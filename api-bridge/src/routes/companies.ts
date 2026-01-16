import { Router, Request, Response } from 'express';
import { companyOperations } from '../services/database';
import { validateUserId, validateCompanyId, validateId } from '../server';
import {
  createCompanySchema,
  deleteCompanySchema,
  validateBody
} from '../middleware/validation';

const router = Router();

// Add company
router.post('/', validateBody(createCompanySchema), async (req: Request, res: Response) => {
  try {
    const { userId, name, careerPageUrl, jobBoardUrl } = req.body;

    const company = await companyOperations.create(userId, name, careerPageUrl, jobBoardUrl);
    res.status(201).json({ company });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's companies
router.get('/user/:userId', validateUserId, async (req: Request, res: Response) => {
  try {
    const companies = await companyOperations.findByUserId(req.params.userId);
    res.json({ companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
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
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
