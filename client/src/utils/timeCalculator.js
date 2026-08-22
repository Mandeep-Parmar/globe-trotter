import { getInterCityTravelHours } from "../data/travelMatrix";

// Maximum activity hours allowed on any single day (Hard Constraint)
export const MAX_DAILY_ACTIVITY_HOURS = 10;

// Maximum total scheduled hours in a 24-hour day (Hard Constraint)
export const MAX_DAILY_SCHEDULE_HOURS = 24;

// Protected Safety Buffer in hours (Soft Constraint)
export const SAFETY_BUFFER_HOURS = 2;

// Calculate available trip duration in hours from start and end dates
export const getTripTotalHours = (startDate, endDate) => {
  if (!startDate || !endDate) return 120; // Default 5 days = 120h
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = Math.max(end.getTime() - start.getTime(), 0);
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  return hours > 0 ? hours : 120;
};

// Calculate total activity hours scheduled for a specific day
export const getDayActivityHours = (activities = [], dayNumber = 1) => {
  const dayActivities = activities.filter((a) => (a.dayNumber || 1) === dayNumber);
  return dayActivities.reduce((sum, act) => sum + (act.durationHours || 2), 0);
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

// Calculate total scheduled activity hours across all stops and days
export const getTotalActivityHours = (stops = []) => {
  if (!stops) return 0;
  let total = 0;
  stops.forEach((stop) => {
    (stop.activities || []).forEach((act) => {
      total += act.durationHours || 2;
    });
  });
  return total;
};

// Comprehensive Validation Calculator
export const validateItineraryTime = (trip) => {
  if (!trip) return { isValid: true, scheduledHours: 0, availableHours: 120, bufferHours: 2, warnings: [] };

  const availableHours = getTripTotalHours(trip.startDate, trip.endDate);
  const totalActivityHours = getTotalActivityHours(trip.stops);
  const totalTravelHours = getTotalTravelHours(trip.stops);
  
  // Total Scheduled Time = Activities + Inter-city Travel
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
