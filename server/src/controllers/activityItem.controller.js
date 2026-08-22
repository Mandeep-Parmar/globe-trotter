import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { formatTrip } from "../utils/formatters.js";

// Add Activity Item to Trip Stop
export const addActivityToStop = async (req, res) => {
  try {
    const { tripId, stopId } = req.params;
    const { activityId, title, customTitle, category, cost, estimatedCost, dayNumber, timeSlot } = req.body;

    let linkedActivityId = activityId;
    if (linkedActivityId && String(linkedActivityId).startsWith("act-")) {
      const existingAct = await prisma.activity.findFirst({
        where: { title: { contains: title || customTitle } }
      });
      if (existingAct) linkedActivityId = existingAct.id;
      else linkedActivityId = null;
    }

    const newActivity = await prisma.tripActivity.create({
      data: {
        tripStopId: stopId,
        activityId: linkedActivityId || undefined,
        customTitle: customTitle || title || "Activity Item",
        category: category || "Sightseeing",
        cost: Number(cost || estimatedCost || 0),
        dayNumber: Number(dayNumber || 1),
        timeSlot: timeSlot || "Morning"
      },
      include: { activity: true }
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

    return sendSuccess(res, { activity: newActivity, trip: formatTrip(updatedTrip) }, 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Delete Activity Item from Trip Stop
export const deleteActivityFromStop = async (req, res) => {
  try {
    const { tripId, activityId } = req.params;

    await prisma.tripActivity.delete({
      where: { id: activityId }
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

    return sendSuccess(res, { message: "Activity item removed successfully.", trip: formatTrip(updatedTrip) });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
