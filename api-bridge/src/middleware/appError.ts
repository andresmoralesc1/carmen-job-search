import { logger } from '../services/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public isOperational = true
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(400, message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(429, message, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(503, message, 'SERVICE_UNAVAILABLE');
    this.name = 'ServiceUnavailableError';
    this.isOperational = false;
  }
}

// Error handler middleware
export const asyncErrorHandler = (error: unknown, req: any, res: any, next: any) => {
  // Log error with context
  logger.error({
    error,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
  }, 'Unhandled error occurred');

  // Default to 500
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_SERVER_ERROR';
  let isOperational = false;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code || 'APP_ERROR';
    isOperational = error.isOperational;
  } else if (error instanceof Error) {
    message = error.message;
    code = 'UNKNOWN_ERROR';
  }

  // Include stack trace in development
  const response: any = {
    error: {
      message,
      code,
      statusCode,
    },
  };

  if (process.env.NODE_ENV === 'development' && error instanceof Error) {
    response.error.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

// Async handler wrapper
export const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Not found handler (404)
export const notFoundHandler = (req: any, res: any) => {
  logger.warn({ url: req.url, method: req.method }, 'Route not found');

  res.status(404).json({
    error: {
      message: 'Route not found',
      code: 'ROUTE_NOT_FOUND',
      statusCode: 404,
    },
  });
};

// Generic error handler (must be last)
export const errorHandler = (error: unknown, req: any, res: any, next: any) => {
  asyncErrorHandler(error, req, res, next);
};

// Validation error handler for middleware
export const validationErrorHandler = (req: any, res: any, next: any) => {
  const errors = req.validationErrors?.array || [];

  if (errors.length > 0) {
    const fields = errors.reduce((acc: any, err: any) => {
      const field = err.path?.join('.') || 'unknown';
      acc[field] = err.message || 'Validation failed';
      return acc;
    }, {});

    throw new ValidationError('Validation failed', fields);
  }
  next();
};
