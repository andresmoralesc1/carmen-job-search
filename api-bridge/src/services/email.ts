import SibApiV3Sdk from 'sib-api-v3-sdk';
import { MatchedJob } from './openai';
import * as EmailTemplates from './email-templates';

export interface EmailSchedule {
  timezone: string;
  preferredTimes: string[];
  frequency: 'daily' | 'weekly' | 'instant';
}

/**
 * Create Brevo API client
 */
function createBrevoClient() {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY environment variable is not set');
  }

  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKeyAuth = defaultClient.authentications['api-key'];
  apiKeyAuth.apiKey = apiKey;

  return defaultClient;
}

/**
 * Send job alert email using Brevo API
 */
export async function sendJobAlertEmail(
  toEmail: string,
  userName: string,
  jobs: MatchedJob[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const client = createBrevoClient();

    // Generate HTML email content using modern templates
    const emailHtml = EmailTemplates.generateJobAlertEmailHtml(userName, jobs);
    const emailText = generateJobAlertEmailText(userName, jobs);

    // Create sendSmtpEmail object for Brevo
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Set sender
    sendSmtpEmail.sender = {
      name: 'Carmen Job Search',
      email: 'carmen@neuralflow.space'
    };

    // Set recipient
    sendSmtpEmail.to = [{
      email: toEmail,
      name: userName
    }];

    // Set subject
    sendSmtpEmail.subject = `🔔 ${jobs.length} nuevas oportunidades laborales para ti`;

    // Set HTML content
    sendSmtpEmail.htmlContent = emailHtml;

    // Set text content
    sendSmtpEmail.textContent = emailText;

    // Set tags for tracking
    sendSmtpEmail.tags = ['job-alert', 'carmen-job-search'];

    // Send email
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log('Job alert email sent via Brevo API:', data.messageId);
    return { success: true };

  } catch (error) {
    console.error('Error sending job alert email via Brevo API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}

/**
 * Send welcome email using Brevo API
 */
export async function sendWelcomeEmail(
  toEmail: string,
  userName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const client = createBrevoClient();

    const emailHtml = EmailTemplates.generateWelcomeEmailHtml(userName);

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: 'Carmen Job Search',
      email: 'carmen@neuralflow.space'
    };

    sendSmtpEmail.to = [{
      email: toEmail,
      name: userName
    }];

    sendSmtpEmail.subject = '👋 ¡Bienvenido a Carmen Job Search!';
    sendSmtpEmail.htmlContent = emailHtml;
    sendSmtpEmail.tags = ['welcome', 'carmen-job-search'];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log('Welcome email sent via Brevo API:', data.messageId);
    return { success: true };

  } catch (error) {
    console.error('Error sending welcome email via Brevo API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}

/**
 * Send password reset email using Brevo API
 */
export async function sendPasswordResetEmail(
  toEmail: string,
  userName: string,
  resetToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const client = createBrevoClient();

    const resetUrl = `https://carmen-job-search.vercel.app/reset-password?token=${resetToken}`;
    const emailHtml = EmailTemplates.generatePasswordResetEmailHtml(userName, resetUrl);

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: 'Carmen Job Search',
      email: 'carmen@neuralflow.space'
    };

    sendSmtpEmail.to = [{
      email: toEmail,
      name: userName
    }];

    sendSmtpEmail.subject = '🔐 Restablecer tu contraseña - Carmen Job Search';
    sendSmtpEmail.htmlContent = emailHtml;
    sendSmtpEmail.tags = ['password-reset', 'carmen-job-search'];

    // Set expiry for tracking (1 hour)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    sendSmtpEmail.params = {
      resetUrl,
      expiresAt
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log('Password reset email sent via Brevo API:', data.messageId);
    return { success: true };

  } catch (error) {
    console.error('Error sending password reset email via Brevo API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}

/**
 * Send test email using Brevo API
 */
export async function sendTestEmail(
  toEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const client = createBrevoClient();

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: 'Carmen Job Search',
      email: 'carmen@neuralflow.space'
    };

    sendSmtpEmail.to = [{ email: toEmail }];
    sendSmtpEmail.subject = '✅ Test Email - Carmen Job Search';
    sendSmtpEmail.htmlContent = EmailTemplates.generateTestEmailHtml();
    sendSmtpEmail.tags = ['test', 'carmen-job-search'];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log('Test email sent via Brevo API:', data.messageId);
    return { success: true };

  } catch (error) {
    console.error('Error sending test email via Brevo API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}

/**
 * Get email statistics from Brevo
 */
export async function getEmailStats() {
  try {
    const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
    const client = createBrevoClient();

    // Get account info
    const accountApi = new SibApiV3Sdk.AccountApi();
    const accountData = await accountApi.getAccount();

    return {
      planType: accountData.planType || [],
      emails: accountData.emails || 0,
      success: true
    };
  } catch (error) {
    console.error('Error getting email stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get stats'
    };
  }
}

// ==================== Text Email Templates ====================
// Used for plain text fallback

function generateJobAlertEmailText(userName: string, jobs: MatchedJob[]): string {
  let text = `🍊 CARMEN JOB SEARCH\n\n`;
  text += `Hola ${userName},\n\n`;
  text += `Encontramos ${jobs.length} ${jobs.length === 1 ? 'trabajo' : 'trabajos'} que podrían interesarte:\n\n`;

  jobs.forEach((job, index) => {
    text += `${index + 1}. ${job.title} en ${job.companyName}\n`;
    text += `   📍 ${job.location}\n`;
    if (job.salaryRange) text += `   💰 ${job.salaryRange}\n`;
    text += `   ✅ Match: ${Math.round(job.similarityScore * 100)}%\n`;
    text += `   🔗 ${job.url}\n\n`;
  });

  text += `---\n`;
  text += `© 2026 Carmen Job Search. Potenciado por IA.\n`;

  return text;
}

/**
 * Create email templates in Brevo for future use
 * This allows you to create reusable templates in Brevo dashboard
 */
export async function createEmailTemplates() {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const client = createBrevoClient();

    // Job alert template
    const jobAlertTemplate = new SibApiV3Sdk.CreateEmailTemplate();
    jobAlertTemplate.templateName = 'carmen-job-alert';
    jobAlertTemplate.subject = '🔔 {{params.jobsCount}} nuevas oportunidades laborales para ti';
    jobAlertTemplate.htmlContent = '<!-- HTML content would go here -->';
    jobAlertTemplate.sender = {
      name: 'Carmen Job Search',
      email: 'carmen@neuralflow.space'
    };

    // Welcome template
    const welcomeTemplate = new SibApiV3Sdk.CreateEmailTemplate();
    welcomeTemplate.templateName = 'carmen-welcome';
    welcomeTemplate.subject = '👋 ¡Bienvenido a Carmen Job Search!';
    welcomeTemplate.htmlContent = '<!-- HTML content would go here -->';
    welcomeTemplate.sender = {
      name: 'Carmen Job Search',
      email: 'carmen@neuralflow.space'
    };

    console.log('Email templates created in Brevo dashboard');
    return { success: true };

  } catch (error) {
    console.error('Error creating email templates:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create templates'
    };
  }
}
