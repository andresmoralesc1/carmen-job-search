import { Router, Request, Response } from 'express';
import { applicationOperations } from '../services/database';
import { validateUserId } from '../server';
import { logger } from '../services/logger';

const router = Router();

// Get all applications for a user
router.get('/user/:userId', validateUserId, async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const applications = await applicationOperations.findByUserId(req.params.userId, status);
    res.json({ applications });
  } catch (error) {
    logger.error({ error, userId: req.params.userId }, 'Error fetching applications');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get application stats
router.get('/stats/:userId', validateUserId, async (req: Request, res: Response) => {
  try {
    const stats = await applicationOperations.getStats(req.params.userId);
    res.json({ stats });
  } catch (error) {
    logger.error({ error, userId: req.params.userId }, 'Error fetching application stats');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single application
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const application = await applicationOperations.findById(req.params.id, userId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ application });
  } catch (error) {
    logger.error({ error, applicationId: req.params.id }, 'Error fetching application');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new application
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, jobId, companyId, status, applicationDate, notes } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!jobId && !companyId) {
      return res.status(400).json({ error: 'Either jobId or companyId is required' });
    }

    const application = await applicationOperations.create(userId, {
      jobId,
      companyId,
      status,
      applicationDate,
      notes,
    });

    res.status(201).json({ application });
  } catch (error) {
    logger.error({ error, userId: req.body.userId }, 'Error creating application');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update application status
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const { userId, status, notes } = req.body;

    if (!userId || !status) {
      return res.status(400).json({ error: 'userId and status are required' });
    }

    const application = await applicationOperations.updateStatus(req.params.id, userId, status, notes);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ application });
  } catch (error) {
    logger.error({ error, applicationId: req.params.id }, 'Error updating application status');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update interview info
router.put('/:id/interview', async (req: Request, res: Response) => {
  try {
    const { userId, interviewDate, interviewNotes } = req.body;

    if (!userId || !interviewDate) {
      return res.status(400).json({ error: 'userId and interviewDate are required' });
    }

    const application = await applicationOperations.updateInterview(
      req.params.id,
      userId,
      new Date(interviewDate),
      interviewNotes
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ application });
  } catch (error) {
    logger.error({ error, applicationId: req.params.id }, 'Error updating interview info');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update offer info
router.put('/:id/offer', async (req: Request, res: Response) => {
  try {
    const { userId, offerAmount, offerStatus } = req.body;

    if (!userId || !offerAmount || !offerStatus) {
      return res.status(400).json({ error: 'userId, offerAmount, and offerStatus are required' });
    }

    const application = await applicationOperations.updateOffer(
      req.params.id,
      userId,
      offerAmount,
      offerStatus
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ application });
  } catch (error) {
    logger.error({ error, applicationId: req.params.id }, 'Error updating offer info');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete application
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const application = await applicationOperations.delete(req.params.id, userId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    logger.error({ error, applicationId: req.params.id }, 'Error deleting application');
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
