import { Router, Request, Response } from 'express';
import { userOperations, preferencesOperations } from '../services/database';
import { validateUserId } from '../server';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  updateApiKeySchema,
  validateBody
} from '../middleware/validation';

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

// Export individual route handlers for public endpoints
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, jobTitles } = req.body;

    // Check if user already exists
    const existingUser = await userOperations.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user without API key
    const user = await userOperations.create(name, email, '');

    // Create job preferences if provided
    if (jobTitles && jobTitles.length > 0) {
      await preferencesOperations.create(user.id, jobTitles);
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = await generateRefreshToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await userOperations.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = await generateRefreshToken(user.id);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
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

    res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
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
    console.error('Error fetching user:', error);
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
    console.error('Error fetching stats:', error);
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
      isNew: false // TODO: implementar lógica de "New" (últimas 24h)
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
        isNew: false
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
        isNew: false
      });
    }

    res.json({ activity });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Router routes
router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', validateBody(refreshSchema), refresh);

module.exports = router;
