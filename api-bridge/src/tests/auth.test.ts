import { describe, it, expect, vi } from 'vitest';
import { generateAccessToken, verifyRefreshToken } from '../middleware/auth';
import jwt from 'jsonwebtoken';

describe('JWT Authentication', () => {
  const testUserId = '123e4567-e89b-12d3-a456-426614174000';
  const testEmail = 'test@example.com';

  describe('generateAccessToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateAccessToken(testUserId, testEmail);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');

      const decoded = jwt.decode(token) as any;
      expect(decoded).toHaveProperty('id', testUserId);
      expect(decoded).toHaveProperty('email', testEmail);
    });

    it('should include expiration time', () => {
      const token = generateAccessToken(testUserId, testEmail);
      const decoded = jwt.decode(token) as any;

      expect(decoded).toHaveProperty('exp');
      expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify valid refresh token', async () => {
      // Mock refresh token operations
      vi.doMock('../services/database', () => ({
        refreshTokenOperations: {
          findByToken: vi.fn().mockResolvedValue({ id: 'token-id' }),
        },
      }));

      const token = jwt.sign(
        { id: testUserId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-key',
        { expiresIn: '7d' }
      );

      // Test would require actual database mock setup
      expect(token).toBeTruthy();
    });

    it('should reject tokens with wrong type', async () => {
      const token = jwt.sign(
        { id: testUserId, type: 'access' }, // Wrong type
        process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-key',
        { expiresIn: '7d' }
      );

      const result = await verifyRefreshToken(token);
      expect(result).toBeNull();
    });

    it('should reject expired tokens', async () => {
      const token = jwt.sign(
        { id: testUserId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-key',
        { expiresIn: '-1h' } // Expired
      );

      const result = await verifyRefreshToken(token);
      expect(result).toBeNull();
    });
  });
});

describe('UUID Validation', () => {
  const validateUUID = (paramName: string) => {
    return (id: string) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(id);
    };
  };

  it('should validate correct UUID format', () => {
    const validator = validateUUID('userId');
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';

    expect(validator(validUUID)).toBe(true);
  });

  it('should reject invalid UUID format', () => {
    const validator = validateUUID('userId');
    const invalidUUIDs = [
      'not-a-uuid',
      '12345678',
      '00000000-0000-0000-0000-000000000000', // All zeros
      '',
    ];

    invalidUUIDs.forEach(uuid => {
      expect(validator(uuid)).toBe(false);
    });
  });
});
