import OpenAI from 'openai';
import { cacheGet, cacheSet, cacheKeys } from './cache';
import { openAIRequestsTotal, openAITokensTotal, scrapeDuration } from './metrics';
import { logger } from './logger';

export interface JobPreferences {
  jobTitles: string[];
  locations?: string[];
  experienceLevel?: string;
  remoteOnly?: boolean;
  salaryRange?: { min: number; max: number };
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  description: string;
  location: string;
  salaryRange?: string;
  url: string;
}

export interface MatchedJob extends Job {
  similarityScore: number;
  matchReasons: string[];
}

interface OpenAIMatchResponse {
  matches: Array<{
    jobId: string;
    score: number;
    reasons: string[];
  }>;
}

/**
 * Calculate similarity score between jobs and user preferences using OpenAI
 */
export async function matchJobsWithPreferences(
  jobs: Job[],
  preferences: JobPreferences,
  userId: string
): Promise<MatchedJob[]> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    // Build the prompt for OpenAI
    const prompt = buildMatchingPrompt(jobs, preferences);

    const startTime = Date.now();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert job matching assistant. Analyze job listings against user preferences and provide:
1. A similarity score from 0.0 to 1.0 (where 1.0 is perfect match)
2. Specific reasons for the match

Consider:
- Job title alignment with desired titles
- Location match
- Experience level
- Remote/hybrid preferences
- Salary range if specified

Respond ONLY with valid JSON.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const duration = (Date.now() - startTime) / 1000;
    logger.info({ jobCount: jobs.length, duration, userId }, 'OpenAI matching completed');

    // Track metrics
    openAIRequestsTotal.inc({ operation: 'match', status: 'success' });
    openAITokensTotal.inc({
      model: 'gpt-4o-mini',
      type: 'prompt'
    }, response.usage?.prompt_tokens || 0);
    openAITokensTotal.inc({
      model: 'gpt-4o-mini',
      type: 'completion'
    }, response.usage?.completion_tokens || 0);

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    const parsedResponse = JSON.parse(content) as OpenAIMatchResponse;
    const matches = parsedResponse.matches || [];

    // Combine jobs with their scores
    const matchedJobs: MatchedJob[] = jobs.map(job => {
      const match = matches.find(m => m.jobId === job.id);

      return {
        ...job,
        similarityScore: match?.score || 0,
        matchReasons: match?.reasons || []
      };
    });

    // Filter by minimum score threshold
    return matchedJobs.filter(job => job.similarityScore > 0.5);

  } catch (error) {
    logger.error({ error, jobCount: jobs.length, userId }, 'OpenAI matching error');
    openAIRequestsTotal.inc({ operation: 'match', status: 'error' });

    // Return jobs with default scores on error
    return jobs.map(job => ({
      ...job,
      similarityScore: 0.5,
      matchReasons: ['Unable to calculate match score']
    }));
  }
}

/**
 * Build the matching prompt for OpenAI
 */
function buildMatchingPrompt(jobs: Job[], preferences: JobPreferences): string {
  const preferencesText = `
User Preferences:
- Job Titles: ${preferences.jobTitles.join(', ')}
- Locations: ${preferences.locations?.join(', ') || 'Any'}
- Experience Level: ${preferences.experienceLevel || 'Any'}
- Remote Only: ${preferences.remoteOnly ? 'Yes' : 'No'}
- Salary Range: ${preferences.salaryRange ? `$${preferences.salaryRange.min} - $${preferences.salaryRange.max}` : 'Any'}
  `.trim();

  const jobsText = jobs.map(job => `
Job ID: ${job.id}
Title: ${job.title}
Company: ${job.companyName}
Location: ${job.location}
Description: ${job.description.slice(0, 300)}...
${job.salaryRange ? `Salary: ${job.salaryRange}` : ''}
  `.trim()).join('\n---\n');

  return `
${preferencesText}

Please rate these jobs from 0-1 based on how well they match the user's preferences:

${jobsText}

Return JSON in this exact format:
{
  "matches": [
    {
      "jobId": "job-id-1",
      "score": 0.85,
      "reasons": ["Matches desired title", "Location preference met"]
    }
  ]
}
  `.trim();
}

/**
 * Calculate match score using basic keyword matching (fallback without OpenAI)
 */
