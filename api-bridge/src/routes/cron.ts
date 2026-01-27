import { Router, Request, Response } from 'express';
import { getPool, scheduleOperations, userOperations, jobOperations } from '../services/database';
import { runScraping } from '../services/scrapers';
import { batchMatchJobs, type JobPreferences } from '../services/openai';
import { sendJobAlertEmail } from '../services/email';
import { logger } from '../services/logger';
import { jobOperations as jobOps } from '../services/database';

const router = Router();

/**
 * Check if current time matches user's preferred schedule
 * considering their timezone
 */
function shouldSendEmailNow(schedule: any): boolean {
  try {
    const now = new Date();

    // Get current time in user's timezone
    const userTimeZone = schedule.timezone || 'America/Bogota';
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: userTimeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const currentTime = formatter.format(now);
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);

    // Check if current time matches any preferred time (within 15 min window)
    for (const preferredTime of schedule.preferred_times) {
      const [prefHour, prefMinute] = preferredTime.split(':').map(Number);

      // Calculate difference in minutes
      const currentTotalMinutes = currentHour * 60 + currentMinute;
      const prefTotalMinutes = prefHour * 60 + prefMinute;
      const diff = Math.abs(currentTotalMinutes - prefTotalMinutes);

      // Match if within 15 minutes
      if (diff <= 15) {
        return true;
      }
    }

    return false;
  } catch (error) {
    logger.error({ error, schedule }, 'Error checking email schedule');
    return false;
  }
}

/**
 * Get last email sent time for a user
 */
async function getLastEmailSent(userId: string, pool: any): Promise<Date | null> {
  const result = await pool.query(
    'SELECT last_email_sent FROM carmen_email_schedules WHERE user_id = $1 AND active = true',
    [userId]
  );
  return result.rows[0]?.last_email_sent || null;
}

/**
 * Check if enough time has passed since last email based on frequency
 */
function shouldSendBasedOnFrequency(lastSent: Date | null, frequency: string): boolean {
  if (!lastSent) return true;

  const now = new Date();
  const hoursSinceLastSent = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);

  switch (frequency) {
    case 'daily':
      return hoursSinceLastSent >= 24;
    case 'weekly':
      return hoursSinceLastSent >= 168; // 7 days
    case 'biweekly':
      return hoursSinceLastSent >= 336; // 14 days
    default:
      return hoursSinceLastSent >= 24;
  }
}

/**
 * Main cron job handler
 * Triggered by Vercel cron to process job search and email alerts
 */
