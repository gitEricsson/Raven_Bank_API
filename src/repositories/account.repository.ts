import { Knex } from 'knex';
import { db } from '../config/database';
import { Account } from '../types/interface';

export class AccountRepository {
  private static instance: AccountRepository;

  private constructor() {}

  public static getInstance(): AccountRepository {
    if (!AccountRepository.instance) {
      AccountRepository.instance = new AccountRepository();
    }
    return AccountRepository.instance;
  }

  async create(
    userId: number,
    accountNumber: number,
    trx?: Knex.Transaction
  ): Promise<Account> {
    const query = (trx || db)('accounts');
    const [accountId] = await query.insert({
      user_id: userId,
      account_number: accountNumber,
      balance: 0,
    });

    const account = await this.findById(accountId, trx);
    if (!account) {
      throw new Error('Failed to create account');
    }
    return account;
  }

  async findById(
    id: number,
    trx?: Knex.Transaction
  ): Promise<Account | undefined> {
    return (trx || db)('accounts').where('id', id).first();
  }

  async findByUserId(userId: number): Promise<Account[]> {
    return db('accounts').where('user_id', userId);
  }

  async findByAccountNumber(
    accountNumber: number,
    trx?: Knex.Transaction
  ): Promise<Account | undefined> {
    return (trx || db)('accounts')
      .where('account_number', accountNumber)
      .first();
  }

  async updateBalance(
    id: number,
    balance: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    await (trx || db)('accounts').where('id', id).update({ balance });
  }

  async updateBalanceByAccountNumber(
    accountNumber: number,
    amount: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    await (trx || db)('accounts')
      .where('account_number', accountNumber)
      .increment('balance', amount);
  }

  async findAll(): Promise<Account[]> {
    return db('accounts').select('*').orderBy('created_at', 'desc');
  }
}

export default AccountRepository;
