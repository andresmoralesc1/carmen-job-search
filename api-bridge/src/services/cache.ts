import Redis from 'ioredis';
import { logger } from './logger';

// Redis client singleton
let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redisClient.on('connect', () => {
      logger.info({ redisUrl }, 'Redis connected');
    });

    redisClient.on('error', (err) => {
      logger.error({ error: err.message }, 'Redis connection error');
    });
  }

  return redisClient;
};

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  JOB_LISTING: 3600, // 1 hour
  JOB_DETAIL: 7200, // 2 hours
  COMPANY_INFO: 86400, // 24 hours
  SCRAPED_PAGE: 1800, // 30 minutes
  AI_MATCHING: 604800, // 7 days - AI results don't change
  USER_PREFERENCES: 300, // 5 minutes
  API_RESPONSE: 600, // 10 minutes
};

// Cache helper functions
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    const client = getRedisClient();
    const data = await client.get(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  } catch (error) {
    logger.error({ error, key }, 'Cache get error');
    return null;
  }
};

export const cacheSet = async (
  key: string,
  value: unknown,
  ttl: number = CACHE_TTL.API_RESPONSE
): Promise<void> => {
  try {
    const client = getRedisClient();
    const serialized = JSON.stringify(value);
    await client.setex(key, ttl, serialized);
  } catch (error) {
    logger.error({ error, key }, 'Cache set error');
  }
};

export const cacheDel = async (key: string): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    logger.error({ error, key }, 'Cache delete error');
  }
};

export const cacheDelPattern = async (pattern: string): Promise<void> => {
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    logger.error({ error, pattern }, 'Cache delete pattern error');
  }
};

// Generate cache keys
export const cacheKeys = {
  jobListing: (filters: string) => `jobs:list:${filters}`,
  jobDetail: (jobId: string) => `jobs:detail:${jobId}`,
  companyInfo: (companyId: string) => `companies:info:${companyId}`,
  scrapedPage: (url: string) => `scrape:page:${Buffer.from(url).toString('base64')}`,
  aiMatching: (jobId: string, userId: string) => `ai:match:${jobId}:${userId}`,
  userPreferences: (userId: string) => `user:${userId}:prefs`,
};

export default getRedisClient;
