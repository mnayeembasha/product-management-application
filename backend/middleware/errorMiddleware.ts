import { type Request, type  Response, type NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
}

// Centralized error handler
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  // Default values
  const status = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific cases
  if (err.name === "ValidationError") {
    // Mongoose validation errors
    return res.status(400).json({ error: "Invalid input data" });
  }

  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    // Duplicate key error
    return res.status(409).json({ error: "Duplicate field value entered" });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  if (err.name === "ZodError") {
    return res.status(400).json({ error: "Validation failed", details: (err as any).issues });
  }

  res.status(status).json({ error: message });
};
