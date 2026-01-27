import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Input sanitization utilities
 */

// Sanitize string input to prevent XSS
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
}

// Sanitize array of strings
export function sanitizeStringArray(input: string[]): string[] {
  return input.map(sanitizeString);
}

// Deep sanitize object properties
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]) as T[Extract<keyof T, string>];
    } else if (Array.isArray(sanitized[key])) {
      sanitized[key] = sanitizeStringArray(sanitized[key]) as T[Extract<keyof T, string>];
    }
  }

  return sanitized;
}

/**
 * Validation schemas
 */

// User validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  jobTitles: z.array(z.string().min(1)).optional().default([])
});

export const updateApiKeySchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  openaiApiKey: z.string().min(20, 'Invalid API key').startsWith('sk-', 'OpenAI API key must start with sk-'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format')
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10, 'Invalid refresh token')
});

export const verifyEmailSchema = z.object({
  token: z.string().length(64, 'Invalid verification token')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format')
});

export const resetPasswordSchema = z.object({
  token: z.string().length(64, 'Invalid reset token'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters')
});

// Company validation schemas
export const createCompanySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(200),
  careerPageUrl: z.string().url('Invalid career page URL'),
  jobBoardUrl: z.string().url('Invalid job board URL').optional()
});

export const deleteCompanySchema = z.object({
  // userId comes from JWT token
});

// Job preferences validation schemas
export const createPreferencesSchema = z.object({
  jobTitles: z.array(z.string().min(1)).min(1, 'At least one job title is required'),
  locations: z.array(z.string().min(1)).optional().default([]),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'principal', 'executive']).optional(),
  remoteOnly: z.boolean().optional().default(false)
});

// Job validation schemas
export const getJobsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(50)
});

// Scrape validation schemas
export const manualScrapeSchema = z.object({
  userId: z.string().uuid('Invalid user ID format')
});

// Email schedule validation schemas
export const createScheduleSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  timezone: z.string().refine((val) => {
    try {
      Intl.DateTimeFormat().resolvedOptions().timeZone;
      return true;
    } catch {
      return false;
    }
  }, 'Invalid timezone'),
  preferredTimes: z.array(z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format. Use HH:MM')),
  frequency: z.enum(['daily', 'weekly', 'biweekly']).optional().default('daily')
});

/**
 * Middleware factory to validate request body against a schema
 * Also sanitizes inputs to prevent XSS attacks
 */
export function validateBody<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // First validate with Zod
      const validated = schema.parse(req.body);
      // Then sanitize to prevent XSS
      req.body = sanitizeObject(validated);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      } else {
        next(error);
      }
    }
  };
}

/**
 * Middleware factory to validate request query parameters against a schema
 */
export function validateQuery<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      } else {
        next(error);
      }
    }
  };
}

/**
 * Middleware factory to validate request parameters against a schema
 */
export function validateParams<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      } else {
        next(error);
      }
    }
  };
}
