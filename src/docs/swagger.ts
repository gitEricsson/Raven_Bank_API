import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Money Transfer API',
      version: '1.0.0',
      description: 'API documentation for the Money Transfer application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Account: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            user_id: { type: 'number' },
            account_number: { type: 'string' },
            balance: { type: 'number' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            sender_account_id: { type: 'number' },
            receiver_account_id: { type: 'number' },
            amount: { type: 'number' },
            type: { type: 'string', enum: ['DEPOSIT', 'TRANSFER'] },
            status: {
              type: 'string',
              enum: ['PENDING', 'COMPLETED', 'FAILED'],
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const specs = swaggerJsdoc(options);
