import React from "react";
import { TripProvider, useTripContext } from "./context/TripContext";
import Navbar from "./components/Navbar";
import Screen3_Dashboard from "./components/Screen3_Dashboard";
import Screen4_TripWizard from "./components/Screen4_TripWizard";
import Screen5_BuildItinerary from "./components/Screen5_BuildItinerary";
import Screen8_ActivitySearch from "./components/Screen8_ActivitySearch";
import Screen9_ItineraryViewBudget from "./components/Screen9_ItineraryViewBudget";
import ToastNotification from "./components/ToastNotification";

const MainContent = () => {
  const { currentScreen, toast, clearToast } = useTripContext();

  return (
    <div className="min-h-screen bg-[#0A0E17] text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentScreen === "dashboard" && <Screen3_Dashboard />}
        {currentScreen === "builder" && <Screen5_BuildItinerary />}
        {currentScreen === "view" && <Screen9_ItineraryViewBudget />}

        {/* Global Modals & Drawers */}
        <Screen4_TripWizard />
        <Screen8_ActivitySearch />
      </main>

      {/* Global Toast Notification System */}
      <ToastNotification toast={toast} onClose={clearToast} />
    </div>
  );
};

function App() {
  return (
    <TripProvider>
      <MainContent />
    </TripProvider>
  );
}

export default App;
