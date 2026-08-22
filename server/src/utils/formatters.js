/**
 * Formats a trip object from Prisma with flattened, consistent structure for frontend consumption
 */
export const formatTrip = (trip) => {
  if (!trip) return null;
  return {
    ...trip,
    budgetLimit: trip.totalBudget || 0,
    startDate: trip.startDate ? trip.startDate.toISOString().split("T")[0] : "",
    endDate: trip.endDate ? trip.endDate.toISOString().split("T")[0] : "",
    stops: (trip.stops || []).map((stop) => ({
      ...stop,
      cityName: stop.city?.name || stop.cityName || "Destination",
      startDate: stop.startDate ? stop.startDate.toISOString().split("T")[0] : "",
      endDate: stop.endDate ? stop.endDate.toISOString().split("T")[0] : "",
      activities: (stop.activities || []).map((act) => ({
        ...act,
        cityName: stop.city?.name || stop.cityName || "",
        imageUrl: act.activity?.imageUrl || act.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80",
        durationHours: act.activity?.durationHours || act.durationHours || 2,
        title: act.customTitle || act.title || "Custom Activity"
      }))
    }))
  };
};
