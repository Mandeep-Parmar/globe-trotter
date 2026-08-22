import { sendError } from "../utils/apiResponse.js";

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

/**
 * Centralized Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Global Error Handler:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "An unexpected internal server error occurred.";
  sendError(res, message, status);
};
