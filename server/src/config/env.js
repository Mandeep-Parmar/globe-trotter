import "dotenv/config";

export const config = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
  JWT_SECRET: process.env.JWT_SECRET || "globetrotter_jwt_secret_key_8f3a9b1c7d2e4f6a5b8c9d0e1f2a3b4c",
  NODE_ENV: process.env.NODE_ENV || "development"
};
