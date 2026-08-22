import React from "react";
import { useTripContext } from "../context/TripContext";
import { Globe, Compass, Plus, MapPin, PieChart, Sparkles } from "lucide-react";

const Navbar = () => {
  const { currentScreen, setCurrentScreen, setIsWizardOpen, setIsSearchOpen, activeTrip } = useTripContext();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080C14]/90 border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentScreen("dashboard")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-extrabold tracking-tight text-white">
              GlobeTrotter
            </h1>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              MVP
            </span>
          </div>
        </div>

        {/* Minimalist Spaced Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setCurrentScreen("dashboard")}
            className={`flex items-center gap-2 text-xs font-semibold transition-all py-1 ${
              currentScreen === "dashboard"
                ? "text-indigo-400 font-bold border-b-2 border-indigo-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => setCurrentScreen("builder")}
            className={`flex items-center gap-2 text-xs font-semibold transition-all py-1 ${
              currentScreen === "builder"
                ? "text-purple-400 font-bold border-b-2 border-purple-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Itinerary Builder
            {activeTrip && (
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all py-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Discover Activities
          </button>

          <button
            onClick={() => setCurrentScreen("view")}
            className={`flex items-center gap-2 text-xs font-semibold transition-all py-1 ${
              currentScreen === "view"
                ? "text-emerald-400 font-bold border-b-2 border-emerald-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            View & Budget
          </button>
        </nav>

        {/* Primary CTA Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWizardOpen(true)}
            className="btn btn-primary text-xs py-2 px-4 shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Plan New Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
