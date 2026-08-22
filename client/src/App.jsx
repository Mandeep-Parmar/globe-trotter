import { TripProvider, useTripContext } from "./context/TripContext";
import Navbar from "./components/Navbar";
import Screen3_Dashboard from "./components/Screen3_Dashboard";
import Screen4_TripWizard from "./components/Screen4_TripWizard";
import Screen5_BuildItinerary from "./components/Screen5_BuildItinerary";
import Screen8_ActivitySearch from "./components/Screen8_ActivitySearch";
import Screen9_ItineraryViewBudget from "./components/Screen9_ItineraryViewBudget";

const MainContent = () => {
  const { currentScreen } = useTripContext();

  return (
    <main className="app-shell max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      {currentScreen === "dashboard" && <Screen3_Dashboard />}
      {currentScreen === "builder" && <Screen5_BuildItinerary />}
      {currentScreen === "view" && <Screen9_ItineraryViewBudget />}

      {/* Screen Modals & Drawers */}
      <Screen4_TripWizard />
      <Screen8_ActivitySearch />
    </main>
  );
};

const App = () => {
  return (
    <TripProvider>
      <div className="app-background min-h-screen text-slate-100 selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <MainContent />
      </div>
    </TripProvider>
  );
};

export default App;
