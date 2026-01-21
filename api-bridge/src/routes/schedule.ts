import { Router, Request, Response } from 'express';
import { scheduleOperations } from '../services/database';
import { logger } from '../services/logger';

const router = Router();

// Create email schedule
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, timezone, preferredTimes, frequency } = req.body;

    if (!userId || !preferredTimes || preferredTimes.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const schedule = await scheduleOperations.create(
      userId,
      timezone || 'America/Bogota',
      preferredTimes,
      frequency || 'daily'
    );

    res.status(201).json({ schedule });
  } catch (error) {
    logger.error({ error }, 'Error creating schedule');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's schedule
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const schedule = await scheduleOperations.findByUserId(req.params.userId);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ schedule });
  } catch (error) {
    logger.error({ error }, 'Error fetching schedule');
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
