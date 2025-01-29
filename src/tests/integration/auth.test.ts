import request from 'supertest';
import app from '../../app';
import { cleanDatabase } from '../helpers';

describe('Authentication', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/api/users/register').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should not register a user with invalid email', async () => {
      const res = await request(app).post('/api/users/register').send({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/users/register').send({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with incorrect password', async () => {
      const res = await request(app).post('/api/users/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
    });
  });
});
