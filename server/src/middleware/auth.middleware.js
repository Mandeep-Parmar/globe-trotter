import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { sendError } from "../utils/apiResponse.js";

/**
 * Strict authentication middleware
 * Rejects requests without valid Bearer token
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return sendError(res, "Access denied. Authentication token missing.", 401);
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      return sendError(res, "Invalid or expired token.", 403);
    }
    req.user = user;
    next();
  });
};

/**
 * Optional authentication middleware
 * Attaches user to req.user if token is present, but does not block if omitted
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(token, config.JWT_SECRET, (err, user) => {
      if (!err) req.user = user;
      next();
    });
  } else {
    next();
  }
};
