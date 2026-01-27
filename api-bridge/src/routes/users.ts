import { Router, Request, Response } from 'express';
import { userOperations, preferencesOperations, passwordResetOperations, emailVerificationOperations } from '../services/database';
import { validateUserId } from '../server';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  updateApiKeySchema,
  verifyEmailSchema,
  resetPasswordSchema,
  validateBody
} from '../middleware/validation';
import { logger } from '../services/logger';
import { serialize } from 'cookie';
import { sendPasswordResetEmail, sendVerificationEmail } from '../services/email';

// Cookie configuration
const isProduction = process.env.NODE_ENV === 'production';
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
};

// Access token cookie options (15 minutes)
const getAccessTokenCookieOptions = () => ({
  ...cookieOptions,
  maxAge: 15 * 60, // 15 minutes
});

// Refresh token cookie options (7 days)
const getRefreshTokenCookieOptions = () => ({
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60, // 7 days
});

const router = Router();

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

// Helper function to check if item is new (within last 24 hours)
function isNew(date: Date): boolean {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const hoursSince = diffMs / 3600000;
  return hoursSince <= 24;
}

// Export individual route handlers for public endpoints
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, jobTitles } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await userOperations.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user with password
    const user = await userOperations.create(name, email, password);

    // Create job preferences if provided
    if (jobTitles && jobTitles.length > 0) {
      await preferencesOperations.create(user.id, jobTitles);
    }

    // Create and send verification email
    try {
      const verificationToken = await emailVerificationOperations.createToken(user.id);
      await sendVerificationEmail(user.email, user.name, verificationToken.token);
      logger.info({ email: user.email }, 'Verification email sent');
    } catch (emailError) {
      logger.error({ error: emailError, email: user.email }, 'Error sending verification email');
      // Continue with registration even if email fails
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = await generateRefreshToken(user.id);

    // Set httpOnly cookies
    res.setHeader('Set-Cookie', [
      serialize('accessToken', accessToken, getAccessTokenCookieOptions()),
      serialize('refreshToken', refreshToken, getRefreshTokenCookieOptions()),
    ]);

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: false,
      },
      message: 'Account created successfully. Please check your email to verify your account.',
    });
  } catch (error) {
    logger.error({ error }, 'Error registering user');
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await userOperations.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const bcrypt = require('bcrypt');
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = await generateRefreshToken(user.id);

    // Set httpOnly cookies
    res.setHeader('Set-Cookie', [
      serialize('accessToken', accessToken, getAccessTokenCookieOptions()),
      serialize('refreshToken', refreshToken, getRefreshTokenCookieOptions()),
    ]);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    logger.error({ error }, 'Error logging in user');
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;

    // Verify refresh token (now async)
    const payload = await verifyRefreshToken(token);
    if (!payload) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    // Get user
    const user = await userOperations.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id, user.email);

    // Set new access token cookie
    res.setHeader('Set-Cookie', serialize('accessToken', newAccessToken, getAccessTokenCookieOptions()));

    res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    logger.error({ error }, 'Error refreshing token');
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Logout function to clear cookies
export const logout = async (req: Request, res: Response) => {
  try {
    // Clear cookies by setting them with expired date
    res.setHeader('Set-Cookie', [
      serialize('accessToken', '', { ...cookieOptions, maxAge: 0 }),
      serialize('refreshToken', '', { ...cookieOptions, maxAge: 0 }),
    ]);

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error({ error }, 'Error logging out');
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await userOperations.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching user');
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { companyOperations, jobOperations, scheduleOperations, applicationOperations } = await import('../services/database');

    // Get companies count
    const companiesResult = await companyOperations.findByUserId(userId);
    const companiesCount = companiesResult.length;

    // Get jobs count
    const jobsResult = await jobOperations.findByUserId(userId, 100);
    const jobsCount = jobsResult.length;

    // Get this week's jobs count
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const jobsWeekResult = await jobOperations.findByDateRange(userId, weekAgo, new Date());
    const jobsThisWeek = jobsWeekResult.length;

    // Get application stats
    const appStats = await applicationOperations.getStats(userId);

    // Get last email sent (from schedule)
    const schedules = await scheduleOperations.findByUserId(userId);
    const lastSchedule = schedules && schedules.length > 0 ? schedules[0] : null;

    let lastEmailSent = "No emails sent yet";
    let totalJobsFound = 0;

    if (lastSchedule && lastSchedule.last_email_sent) {
      lastEmailSent = formatTimeAgo(lastSchedule.last_email_sent);
      totalJobsFound = lastSchedule.total_jobs_found || 0;
    }

    res.json({
      stats: [
        {
          label: "Companies Monitored",
          value: companiesCount,
          icon: "Building2",
          color: "bg-orange-500/10 text-orange-500",
          trend: companiesCount > 0 ? `+${companiesCount} companies` : "Add companies"
        },
        {
          label: "Jobs Found",
          value: jobsCount,
          icon: "Briefcase",
          color: "bg-blue-500/10 text-blue-500",
          trend: `+${jobsThisWeek} this week`
        },
        {
          label: "Applications",
          value: appStats.total || 0,
          icon: "Send",
          color: "bg-green-500/10 text-green-500",
          trend: `${appStats.offers || 0} offers`
        },
        {
          label: "Last Email",
          value: lastEmailSent,
          icon: "Mail",
          color: "bg-purple-500/10 text-purple-500",
          trend: totalJobsFound > 0 ? `${totalJobsFound} jobs found` : "No jobs yet"
        }
      ]
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching stats');
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { jobOperations, scheduleOperations, applicationOperations } = await import('../services/database');

    // Get recent jobs (last 5)
    const recentJobs = await jobOperations.findRecentByUserId(userId, 5);

    // Convert recent jobs to activity format
    const activity = recentJobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      companyName: job.company_name,
      url: job.url,
      time: formatTimeAgo(job.created_at),
      isNew: isNew(job.created_at)
    }));

    // Get recent applications
    const applications = await applicationOperations.findByUserId(userId);
    applications.slice(0, 5).forEach((app: any) => {
      activity.push({
        id: `app-${app.id}`,
        title: `Application ${app.status.replace('_', ' ')}`,
        companyName: app.company_name || 'Unknown',
        url: '#',
        time: formatTimeAgo(app.created_at),
        isNew: isNew(app.created_at)
      });
    });

    // Add email sent activities
    const schedules = await scheduleOperations.findByUserId(userId);
    const lastSchedule = schedules && schedules.length > 0 ? schedules[0] : null;

    if (lastSchedule && lastSchedule.last_email_sent) {
      const totalJobsFound = lastSchedule.total_jobs_found || 0;
      activity.push({
        id: `email-${lastSchedule.id}`,
        title: `Email sent with ${totalJobsFound} relevant offers`,
        url: "#",
        companyName: "Carmen",
        time: formatTimeAgo(lastSchedule.last_email_sent),
        isNew: isNew(lastSchedule.last_email_sent)
      });
    }

    res.json({ activity });
  } catch (error) {
    logger.error({ error }, 'Error fetching activity');
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Forgot password - send reset email
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await userOperations.findByEmail(email);

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      try {
        // Create reset token
        const resetToken = await passwordResetOperations.createToken(user.id);

        // Send reset email
        await sendPasswordResetEmail(user.email, user.name, resetToken.token);

        logger.info({ email: user.email }, 'Password reset email sent');
      } catch (emailError) {
        logger.error({ error: emailError, email: user.email }, 'Error sending password reset email');
        // Still return success to prevent email enumeration
      }
    }

    res.json({
      message: 'If an account exists with this email, a password reset link has been sent.'
    });
  } catch (error) {
    logger.error({ error }, 'Error in forgot password');
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Reset password - validate token and update password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Password strength validation
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Find valid reset token
    const resetRecord = await passwordResetOperations.findByToken(token);

    if (!resetRecord) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update user password
    await userOperations.updatePassword(resetRecord.user_id, newPassword);

    // Mark token as used
    await passwordResetOperations.markAsUsed(token);

    logger.info({ userId: resetRecord.user_id }, 'Password reset successful');

    res.json({
      message: 'Password has been reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    logger.error({ error }, 'Error in reset password');
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify email - validate token and mark as verified
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Find valid verification token
    const verificationRecord = await emailVerificationOperations.findByToken(token);

    if (!verificationRecord) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Mark user email as verified
    await userOperations.setEmailVerified(verificationRecord.user_id, true);

    // Mark token as verified
    await emailVerificationOperations.markAsVerified(token);

    logger.info({ userId: verificationRecord.user_id }, 'Email verified successfully');

    res.json({
      message: 'Email verified successfully. Your account is now fully activated.'
    });
  } catch (error) {
    logger.error({ error }, 'Error in email verification');
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Resend verification email
export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is already verified
    const isVerified = await userOperations.isEmailVerified(userId);
    if (isVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Get user details
    const user = await userOperations.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create new verification token
    const verificationToken = await emailVerificationOperations.createToken(user.id);

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verificationToken.token);

    logger.info({ email: user.email }, 'Verification email resent');

    res.json({
      message: 'Verification email sent successfully. Please check your inbox.'
    });
  } catch (error) {
    logger.error({ error }, 'Error resending verification email');
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Router routes
router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', validateBody(refreshSchema), refresh);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', validateBody(resetPasswordSchema), resetPassword);
router.post('/verify-email', validateBody(verifyEmailSchema), verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// Export both router and individual handlers
export default router;
module.exports = router;
// Also export individual handlers for direct use in server.ts
module.exports.register = register;
module.exports.login = login;
module.exports.refresh = refresh;
module.exports.logout = logout;
module.exports.getMe = getMe;
module.exports.getStats = getStats;
module.exports.getActivity = getActivity;
module.exports.forgotPassword = forgotPassword;
module.exports.resetPassword = resetPassword;
module.exports.verifyEmail = verifyEmail;
module.exports.resendVerificationEmail = resendVerificationEmail;
