import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

// Create a Registry
export const register = new Registry();

// Collect default metrics (CPU, memory, etc.)
collectDefaultMetrics({ register });

// HTTP request counter
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// HTTP request duration histogram
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

// Scraping operations
export const scrapeOperationsTotal = new Counter({
  name: 'scrape_operations_total',
  help: 'Total number of scraping operations',
  labelNames: ['source', 'status'],
  registers: [register],
});

export const scrapeDuration = new Histogram({
  name: 'scrape_duration_seconds',
  help: 'Duration of scraping operations in seconds',
  labelNames: ['source'],
  buckets: [0.5, 1, 2, 5, 10, 30, 60],
  registers: [register],
});

// OpenAI operations
export const openAIRequestsTotal = new Counter({
  name: 'openai_requests_total',
  help: 'Total number of OpenAI API requests',
  labelNames: ['operation', 'status'],
  registers: [register],
});

export const openAITokensTotal = new Counter({
  name: 'openai_tokens_total',
  help: 'Total number of OpenAI tokens used',
  labelNames: ['model', 'type'], // type: prompt|completion
  registers: [register],
});

// Database operations
export const dbOperationsTotal = new Counter({
  name: 'db_operations_total',
  help: 'Total number of database operations',
  labelNames: ['operation', 'table', 'status'],
  registers: [register],
});

export const dbConnectionsActive = new Gauge({
  name: 'db_connections_active',
  help: 'Number of active database connections',
  registers: [register],
});

// Email operations
export const emailSentTotal = new Counter({
  name: 'email_sent_total',
  help: 'Total number of emails sent',
  labelNames: ['template', 'status'],
  registers: [register],
});

// Queue metrics
export const queueJobsTotal = new Gauge({
  name: 'queue_jobs_total',
  help: 'Number of jobs in the queue',
  labelNames: ['queue', 'state'], // state: waiting|active|completed|failed
  registers: [register],
});

// Cache metrics
export const cacheHitsTotal = new Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['operation'],
  registers: [register],
});

export const cacheMissesTotal = new Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['operation'],
  registers: [register],
});

// Active users gauge
export const activeUsers = new Gauge({
  name: 'active_users_total',
  help: 'Number of active users',
  registers: [register],
});

// Jobs found gauge
export const jobsFound = new Gauge({
  name: 'jobs_found_total',
  help: 'Total number of jobs found',
  registers: [register],
});

// Jobs matched gauge
export const jobsMatched = new Gauge({
  name: 'jobs_matched_total',
  help: 'Total number of jobs matched with user preferences',
  registers: [register],
});

// Middleware to track HTTP requests
export const metricsMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path || 'unknown';

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status_code: res.statusCode,
      },
      duration
    );
  });

  next();
};

// Get metrics as string (for /metrics endpoint)
export const getMetrics = async (): Promise<string> => {
  return await register.metrics();
};

// Reset all metrics (useful for testing)
export const resetMetrics = (): void => {
  register.resetMetrics();
};

export default {
  register,
  httpRequestsTotal,
  httpRequestDuration,
  scrapeOperationsTotal,
  scrapeDuration,
  openAIRequestsTotal,
  openAITokensTotal,
  dbOperationsTotal,
  emailSentTotal,
  queueJobsTotal,
  cacheHitsTotal,
  cacheMissesTotal,
  metricsMiddleware,
  getMetrics,
  resetMetrics,
};
