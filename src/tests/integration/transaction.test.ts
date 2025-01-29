import request from 'supertest';
import app from '../../app';
import { createTestUser, cleanDatabase } from '../helpers';
import { accountService } from '../../services/account.service';

describe('Transactions', () => {
  let authToken: string;
  let userId: number;
  let accountNumber: string;
  let receiverAccountNumber: string;

  beforeEach(async () => {
    await cleanDatabase();

    // Create first user and account
    const { user, token } = await createTestUser('sender@example.com');
    authToken = token;
    userId = user.id!;
    const account = await accountService.createAccount(userId);
    accountNumber = account.account_number;

    // Create second user and account
    const receiver = await createTestUser('receiver@example.com');
    const receiverAccount = await accountService.createAccount(
      receiver.user.id!
    );
    receiverAccountNumber = receiverAccount.account_number;
  });

  describe('POST /api/transactions/deposit', () => {
    it('should deposit money into account', async () => {
      const res = await request(app).post('/api/transactions/deposit').send({
        accountNumber,
        amount: 1000,
      });

      expect(res.status).toBe(201);
      expect(res.body.type).toBe('DEPOSIT');
      expect(res.body.amount).toBe(1000);
      expect(res.body.status).toBe('COMPLETED');
    });

    it('should not deposit negative amount', async () => {
      const res = await request(app).post('/api/transactions/deposit').send({
        accountNumber,
        amount: -100,
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/transactions/transfer', () => {
    beforeEach(async () => {
      // Deposit initial amount
      await request(app).post('/api/transactions/deposit').send({
        accountNumber,
        amount: 1000,
      });
    });

    it('should transfer money between accounts', async () => {
      const res = await request(app)
        .post('/api/transactions/transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          senderAccountNumber: accountNumber,
          receiverAccountNumber,
          amount: 500,
        });

      expect(res.status).toBe(201);
      expect(res.body.type).toBe('TRANSFER');
      expect(res.body.amount).toBe(500);
      expect(res.body.status).toBe('COMPLETED');
    });

    it('should not transfer with insufficient funds', async () => {
      const res = await request(app)
        .post('/api/transactions/transfer')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          senderAccountNumber: accountNumber,
          receiverAccountNumber,
          amount: 2000,
        });

      expect(res.status).toBe(400);
    });
  });
});