export function calculateBasicMatchScore(
  job: Job,
  preferences: JobPreferences
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const maxScore = 100;

  // Title matching (40 points)
  const titleLower = job.title.toLowerCase();
  const titleMatches = preferences.jobTitles.some(title =>
    titleLower.includes(title.toLowerCase()) ||
    title.toLowerCase().includes(titleLower.split(' ')[0])
  );
  if (titleMatches) {
    score += 40;
    reasons.push('Job title matches preferences');
  }

  // Location matching (30 points)
  if (preferences.locations && preferences.locations.length > 0) {
    const locationMatch = preferences.locations.some(loc =>
      job.location.toLowerCase().includes(loc.toLowerCase())
    );
    if (locationMatch) {
      score += 30;
      reasons.push('Location matches preferences');
    } else if (job.location.toLowerCase().includes('remote') && !preferences.remoteOnly) {
      score += 15;
      reasons.push('Remote opportunity');
    }
  }

  // Remote preference (20 points)
  if (preferences.remoteOnly && job.location.toLowerCase().includes('remote')) {
    score += 20;
    reasons.push('Remote position');
  }

  // Keywords in description (10 points)
  const keywords = ['senior', 'lead', 'principal', 'staff'];
  const hasKeyword = keywords.some(kw =>
    titleLower.includes(kw) && preferences.jobTitles.some(t => t.toLowerCase().includes(kw))
  );
  if (hasKeyword) {
    score += 10;
    reasons.push('Experience level matches');
  }

  return {
    score: score / maxScore,
    reasons
  };
}

/**
 * Batch match jobs with parallel processing and caching
 */
export async function batchMatchJobs(
  jobs: Job[],
  preferences: JobPreferences,
  userId: string,
  options: {
    batchSize?: number;
    parallelBatches?: number;
    useCache?: boolean;
  } = {}
): Promise<MatchedJob[]> {
  const {
    batchSize = 20,
    parallelBatches = 3,
    useCache = true
  } = options;

  const results: MatchedJob[] = [];
  const batches: Job[][] = [];

  // Split jobs into batches
  for (let i = 0; i < jobs.length; i += batchSize) {
    batches.push(jobs.slice(i, i + batchSize));
  }

  logger.info({
    totalJobs: jobs.length,
    batchCount: batches.length,
    batchSize,
    parallelBatches,
    userId
  }, 'Starting batch job matching');

  // Process batches in parallel groups
  for (let i = 0; i < batches.length; i += parallelBatches) {
    const group = batches.slice(i, i + parallelBatches);

    const batchResults = await Promise.all(
      group.map(async (batch) => {
        // Check cache for each job
        const uncachedJobs: Job[] = [];
        const cachedResults: MatchedJob[] = [];

        if (useCache) {
          for (const job of batch) {
            const cacheKey = cacheKeys.aiMatching(job.id, userId);
            const cached = await cacheGet<MatchedJob>(cacheKey);

            if (cached) {
              cachedResults.push(cached);
            } else {
              uncachedJobs.push(job);
            }
          }
        } else {
          uncachedJobs.push(...batch);
        }

        // Process uncached jobs
        let matched: MatchedJob[] = [];
        if (uncachedJobs.length > 0) {
          matched = await matchJobsWithPreferences(uncachedJobs, preferences, userId);

          // Cache results
          if (useCache) {
            for (const job of matched) {
              const cacheKey = cacheKeys.aiMatching(job.id, userId);
              await cacheSet(cacheKey, job, 604800); // 7 days
            }
          }
        }

        return [...cachedResults, ...matched];
      })
    );

    results.push(...batchResults.flat());

    // Small delay between batch groups to avoid rate limits
    if (i + parallelBatches < batches.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Sort by similarity score descending
  const sorted = results.sort((a, b) => b.similarityScore - a.similarityScore);

  logger.info({
    totalProcessed: jobs.length,
    totalMatched: sorted.length,
    userId
  }, 'Batch job matching completed');

  return sorted;
}

/**
 * Get AI match for a single job with caching
 */
export async function getJobMatch(
  job: Job,
  preferences: JobPreferences,
  userId: string
): Promise<MatchedJob> {
  // Check cache first
  const cacheKey = cacheKeys.aiMatching(job.id, userId);
  const cached = await cacheGet<MatchedJob>(cacheKey);

  if (cached) {
    logger.debug({ jobId: job.id, userId }, 'AI match cache hit');
    return cached;
  }

  // Process with OpenAI
  const results = await matchJobsWithPreferences([job], preferences, userId);
  const matched = results[0];

  // Cache result
  await cacheSet(cacheKey, matched, 604800); // 7 days

  return matched;
}

/**
 * Clear AI matching cache for a user
 */
export async function clearUserAIMatchCache(userId: string): Promise<void> {
  const pattern = `ai:match:*:${userId}`;
  await cacheDel(pattern);
  logger.info({ userId }, 'Cleared AI match cache for user');
}

// Helper function for cache pattern deletion (import from cache)
async function cacheDel(pattern: string): Promise<void> {
  const redis = await import('ioredis');
  const { getRedisClient } = await import('./cache');
  const client = getRedisClient();
  const keys = await client.keys(pattern);
  if (keys.length > 0) {
    await client.del(...keys);
  }
}
