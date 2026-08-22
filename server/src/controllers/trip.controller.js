import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { formatTrip } from "../utils/formatters.js";
import { getOrCreateDemoUser } from "../utils/demoUser.js";

// Get All Trips with full relations
export const getAllTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        stops: {
          orderBy: { stopOrder: "asc" },
          include: {
            city: true,
            activities: {
              include: { activity: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return sendSuccess(res, trips.map(formatTrip));
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Get Single Trip by ID
export const getTripById = async (req, res) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { firstName: true, lastName: true, avatarUrl: true } },
        stops: {
          orderBy: { stopOrder: "asc" },
          include: {
            city: true,
            activities: {
              include: { activity: true }
            }
          }
        }
      }
    });

    if (!trip) return sendError(res, "Trip not found.", 404);
    return sendSuccess(res, formatTrip(trip));
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Create New Trip
export const createTrip = async (req, res) => {
  try {
    let userId = req.user?.userId;
    if (!userId) {
      const demoUser = await getOrCreateDemoUser();
      userId = demoUser.id;
    }

    const { title, startDate, endDate, budgetLimit, totalBudget, stops } = req.body;

    const parsedStart = startDate ? new Date(startDate) : new Date();
    const parsedEnd = endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const budget = Number(budgetLimit || totalBudget || 2000);

    let stopsToCreate = [];
    if (stops && Array.isArray(stops) && stops.length > 0) {
      for (let i = 0; i < stops.length; i++) {
        const s = stops[i];
        let cityId = s.cityId;
        if (!cityId && s.cityName) {
          const matchedCity = await prisma.city.findFirst({
            where: { name: { contains: s.cityName } }
          });
          if (matchedCity) cityId = matchedCity.id;
        }

        if (!cityId) {
          const firstCity = await prisma.city.findFirst();
          cityId = firstCity ? firstCity.id : "";
        }

        if (cityId) {
          stopsToCreate.push({
            cityId,
            stopOrder: i + 1,
            startDate: s.startDate ? new Date(s.startDate) : parsedStart,
            endDate: s.endDate ? new Date(s.endDate) : parsedEnd,
            sectionBudget: Number(s.sectionBudget || budget * 0.6)
          });
        }
      }
    } else {
      const defaultCity = await prisma.city.findFirst();
      if (defaultCity) {
        stopsToCreate.push({
          cityId: defaultCity.id,
          stopOrder: 1,
          startDate: parsedStart,
          endDate: parsedEnd,
          sectionBudget: budget
        });
      }
    }

    const createdTrip = await prisma.trip.create({
      data: {
        userId,
        title: title || "New Adventure",
        startDate: parsedStart,
        endDate: parsedEnd,
        totalBudget: budget,
        stops: {
          create: stopsToCreate
        }
      },
      include: {
        stops: {
          orderBy: { stopOrder: "asc" },
          include: {
            city: true,
            activities: {
              include: { activity: true }
            }
          }
        }
      }
    });

    return sendSuccess(res, formatTrip(createdTrip), 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Update Trip Details
export const updateTrip = async (req, res) => {
  try {
    const { title, startDate, endDate, budgetLimit, totalBudget, status, description, isPublic } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (budgetLimit !== undefined || totalBudget !== undefined) {
      updateData.totalBudget = Number(budgetLimit || totalBudget);
    }
    if (status !== undefined) updateData.status = status;
    if (isPublic !== undefined) updateData.isPublic = Boolean(isPublic);

    const updated = await prisma.trip.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        stops: {
          orderBy: { stopOrder: "asc" },
          include: {
            city: true,
            activities: {
              include: { activity: true }
            }
          }
        }
      }
    });

    return sendSuccess(res, formatTrip(updated));
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Delete Trip
export const deleteTrip = async (req, res) => {
  try {
    await prisma.trip.delete({
      where: { id: req.params.id }
    });
    return sendSuccess(res, { message: "Trip deleted successfully", id: req.params.id });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
