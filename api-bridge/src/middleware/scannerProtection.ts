import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/logger';

/**
 * Scanner Protection Middleware
 *
 * This middleware protects against path scanners and bots that try to discover
 * vulnerabilities by requesting common paths like /_next, /api, /admin, etc.
 *
 * It tracks 404 responses per IP and temporarily blocks IPs that generate
 * too many 404 errors in a short time period.
 */

interface ScannerTracker {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockExpiry: number;
}

// In-memory store for tracking scanners
// In production, consider using Redis for distributed tracking
const scannerStore = new Map<string, ScannerTracker>();

// Configuration
const CONFIG = {
  // Maximum number of 404s allowed per window
  max404s: 10,
  // Time window in milliseconds (5 minutes)
  windowMs: 5 * 60 * 1000,
  // How long to block an IP (1 hour)
  blockDurationMs: 60 * 60 * 1000,
  // Paths that are commonly scanned
  suspiciousPaths: [
    '/_next',
    '/.env',
    '/admin',
    '/wp-admin',
    '/phpmyadmin',
    '/mysql',
    '/setup',
    '/install',
    '/xmlrpc.php',
    '/.git',
    '/config',
    '/solr',
    '/tomcat',
    '/joomla',
    '/drupal',
    '/wordpress',
    '/magmi',
    '/api/route',
    '/app'
  ]
};

/**
 * Check if a path looks suspicious
 */
function isSuspiciousPath(path: string): boolean {
  const normalizedPath = path.toLowerCase();

  // Check against known suspicious paths
  for (const suspicious of CONFIG.suspiciousPaths) {
    if (normalizedPath.startsWith(suspicious.toLowerCase())) {
      return true;
    }
  }

  // Check for common exploit patterns
  const exploitPatterns = [
    /\.\./,           // Directory traversal
    /union.*select/i, // SQL injection
    /<script>/i,      // XSS
    /eval\(/i,        // Code injection
    /base64_/i,       // Base64 encoding attacks
  ];

  for (const pattern of exploitPatterns) {
    if (pattern.test(normalizedPath)) {
      return true;
    }
  }

  return false;
}

/**
 * Get or create tracker for an IP
 */
function getTracker(ip: string): ScannerTracker {
  let tracker = scannerStore.get(ip);

  if (!tracker) {
    tracker = {
      count: 0,
      resetTime: Date.now() + CONFIG.windowMs,
      blocked: false,
      blockExpiry: 0
    };
    scannerStore.set(ip, tracker);
  }

  // Reset counter if window expired
  if (Date.now() > tracker.resetTime) {
    tracker.count = 0;
    tracker.resetTime = Date.now() + CONFIG.windowMs;
  }

  // Check if block expired
  if (tracker.blocked && Date.now() > tracker.blockExpiry) {
    tracker.blocked = false;
    tracker.count = 0;
  }

  return tracker;
}

/**
 * Increment 404 count for an IP
 */
function increment404Count(ip: string): void {
  const tracker = getTracker(ip);
  tracker.count++;

  // Block IP if threshold exceeded
  if (tracker.count >= CONFIG.max404s) {
    tracker.blocked = true;
    tracker.blockExpiry = Date.now() + CONFIG.blockDurationMs;

    logger.warn({
      ip,
      count: tracker.count,
      blockExpiry: new Date(tracker.blockExpiry).toISOString()
    }, 'IP blocked for scanner activity');
  }
}

/**
 * Clean up old entries from the store
 */
function cleanupStore(): void {
  const now = Date.now();

  for (const [ip, tracker] of scannerStore.entries()) {
    // Remove expired blocks and old counters
    if (now > tracker.resetTime && (!tracker.blocked || now > tracker.blockExpiry)) {
      scannerStore.delete(ip);
    }
  }
}

// Run cleanup every 10 minutes
setInterval(cleanupStore, 10 * 60 * 1000);

/**
 * Scanner protection middleware
 *
 * This middleware should be added AFTER routes but BEFORE the 404 handler.
 * It intercepts 404 responses and tracks suspicious activity.
 */
export function scannerProtection(req: Request, res: Response, next: NextFunction): any {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  // Check if IP is currently blocked
  const tracker = scannerStore.get(ip);
  if (tracker?.blocked) {
    const remainingTime = Math.ceil((tracker.blockExpiry - Date.now()) / 1000 / 60);

    logger.warn({
      ip,
      path: req.path,
      remainingMinutes: remainingTime
    }, 'Blocked IP attempted request');

    return res.status(429).json({
      error: 'Too many requests to invalid paths',
      message: `This IP has been temporarily blocked due to suspicious activity. Try again in ${remainingTime} minutes.`
    });
  }

  // Check if path is suspicious
  if (isSuspiciousPath(req.path)) {
    increment404Count(ip);

    logger.warn({
      ip,
      path: req.path,
      method: req.method,
      userAgent: req.get('User-Agent')
    }, 'Suspicious path requested');

    // Return 404 immediately for suspicious paths
    return res.status(404).json({ error: 'Not found' });
  }

  // Store original json function to intercept responses
  const originalJson = res.json.bind(res);

  // Override json function to detect 404 responses
  res.json = function(body: any) {
    // If this is a 404 response, track it
    if (res.statusCode === 404) {
      increment404Count(ip);
    }

    return originalJson(body);
  } as any;

  next();
}

/**
 * Middleware to check request method and content type
 * Blocks suspicious combinations
 */
export function requestTypeFilter(req: Request, res: Response, next: NextFunction): any {
  const ip = req.ip || 'unknown';

  // Block POST requests to / without Content-Type
  if (req.method === 'POST' && req.path === '/' && !req.get('Content-Type')) {
    logger.warn({
      ip,
      method: req.method,
      path: req.path,
      userAgent: req.get('User-Agent')
    }, 'Blocked suspicious POST request');

    increment404Count(ip);
    return res.status(404).json({ error: 'Not found' });
  }

  // Block common exploit attempts in query string
  const queryString = JSON.stringify(req.query);
  if (queryString.includes('../') || queryString.includes('union+select')) {
    logger.warn({
      ip,
      path: req.path,
      query: req.query
    }, 'Blocked request with exploit attempt');

    increment404Count(ip);
    return res.status(404).json({ error: 'Not found' });
  }

  next();
}

/**
 * Get statistics about blocked scanners
 */
export function getScannerStats(): {
  totalTracked: number;
  currentlyBlocked: number;
  blockedIPs: Array<{ ip: string; count: number; blockExpiry: string }>;
} {
  const now = Date.now();
  const blockedIPs: Array<{ ip: string; count: number; blockExpiry: string }> = [];

  for (const [ip, tracker] of scannerStore.entries()) {
    if (tracker.blocked && now < tracker.blockExpiry) {
      blockedIPs.push({
        ip,
        count: tracker.count,
        blockExpiry: new Date(tracker.blockExpiry).toISOString()
      });
    }
  }

  return {
    totalTracked: scannerStore.size,
    currentlyBlocked: blockedIPs.length,
    blockedIPs
  };
}

/**
 * Clear all tracking data (useful for testing)
 */
export function clearScannerTracking(): void {
  scannerStore.clear();
}
