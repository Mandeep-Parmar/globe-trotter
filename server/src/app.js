import express from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";
import healthRouter from "./routes/health.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Root Health / Info Route
app.use("/", healthRouter);

// Main API Routes (/api/auth, /api/cities, /api/activities, /api/trips, /api/admin, /api/health)
app.use("/api", apiRouter);

// 404 Route Not Found Handler
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(errorHandler);

export default app;
