/**
 * Modern Email Templates for Carmen Job Search
 * Responsive, visually appealing, and brand-consistent designs
 */

import { MatchedJob } from './openai';

// ============================================
// COLOR PALETTE & DESIGN TOKENS
// ============================================
const COLORS = {
  primary: '#f97316',      // Orange 500
  primaryDark: '#ea580c',  // Orange 600
  primaryLight: '#fdba74', // Orange 300
  bgDark: '#18181b',       // Zinc 900
  bgCard: '#27272a',       // Zinc 800
  bgLight: '#3f3f46',      // Zinc 700
  textMain: '#fafafa',     // Zinc 50
  textMuted: '#a1a1aa',    // Zinc 400
  textDim: '#71717a',      // Zinc 500
  success: '#22c55e',      // Green 500
  warning: '#eab308',      // Yellow 500
  danger: '#ef4444',       // Red 500
  border: '#3f3f46',       // Zinc 700
};

// ============================================
// SHARED COMPONENTS
// ============================================

const emailWrapper = (content: string, previewText = '') => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    @media screen and (max-width: 600px) {
      .mobile-padding { padding: 20px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-center { text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.bgDark}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: ${COLORS.bgCard}; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
    ${content}
  </div>
</body>
</html>
`;

const header = (title: string, emoji: string, subtitle?: string) => `
<div style="background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%); padding: 48px 30px; text-align: center; position: relative; overflow: hidden;">
  <!-- Decorative elements -->
  <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); pointer-events: none;"></div>
  <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, ${COLORS.primaryLight} 0%, ${COLORS.primary} 50%, ${COLORS.primaryLight} 100%);"></div>

  <div style="position: relative; z-index: 1;">
    <div style="font-size: 56px; margin-bottom: 12px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));">${emoji}</div>
    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">${title}</h1>
    ${subtitle ? `<p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 16px; font-weight: 400;">${subtitle}</p>` : ''}
  </div>
</div>
`;

const footer = (customMessage?: string) => `
<div style="background-color: ${COLORS.bgDark}; padding: 32px 30px; text-align: center; border-top: 1px solid ${COLORS.border};">
  ${customMessage ? `<p style="margin: 0 0 16px 0; color: ${COLORS.textMuted}; font-size: 14px; line-height: 1.5;">${customMessage}</p>` : ''}
  <p style="margin: 0; color: ${COLORS.textDim}; font-size: 12px;">
    © 2026 Carmen Job Search. Potenciado por IA 🤖
  </p>
  <div style="margin-top: 16px;">
    <a href="https://carmen-job-search.vercel.app/dashboard/preferences" style="color: ${COLORS.primaryLight}; text-decoration: none; font-size: 12px;">Configurar preferencias</a>
    <span style="color: ${COLORS.textDim}; margin: 0 8px;">•</span>
    <a href="%%unsubscribe%%" style="color: ${COLORS.primaryLight}; text-decoration: none; font-size: 12px;">Desuscribirse</a>
  </div>
</div>
`;

const button = (text: string, url: string, style: 'primary' | 'secondary' = 'primary') => {
  const primaryStyle = `background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%); color: white;`;
  const secondaryStyle = `background-color: ${COLORS.bgLight}; color: ${COLORS.textMain};`;

  return `
<a href="${url}" style="display: inline-block; ${style === 'primary' ? primaryStyle : secondaryStyle} padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 15px; transition: all 0.2s ease; box-shadow: ${style === 'primary' ? '0 4px 14px rgba(249, 115, 22, 0.4)' : 'none'};">
  ${text}
</a>
`;
};

// ============================================
// WELCOME EMAIL
// ============================================

export function generateWelcomeEmailHtml(userName: string): string {
  const content = header('¡Bienvenido!', '🍊', `Hola ${userName}, tu búsqueda de empleo comienza ahora`) + `
