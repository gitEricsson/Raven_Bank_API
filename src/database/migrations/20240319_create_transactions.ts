import { Knex } from 'knex';
import { TransactionStatus, TransactionType } from '../../types/enums';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table
      .integer('sender_account_id')
      .unsigned()
      .references('id')
      .inTable('accounts');
    table
      .integer('receiver_account_id')
      .unsigned()
      .references('id')
      .inTable('accounts');
    table.decimal('amount', 10, 2).notNullable();
    table.enum('type', Object.values(TransactionType)).notNullable();
    table
      .enum('status', Object.values(TransactionStatus))
      .defaultTo(TransactionStatus.PENDING);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}
