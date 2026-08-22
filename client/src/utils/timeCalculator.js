import { getInterCityTravelHours } from "../data/travelMatrix";

// Hard Constraints
export const MAX_DAILY_ACTIVITY_HOURS = 10;
export const MAX_DAILY_SCHEDULE_HOURS = 24;
export const SAFETY_BUFFER_HOURS = 2;

// Calculate available trip duration in hours from start and end dates
export const getTripTotalHours = (startDate, endDate) => {
  if (!startDate || !endDate) return 72; // Default 3 days = 72h
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = Math.max(end.getTime() - start.getTime(), 0);
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  return hours > 0 ? hours : 72;
};

// Calculate total global days in the trip (e.g. 72h = 3 Days)
export const getGlobalDaysCount = (startDate, endDate) => {
  const totalHours = getTripTotalHours(startDate, endDate);
  return Math.max(Math.ceil(totalHours / 24), 1);
};

// Calculate total inter-city travel hours for a trip across consecutive stops
export const getTotalTravelHours = (stops = []) => {
  if (!stops || stops.length < 2) return 0;
  let totalTravel = 0;
  for (let i = 0; i < stops.length - 1; i++) {
    const cityA = stops[i].cityName || stops[i].city?.name;
    const cityB = stops[i + 1].cityName || stops[i + 1].city?.name;
    totalTravel += getInterCityTravelHours(cityA, cityB);
  }
  return totalTravel;
};

// Calculate total scheduled activity hours across all stops
export const getTotalActivityHours = (stops = []) => {
  if (!stops) return 0;
  let total = 0;
  stops.forEach((stop) => {
    (stop.activities || []).forEach((act) => {
      total += act.durationHours || act.duration || 2;
    });
  });
  return total;
};

// Calculate total scheduled hours across the ENTIRE trip (Activities + Travel)
export const getGlobalScheduledHours = (stops = []) => {
  return getTotalActivityHours(stops) + getTotalTravelHours(stops);
};

// Calculate total activity hours scheduled for a specific GLOBAL day
export const getGlobalDayActivityHours = (stops = [], globalDayNum = 1) => {
  let total = 0;
  (stops || []).forEach((stop) => {
    (stop.activities || []).forEach((act) => {
      if ((act.globalDayNumber || act.dayNumber || 1) === globalDayNum) {
        total += act.durationHours || act.duration || 2;
      }
    });
  });
  return total;
};

// Alias helper for backwards compatibility
export const getDayActivityHours = (activities = [], dayNumber = 1) => {
  if (!activities) return 0;
  const dayActivities = activities.filter((a) => (a.globalDayNumber || a.dayNumber || 1) === dayNumber);
  return dayActivities.reduce((sum, act) => sum + (act.durationHours || act.duration || 2), 0);
};

// Comprehensive Global Validation Calculator
export const validateItineraryTime = (trip) => {
  if (!trip) return { isValid: true, scheduledHours: 0, availableHours: 72, bufferHours: 2, warnings: [] };

  const availableHours = getTripTotalHours(trip.startDate, trip.endDate);
  const totalActivityHours = getTotalActivityHours(trip.stops);
  const totalTravelHours = getTotalTravelHours(trip.stops);
  const totalScheduledHours = totalActivityHours + totalTravelHours;
  const remainingHours = availableHours - totalScheduledHours;

  const warnings = [];
  let isHardValid = true;

  // Hard Rule: Total Scheduled Time <= Available Trip Duration
  if (totalScheduledHours > availableHours) {
    isHardValid = false;
    warnings.push(`Total schedule (${totalScheduledHours}h) exceeds available trip time (${availableHours}h).`);
  }

  // Soft Rule: 2-Hour Safety Buffer
  const isBufferPreserved = remainingHours >= SAFETY_BUFFER_HOURS;
  if (isHardValid && !isBufferPreserved) {
    warnings.push(`Adding this activity reduces your safety buffer below ${SAFETY_BUFFER_HOURS} hours.`);
  }

  return {
    isValid: isHardValid,
    isBufferPreserved,
    totalScheduledHours,
    totalActivityHours,
    totalTravelHours,
    availableHours,
    remainingHours: Math.max(remainingHours, 0),
    warnings
  };
};
