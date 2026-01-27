import { Pool } from 'pg';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

// Validate ENCRYPTION_KEY at startup
if (!ENCRYPTION_KEY) {
  throw new Error('FATAL: ENCRYPTION_KEY must be set. Generate with: openssl rand -hex 32');
}
if (ENCRYPTION_KEY.length !== 64) {
  throw new Error('FATAL: ENCRYPTION_KEY must be 64 characters (32 bytes in hex)');
}

// Type assertion for TypeScript - after validation above, ENCRYPTION_KEY is guaranteed to be a string
const ENCRYPTION_KEY_TYPED: string = ENCRYPTION_KEY;

/**
 * Encrypt sensitive data (API keys, etc.)
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY_TYPED, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY_TYPED, 'hex'), iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true, // Require valid certificate
    // For Neon/Supabase, the CA cert is included in the connection string
  } : false,
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
});

// Database schema initialization
export const initDatabase = async () => {
  const client = await pool.connect();

  try {
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS carmen_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        openai_api_key_encrypted TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS carmen_job_preferences (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES carmen_users(id) ON DELETE CASCADE,
        job_titles TEXT[] NOT NULL,
        locations TEXT[],
        experience_level VARCHAR(50),
        remote_only BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS carmen_companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES carmen_users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        career_page_url TEXT NOT NULL,
        job_board_url TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS carmen_email_schedules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES carmen_users(id) ON DELETE CASCADE,
        timezone VARCHAR(50) DEFAULT 'America/Bogota',
        preferred_times TIME[] NOT NULL,
        frequency VARCHAR(20) DEFAULT 'daily',
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS carmen_jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES carmen_users(id) ON DELETE CASCADE,
        company_id UUID REFERENCES carmen_companies(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        company_name VARCHAR(255),
        description TEXT,
        url TEXT NOT NULL,
        location VARCHAR(255),
        salary_range VARCHAR(100),
        posted_date DATE,
        similarity_score DECIMAL(3,2),
        sent_via_email BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(url, user_id)
      );

      CREATE TABLE IF NOT EXISTS carmen_email_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES carmen_users(id) ON DELETE CASCADE,
        job_id UUID REFERENCES carmen_jobs(id) ON DELETE SET NULL,
        sent_at TIMESTAMP DEFAULT NOW(),
        status VARCHAR(20),
        error_message TEXT
      );

      CREATE TABLE IF NOT EXISTS carmen_applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES carmen_users(id) ON DELETE CASCADE,
        job_id UUID REFERENCES carmen_jobs(id) ON DELETE SET NULL,
        company_id UUID REFERENCES carmen_companies(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'not_applied',
        application_date DATE,
        notes TEXT,
        interview_date DATE,
        interview_notes TEXT,
        offer_amount VARCHAR(100),
        offer_status VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS carmen_refresh_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES carmen_users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        revoked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS carmen_password_reset_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES carmen_users(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_carmen_jobs_user ON carmen_jobs(user_id);
      CREATE INDEX IF NOT EXISTS idx_carmen_jobs_created ON carmen_jobs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_carmen_companies_user ON carmen_companies(user_id);
      CREATE INDEX IF NOT EXISTS idx_carmen_applications_user ON carmen_applications(user_id);
      CREATE INDEX IF NOT EXISTS idx_carmen_applications_status ON carmen_applications(status);
      CREATE INDEX IF NOT EXISTS idx_carmen_refresh_tokens_user ON carmen_refresh_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_carmen_refresh_tokens_token ON carmen_refresh_tokens(token);
      CREATE INDEX IF NOT EXISTS idx_carmen_password_reset_tokens_token ON carmen_password_reset_tokens(token);
      CREATE INDEX IF NOT EXISTS idx_carmen_password_reset_tokens_user ON carmen_password_reset_tokens(user_id);

      -- Performance optimization: composite indexes
      CREATE INDEX IF NOT EXISTS idx_carmen_jobs_user_score_created ON carmen_jobs(user_id, similarity_score DESC, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_carmen_jobs_user_email_sent ON carmen_jobs(user_id, sent_via_email, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_carmen_applications_user_status_updated ON carmen_applications(user_id, status, updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_carmen_email_schedules_user_active ON carmen_email_schedules(user_id, active) WHERE active = true;
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// User operations
export const userOperations = {
  create: async (name: string, email: string, password: string, openaiApiKey: string = '') => {
    const bcrypt = require('bcrypt');
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;

    const encryptedKey = encrypt(openaiApiKey);
    const result = await pool.query(
      'INSERT INTO carmen_users (name, email, password_hash, openai_api_key_encrypted) VALUES ($1, $2, $3, $4) RETURNING id, name, email, created_at',
      [name, email, passwordHash, encryptedKey]
    );
    return result.rows[0];
  },

  findByEmail: async (email: string) => {
    const result = await pool.query(
      'SELECT id, name, email, password_hash, created_at FROM carmen_users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  findById: async (id: string) => {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM carmen_users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  getOpenAIKey: async (id: string) => {
    const result = await pool.query(
      'SELECT openai_api_key_encrypted FROM carmen_users WHERE id = $1',
      [id]
    );
    if (!result.rows[0] || !result.rows[0].openai_api_key_encrypted) {
      throw new Error('OpenAI API key not found for user');
    }
    return decrypt(result.rows[0].openai_api_key_encrypted);
  },

  updateApiKey: async (id: string, openaiApiKey: string | null) => {
    const encryptedKey = openaiApiKey ? encrypt(openaiApiKey) : null;
    const result = await pool.query(
      'UPDATE carmen_users SET openai_api_key_encrypted = $1 WHERE id = $2 RETURNING id, name, email, created_at',
      [encryptedKey, id]
    );
    return result.rows[0];
  },

  hasApiKey: async (id: string) => {
    const result = await pool.query(
      'SELECT openai_api_key_encrypted IS NOT NULL AND openai_api_key_encrypted != \'\' as has_key FROM carmen_users WHERE id = $1',
      [id]
    );
    return result.rows[0]?.has_key || false;
  },

  updatePassword: async (id: string, newPassword: string) => {
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const result = await pool.query(
      'UPDATE carmen_users SET password_hash = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, created_at',
      [passwordHash, id]
    );
    return result.rows[0];
  },
};

// Password reset operations
export const passwordResetOperations = {
  createToken: async (userId: string) => {
    // Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');
    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const result = await pool.query(
      'INSERT INTO carmen_password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *',
      [userId, token, expiresAt]
    );
    return result.rows[0];
  },

  findByToken: async (token: string) => {
    const result = await pool.query(
      `SELECT prt.*, u.email, u.name
       FROM carmen_password_reset_tokens prt
       JOIN carmen_users u ON u.id = prt.user_id
       WHERE prt.token = $1 AND prt.used = false AND prt.expires_at > NOW()
       ORDER BY prt.created_at DESC
       LIMIT 1`,
      [token]
    );
    return result.rows[0];
  },

  markAsUsed: async (token: string) => {
    const result = await pool.query(
      'UPDATE carmen_password_reset_tokens SET used = true WHERE token = $1 RETURNING *',
      [token]
    );
    return result.rows[0];
  },

  // Clean up expired/old tokens (call periodically)
  cleanExpiredTokens: async () => {
    await pool.query(
      'DELETE FROM carmen_password_reset_tokens WHERE expires_at < NOW() OR used = true'
    );
  },
};

// Job preferences operations
export const preferencesOperations = {
  create: async (userId: string, jobTitles: string[], locations?: string[], experienceLevel?: string, remoteOnly?: boolean) => {
    const result = await pool.query(
      'INSERT INTO carmen_job_preferences (user_id, job_titles, locations, experience_level, remote_only) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, jobTitles, locations || [], experienceLevel, remoteOnly || false]
    );
    return result.rows[0];
  },

  findByUserId: async (userId: string) => {
    const result = await pool.query(
      'SELECT * FROM carmen_job_preferences WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },
};

// Company operations
export const companyOperations = {
  create: async (userId: string, name: string, careerPageUrl: string, jobBoardUrl?: string) => {
    const result = await pool.query(
      'INSERT INTO carmen_companies (user_id, name, career_page_url, job_board_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, careerPageUrl, jobBoardUrl]
    );
    return result.rows[0];
  },

  findByUserId: async (userId: string) => {
    const result = await pool.query(
      'SELECT * FROM carmen_companies WHERE user_id = $1 AND active = true ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },

  delete: async (id: string, userId: string) => {
    const result = await pool.query(
      'UPDATE carmen_companies SET active = false WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    return result.rows[0];
  },
};

// Job operations
export const jobOperations = {
  create: async (job: any) => {
    const result = await pool.query(
      `INSERT INTO carmen_jobs
        (user_id, company_id, title, company_name, description, url, location, salary_range, posted_date, similarity_score)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (url, user_id) DO UPDATE SET similarity_score = EXCLUDED.similarity_score
        RETURNING *`,
      [job.userId, job.companyId, job.title, job.companyName, job.description, job.url, job.location, job.salaryRange, job.postedDate, job.similarityScore]
    );
    return result.rows[0];
  },

  findByUserId: async (userId: string, limit = 50) => {
    const result = await pool.query(
      'SELECT * FROM carmen_jobs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows;
  },

  findByUserIdPaginated: async (userId: string, limit = 20, offset = 0) => {
    const result = await pool.query(
      `SELECT * FROM carmen_jobs
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  },

  findByUserIdCursor: async (userId: string, limit = 20, cursorId?: string, cursorTimestamp?: string) => {
    let query = `SELECT * FROM carmen_jobs WHERE user_id = $1`;
    const params: any[] = [userId];

    if (cursorId && cursorTimestamp) {
      query += ` AND (created_at < $2 OR (created_at = $2 AND id < $3))`;
      params.push(cursorTimestamp, cursorId);
    }

    query += ` ORDER BY created_at DESC, id DESC LIMIT $4`;
    params.push(limit);

    const result = await pool.query(query, params);
    return result.rows;
  },

  countByUserId: async (userId: string) => {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM carmen_jobs WHERE user_id = $1',
      [userId]
    );
    return parseInt(result.rows[0].count);
  },

  findFilteredJobs: async (userId: string, options: {
    limit?: number;
    offset?: number;
    status?: string;
    minScore?: number;
    sentOnly?: boolean;
  } = {}) => {
    const { limit = 20, offset = 0, status, minScore = 0.5, sentOnly } = options;
    const conditions: string[] = ['user_id = $1'];
    const params: any[] = [userId];
    let paramIndex = 2;

    if (status) {
      conditions.push(`similarity_score >= $${paramIndex++}`);
      params.push(minScore);
    }

    if (sentOnly) {
      conditions.push('sent_via_email = true');
    }

    const whereClause = conditions.join(' AND ');
    const query = `
      SELECT * FROM carmen_jobs
      WHERE ${whereClause}
      ORDER BY similarity_score DESC, created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    params.push(limit, offset);
    const result = await pool.query(query, params);
    return result.rows;
  },

  countFilteredJobs: async (userId: string, options: {
    status?: string;
    minScore?: number;
    sentOnly?: boolean;
  } = {}) => {
    const conditions: string[] = ['user_id = $1'];
    const params: any[] = [userId];
    let paramIndex = 2;

    if (options.minScore !== undefined) {
      conditions.push(`similarity_score >= $${paramIndex++}`);
      params.push(options.minScore);
    }

    if (options.sentOnly) {
      conditions.push('sent_via_email = true');
    }

    const whereClause = conditions.join(' AND ');
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM carmen_jobs WHERE ${whereClause}`,
      params.slice(0, paramIndex)
    );
    return parseInt(result.rows[0].count);
  },

  markAsSent: async (jobId: string) => {
    const result = await pool.query(
      'UPDATE carmen_jobs SET sent_via_email = true WHERE id = $1 RETURNING *',
      [jobId]
    );
    return result.rows[0];
  },

  findRecentByUserId: async (userId: string, limit = 5) => {
    const result = await pool.query(
      'SELECT * FROM carmen_jobs WHERE user_id = $1 AND sent_via_email = true ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows;
  },

  findByDateRange: async (userId: string, startDate: Date, endDate: Date) => {
    const result = await pool.query(
      'SELECT * FROM carmen_jobs WHERE user_id = $1 AND created_at >= $2 AND created_at <= $3 ORDER BY created_at DESC',
      [userId, startDate, endDate]
    );
    return result.rows;
  },
};

// Email schedule operations
export const scheduleOperations = {
  create: async (userId: string, timezone: string, preferredTimes: string[], frequency: string) => {
    const result = await pool.query(
      'INSERT INTO carmen_email_schedules (user_id, timezone, preferred_times, frequency) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, timezone, preferredTimes, frequency]
    );
    return result.rows[0];
  },

  findByUserId: async (userId: string) => {
    const result = await pool.query(
      'SELECT * FROM carmen_email_schedules WHERE user_id = $1 AND active = true',
      [userId]
    );
    return result.rows[0];
  },

  findActiveSchedules: async () => {
    const result = await pool.query(
      'SELECT * FROM carmen_email_schedules WHERE active = true'
    );
    return result.rows;
  },

  updateLastEmailSent: async (scheduleId: string, totalJobsFound: number) => {
    const result = await pool.query(
      'UPDATE carmen_email_schedules SET last_email_sent = NOW(), total_jobs_found = $1 WHERE id = $2 RETURNING *',
      [totalJobsFound, scheduleId]
    );
    return result.rows[0];
  },

  updateLastEmailSentByUserId: async (userId: string, totalJobsFound: number) => {
    const result = await pool.query(
      'UPDATE carmen_email_schedules SET last_email_sent = NOW(), total_jobs_found = $1 WHERE user_id = $2 AND active = true RETURNING *',
      [totalJobsFound, userId]
    );
    return result.rows[0];
  },
};

// Helper function to get the pool (used by routes)
export const getPool = () => pool;

// Application tracking operations
export const applicationOperations = {
  create: async (userId: string, data: {
    jobId?: string;
    companyId?: string;
    status?: string;
    applicationDate?: Date;
    notes?: string;
  }) => {
    const result = await pool.query(
      `INSERT INTO carmen_applications
        (user_id, job_id, company_id, status, application_date, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
      [userId, data.jobId || null, data.companyId || null, data.status || 'not_applied', data.applicationDate || null, data.notes || null]
    );
    return result.rows[0];
  },

  findByUserId: async (userId: string, status?: string) => {
    let query = 'SELECT * FROM carmen_applications WHERE user_id = $1';
    const params: any[] = [userId];

    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  },

  findById: async (id: string, userId: string) => {
    const result = await pool.query(
      'SELECT * FROM carmen_applications WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  },

  updateStatus: async (id: string, userId: string, status: string, notes?: string) => {
    const result = await pool.query(
      `UPDATE carmen_applications
        SET status = $1, notes = COALESCE($2, notes), updated_at = NOW()
        WHERE id = $3 AND user_id = $4
        RETURNING *`,
      [status, notes || null, id, userId]
    );
    return result.rows[0];
  },

  updateInterview: async (id: string, userId: string, interviewDate: Date, interviewNotes?: string) => {
    const result = await pool.query(
      `UPDATE carmen_applications
        SET interview_date = $1, interview_notes = $2, updated_at = NOW()
        WHERE id = $3 AND user_id = $4
        RETURNING *`,
      [interviewDate, interviewNotes || null, id, userId]
    );
    return result.rows[0];
  },

  updateOffer: async (id: string, userId: string, offerAmount: string, offerStatus: string) => {
    const result = await pool.query(
      `UPDATE carmen_applications
        SET offer_amount = $1, offer_status = $2, updated_at = NOW()
        WHERE id = $3 AND user_id = $4
        RETURNING *`,
      [offerAmount, offerStatus, id, userId]
    );
    return result.rows[0];
  },

  delete: async (id: string, userId: string) => {
    const result = await pool.query(
      'DELETE FROM carmen_applications WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    return result.rows[0];
  },

  getStats: async (userId: string) => {
    const result = await pool.query(
      `SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'applied' THEN 1 END) as applied,
        COUNT(CASE WHEN status = 'interviewing' THEN 1 END) as interviewing,
        COUNT(CASE WHEN status = 'offer' THEN 1 END) as offers,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted
      FROM carmen_applications WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  },
};

// Refresh token operations for JWT authentication
export const refreshTokenOperations = {
  create: async (userId: string, token: string, expiresAt: Date) => {
    const result = await pool.query(
      'INSERT INTO carmen_refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *',
      [userId, token, expiresAt]
    );
    return result.rows[0];
  },

  findByToken: async (token: string) => {
    const result = await pool.query(
      'SELECT * FROM carmen_refresh_tokens WHERE token = $1 AND revoked = false AND expires_at > NOW()',
      [token]
    );
    return result.rows[0];
  },

  revoke: async (token: string) => {
    const result = await pool.query(
      'UPDATE carmen_refresh_tokens SET revoked = true WHERE token = $1 RETURNING *',
      [token]
    );
    return result.rows[0];
  },

  revokeAllForUser: async (userId: string) => {
    const result = await pool.query(
      'UPDATE carmen_refresh_tokens SET revoked = true WHERE user_id = $1 RETURNING *',
      [userId]
    );
    return result.rows;
  },

  deleteExpired: async () => {
    const result = await pool.query(
      'DELETE FROM carmen_refresh_tokens WHERE expires_at < NOW() OR revoked = true'
    );
    return result.rowCount;
  },
};

export { pool };
