import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Pool } from 'pg';

describe('Database Operations', () => {
  let pool: Pool;

  beforeEach(() => {
    // Create test database connection
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  });

  afterEach(async () => {
    await pool.end();
  });

  describe('User Operations', () => {
    it('should create a new user', async () => {
      const result = await pool.query(
        'INSERT INTO carmen_users (name, email) VALUES ($1, $2) RETURNING *',
        ['Test User', 'test@example.com']
      );

      expect(result.rows[0]).toHaveProperty('id');
      expect(result.rows[0].name).toBe('Test User');
      expect(result.rows[0].email).toBe('test@example.com');
    });

    it('should find user by email', async () => {
      await pool.query(
        'INSERT INTO carmen_users (name, email) VALUES ($1, $2)',
        ['Test User', 'test@example.com']
      );

      const result = await pool.query(
        'SELECT * FROM carmen_users WHERE email = $1',
        ['test@example.com']
      );

      expect(result.rows.length).toBe(1);
      expect(result.rows[0].email).toBe('test@example.com');
    });
  });

  describe('Job Operations', () => {
    it('should create a job', async () => {
      const userResult = await pool.query(
        'INSERT INTO carmen_users (name, email) VALUES ($1, $2) RETURNING id',
        ['Test User', 'test@example.com']
      );

      const jobResult = await pool.query(
        `INSERT INTO carmen_jobs (user_id, title, company_name, url, description)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userResult.rows[0].id, 'Software Engineer', 'Test Company', 'https://example.com/job', 'Test description']
      );

      expect(jobResult.rows[0]).toHaveProperty('id');
      expect(jobResult.rows[0].title).toBe('Software Engineer');
    });

    it('should find jobs by user ID', async () => {
      const userResult = await pool.query(
        'INSERT INTO carmen_users (name, email) VALUES ($1, $2) RETURNING id',
        ['Test User', 'test@example.com']
      );

      await pool.query(
        `INSERT INTO carmen_jobs (user_id, title, company_name, url, description)
         VALUES ($1, $2, $3, $4, $5)`,
        [userResult.rows[0].id, 'Software Engineer', 'Test Company', 'https://example.com/job1', 'Test description 1']
      );

      await pool.query(
        `INSERT INTO carmen_jobs (user_id, title, company_name, url, description)
         VALUES ($1, $2, $3, $4, $5)`,
        [userResult.rows[0].id, 'Senior Engineer', 'Another Company', 'https://example.com/job2', 'Test description 2']
      );

      const result = await pool.query(
        'SELECT * FROM carmen_jobs WHERE user_id = $1',
        [userResult.rows[0].id]
      );

      expect(result.rows.length).toBe(2);
    });
  });

  describe('Application Operations', () => {
    it('should create an application', async () => {
      const userResult = await pool.query(
        'INSERT INTO carmen_users (name, email) VALUES ($1, $2) RETURNING id',
        ['Test User', 'test@example.com']
      );

      const jobResult = await pool.query(
        `INSERT INTO carmen_jobs (user_id, title, company_name, url, description)
         RETURNING id`,
        [userResult.rows[0].id, 'Software Engineer', 'Test Company', 'https://example.com/job', 'Test description']
      );

      const appResult = await pool.query(
        `INSERT INTO carmen_applications (user_id, job_id, status, application_date)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userResult.rows[0].id, jobResult.rows[0].id, 'applied', new Date()]
      );

      expect(appResult.rows[0]).toHaveProperty('id');
      expect(appResult.rows[0].status).toBe('applied');
    });

    it('should get application stats', async () => {
      const userResult = await pool.query(
        'INSERT INTO carmen_users (name, email) VALUES ($1, $2) RETURNING id',
        ['Test User', 'test@example.com']
      );

      const jobResult = await pool.query(
        `INSERT INTO carmen_jobs (user_id, title, company_name, url, description)
         RETURNING id`,
        [userResult.rows[0].id, 'Software Engineer', 'Test Company', 'https://example.com/job', 'Test description']
      );

      await pool.query(
        `INSERT INTO carmen_applications (user_id, job_id, status)
         VALUES ($1, $2, 'applied')`,
        [userResult.rows[0].id, jobResult.rows[0].id]
      );

      await pool.query(
        `INSERT INTO cARMEN_applications (user_id, job_id, status)
         VALUES ($1, $2, 'interviewing')`,
        [userResult.rows[0].id, jobResult.rows[0].id]
      );

      const result = await pool.query(
        `SELECT
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'applied' THEN 1 END) as applied,
          COUNT(CASE WHEN status = 'interviewing' THEN 1 END) as interviewing
         FROM carmen_applications WHERE user_id = $1`,
        [userResult.rows[0].id]
      );

      expect(result.rows[0].total).toBeGreaterThan(0);
    });
  });
});
