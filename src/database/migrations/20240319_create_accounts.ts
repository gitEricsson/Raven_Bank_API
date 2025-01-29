import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('accounts', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.string('account_number').unique().notNullable();
    table.decimal('balance', 10, 2).defaultTo(0);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('accounts');
}