<div style="padding: 40px 30px; color: ${COLORS.textMain};">
  <p style="font-size: 17px; line-height: 1.7; margin: 0 0 28px 0; color: ${COLORS.textMuted};">
    Gracias por unirte a <strong style="color: ${COLORS.primary};">Carmen Job Search</strong>.
    Nuestra IA analiza cientos de ofertas diarias para encontrar las que mejor se adaptan a tu perfil.
  </p>

  <!-- Feature Cards -->
  <div style="display: grid; gap: 16px; margin: 32px 0;">
    ${featureCard('🎯', 'Búsqueda Inteligente', 'IA que aprende de tus preferencias y encuentra las mejores oportunidades')}
    ${featureCard('⚡', 'Alertas en Tiempo Real', 'Recibe notificaciones instantáneas cuando encuentremos ofertas perfectas')}
    ${featureCard('🏢', 'Monitoreo de Empresas', 'Seguimiento 24/7 de las empresas que más te interesan')}
  </div>

  <!-- Quick Start Steps -->
  <div style="background-color: ${COLORS.bgLight}; border-radius: 12px; padding: 24px; margin: 32px 0;">
    <h3 style="color: ${COLORS.primary}; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">🚀 Comienza en 4 pasos</h3>
    <div style="display: grid; gap: 16px;">
      ${stepCard(1, 'Configura tus preferencias', 'Títulos de trabajo, ubicaciones, experiencia')}
      ${stepCard(2, 'Agrega empresas', 'Las empresas donde te gustaría trabajar')}
      ${stepCard(3, 'Configura alertas', 'Elige cuándo recibir notificaciones')}
      ${stepCard(4, 'Relájate', 'Nosotros encontramos las ofertas por ti')}
    </div>
  </div>

  <div style="text-align: center; margin: 40px 0;">
    ${button('Ir al Dashboard', 'https://carmen-job-search.vercel.app/dashboard')}
  </div>
</div>
` + footer('¿Tienes preguntas? Estamos aquí para ayudar.');

  return emailWrapper(content, '¡Bienvenido a Carmen Job Search! Tu búsqueda de empleo comienza ahora');
}

// ============================================
// JOB ALERT EMAIL
// ============================================

export function generateJobAlertEmailHtml(userName: string, jobs: MatchedJob[]): string {
  const jobsHtml = jobs.map(job => jobCard(job)).join('');

  const content = header('Nuevas Oportunidades', '💼', `${jobs.length} ${jobs.length === 1 ? 'oferta' : 'ofertas'} para ti, ${userName}`) + `
<div style="padding: 32px 30px 40px;">
  ${jobsHtml}

  <div style="text-align: center; margin: 40px 0 32px;">
    <p style="margin: 0 0 16px; color: ${COLORS.textMuted}; font-size: 14px;">¿No encuentras lo que buscas?</p>
    ${button('Ajustar Preferencias', 'https://carmen-job-search.vercel.app/dashboard/preferences', 'secondary')}
  </div>
</div>
` + footer(`Encontramos ${jobs.length} ${jobs.length === 1 ? 'oportunidad' : 'oportunidades'} para ti.`);

  return emailWrapper(content, `🔔 ${jobs.length} nuevas ofertas laborales para ti`);
}

// ============================================
// PASSWORD RESET EMAIL
// ============================================

export function generatePasswordResetEmailHtml(userName: string, resetUrl: string): string {
  const content = header('Restablecer Contraseña', '🔐') + `
<div style="padding: 40px 30px; color: ${COLORS.textMain};">
  <p style="font-size: 16px; line-height: 1.7; margin: 0 0 24px 0; color: ${COLORS.textMuted};">
    Hola <strong>${userName}</strong>,
  </p>

  <p style="font-size: 16px; line-height: 1.7; margin: 0 0 32px 0; color: ${COLORS.textMuted};">
    Recibimos una solicitud para restablecer tu contraseña. Si no hiciste esta solicitud, puedes ignorar este email de forma segura.
  </p>

  <div style="background-color: ${COLORS.bgLight}; border-radius: 12px; padding: 24px; margin: 32px 0; border-left: 4px solid ${COLORS.warning};">
    <p style="margin: 0; color: ${COLORS.warning}; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px;">
      ⚠️ Este enlace expira en 1 hora
    </p>
  </div>

  <div style="text-align: center; margin: 40px 0;">
    ${button('Restablecer Contraseña', resetUrl)}
  </div>

  <p style="font-size: 14px; color: ${COLORS.textDim}; margin: 32px 0 0; text-align: center;">
    Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
    <a href="${resetUrl}" style="color: ${COLORS.primaryLight}; word-break: break-all; font-size: 12px;">${resetUrl}</a>
  </p>
</div>
` + footer();

  return emailWrapper(content, 'Restablecer tu contraseña de Carmen Job Search');
}

// ============================================
// TEST EMAIL
// ============================================

export function generateTestEmailHtml(): string {
  const content = header('✅ Sistema Funcional', '🧪', 'La configuración de email es correcta') + `
