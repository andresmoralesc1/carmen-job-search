import { Router, Request, Response } from 'express';
import { jobOperations } from '../services/database';
import { validateUserId } from '../server';
import { getJobsSchema, validateQuery } from '../middleware/validation';

const router = Router();

// Get user's jobs (from JWT token) - main endpoint for frontend
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = Math.min(typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 50, 100);

    const jobs = await jobOperations.findByUserId(userId, limit);

    res.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Pagination result type
interface PaginatedResult<T> {
  data: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

// Get user's jobs with pagination
router.get('/user/:userId', validateUserId, validateQuery(getJobsSchema), async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const limit = Math.min(typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 20, 100);
    const offset = typeof req.query.offset === 'string' ? parseInt(req.query.offset, 10) : 0;
    const cursor = req.query.cursor as string | undefined;

    // If using cursor-based pagination
    if (cursor) {
      const [id, timestamp] = cursor.split('_');
      const jobs = await jobOperations.findByUserIdCursor(userId, limit, id, timestamp);
      const hasMore = jobs.length === limit;

      res.json({
        jobs,
        pagination: {
          limit,
          offset,
          hasMore,
          nextCursor: hasMore && jobs.length > 0 ? `${jobs[jobs.length - 1].id}_${jobs[jobs.length - 1].created_at}` : undefined,
        }
      });
    } else {
      // Offset-based pagination
      const [jobs, total] = await Promise.all([
        jobOperations.findByUserIdPaginated(userId, limit, offset),
        jobOperations.countByUserId(userId),
      ]);

      const hasMore = offset + jobs.length < total;

      res.json({
        jobs,
        pagination: {
          limit,
          offset,
          total,
          hasMore,
          nextCursor: hasMore && jobs.length > 0 ? `${jobs[jobs.length - 1].id}_${jobs[jobs.length - 1].created_at}` : undefined,
        }
      });
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get filtered jobs with advanced pagination
router.get('/user/:userId/filtered', validateUserId, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const status = req.query.status as string | undefined;
    const minScore = parseFloat(req.query.minScore as string) || 0.5;
    const sentOnly = req.query.sentOnly === 'true';

    const [jobs, total] = await Promise.all([
      jobOperations.findFilteredJobs(userId, { limit, offset, status, minScore, sentOnly }),
      jobOperations.countFilteredJobs(userId, { status, minScore, sentOnly }),
    ]);

    const hasMore = offset + jobs.length < total;

    res.json({
      jobs,
      pagination: {
        limit,
        offset,
        total,
        hasMore,
      }
    });
  } catch (error) {
    console.error('Error fetching filtered jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
