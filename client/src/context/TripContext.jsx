import React, { createContext, useContext, useState, useEffect } from "react";
import { CITIES as FALLBACK_CITIES, ACTIVITIES as FALLBACK_ACTIVITIES, SAMPLE_TRIPS } from "../data/mockData";
import { useAuth } from "./AuthContext";
import {
  MAX_DAILY_ACTIVITY_HOURS,
  MAX_DAILY_SCHEDULE_HOURS,
  SAFETY_BUFFER_HOURS,
  getTripTotalHours,
  getDayActivityHours,
  getTotalActivityHours,
  getTotalTravelHours,
  validateItineraryTime
} from "../utils/timeCalculator";

const API_BASE_URL = "http://localhost:5000/api";
const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const { token, user } = useAuth();
  
  const [currentScreen, setCurrentScreen] = useState("dashboard");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTargetStopId, setSearchTargetStopId] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  // Dynamic Data States
  const [cities, setCities] = useState(FALLBACK_CITIES);
  const [activities, setActivities] = useState(FALLBACK_ACTIVITIES);
  const [trips, setTrips] = useState(SAMPLE_TRIPS);
  const [activeTrip, setActiveTrip] = useState(SAMPLE_TRIPS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, title = "", type = "info") => {
    setToast({ id: Date.now(), title, message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const clearToast = () => setToast(null);

  // Fetch Cities, Activities, Trips from Backend
  useEffect(() => {
    const fetchBackendData = async () => {
      setIsLoading(true);
      try {
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const citiesRes = await fetch(`${API_BASE_URL}/cities`);
        if (citiesRes.ok) {
          const citiesData = await citiesRes.json();
          if (citiesData && citiesData.length > 0) setCities(citiesData);
        }

        const activitiesRes = await fetch(`${API_BASE_URL}/activities`);
        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          if (activitiesData && activitiesData.length > 0) setActivities(activitiesData);
        }

        const tripsRes = await fetch(`${API_BASE_URL}/trips`, { headers });
        if (tripsRes.ok) {
          const tripsData = await tripsRes.json();
          if (tripsData && tripsData.length > 0) {
            setTrips(tripsData);
            setActiveTrip(tripsData[0]);
          } else {
            setTrips([]);
            setActiveTrip(null);
          }
        } else {
          setTrips([]);
          setActiveTrip(null);
        }
      } catch (err) {
        console.warn("⚠️ API offline or connecting... using seed dataset.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackendData();
  }, [token]);

  // 1. Create New Trip
  const createNewTrip = async ({ title, startPlace, startDate, endDate, budgetLimit }) => {
    const selectedCity = cities.find((c) => c.name.toLowerCase() === startPlace.toLowerCase()) || cities[0];

    const newTripObj = {
      title: title || "New Adventure",
      startDate: startDate || "2026-07-01",
      endDate: endDate || "2026-07-07",
      budgetLimit: Number(budgetLimit) || 2000,
      stops: [
        {
          cityId: selectedCity.id,
          cityName: selectedCity.name,
          startDate: startDate || "2026-07-01",
          endDate: endDate || "2026-07-04",
          sectionBudget: Math.round((Number(budgetLimit) || 2000) * 0.6),
          activities: []
        }
      ]
    };

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/trips`, {
        method: "POST",
        headers,
        body: JSON.stringify(newTripObj)
      });
      if (res.ok) {
        const createdTrip = await res.json();
        setActiveTrip(createdTrip);
        setTrips((prev) => [createdTrip, ...prev]);
      } else {
        const fallbackId = `trip-${Date.now()}`;
        const localTrip = { id: fallbackId, ...newTripObj };
        setActiveTrip(localTrip);
        setTrips((prev) => [localTrip, ...prev]);
      }
    } catch (e) {
      const fallbackId = `trip-${Date.now()}`;
      const localTrip = { id: fallbackId, ...newTripObj };
      setActiveTrip(localTrip);
      setTrips((prev) => [localTrip, ...prev]);
    }

    setIsWizardOpen(false);
    setCurrentScreen("builder");
    showToast("New trip created successfully!", "Trip Created", "success");
  };

  // 2. Add Stop Section to Active Trip
  const addStopToTrip = (cityName = "Rome") => {
    if (!activeTrip) return;
    const selectedCity = cities.find((c) => c.name.toLowerCase() === cityName.toLowerCase()) || cities[2];

    const newStop = {
      id: `stop-${Date.now()}`,
      cityId: selectedCity.id,
      cityName: selectedCity.name,
      startDate: activeTrip.endDate,
      endDate: activeTrip.endDate,
      sectionBudget: 500,
      activities: []
    };

    setActiveTrip((prev) => ({
      ...prev,
      stops: [...(prev.stops || []), newStop]
    }));
    showToast(`Added ${selectedCity.name} to trip stops.`, "Stop Added", "info");
  };

  // 3. Remove Stop
  const removeStopFromTrip = (stopId) => {
    setActiveTrip((prev) => ({
      ...prev,
      stops: prev.stops.filter((s) => s.id !== stopId)
    }));
  };

  // 4. Open Activity Search Drawer for a specific stop
  const openSearchForStop = (stopId) => {
    setSearchTargetStopId(stopId);
    setIsSearchOpen(true);
  };

  // 5. Intelligent Activity Scheduling & Automatic Overflow Engine
  const addActivityToStop = (stopId, activity, targetDay = 1) => {
    if (!activeTrip) return false;

    const stop = activeTrip.stops.find((s) => s.id === stopId);
    if (!stop) return false;

    // Hard Rule 1: Strict City Match
    const activityCityId = activity.cityId || activity.city?.id;
    if (activityCityId && stop.cityId && activityCityId !== stop.cityId) {
      showToast(
        `"${activity.title}" belongs to another city and cannot be added to ${stop.cityName}.`,
        "City Mismatch Error",
        "error"
      );
      return false;
    }

    const activityDuration = Number(activity.durationHours || activity.duration) || 2;

    // Total Available Trip Duration
    const totalAvailableTripHours = getTripTotalHours(activeTrip.startDate, activeTrip.endDate);
    const currentTotalScheduledHours = getTotalActivityHours(activeTrip.stops) + getTotalTravelHours(activeTrip.stops);

    // Hard Constraint Check: Overall Trip Duration
    if (currentTotalScheduledHours + activityDuration > totalAvailableTripHours) {
      showToast(
        "This activity could not be scheduled within your trip. There is no available time remaining that satisfies your itinerary constraints.",
        "Trip Duration Exceeded",
        "error"
      );
      return false;
    }

    // Determine max days for this stop section (default 3 days per stop)
    const maxStopDays = 3;
    let scheduledDay = null;
    let wasOverflowed = false;

    // Sequential Overflow Search: Attempt targetDay, then targetDay+1, targetDay+2...
    for (let dayCandidate = targetDay; dayCandidate <= maxStopDays; dayCandidate++) {
      const currentDayActivitiesHours = getDayActivityHours(stop.activities, dayCandidate);

      // Check Hard Rules for dayCandidate:
      // Rule 2: Daily Activity Hours <= 10
      // Rule 6: Daily Total Schedule <= 24
      if (currentDayActivitiesHours + activityDuration <= MAX_DAILY_ACTIVITY_HOURS) {
        scheduledDay = dayCandidate;
        if (dayCandidate > targetDay) wasOverflowed = true;
        break;
      }
    }

    // Rejection if no day satisfies daily 10h limit
    if (!scheduledDay) {
      showToast(
        "This activity could not be scheduled within your trip. There is no available time remaining that satisfies your itinerary constraints.",
        "Daily Limit Reached",
        "error"
      );
      return false;
    }

    // Add activity to scheduledDay
    const newActivityObj = {
      ...activity,
      cost: Number(activity.cost || activity.estimatedCost) || 0,
      durationHours: activityDuration,
      dayNumber: scheduledDay
    };

    setActiveTrip((prev) => {
      const updatedStops = (prev.stops || []).map((s) => {
        if (s.id === stopId) {
          const exists = (s.activities || []).some((a) => a.id === activity.id);
          if (exists) return s;
          return {
            ...s,
            activities: [...(s.activities || []), newActivityObj]
          };
        }
        return s;
      });

      return {
        ...prev,
        stops: updatedStops
      };
    });

    // Check Soft Constraint: 2-Hour Safety Buffer Warning
    const newTotalScheduledHours = currentTotalScheduledHours + activityDuration;
    const remainingBuffer = totalAvailableTripHours - newTotalScheduledHours;

    if (wasOverflowed) {
      showToast(
        `"${activity.title}" could not fit on Day ${targetDay}, so it was automatically scheduled for Day ${scheduledDay}.`,
        "Activity Rescheduled",
        "warning"
      );
    } else if (remainingBuffer < SAFETY_BUFFER_HOURS) {
      showToast(
        `Adding "${activity.title}" reduces your safety buffer below 2 hours (${remainingBuffer}h remaining).`,
        "Safety Buffer Reduced",
        "warning"
      );
    } else {
      showToast(`Added "${activity.title}" to Day ${scheduledDay}.`, "Activity Scheduled", "success");
    }

    return true;
  };

  // 6. Remove Activity
  const removeActivityFromStop = (stopId, activityId) => {
    setActiveTrip((prev) => {
      const updatedStops = (prev.stops || []).map((stop) => {
        if (stop.id === stopId) {
          return {
            ...stop,
            activities: stop.activities.filter((a) => a.id !== activityId)
          };
        }
        return stop;
      });
      return {
        ...prev,
        stops: updatedStops
      };
    });
  };

  // 7. Load Sample / Saved Trip
  const loadSampleTrip = (tripId) => {
    const found = trips.find((t) => t.id === tripId) || SAMPLE_TRIPS[0];
    setActiveTrip(found);
    setCurrentScreen("builder");
  };

  // 8. Calculate Total Cost
  const calculateTotalCost = () => {
    if (!activeTrip || !activeTrip.stops) return 0;
    return activeTrip.stops.reduce((total, stop) => {
      const stopTotal = (stop.activities || []).reduce((sum, act) => sum + (act.cost || act.estimatedCost || 0), 0);
      return total + stopTotal;
    }, 0);
  };

  // 9. Calculate Category Breakdown
  const calculateCategoryCosts = () => {
    const categories = {
      Sightseeing: 0,
      Food: 0,
      Stay: 0,
      Transport: 0
    };

    if (!activeTrip || !activeTrip.stops) return categories;

    activeTrip.stops.forEach((stop) => {
      (stop.activities || []).forEach((act) => {
        const cat = act.category || "Sightseeing";
        const cost = act.cost || act.estimatedCost || 0;
        if (categories[cat] !== undefined) {
          categories[cat] += cost;
        } else {
          categories.Sightseeing += cost;
        }
      });
    });

    return categories;
  };

  return (
    <TripContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        isWizardOpen,
        setIsWizardOpen,
        isSearchOpen,
        setIsSearchOpen,
        searchTargetStopId,
        toast,
        showToast,
        clearToast,
        cities,
        activities,
        trips,
        activeTrip,
        setActiveTrip,
        isLoading,
        createNewTrip,
        addStopToTrip,
        removeStopFromTrip,
        openSearchForStop,
        addActivityToStop,
        removeActivityFromStop,
        loadSampleTrip,
        calculateTotalCost,
        calculateCategoryCosts
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => useContext(TripContext);
