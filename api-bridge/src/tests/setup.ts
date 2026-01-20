import { vi } from 'vitest';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
process.env.OPENAI_API_KEY = 'test-openai-key';

// Mock external services
vi.mock('../services/cache', () => ({
  getRedisClient: vi.fn(),
  cacheGet: vi.fn(),
  cacheSet: vi.fn(),
  cacheDel: vi.fn(),
  cacheKeys: {
    jobListing: vi.fn(),
    jobDetail: vi.fn(),
    companyInfo: vi.fn(),
    aiMatching: vi.fn(),
  },
}));

vi.mock('../services/queue', () => ({
  getScrapeQueue: vi.fn(),
  getAIMatchQueue: vi.fn(),
  getEmailQueue: vi.fn(),
  addScrapeJob: vi.fn(),
  addAIMatchJob: vi.fn(),
  addEmailJob: vi.fn(),
  getQueueStats: vi.fn(),
  closeQueues: vi.fn(),
}));
