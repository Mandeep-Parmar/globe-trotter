/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { CITIES, SAMPLE_TRIPS } from "../data/mockData";

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  // Screen State: 'dashboard' (3), 'builder' (5), 'view' (9)
  const [currentScreen, setCurrentScreen] = useState("dashboard");
  
  // Modals & Drawers
  const [isWizardOpen, setIsWizardOpen] = useState(false); // Screen 4
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Screen 8
  const [searchTargetStopId, setSearchTargetStopId] = useState(null);

  // Active Trip State
  const [activeTrip, setActiveTrip] = useState(SAMPLE_TRIPS[0]);

  // Create New Trip (from Wizard - Screen 4)
  const createNewTrip = ({ title, startPlace, startDate, endDate, budgetLimit }) => {
    const selectedCity = CITIES.find((c) => c.name.toLowerCase() === startPlace.toLowerCase()) || CITIES[0];

    const newTrip = {
      id: `trip-${Date.now()}`,
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

    setActiveTrip(newTrip);
    setIsWizardOpen(false);
    setCurrentScreen("builder");
  };

  // Add Stop / Section to Trip (Screen 5)
  const addStopToTrip = (cityName = "Rome") => {
    if (!activeTrip) return;
    const selectedCity = CITIES.find((c) => c.name.toLowerCase() === cityName.toLowerCase()) || CITIES[2];

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
      stops: [...prev.stops, newStop]
    }));
  };

  // Remove Stop from Trip
  const removeStopFromTrip = (stopId) => {
    setActiveTrip((prev) => ({
      ...prev,
      stops: prev.stops.filter((s) => s.id !== stopId)
    }));
  };

  // Open Activity Search Drawer for a specific stop (Screen 8 trigger)
  const openSearchForStop = (stopId) => {
    setSearchTargetStopId(stopId);
    setIsSearchOpen(true);
  };

  // Add Activity to Stop (Screen 8 action)
  const addActivityToStop = (stopId, activity, dayNumber = 1) => {
    setActiveTrip((prev) => {
      const updatedStops = prev.stops.map((stop) => {
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

  // Remove Activity from Stop
  const removeActivityFromStop = (stopId, activityId) => {
    setActiveTrip((prev) => {
      const updatedStops = prev.stops.map((stop) => {
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

  // Load a Pre-built Sample Trip
  const loadSampleTrip = (tripId) => {
    const sample = SAMPLE_TRIPS.find((t) => t.id === tripId) || SAMPLE_TRIPS[0];
    setActiveTrip(sample);
    setCurrentScreen("builder");
  };

  // Calculate Total Cost of Active Trip
  const calculateTotalCost = () => {
    if (!activeTrip || !activeTrip.stops) return 0;
    return activeTrip.stops.reduce((total, stop) => {
      const stopTotal = stop.activities.reduce((sum, act) => sum + (act.cost || 0), 0);
      return total + stopTotal;
    }, 0);
  };

  // Calculate Category Cost Breakdown
  const calculateCategoryCosts = () => {
    const categories = {
      Sightseeing: 0,
      Food: 0,
      Stay: 0,
      Transport: 0
    };

    if (!activeTrip || !activeTrip.stops) return categories;

    activeTrip.stops.forEach((stop) => {
      stop.activities.forEach((act) => {
        const cat = act.category || "Sightseeing";
        if (categories[cat] !== undefined) {
          categories[cat] += act.cost || 0;
        } else {
          categories.Sightseeing += act.cost || 0;
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
        activeTrip,
        setActiveTrip,
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
