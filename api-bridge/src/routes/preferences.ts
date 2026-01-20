import { Router, Request, Response } from 'express';
import { preferencesOperations } from '../services/database';
import { validateUserId } from '../server';
import {
  createPreferencesSchema,
  validateBody
} from '../middleware/validation';

const router = Router();

// Get user's preferences (from JWT token)
router.get('/me', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const preferences = await preferencesOperations.findByUserId(userId);
    res.json({ preferences });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create preferences
router.post('/', validateBody(createPreferencesSchema), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { jobTitles, locations, experienceLevel, remoteOnly } = req.body;

    const preferences = await preferencesOperations.create(
      userId,
      jobTitles,
      locations,
      experienceLevel,
      remoteOnly
    );

    res.status(201).json({ preferences });
  } catch (error) {
    console.error('Error creating preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's preferences by ID (legacy route)
router.get('/user/:userId', validateUserId, async (req: Request, res: Response) => {
  try {
    const preferences = await preferencesOperations.findByUserId(req.params.userId);
    res.json({ preferences });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
