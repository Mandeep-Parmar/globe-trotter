import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// Get Admin System Statistics
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTrips = await prisma.trip.count();
    const totalCities = await prisma.city.count();
    const totalActivities = await prisma.activity.count();

    return sendSuccess(res, {
      totalUsers,
      totalTrips,
      totalCities,
      totalActivities,
      database: "SQLite (Local Persistent DB)",
      status: "connected"
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
