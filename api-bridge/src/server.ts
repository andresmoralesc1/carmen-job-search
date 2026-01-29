import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { initDatabase } from './services/database';
import { authenticateToken } from './middleware/auth';
import { logger } from './services/logger';
import { metricsMiddleware, getMetrics } from './services/metrics';
import { closeQueues } from './services/queue';
import {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  AppError,
  ValidationError,
  NotFoundError
} from './middleware/appError';
import {
  scannerProtection,
  requestTypeFilter,
  getScannerStats
} from './middleware/scannerProtection';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Trust proxy - required when behind Caddy/reverse proxy
app.set('trust proxy', true);

// Compression middleware (before other middleware for efficiency)
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Don't compress responses with this Cache-Control
    const cacheControl = res.getHeader('Cache-Control');
    if (typeof cacheControl === 'string' && cacheControl.includes('no-transform')) {
      return false;
    }
    // Only compress responses that can be compressed
    const type = req.headers['content-type'];
    return Boolean(type && /(text|javascript|json|xml|css|html|svg|x-www-form-urlencoded)/i.test(type));
  },
  threshold: 1024, // Only compress responses larger than 1KB
  level: 6, // Compression level (0-9, 6 is default)
}));

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [process.env.VERCEL_DOMAIN || 'http://localhost:3000'];

// Helper function to check if origin is allowed (supports wildcards)
const isOriginAllowed = (origin: string): boolean => {
  if (process.env.NODE_ENV === 'development') return true;

  for (const allowed of allowedOrigins) {
    // Exact match
    if (allowed === origin) return true;
    // Wildcard match (e.g., https://*.example.com)
    if (allowed.includes('*')) {
      const regex = new RegExp('^' + allowed.replace(/\*/g, '.*') + '$');
      if (regex.test(origin)) return true;
    }
  }
  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Security headers middleware
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // HSTS (HTTP Strict Transport Security) - only in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Content Security Policy
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none';"
  );

  // Permissions Policy
  res.setHeader('Permissions-Policy',
    'geolocation=(), ' +
    'microphone=(), ' +
    'camera=(), ' +
    'payment=()'
  );

  next();
});

// Scanner protection - filter suspicious requests early
app.use(requestTypeFilter);

// Add metrics middleware (must be before routes)
app.use(metricsMiddleware);

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn({ ip: req.ip, path: req.path }, 'Rate limit exceeded');
    res.status(429).json({ error: 'Too many requests from this IP, please try again later.' });
  },
});

// Stricter rate limiting for expensive operations (scraping, AI)
const expensiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 expensive requests per hour
  message: {
    error: 'Too many expensive operations, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn({ ip: req.ip, path: req.path }, 'Expensive operation rate limit exceeded');
    res.status(429).json({ error: 'Too many expensive operations, please try again later.' });
  },
});

// API Key authentication middleware for cron endpoints (only use for Vercel cron)
export const cronAuthMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  const cronSecret = req.headers['x-cron-secret'] as string;

  // Accept either API_BRIDGE_KEY or CRON_SECRET for backward compatibility
  const isValid = apiKey === process.env.API_BRIDGE_KEY || cronSecret === process.env.CRON_SECRET;

  if (!isValid) {
    logger.warn({ ip: req.ip, path: req.path }, 'Unauthorized cron access attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// UUID validation middleware factory
export const validateUUID = (paramName: string) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params[paramName] || req.body[paramName];
    if (!id) {
      return next(); // Skip validation if parameter doesn't exist
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        error: `Invalid ${paramName} format. Expected UUID.`
      });
    }
    next();
  };
};

// Predefined UUID validators for common parameters
export const validateUserId = validateUUID('userId');
export const validateCompanyId = validateUUID('companyId');
export const validateJobId = validateUUID('jobId');
export const validateId = validateUUID('id');

// Health check (no auth required)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Metrics endpoint (for Prometheus)
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await getMetrics());
});

// Scanner protection stats (admin endpoint)
app.get('/admin/scanner-stats', (req, res) => {
  // Simple IP-based auth for stats endpoint
  const allowedIPs = process.env.ADMIN_IPS?.split(',') || ['127.0.0.1', '::1'];
  const ip = req.ip || req.socket.remoteAddress || '';

  if (!allowedIPs.includes(ip)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json(getScannerStats());
});

// Public auth routes (register, login, refresh) - only rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Stricter limit for auth endpoints
  message: { error: 'Too many authentication attempts, please try again later.' },
  handler: (req, res) => {
    logger.warn({ ip: req.ip, path: req.path }, 'Auth rate limit exceeded');
    res.status(429).json({ error: 'Too many authentication attempts, please try again later.' });
  },
});

