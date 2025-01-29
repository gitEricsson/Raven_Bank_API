import { db } from '../config/database';

beforeAll(async () => {
  // Run migrations
  await db.migrate.latest();
});

afterAll(async () => {
  // Rollback migrations and close connection
  await db.migrate.rollback(undefined, true);
  await db.destroy();
});

beforeEach(async () => {
  // Clean up tables before each test
  await db('transactions').del();
  await db('accounts').del();
  await db('users').del();
});
