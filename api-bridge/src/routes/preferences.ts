import { Router, Request, Response } from 'express';
import { preferencesOperations } from '../services/database';

const router = Router();

// Create preferences
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, jobTitles, locations, experienceLevel, remoteOnly } = req.body;

    if (!userId || !jobTitles || jobTitles.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const preferences = await preferencesOperations.findByUserId(req.params.userId);
    res.json({ preferences });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