// Import auth handlers
const { register, login, refresh, getMe, getStats, getActivity, forgotPassword, resetPassword, verifyEmail, resendVerificationEmail, updateProfile, updatePassword, deleteAccount, getSearchFrequency, updateSearchFrequency } = require('./routes/users');

app.post('/api/users/register', authLimiter, register);
app.post('/api/users/login', authLimiter, login);
app.post('/api/users/refresh', authLimiter, refresh);
app.post('/api/users/forgot-password', authLimiter, forgotPassword);
app.post('/api/users/reset-password', authLimiter, resetPassword);
app.post('/api/users/verify-email', authLimiter, verifyEmail);
app.post('/api/users/resend-verification', apiLimiter, authenticateToken, resendVerificationEmail);

// API Key management routes (require JWT)
app.put('/api/users/api-key', apiLimiter, authenticateToken, require('./routes/users'));
app.delete('/api/users/:userId/api-key', apiLimiter, authenticateToken, require('./routes/users'));

// Multi-provider API key management routes
// Public endpoint for provider configurations (no auth required)
const apiKeysRouter = require('./routes/api-keys');

// Define the providers inline to avoid TypeScript issues
app.get('/api/api-keys/providers', (_req, res) => {
  const providers = [
    {
      id: 'openai',
      name: 'OpenAI (ChatGPT)',
      description: 'GPT-4 for intelligent job matching',
      endpoint: 'https://api.openai.com/v1',
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      description: 'Advanced AI for job recommendations',
      endpoint: 'https://api.anthropic.com/v1',
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      description: 'Google\'s AI model for insights',
      endpoint: 'https://generativelanguage.googleapis.com/v1',
    },
    {
      id: 'zai',
      name: 'Z.AI',
      description: 'Alternative AI provider',
      endpoint: 'https://api.z.ai/v1',
    },
  ];
  res.json({ providers });
});

// Authenticated API key management routes
app.use('/api/api-keys', apiLimiter, authenticateToken, apiKeysRouter);

// User profile and stats routes (require JWT)
app.get('/api/users/me', apiLimiter, authenticateToken, getMe);
app.get('/api/users/stats', apiLimiter, authenticateToken, getStats);
app.get('/api/users/activity', apiLimiter, authenticateToken, getActivity);

// Profile management routes (require JWT)
app.patch('/api/users/me', apiLimiter, authenticateToken, updateProfile);
app.patch('/api/users/me/password', apiLimiter, authenticateToken, updatePassword);
app.delete('/api/users/me', apiLimiter, authenticateToken, deleteAccount);

// Search frequency preference routes (require JWT)
app.get('/api/users/search-frequency', apiLimiter, authenticateToken, getSearchFrequency);
app.patch('/api/users/search-frequency', apiLimiter, authenticateToken, updateSearchFrequency);

// Protected API Routes (require JWT + rate limiting)
app.use('/api/users/:id', apiLimiter, authenticateToken, require('./routes/users'));
app.use('/api/companies', apiLimiter, authenticateToken, require('./routes/companies'));
app.use('/api/jobs', apiLimiter, authenticateToken, require('./routes/jobs'));
app.use('/api/preferences', apiLimiter, authenticateToken, require('./routes/preferences'));
app.use('/api/applications', apiLimiter, authenticateToken, require('./routes/applications'));
// Expensive operations get stricter rate limiting
app.use('/api/scrape', expensiveLimiter, authenticateToken, require('./routes/scrape'));
app.use('/api/schedule', apiLimiter, authenticateToken, require('./routes/schedule'));
app.use('/api/emails', expensiveLimiter, authenticateToken, require('./routes/emails'));

// Cron endpoints (triggered by Vercel) - uses API key auth, no rate limiting
app.use('/api/cron', cronAuthMiddleware, require('./routes/cron'));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
      ip: req.ip,
    }, 'HTTP request');
  });
  next();
});

// 404 handler - must be after all routes
// Scanner protection tracks 404s to block path scanners
app.use(scannerProtection);
app.use(notFoundHandler);

// Error handler - must be last
app.use(errorHandler);

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, 'Received shutdown signal');

  // Stop accepting new connections
  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      // Close queues
      await closeQueues();

      // Close database connections
      const { pool } = require('./services/database');
      await pool.end();

      logger.info('All connections closed');
      process.exit(0);
    } catch (error) {
      logger.error({ error }, 'Error during shutdown');
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Initialize database and start server
let server: any;
(async () => {
  try {
    await initDatabase();
    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error({ error }, 'Failed to initialize database');
    process.exit(1);
  }

  server = app.listen(PORT, '0.0.0.0', () => {
    logger.info({ port: PORT, env: process.env.NODE_ENV || 'development' }, 'API Bridge running');
  });

  // Handle shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    logger.error({ error }, 'Uncaught exception');
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error({ reason, promise }, 'Unhandled rejection');
  });
})();
