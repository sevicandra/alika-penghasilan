
export class ErrorHandler extends Error {
  statusCode: number;
  message: string;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class NotFoundError extends ErrorHandler {
  constructor(message: string) {
    super(message, 404);
  }
}

export class BadRequestError extends ErrorHandler {
  constructor(message: string) {
    super(message, 400);
  }
}

// export class ValidationError extends 