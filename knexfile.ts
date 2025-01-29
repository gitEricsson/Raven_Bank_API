import dotenv from 'dotenv';
import { Knex } from 'knex';

dotenv.config();

const config: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'money_transfer_app',
  },
  migrations: {
    directory: './src/database/migrations',
    extension: 'ts',
  },
};

export default config;
