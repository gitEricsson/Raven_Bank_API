import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('webhook_logs', (table) => {
    table.increments('id').primary();
    table.string('event').notNullable();
    table.json('data').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('webhook_logs');
}
