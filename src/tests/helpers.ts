import { db } from '../config/database';
import { userService } from '../config/dependencies';
import { User } from '../types/interface';

export async function createTestUser(
  email: string = 'test@example.com',
  password: string = 'password123'
): Promise<{ user: Omit<User, 'password'>; token: string }> {
  return userService.login(email, password);
}

export async function cleanDatabase(): Promise<void> {
  await db('transactions').del();
  await db('accounts').del();
  await db('users').del();
}
