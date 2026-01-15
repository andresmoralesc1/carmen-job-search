import { scrapeLinkedInJobs, scrapeIndeedJobs, scrapeCompanyJobs, ScrapedJob } from './scrapers';
import { PoolClient } from 'pg';

export interface ScrapingConfig {
  searchQueries: string[];
  locations?: string[];
  companies: Array<{ name: string; careerUrl: string; jobBoardUrl?: string }>;
}

export interface ScrapingResult {
  success: boolean;
  jobsFound: number;
  jobsSaved: number;
  errors: string[];
}

/**
 * Main scraping orchestrator
 * Coordinates scraping from multiple sources
 */
export async function runScraping(
  config: ScrapingConfig,
  db: PoolClient
): Promise<ScrapingResult> {
  const result: ScrapingResult = {
    success: false,
    jobsFound: 0,
    jobsSaved: 0,
    errors: []
  };

  const allJobs: ScrapedJob[] = [];

  try {
    // 1. Scrape job boards (LinkedIn, Indeed)
    for (const query of config.searchQueries) {
      for (const location of config.locations || ['Remote']) {
        try {
          const linkedinJobs = await scrapeLinkedInJobs(query, location);
          const indeedJobs = await scrapeIndeedJobs(query, location);
          allJobs.push(...linkedinJobs, ...indeedJobs);
        } catch (error) {
          result.errors.push(`Job board error for ${query} in ${location}: ${error}`);
        }
      }
    }

    // 2. Scrape company career pages
    for (const company of config.companies) {
      try {
        const companyJobs = await scrapeCompanyJobs(company.name, company.careerUrl);
        allJobs.push(...companyJobs);
      } catch (error) {
        result.errors.push(`Company error for ${company.name}: ${error}`);
      }
    }

    result.jobsFound = allJobs.length;

    // 3. Deduplicate jobs
    const uniqueJobs = deduplicateJobs(allJobs);

    // 4. Save to database
    result.jobsSaved = await saveJobsToDatabase(uniqueJobs, db);

    result.success = true;
  } catch (error) {
    result.errors.push(`Scraping failed: ${error}`);
  }

  return result;
}

/**
 * Remove duplicate jobs based on URL similarity
 */
function deduplicateJobs(jobs: ScrapedJob[]): ScrapedJob[] {
  const seen = new Set<string>();
  const unique: ScrapedJob[] = [];

  for (const job of jobs) {
    // Normalize URL for comparison
    const normalizedUrl = job.url.toLowerCase().replace(/\/$/, '');
    const urlKey = new URL(normalizedUrl).pathname;

    if (!seen.has(urlKey)) {
      seen.add(urlKey);
      unique.push(job);
    }
  }

  return unique;
}

/**
 * Save scraped jobs to database
 */
async function saveJobsToDatabase(
  jobs: ScrapedJob[],
  db: PoolClient
): Promise<number> {
  let saved = 0;

  for (const job of jobs) {
    try {
      const query = `
        INSERT INTO carmen_jobs (id, user_id, title, company_name, description, url, location, salary_range, posted_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (url, user_id) DO NOTHING
      `;

      await db.query(query, [
        crypto.randomUUID(),
        'system', // Or appropriate user_id
        job.title,
        job.companyName,
        job.description,
        job.url,
        job.location,
        job.salaryRange || null,
        job.postedDate || null
      ]);

      saved++;
    } catch (error) {
      console.error(`Failed to save job: ${job.url}`, error);
    }
  }

  return saved;
}

export { scrapeLinkedInJobs, scrapeIndeedJobs, scrapeCompanyJobs };
export type { ScrapedJob };
