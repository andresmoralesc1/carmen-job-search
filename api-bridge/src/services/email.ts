import nodemailer from 'nodemailer';
import { MatchedJob } from './openai';

export interface EmailSchedule {
  timezone: string;
  preferredTimes: string[]; // ['08:00', '12:00', '18:00']
  frequency: 'daily' | 'weekly' | 'instant';
}

/**
 * Create Brevo SMTP transporter
 */
function createBrevoTransporter() {
  return nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
    secure: false, // TLS
    auth: {
      user: process.env.BREVO_SMTP_USER || '93a2f9001@smtp-brevo.com',
      pass: process.env.BREVO_SMTP_PASSWORD
    }
  });
}

/**
 * Send job alert email to user
 */
export async function sendJobAlertEmail(
  toEmail: string,
  userName: string,
  jobs: MatchedJob[]
): Promise<{ success: boolean; error?: string }> {
  const transporter = createBrevoTransporter();

  try {
    const emailHtml = generateJobAlertEmail(userName, jobs);
    const emailText = generateJobAlertEmailText(userName, jobs);

    const info = await transporter.sendMail({
      from: '"Carmen Job Search" <carmen@neuralflow.space>',
      to: toEmail,
      subject: `🔔 ${jobs.length} nuevas oportunidades laborales para ti`,
      text: emailText,
      html: emailHtml
    });

    console.log('Email sent:', info.messageId);
    return { success: true };

  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  toEmail: string,
  userName: string
): Promise<{ success: boolean; error?: string }> {
  const transporter = createBrevoTransporter();

  try {
    const emailHtml = `
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

    const info = await transporter.sendMail({
      from: '"Carmen Job Search" <carmen@neuralflow.space>',
      to: toEmail,
      subject: '👋 ¡Bienvenido a Carmen Job Search!',
      html: emailHtml
    });

    console.log('Welcome email sent:', info.messageId);
    return { success: true };

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Generate HTML for job alert email
 */
function generateJobAlertEmail(userName: string, jobs: MatchedJob[]): string {
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

/**
 * Generate plain text version of job alert email
 */
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
 * Get color based on similarity score
 */
function getScoreColor(score: number): string {
  if (score >= 0.8) return '#22c55e'; // Green
  if (score >= 0.6) return '#f97316'; // Orange
  return '#ef4444'; // Red
}

/**
 * Send test email (for development)
 */
export async function sendTestEmail(
  toEmail: string
): Promise<{ success: boolean; error?: string }> {
  const transporter = createBrevoTransporter();

  try {
    const info = await transporter.sendMail({
      from: '"Carmen Job Search" <carmen@neuralflow.space>',
      to: toEmail,
      subject: '🧪 Test Email - Carmen Job Search',
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #27272a; color: #e4e4e7;">
          <h1 style="color: #f97316;">✅ Email Working!</h1>
          <p>Si estás recibiendo esto, la configuración de Brevo SMTP es correcta.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `
    });

    console.log('Test email sent:', info.messageId);
    return { success: true };

  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error: String(error) };
  }
}
