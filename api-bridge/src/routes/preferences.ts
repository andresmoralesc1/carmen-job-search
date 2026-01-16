import { Router, Request, Response } from 'express';
import { preferencesOperations } from '../services/database';
import { validateUserId } from '../server';
import {
  createPreferencesSchema,
  validateBody
} from '../middleware/validation';

const router = Router();

// Create preferences
router.post('/', validateBody(createPreferencesSchema), async (req: Request, res: Response) => {
  try {
    const { userId, jobTitles, locations, experienceLevel, remoteOnly } = req.body;

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

// Get user's preferences
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
