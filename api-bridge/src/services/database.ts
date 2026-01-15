import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
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

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_carmen_jobs_user ON carmen_jobs(user_id);
      CREATE INDEX IF NOT EXISTS idx_carmen_jobs_created ON carmen_jobs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_carmen_companies_user ON carmen_companies(user_id);
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
  create: async (name: string, email: string, openaiApiKey: string) => {
    const result = await pool.query(
      'INSERT INTO carmen_users (name, email, openai_api_key_encrypted) VALUES ($1, $2, $3) RETURNING *',
      [name, email, openaiApiKey] // TODO: Encrypt the API key
    );
    return result.rows[0];
  },

  findByEmail: async (email: string) => {
    const result = await pool.query(
      'SELECT * FROM carmen_users WHERE email = $1',
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

  markAsSent: async (jobId: string) => {
    const result = await pool.query(
      'UPDATE carmen_jobs SET sent_via_email = true WHERE id = $1 RETURNING *',
      [jobId]
    );
    return result.rows[0];
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
};

export { pool };