router.post('/job-search', async (req: Request, res: Response) => {
  const startTime = Date.now();
  logger.info({ timestamp: new Date().toISOString() }, 'Cron job triggered');

  const results = {
    timestamp: new Date().toISOString(),
    usersProcessed: 0,
    usersSkipped: 0,
    totalJobsFound: 0,
    totalJobsMatched: 0,
    emailsSent: 0,
    errors: [] as string[]
  };

  const pool = getPool();
  const client = await pool.connect();

  try {
    // 1. Get all users with active schedules
    const usersQuery = `
      SELECT DISTINCT
        u.id,
        u.name,
        u.email
      FROM carmen_users u
      INNER JOIN carmen_email_schedules es ON u.id = es.user_id
      WHERE es.active = true
    `;

    const usersResult = await client.query(usersQuery);
    const users = usersResult.rows;

    logger.info({ userCount: users.length }, 'Found users with active schedules');

    // 2. Process each user
    for (const user of users) {
      try {
        // Get user's schedule
        const scheduleResult = await client.query(
          'SELECT * FROM carmen_email_schedules WHERE user_id = $1 AND active = true',
          [user.id]
        );

        if (scheduleResult.rows.length === 0) {
          logger.debug({ userId: user.id }, 'No active schedule found');
          results.usersSkipped++;
          continue;
        }

        const schedule = scheduleResult.rows[0];

        // Check if should send email now based on time
        if (!shouldSendEmailNow(schedule)) {
          logger.debug({ userId: user.id, timezone: schedule.timezone }, 'Not time to send email yet');
          results.usersSkipped++;
          continue;
        }

        // Check if enough time has passed based on frequency
        const lastEmailSent = await getLastEmailSent(user.id, client);
        if (!shouldSendBasedOnFrequency(lastEmailSent, schedule.frequency)) {
          logger.debug({ userId: user.id, lastEmailSent, frequency: schedule.frequency }, 'Too soon to send email based on frequency');
          results.usersSkipped++;
          continue;
        }

        // Get user preferences separately
        const prefsResult = await client.query(
          'SELECT * FROM carmen_job_preferences WHERE user_id = $1',
          [user.id]
        );

        if (prefsResult.rows.length === 0) {
          logger.warn({ userId: user.id }, 'No job preferences found');
          results.usersSkipped++;
          continue;
        }

        // Get first preference set
        const preferences = prefsResult.rows[0];
        const jobTitles = preferences.job_titles || [];
        const locations = preferences.locations || [];

        logger.info({ userId: user.id, jobTitles, locations }, 'Processing user job search');

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
        logger.info({ userId: user.id, companiesCount: companies.length }, 'Starting job scraping');
        const scrapeResult = await runScraping(
          {
            userId: user.id,
            searchQueries: jobTitles,
            locations: locations,
            companies,
            sources: ['linkedin', 'indeed', 'remotive', 'companies']
          },
          client
        );

        results.totalJobsFound += scrapeResult.jobsFound;

        if (scrapeResult.errors.length > 0) {
          results.errors.push(...scrapeResult.errors.slice(0, 3));
        }

        if (scrapeResult.jobsFound === 0) {
          logger.info({ userId: user.id }, 'No jobs found for user');
          results.usersProcessed++;
          continue;
        }

        // Get newly scraped jobs for matching
        const newJobsResult = await client.query(
          `SELECT * FROM carmen_jobs
           WHERE user_id = $1
           AND created_at > NOW() - INTERVAL '1 hour'
           ORDER BY created_at DESC`,
          [user.id]
        );

        const newJobs = newJobsResult.rows.map((j: any) => ({
          id: j.id,
          title: j.title,
          companyName: j.company_name,
          description: j.description || '',
          location: j.location || 'Remote',
          salaryRange: j.salary_range,
          url: j.url
        }));

        if (newJobs.length === 0) {
          logger.info({ userId: user.id }, 'No new jobs to match');
          results.usersProcessed++;
          continue;
        }

        // Match jobs with preferences using OpenAI
        logger.info({ userId: user.id, jobCount: newJobs.length }, 'Starting AI matching');
        const matchedJobs = await batchMatchJobs(newJobs, preferences, user.id, {
          batchSize: 20,
          useCache: true
        });

        // Filter jobs by minimum similarity score (0.6 = 60%)
        const highQualityJobs = matchedJobs.filter(job => job.similarityScore >= 0.6);

        results.totalJobsMatched += matchedJobs.length;

        logger.info({
          userId: user.id,
          totalMatched: matchedJobs.length,
          highQuality: highQualityJobs.length
        }, 'Job matching completed');

        // Send email if we have high quality matches
        if (highQualityJobs.length > 0) {
          logger.info({ userId: user.id, jobCount: highQualityJobs.length }, 'Sending job alert email');

          const emailResult = await sendJobAlertEmail(
            user.email,
            user.name,
            highQualityJobs
          );

          if (emailResult.success) {
            results.emailsSent++;

            // Mark jobs as sent
            for (const job of highQualityJobs) {
              await jobOps.markAsSent(job.id);
            }

            // Update last email sent time
            await scheduleOperations.updateLastEmailSentByUserId(
              user.id,
              highQualityJobs.length
            );

            logger.info({
              userId: user.id,
              email: user.email,
              jobsSent: highQualityJobs.length
            }, 'Job alert email sent successfully');
          } else {
            results.errors.push(`Email failed for ${user.email}: ${emailResult.error}`);
            logger.error({
              userId: user.id,
              error: emailResult.error
            }, 'Failed to send job alert email');
          }
        } else {
          logger.info({ userId: user.id }, 'No high quality matches to email');
        }

        results.usersProcessed++;

      } catch (userError) {
        logger.error({ userId: user.id, error: userError }, 'Error processing user in cron job');
        results.errors.push(`User ${user.id}: ${userError}`);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.info({
      ...results,
      duration
    }, 'Cron job completed');

    res.json({
      success: true,
      ...results,
      duration: `${duration}s`
    });

  } catch (error) {
    logger.error({ error }, 'Error in cron job');
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      ...results
    });
  } finally {
    client.release();
  }
});

