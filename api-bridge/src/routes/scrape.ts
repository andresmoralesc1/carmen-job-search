import { Router, Request, Response } from 'express';

const router = Router();

// Manual scrape trigger for a user
router.post('/manual', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // TODO: Implement scraping logic
    // This will:
    // 1. Get user's companies
    // 2. Scrape jobs from each company
    // 3. Match with preferences using OpenAI
    // 4. Store jobs in database
    // 5. Optionally send email if matches found

    res.json({
      message: 'Scraping initiated',
      jobsFound: 0,
      jobsMatched: 0
    });
  } catch (error) {
    console.error('Error in manual scrape:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Scrape all users (triggered by cron)
router.post('/all', async (req: Request, res: Response) => {
  try {
    // TODO: Implement batch scraping for all active users
    // This will be called by Vercel cron jobs

    res.json({
      message: 'Batch scraping completed',
      usersProcessed: 0,
      totalJobsFound: 0,
      totalJobsMatched: 0,
      emailsSent: 0
    });
  } catch (error) {
    console.error('Error in batch scrape:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
