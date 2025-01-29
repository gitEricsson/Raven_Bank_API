import request from 'supertest';
import app from '../../app';
import { createTestUser, cleanDatabase } from '../helpers';

describe('Account Management', () => {
  let authToken: string;
  let userId: number;

  beforeEach(async () => {
    await cleanDatabase();
    const { user, token } = await createTestUser();
    authToken = token;
    userId = user.id!;
  });

  describe('POST /api/accounts', () => {
    it('should create a new account for authenticated user', async () => {
      const res = await request(app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send();

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('account_number');
      expect(res.body.user_id).toBe(userId);
      expect(res.body.balance).toBe(0);
    });

    it('should not create account without authentication', async () => {
      const res = await request(app).post('/api/accounts').send();

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/accounts', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send();
    });

    it('should get all accounts for authenticated user', async () => {
      const res = await request(app)
        .get('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].user_id).toBe(userId);
    });
  });
});
