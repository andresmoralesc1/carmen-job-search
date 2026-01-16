import { Router, Request, Response } from 'express';
import { jobOperations } from '../services/database';
import { validateUserId } from '../server';
import { getJobsSchema, validateQuery } from '../middleware/validation';

const router = Router();

// Get user's jobs
router.get('/user/:userId', validateUserId, validateQuery(getJobsSchema), async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit as number;
    const jobs = await jobOperations.findByUserId(req.params.userId, limit);
    res.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
