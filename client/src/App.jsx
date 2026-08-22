import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TripProvider, useTripContext } from "./context/TripContext";
import Navbar from "./components/Navbar";
import Screen1_Login from "./components/Screen1_Login";
import Screen2_Register from "./components/Screen2_Register";
import Screen3_Dashboard from "./components/Screen3_Dashboard";
import Screen4_TripWizard from "./components/Screen4_TripWizard";
import Screen5_BuildItinerary from "./components/Screen5_BuildItinerary";
import Screen7_UserProfile from "./components/Screen7_UserProfile";
import Screen8_ActivitySearch from "./components/Screen8_ActivitySearch";
import Screen9_ItineraryViewBudget from "./components/Screen9_ItineraryViewBudget";

const MainContent = () => {
  const { currentScreen } = useTripContext();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {currentScreen === "dashboard" && <Screen3_Dashboard />}
      {currentScreen === "builder" && <Screen5_BuildItinerary />}
      {currentScreen === "view" && <Screen9_ItineraryViewBudget />}
      {currentScreen === "profile" && <Screen7_UserProfile />}

      {/* Screen Modals & Drawers */}
      <Screen4_TripWizard />
      <Screen8_ActivitySearch />
    </main>
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
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-cyan-500 selection:text-white flex flex-col">
        <Navbar />
        <MainContent />
      </div>
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
