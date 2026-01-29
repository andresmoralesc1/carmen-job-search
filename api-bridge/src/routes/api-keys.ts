import { Router, Request, Response } from 'express';
import { userApiKeyOperations } from '../services/database';
import { logger } from '../services/logger';

const router = Router();

// Provider configuration with validation patterns
const PROVIDER_CONFIG = {
  openai: {
    name: 'OpenAI (ChatGPT)',
    description: 'Required for GPT-4 powered job matching and analysis',
    keyPattern: /^sk-/,
    keyPrefix: 'sk-',
    endpoint: 'https://api.openai.com/v1',
  },
  claude: {
    name: 'Anthropic Claude',
    description: 'Advanced AI assistant for intelligent job recommendations',
    keyPattern: /^sk-ant-/,
    keyPrefix: 'sk-ant-',
    endpoint: 'https://api.anthropic.com/v1',
  },
  gemini: {
    name: 'Google Gemini',
    description: 'Google\'s AI model for job matching and insights',
    keyPattern: /^[A-Za-z0-9_-]{32,}$/,
    keyPrefix: '',
    endpoint: 'https://generativelanguage.googleapis.com/v1',
  },
  zai: {
    name: 'Z.AI',
    description: 'Alternative AI provider for job search assistance',
    keyPattern: /^zai-/,
    keyPrefix: 'zai-',
    endpoint: 'https://api.z.ai/v1',
  },
};

// Get all API keys for the current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const apiKeys = await userApiKeyOperations.getAllApiKeys(userId);

    // Map to include provider info
    const keysWithInfo = await Promise.all(
      apiKeys.map(async (key: any) => ({
        provider: key.provider,
        name: PROVIDER_CONFIG[key.provider as keyof typeof PROVIDER_CONFIG]?.name || key.provider,
        isActive: key.is_active,
        createdAt: key.created_at,
        updatedAt: key.updated_at,
      }))
    );

    res.json({ apiKeys: keysWithInfo });
  } catch (error) {
    logger.error({ error }, 'Error fetching API keys');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if user has an API key for a specific provider
router.get('/me/:provider', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { provider } = req.params;
    if (!PROVIDER_CONFIG[provider as keyof typeof PROVIDER_CONFIG]) {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    const hasKey = await userApiKeyOperations.hasApiKey(userId, provider);
    res.json({ hasKey, provider });
  } catch (error) {
    logger.error({ error }, 'Error checking API key');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Set or update an API key for a provider
router.put('/me/:provider', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { provider } = req.params;
    const { apiKey } = req.body;

    if (!PROVIDER_CONFIG[provider as keyof typeof PROVIDER_CONFIG]) {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(400).json({ error: 'API key is required' });
    }

    const config = PROVIDER_CONFIG[provider as keyof typeof PROVIDER_CONFIG];

    // Validate key format
    if (config.keyPrefix && !apiKey.startsWith(config.keyPrefix)) {
      return res.status(400).json({
        error: `Invalid ${config.name} API key format. Keys should start with "${config.keyPrefix}"`
      });
    }

    // Store the encrypted API key
    await userApiKeyOperations.setApiKey(userId, provider, apiKey);

    logger.info({ userId, provider }, 'API key updated');

    res.json({
      success: true,
      provider,
      message: `${config.name} API key saved successfully`
    });
  } catch (error) {
    logger.error({ error }, 'Error saving API key');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an API key for a provider
router.delete('/me/:provider', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { provider } = req.params;
    if (!PROVIDER_CONFIG[provider as keyof typeof PROVIDER_CONFIG]) {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    await userApiKeyOperations.deleteApiKey(userId, provider);

    logger.info({ userId, provider }, 'API key deleted');

    res.json({
      success: true,
      provider,
      message: 'API key removed successfully'
    });
  } catch (error) {
    logger.error({ error }, 'Error deleting API key');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle active status for an API key (auto-toggles current state)
router.patch('/me/:provider/toggle', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { provider } = req.params;

    if (!PROVIDER_CONFIG[provider as keyof typeof PROVIDER_CONFIG]) {
      return res.status(400).json({ error: 'Invalid provider' });
    }

    // Get current state to determine new state
    const currentKey = await userApiKeyOperations.getApiKeyMetadata(userId, provider);
    if (!currentKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    const newActiveState = !currentKey.is_active;
    await userApiKeyOperations.toggleApiKey(userId, provider, newActiveState);

    res.json({
      success: true,
      provider,
      isActive: newActiveState
    });
  } catch (error) {
    logger.error({ error }, 'Error toggling API key');
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

// Export the providers config for use in other routes
module.exports.PROVIDER_CONFIG = PROVIDER_CONFIG;
