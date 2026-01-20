import SibApiV3Sdk from 'sib-api-v3-sdk';
import { MatchedJob } from './openai';

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

    // Generate HTML email content
    const emailHtml = generateJobAlertEmailHtml(userName, jobs);
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

    const emailHtml = generateWelcomeEmailHtml(userName);

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
    const emailHtml = generatePasswordResetEmailHtml(userName, resetUrl);

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
    sendSmtpEmail.subject = '🧪 Test Email - Carmen Job Search';
    sendSmtpEmail.htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; background-color: #27272a; color: #e4e4e7;">
        <h1 style="color: #f97316;">✅ Email Working!</h1>
        <p>Si estás recibiendo esto, la configuración de la API de Brevo es correcta.</p>
        <p><strong>API:</strong> HTTP Brevo API (no SMTP)</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      </div>
    `;
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

// ==================== HTML Templates ====================

function generateWelcomeEmailHtml(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a Carmen Job Search</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #18181b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 30px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">🍊</div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">¡Bienvenido, ${userName}!</h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px; color: #e4e4e7;">
            <p style="font-size: 18px; line-height: 1.6; margin: 0 0 20px 0;">
              ¡Gracias por unirte a <strong>Carmen Job Search</strong>! Estamos emocionados de ayudarte a encontrar tu trabajo ideal.
            </p>

            <div style="background-color: #3f3f46; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #f97316; margin: 0 0 15px 0; font-size: 18px;">🚀 ¿Qué sigue?</h3>
              <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
                <li style="margin-bottom: 10px;">Configura tus preferencias de trabajo</li>
                <li style="margin-bottom: 10px;">Agrega las empresas que te interesan</li>
                <li style="margin-bottom: 10px;">Configura tu horario de alertas</li>
                <li>Recibe ofertas laborales personalizadas</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 40px 0;">
              <a href="https://carmen-job-search.vercel.app/dashboard" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 15px 40px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Ir al Dashboard →
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #18181b; padding: 30px; text-align: center; border-top: 1px solid #3f3f46;">
            <p style="margin: 0 0 10px 0; color: #71717a; font-size: 14px;">
              Si tienes preguntas, no dudes en contactarnos
            </p>
            <p style="margin: 0; color: #52525b; font-size: 12px;">
              © 2026 Carmen Job Search. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateJobAlertEmailHtml(userName: string, jobs: MatchedJob[]): string {
  const jobsHtml = jobs.map(job => `
    <div style="background-color: #3f3f46; border-radius: 8px; padding: 20px; margin-bottom: 16px; border-left: 4px solid ${getScoreColor(job.similarityScore)};">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
        <div>
          <h3 style="color: #fafafa; margin: 0 0 4px 0; font-size: 18px;">${job.title}</h3>
          <p style="color: #a1a1aa; margin: 0; font-size: 14px;">${job.companyName}</p>
        </div>
        <div style="background-color: ${getScoreColor(job.similarityScore)}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
          ${Math.round(job.similarityScore * 100)}% match
        </div>
      </div>

      <div style="display: flex; gap: 12px; margin-bottom: 12px; flex-wrap: wrap;">
        <span style="background-color: #27272a; color: #d4d4d8; padding: 4px 10px; border-radius: 4px; font-size: 12px;">
          📍 ${job.location}
        </span>
        ${job.salaryRange ? `
          <span style="background-color: #27272a; color: #d4d4d8; padding: 4px 10px; border-radius: 4px; font-size: 12px;">
            💰 ${job.salaryRange}
          </span>
        ` : ''}
      </div>

      ${job.matchReasons && job.matchReasons.length > 0 ? `
        <div style="margin-bottom: 12px;">
          ${job.matchReasons.map(reason => `
            <span style="display: inline-block; background-color: #27272a; color: #f97316; padding: 3px 8px; border-radius: 4px; font-size: 11px; margin-right: 6px;">
              ✓ ${reason}
            </span>
          `).join('')}
        </div>
      ` : ''}

      <div style="text-align: right;">
        <a href="${job.url}" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
          Aplicar →
        </a>
      </div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nuevas oportunidades laborales</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #18181b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 30px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">🍊</div>
            <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 700;">Nuevas oportunidades para ti</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Hola ${userName}, encontramos ${jobs.length} ${jobs.length === 1 ? 'trabajo' : 'trabajos'} que podrían interesarte
            </p>
          </div>

          <!-- Jobs -->
          <div style="padding: 30px;">
            ${jobsHtml}
          </div>

          <!-- Footer -->
          <div style="background-color: #18181b; padding: 30px; text-align: center; border-top: 1px solid #3f3f46;">
            <p style="margin: 0 0 15px 0; color: #a1a1aa; font-size: 14px;">
              ¿No quieres recibir más estos emails?
            </p>
            <a href="https://carmen-job-search.vercel.app/dashboard/preferences" style="color: #f97316; text-decoration: none; font-size: 14px;">
              Configurar preferencias de email
            </a>
            <p style="margin: 20px 0 0 0; color: #52525b; font-size: 12px;">
              © 2026 Carmen Job Search. Potenciado por IA.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

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

function generatePasswordResetEmailHtml(userName: string, resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecer contraseña - Carmen Job Search</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #18181b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 30px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">🔐</div>
            <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 700;">Restablecer tu contraseña</h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px; color: #e4e4e7;">
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hola <strong>${userName}</strong>,
            </p>

            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Recibimos una solicitud para restablecer tu contraseña. Si no hiciste esta solicitud, puedes ignorar este email.
            </p>

            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 15px 40px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Restablecer Contraseña →
              </a>
            </div>

            <div style="background-color: #3f3f46; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <p style="margin: 0; font-size: 14px; color: #a1a1aa;">
                ⚠️ <strong>Este enlace expira en 1 hora.</strong> Si no lo usas antes, tendrás que solicitar un nuevo enlace.
              </p>
            </div>

            <p style="font-size: 14px; color: #71717a; margin: 20px 0;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:
            </p>
            <p style="font-size: 12px; color: #52525b; word-break: break-all; margin: 0;">
              ${resetUrl}
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #18181b; padding: 30px; text-align: center; border-top: 1px solid #3f3f46;">
            <p style="margin: 0; color: #52525b; font-size: 12px;">
              © 2026 Carmen Job Search. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function getScoreColor(score: number): string {
  if (score >= 0.8) return '#22c55e'; // Green
  if (score >= 0.6) return '#f97316'; // Orange
  return '#ef4444'; // Red
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
