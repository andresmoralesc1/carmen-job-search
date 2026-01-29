import { Router, Request, Response } from 'express';
import { scheduleOperations } from '../services/database';
import { logger } from '../services/logger';

const router = Router();

// Get user's email schedule
router.get('/me', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const schedule = await scheduleOperations.findByUserId(userId);
    if (!schedule) {
      // Return empty schedule with defaults
      return res.json({
        schedule: {
          timezone: 'America/Bogota',
          preferred_times: ['09:00', '18:00'],
          frequency: 'daily',
          active: true
        }
      });
    }
    res.json({ schedule });
  } catch (error) {
    logger.error({ error }, 'Error fetching schedule');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update email schedule (upsert)
router.put('/me', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { timezone, preferredTimes, frequency } = req.body;

    // Validate required fields
    if (!preferredTimes || !Array.isArray(preferredTimes) || preferredTimes.length === 0) {
      return res.status(400).json({ error: 'preferredTimes is required and must be a non-empty array' });
    }

    if (!frequency || !['instant', 'daily', 'weekly'].includes(frequency)) {
      return res.status(400).json({ error: 'frequency must be one of: instant, daily, weekly' });
    }

    const schedule = await scheduleOperations.upsert(
      userId,
      timezone || 'America/Bogota',
      preferredTimes,
      frequency
    );

    logger.info({ userId, frequency }, 'Email schedule updated');

    res.json({ schedule });
  } catch (error) {
    logger.error({ error }, 'Error upserting schedule');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update existing schedule (partial update)
router.patch('/me', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { timezone, preferredTimes, frequency, active } = req.body;

    const schedule = await scheduleOperations.update(userId, {
      timezone,
      preferredTimes,
      frequency,
      active
    });

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found. Use PUT to create a new schedule.' });
    }

    logger.info({ userId }, 'Email schedule patched');

    res.json({ schedule });
  } catch (error) {
    logger.error({ error }, 'Error updating schedule');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete email schedule
router.delete('/me', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const schedule = await scheduleOperations.delete(userId);

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    logger.info({ userId }, 'Email schedule deleted');

    res.json({ message: 'Email schedule deleted successfully' });
  } catch (error) {
    logger.error({ error }, 'Error deleting schedule');
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
