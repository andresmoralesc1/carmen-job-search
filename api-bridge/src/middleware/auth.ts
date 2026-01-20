import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { refreshTokenOperations } from '../services/database';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Validate that secrets are set in production
if (process.env.NODE_ENV === 'production' && (!JWT_SECRET || !JWT_REFRESH_SECRET)) {
  throw new Error('FATAL: JWT_SECRET and JWT_REFRESH_SECRET must be set in production. Use: openssl rand -hex 32');
}

// Fallback for development only (with warning)
if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  console.warn('⚠️  WARNING: Using default JWT secrets. Set JWT_SECRET and JWT_REFRESH_SECRET environment variables in production!');
}

// Access token expires in 15 minutes
const ACCESS_TOKEN_EXPIRY = '15m';
// Refresh token expires in 7 days
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Generate JWT access token
 */
export function generateAccessToken(userId: string, email: string): string {
  const secret = JWT_SECRET || 'dev-secret-key-change-in-production';
  return jwt.sign(
    { id: userId, email },
    secret,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

/**
 * Generate JWT refresh token
 */
export async function generateRefreshToken(userId: string): Promise<string> {
  const secret = JWT_REFRESH_SECRET || 'dev-refresh-secret-key-change-in-production';
  const token = jwt.sign(
    { id: userId, type: 'refresh' },
    secret,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  // Calculate expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Store in database
  await refreshTokenOperations.create(userId, token, expiresAt);

  return token;
}

/**
 * Verify JWT access token middleware
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  const secret = JWT_SECRET || 'dev-secret-key-change-in-production';
  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  });
}

/**
 * Verify refresh token and return new access token
 */
export async function verifyRefreshToken(token: string): Promise<{ userId: string; valid: boolean } | null> {
  try {
    const secret = JWT_REFRESH_SECRET || 'dev-refresh-secret-key-change-in-production';
    const decoded = jwt.verify(token, secret) as any;
    if (decoded.type !== 'refresh') {
      return null;
    }

    // Check if token exists in database and is not revoked
    const storedToken = await refreshTokenOperations.findByToken(token);
    if (!storedToken) {
      return null;
    }

    return { userId: decoded.id, valid: true };
  } catch {
    return null;
  }
}

/**
 * Revoke a refresh token
 */
export async function revokeRefreshToken(token: string): Promise<boolean> {
  const result = await refreshTokenOperations.revoke(token);
  return !!result;
}

/**
 * Revoke all refresh tokens for a user
 */
export async function revokeAllUserTokens(userId: string): Promise<boolean> {
  await refreshTokenOperations.revokeAllForUser(userId);
  return true;
}

/**
 * Optional authentication - attaches user if token exists, but doesn't require it
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  const secret = JWT_SECRET || 'dev-secret-key-change-in-production';
  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (!err) {
      req.user = {
        id: decoded.id,
        email: decoded.email
      };
    }
    next();
  });
}

export { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY };
