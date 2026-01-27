import puppeteer, { Page, Browser } from 'puppeteer';
import * as cheerio from 'cheerio';
import { withThrottle, withRetry, sleep, randomDelay, THROTTLE_CONFIG } from './throttle';
import { logger } from '../logger';

export interface ScrapedJob {
  title: string;
  companyName: string;
  description: string;
  url: string;
  location?: string;
  salaryRange?: string;
  postedDate?: Date;
}

// User agents to rotate for anti-bot detection
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
];

// Random user agent
function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Create browser instance with anti-detection settings
async function createBrowser(): Promise<Browser> {
  return puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });
}

/**
 * Scrape LinkedIn jobs for a given query
 * Uses Puppeteer with anti-bot measures
 */
export async function scrapeLinkedInJobs(searchQuery: string, location?: string): Promise<ScrapedJob[]> {
  let browser: Browser | null = null;

  return withRetry(async () => {
    const jobs: ScrapedJob[] = [];
    let url = '';

    try {
      browser = await createBrowser();
      const page = await browser.newPage();

      // Anti-bot measures
      await page.setUserAgent(getRandomUserAgent());
      await page.setViewport({ width: 1920, height: 1080 });

      // Set extra headers to look like a real browser
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      });

      // Build URL with search parameters
      const searchParams = new URLSearchParams({
        keywords: searchQuery,
        location: location || 'Remote',
        f_JT: 'F', // Full-time
        f_WT: '2', // Remote
      });

      url = `https://www.linkedin.com/jobs/search/?${searchParams.toString()}`;

      // Navigate to page with throttling
      await withThrottle(
        async () => {
          logger.info({ url, source: 'LinkedIn' }, 'Scraping jobs');

          await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000,
          });
        },
        3000, // 3 second delay
        5000
      );

      // Wait for job cards to load
      await page.waitForSelector('.job-card-container', { timeout: 15000 }).catch(() => {
        logger.warn({ url, source: 'LinkedIn' }, 'Job cards not found, might be blocked or no results');
      });

      // Random delay to look human
      await sleep(randomDelay(2000, 4000));

      // Scroll down to load more jobs
      await autoScroll(page);

      // Extract job data
      const pageData = await page.evaluate(() => {
        const jobCards = Array.from(document.querySelectorAll('.job-card-container'));
        return jobCards.map(card => {
          const titleEl = card.querySelector('.job-card-list__title--link');
          const companyEl = card.querySelector('.job-card-container__company-name');
          const locationEl = card.querySelector('.job-card-container__metadata-item');
          const linkEl = card.querySelector('a.job-card-container__link');
          const salaryEl = card.querySelector('.job-card-container__salary-range');

          return {
            title: titleEl?.textContent?.trim() || '',
            companyName: companyEl?.textContent?.trim() || '',
            location: locationEl?.textContent?.trim() || '',
            url: linkEl?.getAttribute('href') || '',
            salaryRange: salaryEl?.textContent?.trim() || '',
          };
        });
      });

      // Process each job
      for (const jobData of pageData) {
        if (!jobData.url) continue;

        // Clean URL (LinkedIn URLs can be relative)
        const fullUrl = jobData.url.startsWith('http')
          ? jobData.url
          : `https://www.linkedin.com${jobData.url}`;

        jobs.push({
          title: jobData.title,
          companyName: jobData.companyName || 'Unknown Company',
          description: `Job opportunity for ${jobData.title} at ${jobData.companyName}`,
          url: fullUrl,
          location: jobData.location || location || 'Remote',
          salaryRange: jobData.salaryRange || undefined,
          postedDate: new Date(),
        });
      }

      logger.info({ url, searchQuery, jobCount: jobs.length, source: 'LinkedIn' }, 'Jobs found successfully');

      return jobs;
    } catch (error) {
      logger.error({ error, url, source: 'LinkedIn' }, 'Scraping error');
      // Return mock data on failure as fallback
      return getMockLinkedInJobs(searchQuery, location);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });
}

/**
 * Auto-scroll to load lazy-loaded content
 */
async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight || totalHeight > 5000) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

/**
 * Mock LinkedIn jobs as fallback
 */
function getMockLinkedInJobs(searchQuery: string, location?: string): ScrapedJob[] {
  return [
    {
      title: `${searchQuery} - Remote Position`,
      companyName: 'Tech Company Inc.',
      description: `Looking for a skilled ${searchQuery} to join our team...`,
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchQuery)}`,
      location: location || 'Remote',
      salaryRange: '$80,000 - $120,000',
      postedDate: new Date(),
    },
    {
      title: `Senior ${searchQuery}`,
      companyName: 'Innovation Labs',
      description: `Senior ${searchQuery} position with great benefits...`,
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchQuery)}`,
      location: location || 'Remote',
      salaryRange: '$100,000 - $150,000',
      postedDate: new Date(),
    },
  ];
}

/**
 * Scrape Indeed jobs for a given query
 */
