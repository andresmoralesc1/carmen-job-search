import { Router, Request, Response } from 'express';
import { getPool } from '../services/database';
import { sendJobAlertEmail } from '../services/email';
import { MatchedJob, Job } from '../services/openai';

const router = Router();

/**
 * Send digest emails to users based on their schedules
 * Called by Vercel cron job
 */
router.post('/send-digest', async (req: Request, res: Response) => {
  try {
    console.log('[Email Digest] Starting:', new Date().toISOString());

    const pool = getPool();
    const client = await pool.connect();

    let emailsSent = 0;
    let usersProcessed = 0;
    const errors: string[] = [];

    try {
      // Get users who should receive emails now
      const usersResult = await client.query(`
        SELECT u.id, u.name, u.email,
          es.preferred_times,
          es.timezone,
          json_agg(DISTINCT jp.*) FILTER (WHERE jp.id IS NOT NULL) as preferences
        FROM carmen_users u
        INNER JOIN carmen_email_schedules es ON u.id = es.user_id
        LEFT JOIN carmen_job_preferences jp ON u.id = jp.user_id
        WHERE es.active = true
        GROUP BY u.id, es.preferred_times, es.timezone
      `);

      for (const user of usersResult.rows) {
        try {
          // Check if current time matches user's preferred times
          const now = new Date();
          const userHour = parseInt(user.preferred_times[0]?.split(':')[0] || '8');

          // Simple check - in production, use timezone-aware comparison
          const currentHour = now.getHours();
          const shouldSend = Math.abs(currentHour - userHour) < 1;

          if (!shouldSend) continue;

          // Get unsent jobs for this user
          const jobsResult = await client.query(`
            SELECT * FROM carmen_jobs
            WHERE user_id = $1
            AND sent_via_email = false
            AND similarity_score >= 0.5
            ORDER BY created_at DESC
            LIMIT 20
          `, [user.id]);

          if (jobsResult.rows.length === 0) continue;

          const jobs: MatchedJob[] = jobsResult.rows.map((row: any) => ({
            id: row.id,
            title: row.title,
            companyName: row.company_name,
            description: row.description,
            location: row.location,
            salaryRange: row.salary_range,
            url: row.url,
            similarityScore: parseFloat(row.similarity_score),
            matchReasons: [] // Could be stored separately
          }));

          // Send email
          const emailResult = await sendJobAlertEmail(
            user.email,
            user.name,
            jobs
          );

          if (emailResult.success) {
            // Mark jobs as sent
            await client.query(`
              UPDATE carmen_jobs
              SET sent_via_email = true
              WHERE id = ANY($1)
            `, [jobs.map(j => j.id)]);

            emailsSent++;
            usersProcessed++;
          } else {
            errors.push(`Failed to send email to ${user.email}: ${emailResult.error}`);
          }

        } catch (userError) {
          console.error(`Error processing user ${user.id}:`, userError);
          errors.push(`User ${user.id}: ${userError}`);
        }
      }

      res.json({
        message: 'Email digest completed',
        usersProcessed,
        emailsSent,
        errors: errors.slice(0, 10)
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error in email digest:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Send a test email to a user
 */
router.post('/test', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const pool = getPool();
    const client = await pool.connect();

    try {
      const userResult = await client.query(
        'SELECT * FROM carmen_users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = userResult.rows[0];

      // Get some recent jobs
      const jobsResult = await client.query(`
        SELECT * FROM carmen_jobs
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 3
      `, [userId]);

      const jobs: MatchedJob[] = jobsResult.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        companyName: row.company_name,
        description: row.description,
        location: row.location,
        salaryRange: row.salary_range,
        url: row.url,
        similarityScore: parseFloat(row.similarity_score) || 0.75,
        matchReasons: ['Test match reason']
      }));

      const result = await sendJobAlertEmail(user.email, user.name, jobs);

      res.json(result);

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
