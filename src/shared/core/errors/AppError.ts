export type ErrorType = 'auth' | 'validation' | 'infra' | 'business' | 'unknown';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly type: ErrorType;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 400,
    type: ErrorType = 'business',
    isOperational = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
