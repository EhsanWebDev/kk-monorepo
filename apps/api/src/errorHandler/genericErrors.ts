import { Error as MongooseError, mongo } from "mongoose";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
  ) {
    super(message);
  }
}

export const handleMongooseErrors = (err: any): AppError => {
  // Invalid ObjectId  → /api/devices/123
  if (err instanceof MongooseError.CastError) {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // Validation errors → missing required fields
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    return new AppError(messages.join(", "), 400);
  }

  // Duplicate key → unique index violation
  if (err instanceof mongo.MongoServerError && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return new AppError(`${field} already exists`, 409);
  }

  return new AppError(err.message ?? "Internal server error", 500);
};
