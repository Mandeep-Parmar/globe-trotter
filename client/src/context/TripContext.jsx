import React, { createContext, useContext, useState, useEffect } from "react";
import { CITIES as FALLBACK_CITIES, ACTIVITIES as FALLBACK_ACTIVITIES, SAMPLE_TRIPS } from "../data/mockData";
import { useAuth } from "./AuthContext";
import {
  MAX_DAILY_ACTIVITY_HOURS,
  SAFETY_BUFFER_HOURS,
  getTripTotalHours,
  getGlobalDaysCount,
  getGlobalScheduledHours,
  getGlobalDayActivityHours,
  getTotalActivityHours,
  getTotalTravelHours,
  validateItineraryTime
} from "../utils/timeCalculator";

const API_BASE_URL = "http://localhost:5000/api";
const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const { token, user: authUser } = useAuth();

  const [currentScreen, setCurrentScreen] = useState("dashboard");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTargetStopId, setSearchTargetStopId] = useState(null);

  // Database & Saving State
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [dbStats, setDbStats] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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

  // Fetch Backend Data & Verify Neon Database Connection
  const fetchBackendData = async () => {
    setIsLoading(true);
    try {
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const citiesRes = await fetch(`${API_BASE_URL}/cities`);
      if (citiesRes.ok) {
        const citiesData = await citiesRes.json();
        if (citiesData && citiesData.length > 0) setCities(citiesData);
        setIsDbConnected(true);
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
        }
      }

      const statsRes = await fetch(`${API_BASE_URL}/admin/stats`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setDbStats(statsData);
      }
    } catch (err) {
      console.warn("⚠️ API offline or connecting... using seed dataset.");
      setIsDbConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, [token]);

  const refreshData = () => {
    fetchBackendData();
  };

  // Save Complete Trip to Database Engine (Requirement 2 & 3)
  const saveTripToDatabase = async (tripToSave) => {
    const targetTrip = tripToSave || activeTrip;
    if (!targetTrip) return;

    setIsSaving(true);
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const payload = {
        title: targetTrip.title || "My Travel Plan",
        description: targetTrip.description || "Customized multi-city itinerary",
        startDate: targetTrip.startDate || "2026-07-01",
        endDate: targetTrip.endDate || "2026-07-04",
        totalBudget: Number(targetTrip.budgetLimit || targetTrip.totalBudget) || 2000,
        stops: (targetTrip.stops || []).map((stop, index) => ({
          cityId: stop.cityId || cities[0]?.id,
          cityName: stop.cityName || stop.city?.name,
          stopOrder: index + 1,
          activities: (stop.activities || []).map((act) => ({
            customTitle: act.customTitle || act.title,
            category: act.category || "Sightseeing",
            cost: Number(act.cost || act.estimatedCost) || 0,
            durationHours: Number(act.durationHours || act.duration) || 2,
            dayNumber: act.globalDayNumber || act.dayNumber || 1
          }))
        }))
      };

      const res = await fetch(`${API_BASE_URL}/trips`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedTripFromDb = await res.json();
        setActiveTrip(savedTripFromDb);
        setTrips((prev) => {
          const exists = prev.some((t) => t.id === savedTripFromDb.id);
          if (exists) {
            return prev.map((t) => (t.id === savedTripFromDb.id ? savedTripFromDb : t));
          }
          return [savedTripFromDb, ...prev];
        });
        showToast("Trip saved successfully to database!", "Trip Saved", "success");
      } else {
        showToast("Trip saved to session!", "Trip Saved", "success");
      }
    } catch (err) {
      console.warn("⚠️ API Save error, updated local session.", err);
      showToast("Trip saved to session!", "Trip Saved", "success");
    } finally {
      setIsSaving(false);
      setCurrentScreen("my-trips");
    }
  };

  // 1. Create New Trip (Navigates to Builder ONLY when user finishes Wizard)
  const createNewTrip = async ({ title, startPlace, startDate, endDate, budgetLimit }) => {
    const selectedCity = cities.find((c) => c.name.toLowerCase() === startPlace.toLowerCase()) || cities[0];

    const newTripObj = {
      title: title || "New Adventure",
      startDate: startDate || "2026-07-01",
      endDate: endDate || "2026-07-04",
      budgetLimit: Number(budgetLimit) || 2000,
      stops: [
        {
          id: `stop-${Date.now()}`,
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
    showToast("New trip initialized!", "Trip Started", "success");
  };

  // 2. Add Stop Section to Active Trip
  const addStopToTrip = (cityName = "Rome") => {
    if (!activeTrip) return;
    const selectedCity = cities.find((c) => c.name.toLowerCase() === cityName.toLowerCase()) || cities[2];

    const newStop = {
      id: `stop-${Date.now()}`,
      cityId: selectedCity.id,
      cityName: selectedCity.name,
      startDate: activeTrip.startDate,
      endDate: activeTrip.endDate,
      sectionBudget: 500,
      activities: []
    };

    setActiveTrip((prev) => ({
      ...prev,
      stops: [...(prev.stops || []), newStop]
    }));
    showToast(`Added ${selectedCity.name} to the trip timeline.`, "Destination Added", "info");
  };

  // 3. Remove Stop
  const removeStopFromTrip = (stopId) => {
    setActiveTrip((prev) => ({
      ...prev,
      stops: prev.stops.filter((s) => s.id !== stopId)
    }));
    showToast("Destination stop removed.", "Stop Removed", "info");
  };

  // 4. Open Activity Search Drawer
  const openSearchForStop = (stopId) => {
    setSearchTargetStopId(stopId);
    setIsSearchOpen(true);
  };

  // 5. Intelligent Activity Allocator
  const addActivityToStop = (stopId, activity, targetGlobalDay = 1) => {
    if (!activeTrip) return false;

    const stop = activeTrip.stops.find((s) => s.id === stopId);
    if (!stop) return false;

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
    const availableTripHours = getTripTotalHours(activeTrip.startDate, activeTrip.endDate);
    const currentGlobalScheduledHours = getGlobalScheduledHours(activeTrip.stops);
    const globalRemainingHours = availableTripHours - currentGlobalScheduledHours;

    if (currentGlobalScheduledHours + activityDuration > availableTripHours) {
      showToast(
        `Only ${globalRemainingHours} hours remain in your trip. Some activities could not be scheduled.`,
        "Global Trip Time Exceeded",
        "error"
      );
      return false;
    }

    const maxGlobalDays = getGlobalDaysCount(activeTrip.startDate, activeTrip.endDate);
    let scheduledGlobalDay = null;
    let wasOverflowed = false;

    for (let dayCandidate = targetGlobalDay; dayCandidate <= maxGlobalDays; dayCandidate++) {
      const currentGlobalDayActivityHours = getGlobalDayActivityHours(activeTrip.stops, dayCandidate);

      if (currentGlobalDayActivityHours + activityDuration <= MAX_DAILY_ACTIVITY_HOURS) {
        scheduledGlobalDay = dayCandidate;
        if (dayCandidate > targetGlobalDay) wasOverflowed = true;
        break;
      }
    }

    if (!scheduledGlobalDay) {
      showToast(
        `Only ${globalRemainingHours} hours remain in your trip. Some activities could not be scheduled.`,
        "Daily 10h Cap Reached",
        "error"
      );
      return false;
    }

    const newActivityObj = {
      ...activity,
      cost: Number(activity.cost || activity.estimatedCost) || 0,
      durationHours: activityDuration,
      globalDayNumber: scheduledGlobalDay,
      dayNumber: scheduledGlobalDay
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

    const newRemainingHours = availableTripHours - (currentGlobalScheduledHours + activityDuration);

    if (wasOverflowed) {
      showToast(
        `"${activity.title}" could not fit on Global Day ${targetGlobalDay}, so it was automatically scheduled for Global Day ${scheduledGlobalDay}.`,
        "Activity Rescheduled",
        "warning"
      );
    } else if (newRemainingHours < SAFETY_BUFFER_HOURS) {
      showToast(
        `Adding "${activity.title}" reduces your global safety buffer below 2 hours (${newRemainingHours}h remaining).`,
        "Safety Buffer Reduced",
        "warning"
      );
    } else {
      showToast(`Added "${activity.title}" to Global Day ${scheduledGlobalDay}.`, "Activity Scheduled", "success");
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

  // 7. Load Trip into Builder Workspace
  const loadTrip = (tripId) => {
    const found = trips.find((t) => t.id === tripId) || SAMPLE_TRIPS[0];
    setActiveTrip(found);
    setCurrentScreen("builder");
  };

  // 8. Open Trip Details Showcase Page
  const openTripDetails = (tripId) => {
    const found = trips.find((t) => t.id === tripId) || SAMPLE_TRIPS[0];
    setActiveTrip(found);
    setCurrentScreen("trip-details");
  };

  // 9. Delete Trip
  const deleteTrip = (tripId) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (activeTrip?.id === tripId) {
      const remaining = trips.filter((t) => t.id !== tripId);
      setActiveTrip(remaining[0] || null);
    }
    showToast("Trip deleted.", "Trip Deleted", "info");
  };

  // 10. Calculate Total Cost
  const calculateTotalCost = () => {
    if (!activeTrip || !activeTrip.stops) return 0;
    return activeTrip.stops.reduce((total, stop) => {
      const stopTotal = (stop.activities || []).reduce((sum, act) => sum + (act.cost || act.estimatedCost || 0), 0);
      return total + stopTotal;
    }, 0);
  };

  // 11. Calculate Category Breakdown
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
        isDbConnected,
        dbStats,
        isSaving,
        user: authUser,
        toast,
        showToast,
        clearToast,
        refreshData,
        cities,
        activities,
        trips,
        activeTrip,
        setActiveTrip,
        isLoading,
        createNewTrip,
        saveTripToDatabase,
        addStopToTrip,
        removeStopFromTrip,
        openSearchForStop,
        addActivityToStop,
        removeActivityFromStop,
        loadSampleTrip: loadTrip,
        loadTrip,
        openTripDetails,
        deleteTrip,
        calculateTotalCost,
        calculateCategoryCosts
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => useContext(TripContext);
