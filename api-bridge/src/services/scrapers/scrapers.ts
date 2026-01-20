/**
 * Scrapers module - Re-exports all scraping functions
 * This file maintains backward compatibility while using the real implementations
 */

// Re-export everything from the linkedin.ts file which has the real Puppeteer implementation
export {
  scrapeLinkedInJobs,
  scrapeIndeedJobs,
  scrapeGlassdoorJobs,
  scrapeRemotiveJobs,
  scrapeCompanyJobs,
  type ScrapedJob,
} from './linkedin';
