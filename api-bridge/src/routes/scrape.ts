import { Router, Request, Response } from 'express';
import { getPool } from '../services/database';
import { runScraping } from '../services/scrapers';
import { matchJobsWithPreferences } from '../services/openai';
import { validateUserId } from '../server';
import { manualScrapeSchema, validateBody } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../services/logger';

const router = Router();

// Manual scrape trigger for a user (requires authentication)
router.post('/manual', authenticateToken, validateBody(manualScrapeSchema), async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const authenticatedUserId = req.user?.id;

    // CRITICAL SECURITY: Validate that authenticated user matches requested userId
    if (userId !== authenticatedUserId) {
      logger.warn({ authenticatedUserId, requestedUserId: userId }, 'Attempt to trigger scrape for different user');
      return res.status(403).json({ error: 'You can only trigger scrapes for your own account' });
    }

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
          userId,
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
    logger.error({ error }, 'Error in manual scrape');
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
              userId: user.id,
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
          logger.error({ userId: user.id, error: userError }, 'Error processing user in batch scrape');
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
    logger.error({ error }, 'Error in batch scrape');
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
