import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// Get All Activities with optional city, category, and search filter
export const getActivities = async (req, res) => {
  try {
    const { cityId, category, search } = req.query;
    const where = {};
    if (cityId) where.cityId = cityId;
    if (category && category !== "All") where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const activities = await prisma.activity.findMany({
      where,
      include: { city: true },
      orderBy: { estimatedCost: "asc" }
    });

    const formatted = activities.map((act) => ({
      ...act,
      cost: act.estimatedCost,
      cityName: act.city?.name || ""
    }));

    return sendSuccess(res, formatted);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Get Single Activity by ID
export const getActivityById = async (req, res) => {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: req.params.id },
      include: { city: true }
    });
    if (!activity) return sendError(res, "Activity not found.", 404);
    return sendSuccess(res, { ...activity, cost: activity.estimatedCost, cityName: activity.city?.name || "" });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Create Custom Activity
export const createActivity = async (req, res) => {
  try {
    const { cityId, title, category, estimatedCost, durationHours, imageUrl, description } = req.body;
    if (!cityId || !title) {
      return sendError(res, "City ID and Title are required.", 400);
    }

    const activity = await prisma.activity.create({
      data: {
        cityId,
        title,
        category: category || "Sightseeing",
        estimatedCost: Number(estimatedCost) || 50,
        durationHours: Number(durationHours) || 2,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80",
        description: description || "Exciting activity in the city."
      },
      include: { city: true }
    });

    return sendSuccess(res, { ...activity, cost: activity.estimatedCost, cityName: activity.city?.name || "" }, 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