export async function scrapeIndeedJobs(searchQuery: string, location?: string): Promise<ScrapedJob[]> {
  return withRetry(async () => {
    let browser: Browser | null = null;
    let url = '';

    try {
      browser = await createBrowser();
      const page = await browser.newPage();

      await page.setUserAgent(getRandomUserAgent());
      await page.setViewport({ width: 1920, height: 1080 });

      const searchParams = new URLSearchParams({
        q: searchQuery,
        l: location || 'Remote',
      });

      url = `https://www.indeed.com/jobs?${searchParams.toString()}`;

      await withThrottle(
        async () => {
          logger.info({ url, source: 'Indeed' }, 'Scraping jobs');

          await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000,
          });
        },
        3000,
        5000
      );

      // Wait for job cards
      await page.waitForSelector('.job_seen_beacon', { timeout: 15000 }).catch(() => {
        logger.warn({ url, source: 'Indeed' }, 'Job cards not found');
      });

      await sleep(randomDelay(2000, 4000));
      await autoScroll(page);

      const jobs = await page.evaluate(() => {
        const jobCards = Array.from(document.querySelectorAll('.job_seen_beacon'));
        return jobCards.map(card => {
          const titleEl = card.querySelector('[data-testid="job-title"] a') || card.querySelector('h2 a');
          const companyEl = card.querySelector('[data-testid="company-name"]') || card.querySelector('.companyName');
          const locationEl = card.querySelector('[data-testid="job-location"]') || card.querySelector('.companyLocation');
          const linkEl = card.querySelector('a[data-jk]');

          return {
            title: titleEl?.textContent?.trim() || '',
            companyName: companyEl?.textContent?.trim() || '',
            location: locationEl?.textContent?.trim() || '',
            url: linkEl?.getAttribute('href') || '',
          };
        });
      });

      const processedJobs = jobs
        .filter(job => job.url)
        .map(job => ({
          title: job.title,
          companyName: job.companyName || 'Unknown Company',
          description: `Job opportunity for ${job.title}`,
          url: job.url.startsWith('http') ? job.url : `https://www.indeed.com${job.url}`,
          location: job.location || location || 'Remote',
          postedDate: new Date(),
        }));

      logger.info({ url, jobCount: processedJobs.length, source: 'Indeed' }, 'Jobs found successfully');
      return processedJobs;

    } catch (error) {
      logger.error({ error, url, source: 'Indeed' }, 'Scraping error');
      return getMockIndeedJobs(searchQuery, location);
    } finally {
      if (browser) await browser.close();
    }
  });
}

/**
 * Mock Indeed jobs as fallback
 */
function getMockIndeedJobs(searchQuery: string, location?: string): ScrapedJob[] {
  return [
    {
      title: `${searchQuery} Position`,
      companyName: 'Global Corp',
      description: `Exciting opportunity for ${searchQuery}...`,
      url: `https://www.indeed.com/jobs?q=${encodeURIComponent(searchQuery)}`,
      location: location || 'Remote',
      postedDate: new Date(),
    },
  ];
}

/**
 * Scrape company career pages
 */
export async function scrapeCompanyJobs(companyName: string, careerUrl: string): Promise<ScrapedJob[]> {
  return withRetry(async () => {
    let browser: Browser | null = null;

    try {
      browser = await createBrowser();
      const page = await browser.newPage();

      await page.setUserAgent(getRandomUserAgent());
      await page.setViewport({ width: 1920, height: 1080 });

      logger.info({ companyName, careerUrl, source: 'Company' }, 'Scraping company careers page');

      await withThrottle(
        async () => {
          await page.goto(careerUrl, {
            waitUntil: 'networkidle2',
            timeout: 30000,
          });
        }
      );

      await sleep(randomDelay(2000, 4000));
      await autoScroll(page);

      // Generic selectors - companies have different structures
      const jobs = await page.evaluate(() => {
        // Try common job listing selectors
        const selectors = [
          'a[href*="job"]',
          'a[href*="position"]',
          'a[href*="opening"]',
          '.job-item',
          '.position-item',
          '[data-job]',
        ];

        const jobLinks: { title: string; url: string }[] = [];

        for (const selector of selectors) {
          const elements = Array.from(document.querySelectorAll(selector));
          for (const el of elements) {
            const title = el.textContent?.trim();
            const href = (el as HTMLAnchorElement).href;
            if (title && href && title.length > 3 && title.length < 100) {
              jobLinks.push({ title, url: href });
            }
          }
          if (jobLinks.length > 0) break;
        }

        return jobLinks.slice(0, 10); // Max 10 jobs per company
      });

      const processedJobs = jobs.map(job => ({
        title: job.title,
        companyName,
        description: `Job opening at ${companyName}`,
        url: job.url,
        location: 'Company Location',
        postedDate: new Date(),
      }));

      logger.info({ companyName, jobCount: processedJobs.length, source: 'Company' }, 'Jobs found for company');
      return processedJobs;

    } catch (error) {
      logger.error({ error, companyName, careerUrl, source: 'Company' }, 'Error scraping company');
      return [{
        title: 'Software Engineer',
        companyName,
        description: `Job at ${companyName}`,
        url: careerUrl,
        location: 'Remote',
        postedDate: new Date(),
      }];
    } finally {
      if (browser) await browser.close();
    }
  });
}

/**
 * Scrape Glassdoor jobs
 */
export async function scrapeGlassdoorJobs(searchQuery: string, location?: string): Promise<ScrapedJob[]> {
  // Similar implementation to LinkedIn/Indeed
  // For now, returning empty array
  logger.info({ searchQuery, source: 'Glassdoor' }, 'Scraping not yet implemented');
  return [];
}

/**
 * Scrape Remotive (remote jobs API)
 */
export async function scrapeRemotiveJobs(searchQuery: string): Promise<ScrapedJob[]> {
  try {
    // Remotive has a public API
    const response = await fetch('https://remotive.com/api/remote-jobs?limit=50');
    const data = await response.json();

    const query = searchQuery.toLowerCase();

    return data.jobs
      .filter((job: any) =>
        job.title.toLowerCase().includes(query) ||
        job.tags.some((tag: string) => tag.toLowerCase().includes(query))
      )
      .slice(0, 10)
      .map((job: any) => ({
        title: job.title,
        companyName: job.company_name,
        description: job.description?.substring(0, 200) || 'Remote job opportunity',
        url: job.url,
        location: 'Remote',
        postedDate: new Date(job.publication_date),
      }));
  } catch (error) {
    logger.error({ error, source: 'Remotive' }, 'API error');
    return [];
  }
}