/**
 * Manual trigger for testing cron job
 * Requires API key authentication
 */
router.post('/job-search/manual', async (req: Request, res: Response) => {
  logger.info({ timestamp: new Date().toISOString() }, 'Manual cron trigger');

  // For manual testing, we can optionally override the time check
  // This allows testing the full workflow without waiting for the scheduled time
  const results = {
    timestamp: new Date().toISOString(),
    usersProcessed: 0,
    usersSkipped: 0,
    totalJobsFound: 0,
    totalJobsMatched: 0,
    emailsSent: 0,
    errors: [] as string[],
    note: 'This is a manual trigger - schedule time checks are bypassed'
  };

  const pool = getPool();
  const client = await pool.connect();

  try {
    // Get all users (bypassing schedule time check for manual testing)
    const usersQuery = `
      SELECT DISTINCT
        u.id,
        u.name,
        u.email
      FROM carmen_users u
      LIMIT 3
    `;

    const usersResult = await client.query(usersQuery);
    const users = usersResult.rows;

    logger.info({ userCount: users.length }, 'Processing users (manual test - limited to 3)');

    // Process first 3 users for testing
    for (const user of users.slice(0, 3)) {
      // Get user's preferences
      const prefsResult = await client.query(
        'SELECT * FROM carmen_job_preferences WHERE user_id = $1',
        [user.id]
      );

      if (prefsResult.rows.length === 0) continue;

      const preferences = prefsResult.rows[0];
      const jobTitles = preferences.job_titles || [];
      const locations = preferences.locations || [];

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

      // Run scraping with limited sources for testing
      const scrapeResult = await runScraping(
        {
          userId: user.id,
          searchQueries: jobTitles.slice(0, 2), // Limit queries
          locations: locations.slice(0, 1) || ['Remote'],
          companies: companies.slice(0, 2), // Limit companies
          sources: ['remotive'] // Use fastest source for testing
        },
        client
      );

      results.totalJobsFound += scrapeResult.jobsFound;

      if (scrapeResult.jobsFound === 0) continue;

      // Get newly scraped jobs
      const newJobsResult = await client.query(
        `SELECT * FROM carmen_jobs
         WHERE user_id = $1
         AND created_at > NOW() - INTERVAL '5 minutes'
         ORDER BY created_at DESC
         LIMIT 10`,
        [user.id]
      );

      const newJobs = newJobsResult.rows.map((j: any) => ({
        id: j.id,
        title: j.title,
        companyName: j.company_name,
        description: j.description || '',
        location: j.location || 'Remote',
        salaryRange: j.salary_range,
        url: j.url
      }));

      if (newJobs.length === 0) continue;

      // Match jobs (without cache for testing)
      const matchedJobs = await batchMatchJobs(newJobs, preferences, user.id, {
        useCache: false
      });

      const highQualityJobs = matchedJobs.filter(job => job.similarityScore >= 0.6);
      results.totalJobsMatched += matchedJobs.length;

      // Send email if we have matches
      if (highQualityJobs.length > 0) {
        const emailResult = await sendJobAlertEmail(
          user.email,
          user.name,
          highQualityJobs
        );

        if (emailResult.success) {
          results.emailsSent++;
          results.usersProcessed++;
        } else {
          results.errors.push(`Email failed for ${user.email}: ${emailResult.error}`);
        }
      }
    }

    logger.info({ ...results }, 'Manual cron trigger completed');

    res.json({
      success: true,
      ...results
    });

  } catch (error) {
    logger.error({ error }, 'Error in manual cron trigger');
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      ...results
    });
  } finally {
    client.release();
  }
});

module.exports = router;
