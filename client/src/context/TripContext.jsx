import React, { createContext, useContext, useState, useEffect } from "react";
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

  // Dynamic Data States from Neon PostgreSQL API
  const [cities, setCities] = useState(FALLBACK_CITIES);
  const [activities, setActivities] = useState(FALLBACK_ACTIVITIES);
  const [trips, setTrips] = useState(SAMPLE_TRIPS);
  const [activeTrip, setActiveTrip] = useState(SAMPLE_TRIPS[0]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch Dynamic Cities, Activities, and Trips from Neon Backend API
  useEffect(() => {
    const fetchBackendData = async () => {
      setIsLoading(true);
      try {
        // Fetch Cities
        const citiesRes = await fetch(`${API_BASE_URL}/cities`);
        if (citiesRes.ok) {
          const citiesData = await citiesRes.json();
          if (citiesData && citiesData.length > 0) setCities(citiesData);
        }

        // Fetch Activities
        const activitiesRes = await fetch(`${API_BASE_URL}/activities`);
        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          if (activitiesData && activitiesData.length > 0) setActivities(activitiesData);
        }

        // Fetch Trips
        const tripsRes = await fetch(`${API_BASE_URL}/trips`);
        if (tripsRes.ok) {
          const tripsData = await tripsRes.json();
          if (tripsData && tripsData.length > 0) {
            setTrips(tripsData);
            setActiveTrip(tripsData[0]);
          }
        }
      } catch (err) {
        console.warn("⚠️ API offline or connecting... using seed dataset.", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackendData();
  }, []);

  // 2. Create New Trip (Screen 4 Wizard action -> Neon DB)
  const createNewTrip = async ({ title, startPlace, startDate, endDate, budgetLimit }) => {
    const selectedCity = cities.find((c) => c.name.toLowerCase() === startPlace.toLowerCase()) || cities[0];

    const newTripObj = {
      title: title || "New Adventure",
      startDate: startDate || "2026-07-01",
      endDate: endDate || "2026-07-07",
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
      const res = await fetch(`${API_BASE_URL}/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
  };

  // 3. Add Stop Section to Active Trip
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
  };

  // 4. Remove Stop from Trip
  const removeStopFromTrip = (stopId) => {
    setActiveTrip((prev) => ({
      ...prev,
      stops: prev.stops.filter((s) => s.id !== stopId)
    }));
  };

  // Open Activity Search Drawer for a specific stop
  const openSearchForStop = (stopId) => {
    setSearchTargetStopId(stopId);
    setIsSearchOpen(true);
  };

  // 5. Add Activity to Stop Section
  const addActivityToStop = (stopId, activity, dayNumber = 1) => {
    setActiveTrip((prev) => {
      const updatedStops = (prev.stops || []).map((stop) => {
        if (stop.id === stopId) {
          const exists = stop.activities.some((a) => a.id === activity.id);
          if (exists) return stop;
          return {
            ...stop,
            activities: [...stop.activities, { ...activity, dayNumber }]
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

  // 6. Remove Activity from Stop
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

  // 7. Load Sample Trip
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
