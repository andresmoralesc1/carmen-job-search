import { Queue, Worker, Job } from 'bullmq';
import { getRedisClient } from './cache';
import { logger } from './logger';

// Queue types
export type QueueJobData =
  | { type: 'scrape'; url: string; source: string }
  | { type: 'ai-match'; jobId: string; userId: string; jobData: unknown }
  | { type: 'send-email'; to: string; subject: string; body: string }
  | { type: 'batch-scrape'; urls: string[]; source: string };

export type QueueJobResult = { success: boolean; data?: unknown; error?: string };

// Queue singleton
let scrapeQueue: Queue<QueueJobData, QueueJobResult> | null = null;
let aiMatchQueue: Queue<QueueJobData, QueueJobResult> | null = null;
let emailQueue: Queue<QueueJobData, QueueJobResult> | null = null;

// Connection options for BullMQ
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
};

// Get or create queues
export const getScrapeQueue = (): Queue<QueueJobData, QueueJobResult> => {
  if (!scrapeQueue) {
    scrapeQueue = new Queue<QueueJobData, QueueJobResult>('scrape-queue', {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: {
          count: 100,
          age: 3600, // 1 hour
        },
        removeOnFail: {
          count: 500,
          age: 7200, // 2 hours
        },
      },
    });

    scrapeQueue.on('error', (err) => {
      logger.error({ error: err.message }, 'Scrape queue error');
    });
  }

  return scrapeQueue;
};

export const getAIMatchQueue = (): Queue<QueueJobData, QueueJobResult> => {
  if (!aiMatchQueue) {
    aiMatchQueue = new Queue<QueueJobData, QueueJobResult>('ai-match-queue', {
      connection,
      defaultJobOptions: {
        attempts: 2,
        backoff: {
          type: 'fixed',
          delay: 5000,
        },
        removeOnComplete: {
          count: 50,
          age: 3600,
        },
        removeOnFail: {
          count: 200,
          age: 7200,
        },
      },
    });

    aiMatchQueue.on('error', (err) => {
      logger.error({ error: err.message }, 'AI match queue error');
    });
  }

  return aiMatchQueue;
};

export const getEmailQueue = (): Queue<QueueJobData, QueueJobResult> => {
  if (!emailQueue) {
    emailQueue = new Queue<QueueJobData, QueueJobResult>('email-queue', {
      connection,
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: {
          count: 100,
          age: 7200, // 2 hours
        },
        removeOnFail: {
          count: 500,
          age: 86400, // 24 hours
        },
      },
    });

    emailQueue.on('error', (err) => {
      logger.error({ error: err.message }, 'Email queue error');
    });
  }

  return emailQueue;
};

// Add jobs to queues
export const addScrapeJob = async (url: string, source: string) => {
  const queue = getScrapeQueue();
  return await queue.add('scrape', { type: 'scrape', url, source });
};

export const addAIMatchJob = async (jobId: string, userId: string, jobData: unknown) => {
  const queue = getAIMatchQueue();
  return await queue.add('ai-match', { type: 'ai-match', jobId, userId, jobData });
};

export const addEmailJob = async (to: string, subject: string, body: string) => {
  const queue = getEmailQueue();
  return await queue.add('send-email', { type: 'send-email', to, subject, body });
};

export const addBatchScrapeJob = async (urls: string[], source: string) => {
  const queue = getScrapeQueue();
  return await queue.add('batch-scrape', { type: 'batch-scrape', urls, source });
};

// Get queue stats
export const getQueueStats = async () => {
  const stats = {
    scrape: await getScrapeQueue().getJobCounts(),
    aiMatch: await getAIMatchQueue().getJobCounts(),
    email: await getEmailQueue().getJobCounts(),
  };
  return stats;
};

// Close all queues
export const closeQueues = async () => {
  const queues = [scrapeQueue, aiMatchQueue, emailQueue];
  await Promise.all(queues.map(async (queue) => queue?.close()));
  logger.info('All queues closed');
};

export default {
  getScrapeQueue,
  getAIMatchQueue,
  getEmailQueue,
  addScrapeJob,
  addAIMatchJob,
  addEmailJob,
  addBatchScrapeJob,
  getQueueStats,
  closeQueues,
};
