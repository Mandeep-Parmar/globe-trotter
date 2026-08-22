import { Router } from "express";
import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

const router = Router();

router.get("/health", async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    return sendSuccess(res, {
      status: "healthy",
      database: "connected",
      records: { users: userCount },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
});

router.get("/", (req, res) => {
  return sendSuccess(res, {
    message: "GlobeTrotter Database API is running in modular architecture!",
    status: "healthy"
  });
});

export default router;
