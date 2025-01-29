export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(400, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(409, message);
  }
}

export class InsufficientFundsError extends AppError {
  constructor(message: string = 'Insufficient funds') {
    super(400, message);
  }
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}