<div style="padding: 40px 30px; color: ${COLORS.textMain};">
  <div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 32px; text-align: center;">
    <div style="font-size: 64px; margin-bottom: 16px;">✅</div>
    <h2 style="color: ${COLORS.success}; margin: 0 0 12px 0; font-size: 24px; font-weight: 600;">¡Todo funciona!</h2>
    <p style="margin: 0; color: ${COLORS.textMuted}; font-size: 15px; line-height: 1.6;">
      La configuración de la API de Brevo es correcta.<br>
      Este email fue enviado usando el servicio HTTP de Brevo.
    </p>
  </div>

  <div style="margin-top: 32px; padding: 20px; background-color: ${COLORS.bgLight}; border-radius: 8px;">
    <p style="margin: 0 0 8px; color: ${COLORS.textDim}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Detalles técnicos</p>
    <p style="margin: 0; color: ${COLORS.textMuted}; font-size: 14px; font-family: monospace;">
      Timestamp: ${new Date().toISOString()}<br>
      Method: Brevo HTTP API v3<br>
      Status: Connected
    </p>
  </div>
</div>
` + footer();

  return emailWrapper(content, '✅ Email de prueba - Carmen Job Search');
}

// ============================================
// HELPER COMPONENTS
// ============================================

function featureCard(emoji: string, title: string, description: string) {
  return `
<div style="background-color: ${COLORS.bgLight}; border-radius: 10px; padding: 16px; display: flex; gap: 16px; align-items: start;">
  <div style="font-size: 28px; flex-shrink: 0;">${emoji}</div>
  <div>
    <h4 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: ${COLORS.textMain};">${title}</h4>
    <p style="margin: 0; font-size: 13px; color: ${COLORS.textMuted}; line-height: 1.5;">${description}</p>
  </div>
</div>
`;
}

function stepCard(step: number, title: string, description: string) {
  return `
<div style="display: flex; gap: 16px; align-items: start;">
  <div style="width: 32px; height: 32px; background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">
    ${step}
  </div>
  <div style="flex: 1;">
    <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: ${COLORS.textMain};">${title}</h4>
    <p style="margin: 0; font-size: 12px; color: ${COLORS.textMuted};">${description}</p>
  </div>
</div>
`;
}

function jobCard(job: MatchedJob) {
  const scoreColor = getScoreColor(job.similarityScore);
  const scorePercent = Math.round(job.similarityScore * 100);

  return `
<div style="background-color: ${COLORS.bgLight}; border-radius: 12px; overflow: hidden; margin-bottom: 20px; border: 1px solid ${COLORS.border};">
  <!-- Header -->
  <div style="padding: 20px; border-left: 4px solid ${scoreColor};">
    <div style="display: flex; justify-content: space-between; align-items: start; gap: 16px;">
      <div style="flex: 1;">
        <h3 style="color: ${COLORS.textMain}; margin: 0 0 6px 0; font-size: 18px; font-weight: 600; line-height: 1.3;">
          ${job.title}
        </h3>
        <p style="color: ${COLORS.textMuted}; margin: 0; font-size: 14px; font-weight: 500;">${job.companyName}</p>
      </div>
      <div style="background-color: ${scoreColor}; color: white; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; white-space: nowrap;">
        ${scorePercent}% match
      </div>
    </div>
  </div>

  <!-- Details -->
  <div style="padding: 0 20px 16px; display: flex; gap: 10px; flex-wrap: wrap;">
    ${badge('📍', job.location)}
    ${job.salaryRange ? badge('💰', job.salaryRange) : ''}
  </div>

  ${job.matchReasons && job.matchReasons.length > 0 ? `
  <div style="padding: 0 20px 16px;">
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      ${job.matchReasons.map(reason => `
        <span style="background-color: rgba(249, 115, 22, 0.15); color: ${COLORS.primaryLight}; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 500;">
          ✓ ${reason}
        </span>
      `).join('')}
    </div>
  </div>
  ` : ''}

  <!-- Action -->
  <div style="padding: 16px 20px; background-color: ${COLORS.bgDark}; border-top: 1px solid ${COLORS.border}; display: flex; justify-content: space-between; align-items: center;">
    <span style="color: ${COLORS.textDim}; font-size: 12px;">${timeAgo()}</span>
    ${button('Aplicar Ahora', job.url, 'primary')}
  </div>
</div>
`;
}

function badge(emoji: string, text: string) {
  return `
<span style="background-color: ${COLORS.bgDark}; color: ${COLORS.textMuted}; padding: 6px 12px; border-radius: 6px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px;">
  ${emoji} ${text}
</span>
`;
}

function getScoreColor(score: number): string {
  if (score >= 0.8) return COLORS.success;
  if (score >= 0.6) return COLORS.primary;
  return COLORS.warning;
}

function timeAgo(): string {
  return 'Oferta reciente';
}
