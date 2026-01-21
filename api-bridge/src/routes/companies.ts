import { Router, Request, Response } from 'express';
import { companyOperations } from '../services/database';
import { validateUserId, validateCompanyId, validateId } from '../server';
import {
  createCompanySchema,
  deleteCompanySchema,
  validateBody
} from '../middleware/validation';
import { logger } from '../services/logger';

const router = Router();

// Get user's companies (from JWT token)
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const companies = await companyOperations.findByUserId(userId);
    res.json({ companies });
  } catch (error) {
    logger.error({ error }, 'Error fetching companies');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add company
router.post('/', validateBody(createCompanySchema), async (req: Request, res: Response) => {
  try {
    // Get userId from JWT token instead of body
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, careerPageUrl, jobBoardUrl } = req.body;

    const company = await companyOperations.create(userId, name, careerPageUrl, jobBoardUrl);
    res.status(201).json({ company });
  } catch (error) {
    logger.error({ error }, 'Error creating company');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's companies by ID (legacy route)
router.get('/user/:userId', validateUserId, async (req: Request, res: Response) => {
  try {
    const companies = await companyOperations.findByUserId(req.params.userId);
    res.json({ companies });
  } catch (error) {
    logger.error({ error }, 'Error fetching companies (by userId)');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete company
router.delete('/:id', validateId, validateBody(deleteCompanySchema), async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const company = await companyOperations.delete(req.params.id, userId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json({ company });
  } catch (error) {
    logger.error({ error }, 'Error deleting company');
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
