import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { initDatabase } from './services/database';
import { authenticateToken } from './middleware/auth';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Middleware
app.use(cors({
  origin: process.env.VERCEL_DOMAIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
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
});

// API Key authentication middleware
export const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  if (apiKey !== process.env.API_BRIDGE_KEY) {
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

// Public auth routes (register, login, refresh) - only rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Stricter limit for auth endpoints
  message: { error: 'Too many authentication attempts, please try again later.' }
});

// Import auth handlers
const { register, login, refresh } = require('./routes/users');

app.post('/api/users/register', authLimiter, register);
app.post('/api/users/login', authLimiter, login);
app.post('/api/users/refresh', authLimiter, refresh);

// API Key management routes (require JWT)
app.put('/api/users/api-key', apiLimiter, authenticateToken, require('./routes/users'));
app.delete('/api/users/:userId/api-key', apiLimiter, authenticateToken, require('./routes/users'));

// Protected API Routes (require JWT + rate limiting)
app.use('/api/users/:id', apiLimiter, authenticateToken, require('./routes/users'));
app.use('/api/companies', apiLimiter, authenticateToken, require('./routes/companies'));
app.use('/api/jobs', apiLimiter, authenticateToken, require('./routes/jobs'));
app.use('/api/preferences', apiLimiter, authenticateToken, require('./routes/preferences'));
// Expensive operations get stricter rate limiting
app.use('/api/scrape', expensiveLimiter, authenticateToken, require('./routes/scrape'));
app.use('/api/schedule', apiLimiter, authenticateToken, require('./routes/schedule'));
app.use('/api/emails', expensiveLimiter, authenticateToken, require('./routes/emails'));

// Cron endpoint (triggered by Vercel) - uses API key auth, no rate limiting
app.post('/api/cron/job-search', authMiddleware, require('./routes/cron'));

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error handler - must be last
app.use(errorHandler);

// Initialize database and start server
(async () => {
  try {
    await initDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API Bridge running on port ${PORT}`);
  });
})();
