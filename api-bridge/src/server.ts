import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.VERCEL_DOMAIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// API Key authentication middleware
export const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  if (apiKey !== process.env.API_BRIDGE_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Health check (no auth required)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes (all require auth)
app.use('/api/users', authMiddleware, require('./routes/users'));
app.use('/api/companies', authMiddleware, require('./routes/companies'));
app.use('/api/jobs', authMiddleware, require('./routes/jobs'));
app.use('/api/preferences', authMiddleware, require('./routes/preferences'));
app.use('/api/scrape', authMiddleware, require('./routes/scrape'));
app.use('/api/schedule', authMiddleware, require('./routes/schedule'));
app.use('/api/emails', authMiddleware, require('./routes/emails'));

// Cron endpoint (triggered by Vercel)
app.post('/api/cron/job-search', authMiddleware, require('./routes/cron'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Bridge running on port ${PORT}`);
});
