import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CITIES as FALLBACK_CITIES, ACTIVITIES as FALLBACK_ACTIVITIES, SAMPLE_TRIPS } from "../data/mockData";

const API_BASE_URL = "http://localhost:5000/api";
const TripContext = createContext();

export const TripProvider = ({ children }) => {
  // Screen State: 'dashboard', 'builder', 'view'
  const [currentScreen, setCurrentScreen] = useState("dashboard");

  // Modals & Drawers
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTargetStopId, setSearchTargetStopId] = useState(null);

  // Authentication State
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("globetrotter_token") || null);

  // Database Connection Health State
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [dbStats, setDbStats] = useState(null);

  // Dynamic Data States from Database API
  const [cities, setCities] = useState(FALLBACK_CITIES);
  const [activities, setActivities] = useState(FALLBACK_ACTIVITIES);
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 3000 ? null : prev));
    }, 3500);
  }, []);

  // Helper for Auth Headers
  const getAuthHeaders = useCallback(() => {
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }, [token]);

  // 1. Check DB Health & Stats
  const checkDbHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (res.ok) {
        setIsDbConnected(true);
        const statsRes = await fetch(`${API_BASE_URL}/admin/stats`);
        if (statsRes.ok) {
          const stats = await statsRes.json();
          setDbStats(stats);
        }
      } else {
        setIsDbConnected(false);
      }
    } catch {
      setIsDbConnected(false);
    }
  }, []);

  // 2. Demo User Auto-Login / Auth Init
  const initAuth = useCallback(async () => {
    try {
      const savedToken = localStorage.getItem("globetrotter_token");
      if (savedToken) {
        const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${savedToken}` }
        });
        if (meRes.ok) {
          const userData = await meRes.json();
          setUser(userData);
          setToken(savedToken);
          return;
        }
      }

      // Auto Demo Login on startup if no active session
      const demoRes = await fetch(`${API_BASE_URL}/auth/demo`, { method: "POST" });
      if (demoRes.ok) {
        const demoData = await demoRes.json();
        setUser(demoData.user);
        setToken(demoData.token);
        localStorage.setItem("globetrotter_token", demoData.token);
      }
    } catch {
      console.warn("API offline or starting up, using local demo user.");
      setUser({
        id: "demo-user",
        firstName: "Alex",
        lastName: "Traveler",
        email: "demo@globetrotter.com"
      });
    }
  }, []);

  // 3. Fetch Master Cities, Activities & Trips from Backend DB
  const fetchBackendData = useCallback(async () => {
    setIsLoading(true);
    try {
      await checkDbHealth();

      // Fetch Cities from DB
      const citiesRes = await fetch(`${API_BASE_URL}/cities`);
      if (citiesRes.ok) {
        const citiesData = await citiesRes.json();
        if (citiesData && citiesData.length > 0) setCities(citiesData);
      }

      // Fetch Activities from DB
      const activitiesRes = await fetch(`${API_BASE_URL}/activities`);
      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        if (activitiesData && activitiesData.length > 0) setActivities(activitiesData);
      }

      // Fetch Trips from DB
      const tripsRes = await fetch(`${API_BASE_URL}/trips`);
      if (tripsRes.ok) {
        const tripsData = await tripsRes.json();
        if (tripsData && tripsData.length > 0) {
          setTrips(tripsData);
          setActiveTrip((prev) => prev ? (tripsData.find(t => t.id === prev.id) || tripsData[0]) : tripsData[0]);
        } else {
          setTrips(SAMPLE_TRIPS);
          setActiveTrip(SAMPLE_TRIPS[0]);
        }
      }
    } catch (err) {
      console.warn("⚠️ API offline, using cached fallback data.", err);
      setTrips(SAMPLE_TRIPS);
      setActiveTrip(SAMPLE_TRIPS[0]);
    } finally {
      setIsLoading(false);
    }
  }, [checkDbHealth]);

  // Initial Load
  useEffect(() => {
    const init = async () => {
      await initAuth();
      await fetchBackendData();
    };
    init();
  }, [initAuth, fetchBackendData]);

  // 4. Create New Trip (Saves to DB)
  const createNewTrip = async ({ title, startPlace, startDate, endDate, budgetLimit }) => {
    const selectedCity = cities.find((c) => c.name.toLowerCase() === (startPlace || "").toLowerCase()) || cities[0];

    const newTripPayload = {
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
          sectionBudget: Math.round((Number(budgetLimit) || 2000) * 0.6)
        }
      ]
    };

    try {
      const res = await fetch(`${API_BASE_URL}/trips`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newTripPayload)
      });

      if (res.ok) {
        const createdTrip = await res.json();
        setActiveTrip(createdTrip);
        setTrips((prev) => [createdTrip, ...prev]);
        showToast(`Trip "${createdTrip.title}" created & saved to database!`, "success");
      } else {
        throw new Error("Failed to save on server");
      }
    } catch (e) {
      console.warn("Saving to local state fallback:", e);
      const fallbackTrip = {
        id: `trip-${Date.now()}`,
        ...newTripPayload,
        stops: [
          {
            id: `stop-${Date.now()}`,
            cityId: selectedCity.id,
            cityName: selectedCity.name,
            startDate: newTripPayload.startDate,
            endDate: newTripPayload.endDate,
            sectionBudget: Math.round(newTripPayload.budgetLimit * 0.6),
            activities: []
          }
        ]
      };
      setActiveTrip(fallbackTrip);
      setTrips((prev) => [fallbackTrip, ...prev]);
      showToast("Trip created in local workspace mode", "info");
    }

    setIsWizardOpen(false);
    setCurrentScreen("builder");
  };

  // 5. Add Stop Section to Active Trip (Saves to DB)
  const addStopToTrip = async (cityName = "Rome") => {
    if (!activeTrip) return;
    const selectedCity = cities.find((c) => c.name.toLowerCase() === cityName.toLowerCase()) || cities[0];

    try {
      const res = await fetch(`${API_BASE_URL}/trips/${activeTrip.id}/stops`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          cityId: selectedCity.id,
          cityName: selectedCity.name,
          startDate: activeTrip.endDate,
          endDate: activeTrip.endDate,
          sectionBudget: 500
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.trip) {
          setActiveTrip(data.trip);
          setTrips((prev) => prev.map((t) => (t.id === data.trip.id ? data.trip : t)));
          showToast(`Added ${selectedCity.name} to itinerary in DB!`, "success");
          return;
        }
      }
    } catch (err) {
      console.warn("DB stop update failed, updating local state:", err);
    }

    // Local state fallback
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
    showToast(`Added ${selectedCity.name} stop`, "info");
  };

  // 6. Remove Stop Section from Trip (Saves to DB)
  const removeStopFromTrip = async (stopId) => {
    if (!activeTrip) return;

    try {
      const res = await fetch(`${API_BASE_URL}/trips/${activeTrip.id}/stops/${stopId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (res.ok) {
        const data = await res.json();
        if (data.trip) {
          setActiveTrip(data.trip);
          setTrips((prev) => prev.map((t) => (t.id === data.trip.id ? data.trip : t)));
          showToast("Stop section removed from database", "success");
          return;
        }
      }
    } catch (err) {
      console.warn("DB remove stop failed, updating local state:", err);
    }

    // Local state fallback
    setActiveTrip((prev) => ({
      ...prev,
      stops: (prev.stops || []).filter((s) => s.id !== stopId)
    }));
    showToast("Stop section removed", "info");
  };

  // 7. Add Activity to Stop (Saves to DB)
  const addActivityToStop = async (stopId, activity, dayNumber = 1) => {
    if (!activeTrip) return;

    const cost = Number(activity.cost || activity.estimatedCost || 0);

    try {
      const res = await fetch(`${API_BASE_URL}/trips/${activeTrip.id}/stops/${stopId}/activities`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          activityId: activity.id,
          title: activity.title,
          customTitle: activity.title,
          category: activity.category || "Sightseeing",
          cost: cost,
          dayNumber: dayNumber
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.trip) {
          setActiveTrip(data.trip);
          setTrips((prev) => prev.map((t) => (t.id === data.trip.id ? data.trip : t)));
          showToast(`"${activity.title}" saved to itinerary!`, "success");
          return;
        }
      }
    } catch (err) {
      console.warn("DB add activity failed, updating local state:", err);
    }

    // Local state fallback
    setActiveTrip((prev) => {
      const updatedStops = (prev.stops || []).map((stop) => {
        if (stop.id === stopId) {
          const exists = stop.activities.some((a) => a.id === activity.id);
          if (exists) return stop;
          return {
            ...stop,
            activities: [...stop.activities, { ...activity, cost, dayNumber }]
          };
        }
        return stop;
      });

      return { ...prev, stops: updatedStops };
    });
    showToast(`Added "${activity.title}"`, "info");
  };

  // 8. Remove Activity from Stop (Saves to DB)
  const removeActivityFromStop = async (stopId, activityId) => {
    if (!activeTrip) return;

    try {
      const res = await fetch(`${API_BASE_URL}/trips/${activeTrip.id}/stops/${stopId}/activities/${activityId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (res.ok) {
        const data = await res.json();
        if (data.trip) {
          setActiveTrip(data.trip);
          setTrips((prev) => prev.map((t) => (t.id === data.trip.id ? data.trip : t)));
          showToast("Activity removed from database", "success");
          return;
        }
      }
    } catch (err) {
      console.warn("DB remove activity failed, updating local state:", err);
    }

    // Local fallback
    setActiveTrip((prev) => {
      const updatedStops = (prev.stops || []).map((stop) => {
        if (stop.id === stopId) {
          return {
            ...stop,
            activities: (stop.activities || []).filter((a) => a.id !== activityId)
          };
        }
        return stop;
      });
      return { ...prev, stops: updatedStops };
    });
  };

  // 9. Delete Entire Trip (Saves to DB)
  const deleteTrip = async (tripId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (res.ok) {
        setTrips((prev) => prev.filter((t) => t.id !== tripId));
        if (activeTrip?.id === tripId) {
          const remaining = trips.filter((t) => t.id !== tripId);
          setActiveTrip(remaining.length > 0 ? remaining[0] : null);
        }
        showToast("Trip deleted from database", "success");
      }
    } catch (err) {
      console.warn("DB delete trip failed, removing locally:", err);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      if (activeTrip?.id === tripId) {
        const remaining = trips.filter((t) => t.id !== tripId);
        setActiveTrip(remaining.length > 0 ? remaining[0] : null);
      }
    }
  };

  // 10. Load Specific Trip
  const loadTrip = async (tripId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/trips/${tripId}`);
      if (res.ok) {
        const fullTrip = await res.json();
        setActiveTrip(fullTrip);
        setCurrentScreen("builder");
        return;
      }
    } catch (e) {
      console.warn("Could not fetch trip by ID, finding from cache:", e);
    }

    const found = trips.find((t) => t.id === tripId) || SAMPLE_TRIPS[0];
    setActiveTrip(found);
    setCurrentScreen("builder");
  };

  // 11. Open Search Drawer for a specific stop
  const openSearchForStop = (stopId) => {
    setSearchTargetStopId(stopId);
    setIsSearchOpen(true);
  };

  // 12. Calculate Total Cost
  const calculateTotalCost = () => {
    if (!activeTrip || !activeTrip.stops) return 0;
    return activeTrip.stops.reduce((total, stop) => {
      const stopTotal = (stop.activities || []).reduce((sum, act) => sum + (Number(act.cost || act.estimatedCost || 0)), 0);
      return total + stopTotal;
    }, 0);
  };

  // 13. Calculate Category Breakdown
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
        const cost = Number(act.cost || act.estimatedCost || 0);
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
        user,
        token,
        isDbConnected,
        dbStats,
        cities,
        activities,
        trips,
        activeTrip,
        setActiveTrip,
        isLoading,
        toast,
        showToast,
        createNewTrip,
        addStopToTrip,
        removeStopFromTrip,
        openSearchForStop,
        addActivityToStop,
        removeActivityFromStop,
        deleteTrip,
        loadTrip,
        loadSampleTrip: loadTrip,
        calculateTotalCost,
        calculateCategoryCosts,
        refreshData: fetchBackendData
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => useContext(TripContext);
