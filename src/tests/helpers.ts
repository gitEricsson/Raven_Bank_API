import { db } from '../config/database';
import { userService } from '../services/user.service';
import { accountService } from '../services/account.service';
import { User, Account } from '../types';

export async function createTestUser(
  email: string = 'test@example.com',
  password: string = 'password123'
): Promise<{ user: Omit<User, 'password'>; token: string }> {
  return userService.createUser(email, password);
}

export async function createTestAccount(userId: number): Promise<Account> {
  return accountService.createAccount(userId);
}

export async function cleanDatabase(): Promise<void> {
  await db('transactions').del();
  await db('accounts').del();
  await db('users').del();
}
