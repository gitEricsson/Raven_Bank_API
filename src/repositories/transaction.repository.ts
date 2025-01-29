import { Knex } from 'knex';
import { db } from '../config/database';
import { Transaction } from '../types';

export class TransactionRepository {
  private static instance: TransactionRepository;

  private constructor() {}

  public static getInstance(): TransactionRepository {
    if (!TransactionRepository.instance) {
      TransactionRepository.instance = new TransactionRepository();
    }
    return TransactionRepository.instance;
  }

  async create(
    senderAccountId: number,
    receiverAccountId: number,
    amount: number,
    type: 'DEPOSIT' | 'TRANSFER',
    trx?: Knex.Transaction
  ): Promise<Transaction> {
    const query = (trx || db)('transactions');
    const [transactionId] = await query.insert({
      sender_account_id: senderAccountId,
      receiver_account_id: receiverAccountId,
      amount,
      type,
      status: 'PENDING',
    });

    const transaction = await this.findById(transactionId, trx);
    if (!transaction) {
      throw new Error('Failed to create transaction');
    }
    return transaction;
  }

  async findById(
    id: number,
    trx?: Knex.Transaction
  ): Promise<Transaction | undefined> {
    return (trx || db)('transactions').where('id', id).first();
  }

  async findByAccountId(accountId: number): Promise<Transaction[]> {
    return db('transactions')
      .where('sender_account_id', accountId)
      .orWhere('receiver_account_id', accountId)
      .orderBy('created_at', 'desc');
  }

  async updateStatus(
    id: number,
    status: 'PENDING' | 'COMPLETED' | 'FAILED',
    trx?: Knex.Transaction
  ): Promise<void> {
    await (trx || db)('transactions').where('id', id).update({ status });
  }
}

export default TransactionRepository;
