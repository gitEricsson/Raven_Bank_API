import knex from 'knex';
import AppConfig from './app.config';

export const db = knex({
  client: 'mysql2',
  connection: {
    host: AppConfig.db.host,
    port: AppConfig.db.port,
    user: AppConfig.db.username,
    password: AppConfig.db.password,
    database: AppConfig.db.database,
  },
  pool: {
    min: 2,
    max: 10,
  },
  debug: AppConfig.db.logging === true,
});

export default db;
