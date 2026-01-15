import { Router, Request, Response } from 'express';
import { jobOperations } from '../services/database';

const router = Router();

// Get user's jobs
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const jobs = await jobOperations.findByUserId(req.params.userId, limit);
    res.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
