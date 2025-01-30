import { Knex } from 'knex';
import { Role } from '../../types/enums';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.enum('role', Object.values(Role)).notNullable().defaultTo(Role.USER);
    table;
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
