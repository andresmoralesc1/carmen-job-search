/**
 * Throttling utilities for web scraping
 */

// Configuration for delays between requests
export const THROTTLE_CONFIG = {
  MIN_DELAY_MS: 2000,      // Minimum delay between requests (2 seconds)
  MAX_DELAY_MS: 5000,      // Maximum delay between requests (5 seconds)
  RETRY_DELAY_MS: 10000,   // Delay before retry (10 seconds)
  MAX_RETRIES: 3,          // Maximum number of retries
};

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Random delay between min and max milliseconds
 * Adds randomness to make scraping less detectable
 */
export function randomDelay(minMs: number, maxMs: number): number {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

/**
 * Execute a function with throttling - adds delay between executions
 */
export async function withThrottle<T>(
  fn: () => Promise<T>,
  minDelay: number = THROTTLE_CONFIG.MIN_DELAY_MS,
  maxDelay: number = THROTTLE_CONFIG.MAX_DELAY_MS
): Promise<T> {
  // Add random delay before execution
  const delay = randomDelay(minDelay, maxDelay);
  await sleep(delay);

  return fn();
}

/**
 * Execute a function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = THROTTLE_CONFIG.MAX_RETRIES,
  retryDelay: number = THROTTLE_CONFIG.RETRY_DELAY_MS
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1}/${maxRetries + 1} failed:`, error);

      if (attempt < maxRetries) {
        const backoffDelay = retryDelay * Math.pow(2, attempt); // Exponential backoff
        console.log(`Retrying in ${backoffDelay}ms...`);
        await sleep(backoffDelay);
      }
    }
  }

  throw lastError;
}

/**
 * Rate limiter class - limits concurrent requests
 */
export class RateLimiter {
  private maxConcurrent: number;
  private queue: Array<() => void> = [];
  private active = 0;

  constructor(maxConcurrent: number = 3) {
    this.maxConcurrent = maxConcurrent;
  }

  /**
   * Execute a function with rate limiting
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // If we've hit the limit, wait
    if (this.active >= this.maxConcurrent) {
      await new Promise<void>(resolve => {
        this.queue.push(resolve);
      });
    }

    this.active++;

    try {
      return await fn();
    } finally {
      this.active--;

      // Process next item in queue
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        if (next) next();
      }
    }
  }
}

/**
 * Create a rate limiter instance for scraping operations
 */
export const scraperRateLimiter = new RateLimiter(3); // Max 3 concurrent requests
