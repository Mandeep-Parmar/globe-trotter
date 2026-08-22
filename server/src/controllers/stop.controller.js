import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { formatTrip } from "../utils/formatters.js";

// Add Stop Section to Trip
export const addStop = async (req, res) => {
  try {
    const { cityName, cityId, startDate, endDate, sectionBudget } = req.body;
    const tripId = req.params.id;

    let targetCityId = cityId;
    if (!targetCityId && cityName) {
      const foundCity = await prisma.city.findFirst({
        where: { name: { contains: cityName } }
      });
      if (foundCity) targetCityId = foundCity.id;
    }

    if (!targetCityId) {
      const fallbackCity = await prisma.city.findFirst();
      targetCityId = fallbackCity.id;
    }

    const existingStops = await prisma.tripStop.findMany({
      where: { tripId },
      orderBy: { stopOrder: "desc" },
      take: 1
    });
    const nextOrder = existingStops.length > 0 ? existingStops[0].stopOrder + 1 : 1;

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) return sendError(res, "Trip not found.", 404);

    const newStop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId: targetCityId,
        stopOrder: nextOrder,
        startDate: startDate ? new Date(startDate) : trip.endDate,
        endDate: endDate ? new Date(endDate) : trip.endDate,
        sectionBudget: Number(sectionBudget || 500)
      },
      include: {
        city: true,
        activities: true
      }
    });

    const updatedTrip = await prisma.trip.findUnique({
      where: { id: tripId },
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

    return sendSuccess(res, { stop: newStop, trip: formatTrip(updatedTrip) }, 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Delete Stop from Trip
export const deleteStop = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;

    await prisma.tripStop.delete({
      where: { id: stopId }
    });

    const updatedTrip = await prisma.trip.findUnique({
      where: { id: tripId },
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

    return sendSuccess(res, { message: "Stop removed successfully.", trip: formatTrip(updatedTrip) });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
