import { Knex } from 'knex';

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
    table.enum('type', ['DEPOSIT', 'TRANSFER']).notNullable();
    table
      .enum('status', ['PENDING', 'COMPLETED', 'FAILED'])
      .defaultTo('PENDING');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}
