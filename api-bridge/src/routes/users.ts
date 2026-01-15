import { Router, Request, Response } from 'express';
import { userOperations, preferencesOperations } from '../services/database';

const router = Router();

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, openaiApiKey, jobTitles } = req.body;

    if (!name || !email || !openaiApiKey) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await userOperations.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user
    const user = await userOperations.create(name, email, openaiApiKey);

    // Create job preferences if provided
    if (jobTitles && jobTitles.length > 0) {
      await preferencesOperations.create(user.id, jobTitles);
    }

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await userOperations.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
