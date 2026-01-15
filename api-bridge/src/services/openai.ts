import OpenAI from 'openai';

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

/**
 * Calculate similarity score between jobs and user preferences using OpenAI
 */
export async function matchJobsWithPreferences(
  jobs: Job[],
  preferences: JobPreferences
): Promise<MatchedJob[]> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    // Build the prompt for OpenAI
    const prompt = buildMatchingPrompt(jobs, preferences);

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

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    const parsedResponse = JSON.parse(content);
    const matches = parsedResponse.matches || [];

    // Combine jobs with their scores
    const matchedJobs: MatchedJob[] = jobs.map(job => {
      const match = matches.find((m: any) => m.jobId === job.id);

      return {
        ...job,
        similarityScore: match?.score || 0,
        matchReasons: match?.reasons || []
      };
    });

    // Filter by minimum score threshold
    return matchedJobs.filter(job => job.similarityScore > 0.5);

  } catch (error) {
    console.error('OpenAI matching error:', error);
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
 * Batch match jobs with pagination support
 */
export async function batchMatchJobs(
  jobs: Job[],
  preferences: JobPreferences,
  batchSize: number = 20
): Promise<MatchedJob[]> {
  const results: MatchedJob[] = [];

  for (let i = 0; i < jobs.length; i += batchSize) {
    const batch = jobs.slice(i, i + batchSize);
    const matched = await matchJobsWithPreferences(batch, preferences);
    results.push(...matched);

    // Small delay between batches to avoid rate limits
    if (i + batchSize < jobs.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Sort by similarity score descending
  return results.sort((a, b) => b.similarityScore - a.similarityScore);
}
