import { Request, Response, NextFunction } from 'express';

/**
 * Custom error classes
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(404, `${resource} not found`);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(429, message);
  }
}

/**
 * Error handler middleware
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error for debugging (in production, use a proper logging service)
  console.error('[Error]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle operational errors (known error types)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message
    });
    return;
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
    return;
  }

  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: 'Invalid or missing authentication'
    });
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'Invalid token'
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'Token expired'
    });
    return;
  }

  // Handle database errors
  if (err.message.includes('duplicate key')) {
    res.status(409).json({
      error: 'Resource already exists'
    });
    return;
  }

  if (err.message.includes('foreign key')) {
    res.status(400).json({
      error: 'Invalid reference to related resource'
    });
    return;
  }

  // Handle network errors
  if (err.message.includes('ECONNREFUSED')) {
    res.status(503).json({
      error: 'Service temporarily unavailable'
    });
    return;
  }

  // Generic error response (don't expose internal details)
  const statusCode = 500;
  const message = process.env.NODE_ENV === 'development'
    ? err.message
    : 'An unexpected error occurred';

  res.status(statusCode).json({
    error: message
  });
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: 'Resource not found',
    path: req.path
  });
}
