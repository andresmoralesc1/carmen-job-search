import { Router, Request, Response } from 'express';
import { getPool } from '../services/database';
import { runScraping } from '../services/scrapers';
import { matchJobsWithPreferences } from '../services/openai';
import { validateUserId } from '../server';
import { manualScrapeSchema, validateBody } from '../middleware/validation';

const router = Router();

// Manual scrape trigger for a user
router.post('/manual', validateBody(manualScrapeSchema), async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const pool = getPool();
    const client = await pool.connect();

    try {
      // Get user preferences
      const prefsResult = await client.query(
        'SELECT * FROM carmen_job_preferences WHERE user_id = $1',
        [userId]
      );

      if (prefsResult.rows.length === 0) {
        return res.status(404).json({ error: 'User preferences not found' });
      }

      const preferences = prefsResult.rows[0];

      // Get user's companies
      const companiesResult = await client.query(
        'SELECT * FROM carmen_companies WHERE user_id = $1 AND active = true',
        [userId]
      );

      const companies = companiesResult.rows.map((c: any) => ({
        name: c.name,
        careerUrl: c.career_page_url,
        jobBoardUrl: c.job_board_url
      }));

      // Run scraping
      const result = await runScraping(
        {
          searchQueries: preferences.job_titles,
          locations: preferences.locations,
          companies
        },
        client
      );

      res.json({
        message: 'Scraping completed',
        jobsFound: result.jobsFound,
        jobsSaved: result.jobsSaved,
        errors: result.errors
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error in manual scrape:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Scrape all users (triggered by cron)
router.post('/all', async (req: Request, res: Response) => {
  try {
    console.log('[Cron] Starting batch scraping:', new Date().toISOString());

    const pool = getPool();
    const client = await pool.connect();

    let totalJobsFound = 0;
    let totalJobsMatched = 0;
    let usersProcessed = 0;
    const errors: string[] = [];

    try {
      // Get all users with preferences
      const usersResult = await client.query(`
        SELECT DISTINCT u.id, u.name, u.email,
          json_agg(DISTINCT jp.*) FILTER (WHERE jp.id IS NOT NULL) as preferences
        FROM carmen_users u
        LEFT JOIN carmen_job_preferences jp ON u.id = jp.user_id
        GROUP BY u.id
      `);

      for (const user of usersResult.rows) {
        try {
          const preferences = user.preferences[0];
          if (!preferences) continue;

          // Get user's companies
          const companiesResult = await client.query(
            'SELECT * FROM carmen_companies WHERE user_id = $1 AND active = true',
            [user.id]
          );

          const companies = companiesResult.rows.map((c: any) => ({
            name: c.name,
            careerUrl: c.career_page_url,
            jobBoardUrl: c.job_board_url
          }));

          // Run scraping
          const scrapeResult = await runScraping(
            {
              searchQueries: preferences.job_titles,
              locations: preferences.locations,
              companies
            },
            client
          );

          totalJobsFound += scrapeResult.jobsFound;
          usersProcessed++;

          if (scrapeResult.errors.length > 0) {
            errors.push(...scrapeResult.errors);
          }

        } catch (userError) {
          console.error(`Error processing user ${user.id}:`, userError);
          errors.push(`User ${user.id}: ${userError}`);
        }
      }

      res.json({
        message: 'Batch scraping completed',
        usersProcessed,
        totalJobsFound,
        totalJobsMatched,
        errors: errors.slice(0, 10) // Return first 10 errors
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error in batch scrape:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
