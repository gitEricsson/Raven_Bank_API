import { configDotenv } from 'dotenv';

// Load ENVs only on development environment
if (process.env.NODE_ENV !== 'production') configDotenv();

const AppConfig = {
  NODE_ENV: process.env.NODE_ENV,
  server: {
    port: process.env.PORT || '3000',
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'money_transfer',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  },
  jwt: {
    ACCESS_TOKEN_SECRET: String(process.env.JWT_SECRET || 'your-secret-key'),
    ACCESS_TOKEN_EXPIRY: String(process.env.JWT_EXPIRY || '1h'),
    REFRESH_TOKEN_SECRET: String(
      process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key'
    ),
    REFRESH_TOKEN_EXPIRY: String(process.env.REFRESH_TOKEN_EXPIRY || '7d'),
  },
  webhook: {
    url: process.env.WEBHOOK_URL || 'http://localhost:3000/webhook',
    secret: process.env.WEBHOOK_SECRET || 'webhook-secret',
  },
  raven: {
    apiUrl: process.env.RAVEN_API_URL || 'https://api.getravenbank.com/v1',
    apiKey: process.env.RAVEN_API_KEY || '',
    webhookSecret: process.env.RAVEN_WEBHOOK_SECRET || '',
  },
};

export default AppConfig;
