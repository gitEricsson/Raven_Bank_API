# Raven Money Transfer API

A RESTful API for managing user accounts, transactions, and webhooks for a money transfer application. Built with TypeScript, Express, and Knex.js.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and authentication
- Account creation and management
- Transaction handling (deposit and transfer)
- Webhook handling for transaction status updates
- Rate limiting and security middleware
- Swagger documentation for API endpoints

## Technologies

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **TypeScript**: Superset of JavaScript for type safety
- **Knex.js**: SQL query builder for database interactions
- **MySQL**: Relational database management system
- **Joi**: Data validation library
- **Winston**: Logging library
- **Swagger**: API documentation

## Installation

1. Clone the repository:

   ````bash
   git clone https://github.com/yourusername/money-transfer-app.git
   cd money-transfer-app
   ```README.md

   ````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:
   - Copy `.env.example` to `.env` and update the values as needed.

## Configuration

### Environment Variables

Make sure to configure the following environment variables in your `.env` file:

```plaintext:README.md
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=money_transfer
JWT_SECRET=your-secret-key
JWT_EXPIRY=1h
REFRESH_TOKEN_SECRET=refresh-secret-key
REFRESH_TOKEN_EXPIRY=7d
PORT=3000
BASE_URL=http://localhost:3000
RAVEN_API_URL=https://integrations.getravenbank.com/v1
RAVEN_API_KEY=your-raven-api-key
RAVEN_WEBHOOK_SECRET=your-webhook-secret
NODE_ENV=development
```

## Usage

1. Start the server:

   ```bash
   npm run dev
   ```

2. Access the API at `http://localhost:3000`.

3. View the API documentation at `http://localhost:3000/api-docs`.

## API Documentation

### User Management

- **POST /api/users/register**: Register a new user.
- **POST /api/users/login**: Log in a user.
- **POST /api/users/refresh-token**: Refresh access token.

### Account Management

- **POST /api/accounts**: Create a new account.
- **GET /api/accounts**: Get all accounts for the authenticated user.
- **GET /api/accounts/all**: Get all accounts (admin only).

### Transaction Management

- **POST /api/transactions/transfer**: Transfer money between accounts.
- **GET /api/transactions/history/:accountNumber**: Get transaction history for an account.

### Webhook Management

- **POST /api/webhooks**: Handle incoming deposit webhooks.
- **GET /api/webhooks/logs**: Get webhook logs (admin only).

## Testing

Run tests using Jest:

```bash
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

```

### Instructions to Use the README
- Replace `yourusername` in the clone URL with your actual GitHub username.
- Update any specific details related to your project as necessary.
- Ensure that the API documentation matches the actual endpoints and functionality of your application.

Would you like to add any additional sections or modify any part of this README?
```
