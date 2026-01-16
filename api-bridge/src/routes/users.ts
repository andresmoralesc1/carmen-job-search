import { Router, Request, Response } from 'express';
import { userOperations, preferencesOperations } from '../services/database';
import { validateUserId, validateUUID } from '../server';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  updateApiKeySchema,
  validateBody
} from '../middleware/validation';

const router = Router();

// Register new user - API key is now optional
router.post('/register', validateBody(registerSchema), async (req: Request, res: Response) => {
  try {
    const { name, email, jobTitles } = req.body;

    // Check if user already exists
    const existingUser = await userOperations.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user without API key
    const user = await userOperations.create(name, email, '');

    // Create job preferences if provided
    if (jobTitles && jobTitles.length > 0) {
      await preferencesOperations.create(user.id, jobTitles);
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', validateBody(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await userOperations.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh access token
router.post('/refresh', validateBody(refreshSchema), async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;

    // Verify refresh token
    const payload = verifyRefreshToken(token);
    if (!payload) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    // Get user
    const user = await userOperations.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id, user.email);

    res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user's OpenAI API key
router.put('/api-key', validateBody(updateApiKeySchema), async (req: Request, res: Response) => {
  try {
    const { userId, openaiApiKey } = req.body;

    // Verify user exists
    const user = await userOperations.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update API key
    const { encrypt } = await import('../services/database');
    const encryptedKey = encrypt(openaiApiKey);

    await userOperations.updateApiKey(userId, encryptedKey);

    res.json({
      message: 'API key updated successfully'
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove user's OpenAI API key
router.delete('/:userId/api-key', validateUserId, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Verify user exists
    const user = await userOperations.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Clear API key
    await userOperations.updateApiKey(userId, null);

    res.json({
      message: 'API key removed successfully'
    });
  } catch (error) {
    console.error('Error removing API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', validateUserId, async (req: Request, res: Response) => {
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

// Export individual route handlers for public endpoints
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, jobTitles } = req.body;

    // Validate with schema
    const validatedData = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await userOperations.findByEmail(validatedData.email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user without API key
    const user = await userOperations.create(validatedData.name, validatedData.email, '');

    // Create job preferences if provided
    if (validatedData.jobTitles && validatedData.jobTitles.length > 0) {
      await preferencesOperations.create(user.id, validatedData.jobTitles);
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email } = loginSchema.parse(req.body);

    // Find user by email
    const user = await userOperations.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = refreshSchema.parse(req.body);

    // Verify refresh token
    const payload = verifyRefreshToken(token);
    if (!payload) {
      return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    // Get user
    const user = await userOperations.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id, user.email);

    res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = router;
