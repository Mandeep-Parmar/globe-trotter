import React, { useState } from "react";
import { useTripContext } from "../context/TripContext";
import { getInterCityTravelHours } from "../data/travelMatrix";
import {
  getGlobalDaysCount,
  getGlobalDayActivityHours,
  MAX_DAILY_ACTIVITY_HOURS,
  validateItineraryTime,
  SAFETY_BUFFER_HOURS
} from "../utils/timeCalculator";
import {
  MapPin,
  Calendar,
  Plus,
  Trash2,
  DollarSign,
  Clock,
  Sparkles,
  ArrowRight,
  Plane,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw
} from "lucide-react";

const Screen5_BuildItinerary = () => {
  const {
    activeTrip,
    cities,
    addStopToTrip,
    removeStopFromTrip,
    openSearchForStop,
    removeActivityFromStop,
    setCurrentScreen,
    calculateTotalCost,
    calculateCategoryCosts,
    saveTripToDatabase,
    isSaving
  } = useTripContext();

  const [selectedCityToAdd, setSelectedCityToAdd] = useState("");

  if (!activeTrip) {
    return (
      <div className="text-center py-20 text-slate-400">
        No active trip selected. Create a new trip from the Dashboard.
      </div>
    );
  }

  // Cities ALREADY present in current trip stops
  const existingCityNames = (activeTrip.stops || []).map((s) => (s.cityName || s.city?.name || "").toLowerCase());
  // Cities NOT YET added to current trip
  const unaddedCities = (cities || []).filter((c) => !existingCityNames.includes(c.name.toLowerCase()));

  // Global Time & Constraint Metrics
  const validation = validateItineraryTime(activeTrip);
  const totalCost = calculateTotalCost();
  const categoryCosts = calculateCategoryCosts();
  const budgetLimit = activeTrip.budgetLimit || activeTrip.totalBudget || 2000;
  const isOverBudget = totalCost > budgetLimit;

  // Single Global Days Count (e.g., 72h = Days 1..3)
  const totalGlobalDays = getGlobalDaysCount(activeTrip.startDate, activeTrip.endDate);
  const globalDaysArray = Array.from({ length: totalGlobalDays }, (_, i) => i + 1);

  const handleAddCityClick = () => {
    if (!selectedCityToAdd) return;
    const targetCityName = selectedCityToAdd;
    setSelectedCityToAdd(""); // Reset dropdown state immediately to placeholder
    addStopToTrip(targetCityName); // Pass selected city explicitly
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Global Trip Header & Timeline Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 glass-panel border border-white/10 shadow-xl rounded-2xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              Single Global Trip Timeline
            </span>

            {/* 2-Hour Safety Buffer Indicator */}
            {validation.isBufferPreserved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                {SAFETY_BUFFER_HOURS}h Safety Buffer Preserved
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Buffer Reduced ({validation.remainingHours}h remaining)
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {activeTrip.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              {String(activeTrip.startDate).split("T")[0]} → {String(activeTrip.endDate).split("T")[0]} ({validation.availableHours}h Fixed Container)
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-500" />
              {(activeTrip.stops || []).length} Destination Stops
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-400" />
              {validation.totalScheduledHours}h Scheduled / {validation.availableHours}h Total
            </span>
          </div>
        </div>

        {/* Primary Action Button Bar with Prominent SAVE TRIP Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentScreen("view")}
            className="btn btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5"
          >
            <span>View Budget</span>
          </button>

          {/* Prominent Save Trip Button (Requirement 2) */}
          <button
            onClick={() => saveTripToDatabase(activeTrip)}
            disabled={isSaving}
            className={`btn text-xs py-2.5 px-6 shadow-lg transition-all flex items-center gap-2 ${
              isSaving
                ? "bg-indigo-600/50 text-indigo-200 cursor-not-allowed"
                : "btn-primary shadow-indigo-500/25 hover:scale-105"
            }`}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-300" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-white" />
                <span>Save Trip</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3-Column Global Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Trip Stops Navigator (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel p-4 space-y-4 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                City Destinations
              </h3>
              <span className="text-[11px] text-slate-500">{(activeTrip.stops || []).length} Cities</span>
            </div>

            <div className="space-y-2">
              {(activeTrip.stops || []).map((stop, index) => {
                const stopCityName = stop.cityName || stop.city?.name || "Destination";
                const nextStop = activeTrip.stops[index + 1];
                const nextCityName = nextStop ? (nextStop.cityName || nextStop.city?.name) : null;
                const travelHours = nextCityName ? getInterCityTravelHours(stopCityName, nextCityName) : 0;

                return (
                  <React.Fragment key={stop.id || index}>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 group hover:border-indigo-500/40 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold flex items-center justify-center border border-indigo-500/30">
                            {index + 1}
                          </span>
                          <h4 className="text-xs font-bold text-white">{stopCityName}</h4>
                        </div>

                        {/* Trash Icon Always Visible */}
                        <button
                          onClick={() => removeStopFromTrip(stop.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          title="Remove Stop"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                        <span>{(stop.activities || []).length} Activities</span>
                        <button
                          onClick={() => openSearchForStop(stop.id)}
                          className="text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Activity
                        </button>
                      </div>
                    </div>

                    {/* Inter-City Travel Duration Badge */}
                    {nextCityName && (
                      <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 font-semibold">
                        <Plane className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Travel to {nextCityName}: {travelHours}h</span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Add Destination Section with Explicit Placeholder & Synchronized Handler */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <label className="text-[11px] text-slate-400 font-semibold">Add City to Timeline:</label>
              {unaddedCities.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic">All available cities added to trip.</p>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCityToAdd}
                    onChange={(e) => setSelectedCityToAdd(e.target.value)}
                    className="input-field py-1.5 text-xs flex-1"
                  >
                    <option value="" disabled className="bg-[#0A0E17] text-slate-500">
                      Select a destination city...
                    </option>
                    {unaddedCities.map((c) => (
                      <option key={c.id} value={c.name} className="bg-[#0A0E17] text-white">
                        {c.name} ({c.country})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddCityClick}
                    disabled={!selectedCityToAdd}
                    className={`btn text-xs py-1.5 px-3 transition-all ${
                      selectedCityToAdd
                        ? "btn-secondary"
                        : "bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed"
                    }`}
                  >
                    + Add
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Column: Single Continuous Global Days Timeline (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-5 space-y-5 border border-white/10 shadow-lg">
            
            {/* Header: REMOVED "+ Discover Activities" button (Requirement 1) */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Global Itinerary Timeline</h3>
                <p className="text-xs text-slate-400">
                  {totalGlobalDays} Days Total ({validation.availableHours}h Container) • Multi-City Continuous Flow
                </p>
              </div>
            </div>

            {/* Continuous Global Days Flow */}
            <div className="space-y-5">
              {globalDaysArray.map((globalDayNum) => {
                const dayActivityHours = getGlobalDayActivityHours(activeTrip.stops, globalDayNum);

                return (
                  <div key={globalDayNum} className="p-4 rounded-xl bg-[#080C14] border border-white/10 space-y-4">
                    
                    {/* Global Day Header with Activity Capacity Meter */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">GLOBAL DAY {globalDayNum}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-xs text-slate-400 font-semibold">{activeTrip.title}</span>
                      </div>

                      {/* Daily Activity Cap Indicator (Max 10h) */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-400">
                          Activity Limit: <strong className={dayActivityHours >= 10 ? "text-rose-400" : "text-indigo-300"}>{dayActivityHours}h / {MAX_DAILY_ACTIVITY_HOURS}h</strong>
                        </span>
                        <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              dayActivityHours >= 10
                                ? "bg-rose-500"
                                : dayActivityHours >= 7
                                ? "bg-amber-500"
                                : "bg-indigo-500"
                            }`}
                            style={{ width: `${Math.min((dayActivityHours / 10) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Render Activities for this Global Day grouped by City Stop */}
                    <div className="space-y-3">
                      {(activeTrip.stops || []).map((stop, stopIdx) => {
                        const stopCityName = stop.cityName || stop.city?.name || "Destination";
                        const dayStopActivities = (stop.activities || []).filter(
                          (a) => (a.globalDayNumber || a.dayNumber || 1) === globalDayNum
                        );

                        if (dayStopActivities.length === 0) return null;

                        return (
                          <div key={stop.id || stopIdx} className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-indigo-400" />
                                {stopCityName}
                              </span>
                              <button
                                onClick={() => openSearchForStop(stop.id)}
                                className="text-[10px] text-slate-400 hover:text-white underline"
                              >
                                + Add to {stopCityName}
                              </button>
                            </div>

                            <div className="space-y-2">
                              {dayStopActivities.map((act) => {
                                const actTitle = act.customTitle || act.title;
                                const actCost = act.cost || act.estimatedCost || 0;
                                const actDuration = act.durationHours || act.duration || 2;

                                return (
                                  <div
                                    key={act.id}
                                    className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between gap-3 group hover:border-indigo-500/40 transition-all"
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      <span className={`badge badge-${(act.category || "Sightseeing").toLowerCase()}`}>
                                        {act.category || "Sightseeing"}
                                      </span>
                                      <div className="min-w-0">
                                        <h5 className="text-xs font-bold text-white truncate">{actTitle}</h5>
                                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                                          <span className="flex items-center gap-1 font-semibold text-purple-300">
                                            <Clock className="w-3 h-3" />
                                            {actDuration}h
                                          </span>
                                          <span className="font-semibold text-emerald-400">${actCost}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => removeActivityFromStop(stop.id, act.id)}
                                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors shrink-0"
                                      title="Remove activity"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}

                      {/* Empty state for global day if no activities scheduled */}
                      {getGlobalDayActivityHours(activeTrip.stops, globalDayNum) === 0 && (
                        <div className="text-center py-4 border border-dashed border-white/10 rounded-lg text-slate-500 text-xs">
                          No activities scheduled for Global Day {globalDayNum}. Select + Add to add activities.
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Global Budget & Remaining Hours (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel p-5 space-y-5 border border-white/10 shadow-lg sticky top-24">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-3">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Global Budget & Capacity
            </h3>

            {/* Total Spend vs Budget Limit Meter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Estimated Total Cost:</span>
                <span className={`font-extrabold text-sm ${isOverBudget ? "text-rose-400" : "text-emerald-400"}`}>
                  ${totalCost}
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isOverBudget ? "bg-rose-500" : "bg-emerald-500"}`}
                  style={{ width: `${Math.min((totalCost / budgetLimit) * 100, 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                <span>Budget Limit: ${budgetLimit}</span>
                <span>{isOverBudget ? "Over Budget" : `$${budgetLimit - totalCost} Left`}</span>
              </div>
            </div>

            {/* Category Expense Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-white/10">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category Expenses</div>
              {Object.entries(categoryCosts).map(([cat, cost]) => (
                <div key={cat} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    {cat}
                  </span>
                  <span className="font-bold text-white">${cost}</span>
                </div>
              ))}
            </div>

            {/* Overall Schedule Validation Overview */}
            <div className="p-3.5 rounded-xl bg-[#080C14] border border-white/10 space-y-2">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Global Timeline Capacity</div>
              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Available Trip Hours:</span>
                  <span className="font-bold text-white">{validation.availableHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Activities Scheduled:</span>
                  <span className="font-bold text-indigo-300">{validation.totalActivityHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Inter-City Travel:</span>
                  <span className="font-bold text-purple-300">{validation.totalTravelHours}h</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-1 mt-1 font-bold text-white">
                  <span>Global Remaining Hours:</span>
                  <span className={validation.remainingHours < 2 ? "text-amber-400" : "text-emerald-400"}>
                    {validation.remainingHours}h
                  </span>
                </div>
              </div>
            </div>

            {/* Save Trip Button in Sidebar */}
            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => saveTripToDatabase(activeTrip)}
                disabled={isSaving}
                className="btn btn-primary w-full text-xs py-3 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Trip to Account"}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Screen5_BuildItinerary;
