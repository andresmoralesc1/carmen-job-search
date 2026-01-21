import { Router, Request, Response } from 'express';
import { validateUserId } from '../server';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../services/logger';

const router = Router();

// Get user profile
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userOperations } = await import('../services/database');
    const user = await userOperations.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching user');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userOperations, companyOperations, jobOperations, preferencesOperations } = await import('../services/database');

    // Get companies count
    const companiesResult = await companyOperations.findByUserId(userId);
    const companiesCount = companiesResult.length;

    // Get jobs count
    const jobsResult = await jobOperations.findByUserId(userId, 100);
    const jobsCount = jobsResult.length;

    // Get this week's jobs count
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const jobsWeekResult = await jobOperations.findByDateRange(userId, weekAgo, new Date());
    const jobsThisWeek = jobsWeekResult.length;

    // Get last email sent (from schedule)
    const { scheduleOperations } = await import('../services/database');
    const schedule = await scheduleOperations.findByUserId(userId);

    let lastEmailSent = "No emails sent yet";
    if (schedule && schedule.length > 0) {
      const lastSchedule = schedule[0];
      if (lastSchedule.lastEmailSent) {
        lastEmailSent = lastSchedule.lastEmailSent;
      }
    }

    res.json({
      stats: [
        {
          label: "Companies Monitored",
          value: companiesCount,
          icon: "Building2",
          color: "bg-orange-500/10 text-orange-500",
          trend: companiesCount > 0 ? `+${companiesCount} companies` : "Add companies"
        },
        {
          label: "Jobs Found",
          value: jobsCount,
          icon: "Briefcase",
          color: "bg-blue-500/10 text-blue-500",
          trend: `+${jobsThisWeek} this week`
        },
        {
          label: "Last Email",
          value: lastEmailSent,
          icon: "Mail",
          color: "bg-green-500/10 text-green-500",
          trend: jobsCount > 0 ? `${jobsCount} jobs found` : "No jobs yet"
        }
      ]
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching stats');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent activity
router.get('/activity', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { jobOperations } = await import('../services/database');

    // Get recent jobs (last 5)
    const recentJobs = await jobOperations.findRecentByUserId(userId, 5);

    // Convert recent jobs to activity format
    const activity = recentJobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      companyName: job.company_name,
      time: formatTimeAgo(job.created_at),
      isNew: false // TODO: implementar lógica de "New"
    }));

    // Add email sent activities
    const { scheduleOperations } = await import('../services/database');
    const schedules = await scheduleOperations.findByUserId(userId);
    const lastSchedule = schedules && schedules.length > 0 ? schedules[0] : null;

    if (lastSchedule && lastSchedule.lastEmailSent) {
      activity.push({
        id: `email-${lastSchedule.id}`,
        title: `Email sent with ${lastSchedule.totalJobsFound} relevant offers`,
        companyName: 'Carmen',
        time: formatTimeAgo(lastSchedule.lastEmailSent),
        isNew: false
      });
    }

    res.json({ activity });
  } catch (error) {
    logger.error({ error }, 'Error fetching activity');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to format time ago
function formatTimeAgo(date: string): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = now.getTime() - targetDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
}

module.exports = router;
