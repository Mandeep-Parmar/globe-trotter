import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// Get All Cities with region and query filter
export const getCities = async (req, res) => {
  try {
    const { region, search } = req.query;
    const where = {};
    if (region && region !== "All") where.region = region;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { country: { contains: search } }
      ];
    }

    const cities = await prisma.city.findMany({
      where,
      include: {
        _count: { select: { activities: true } }
      },
      orderBy: { popularity: "desc" }
    });

    const formatted = cities.map((c) => ({
      ...c,
      rating: c.popularity,
      activitiesCount: c._count?.activities || 0
    }));

    return sendSuccess(res, formatted);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Get Single City by ID with activities
export const getCityById = async (req, res) => {
  try {
    const city = await prisma.city.findUnique({
      where: { id: req.params.id },
      include: { activities: true }
    });
    if (!city) return sendError(res, "City destination not found.", 404);
    return sendSuccess(res, city);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Create New City
export const createCity = async (req, res) => {
  try {
    const { name, country, region, costIndex, bannerUrl, description, popularity } = req.body;
    if (!name || !country) {
      return sendError(res, "Name and country are required.", 400);
    }

    const city = await prisma.city.create({
      data: {
        name,
        country,
        region: region || "Europe",
        costIndex: costIndex || "$$",
        bannerUrl: bannerUrl || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
        description: description || "Exciting travel destination.",
        popularity: Number(popularity) || 4.8
      }
    });

    return sendSuccess(res, city, 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
