import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TripProvider, useTripContext } from "./context/TripContext";
import Navbar from "./components/Navbar";
import Screen1_Login from "./components/Screen1_Login";
import Screen2_Register from "./components/Screen2_Register";
import Screen3_Dashboard from "./components/Screen3_Dashboard";
import Screen4_TripWizard from "./components/Screen4_TripWizard";
import Screen5_BuildItinerary from "./components/Screen5_BuildItinerary";
import Screen6_MyTrips from "./components/Screen6_MyTrips";
import Screen7_UserProfile from "./components/Screen7_UserProfile";
import Screen8_ActivitySearch from "./components/Screen8_ActivitySearch";
import Screen9_ItineraryViewBudget from "./components/Screen9_ItineraryViewBudget";
import Screen10_TripDetails from "./components/Screen10_TripDetails";
import ToastNotification from "./components/ToastNotification";

const MainContent = () => {
  const { currentScreen, toast, clearToast, trips, openTripDetails } = useTripContext();

  // Listen for ?tripId=... Shareable URL parameter on app mount (Step 1)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tripIdParam = urlParams.get("tripId");
    if (tripIdParam && trips && trips.length > 0) {
      openTripDetails(tripIdParam);
    }
  }, [trips]);

  return (
    <div className="min-h-screen bg-[#0A0E17] text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentScreen === "dashboard" && <Screen3_Dashboard />}
        {currentScreen === "my-trips" && <Screen6_MyTrips />}
        {currentScreen === "builder" && <Screen5_BuildItinerary />}
        {currentScreen === "trip-details" && <Screen10_TripDetails />}
        {currentScreen === "view" && <Screen9_ItineraryViewBudget />}
        {currentScreen === "profile" && <Screen7_UserProfile />}

        {/* Global Modals & Drawers */}
        <Screen4_TripWizard />
        <Screen8_ActivitySearch />
      </main>

      {/* Global Toast Notification System */}
      <ToastNotification toast={toast} onClose={clearToast} />
    </div>
  );
};

const AuthWrapper = () => {
  const { user, isLoading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080C14] text-slate-400 text-xs font-semibold select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
          <span>Loading User Profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return isRegistering ? (
      <Screen2_Register onSwitchToLogin={() => setIsRegistering(false)} />
    ) : (
      <Screen1_Login onSwitchToRegister={() => setIsRegistering(true)} />
    );
  }

  return (
    <TripProvider>
      <MainContent />
    </TripProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
};

export default App;
