import React, { useState } from "react";
import { useTripContext } from "../context/TripContext";
import { getInterCityTravelHours } from "../data/travelMatrix";
import {
  getDayActivityHours,
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
  ChevronRight
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
    calculateCategoryCosts
  } = useTripContext();

  const [selectedCityToAdd, setSelectedCityToAdd] = useState("Rome");

  if (!activeTrip) {
    return (
      <div className="text-center py-20 text-slate-400">
        No active trip selected. Create a new trip from the Dashboard.
      </div>
    );
  }

  // Time and constraint metrics
  const validation = validateItineraryTime(activeTrip);
  const totalCost = calculateTotalCost();
  const categoryCosts = calculateCategoryCosts();
  const budgetLimit = activeTrip.budgetLimit || activeTrip.totalBudget || 2000;
  const isOverBudget = totalCost > budgetLimit;

  return (
    <div className="space-y-6 pb-20">
      {/* Workspace Header & Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 glass-panel border border-white/10 shadow-xl rounded-2xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              Interactive Itinerary Builder
            </span>

            {/* 2-Hour Safety Buffer Badge */}
            {validation.isBufferPreserved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                {SAFETY_BUFFER_HOURS}h Safety Buffer Preserved
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Safety Buffer Reduced ({validation.remainingHours}h remaining)
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {activeTrip.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              {String(activeTrip.startDate).split("T")[0]} → {String(activeTrip.endDate).split("T")[0]} ({validation.availableHours}h Total)
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-500" />
              {(activeTrip.stops || []).length} Destination Stops
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-400" />
              {validation.totalActivityHours}h Activities Scheduled
            </span>
          </div>
        </div>

        {/* Primary Action Row */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentScreen("view")}
            className="btn btn-primary text-xs py-2.5 px-5 shadow-lg shadow-indigo-500/20 flex items-center gap-2"
          >
            <span>View Full Itinerary & Budget</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Column Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Trip Stops Navigator (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel p-4 space-y-4 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                City Stops
              </h3>
              <span className="text-[11px] text-slate-500">{(activeTrip.stops || []).length} Stops</span>
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

                        {activeTrip.stops.length > 1 && (
                          <button
                            onClick={() => removeStopFromTrip(stop.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                            title="Remove Stop"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                        <span>{(stop.activities || []).length} Activities</span>
                        <button
                          onClick={() => openSearchForStop(stop.id)}
                          className="text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add Activity
                        </button>
                      </div>
                    </div>

                    {/* Inter-City Travel Duration Connector */}
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

            {/* Add New Stop Selector */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <label className="text-[11px] text-slate-400 font-semibold">Add Next Destination:</label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedCityToAdd}
                  onChange={(e) => setSelectedCityToAdd(e.target.value)}
                  className="input-field py-1.5 text-xs flex-1"
                >
                  {cities.map((c) => (
                    <option key={c.id} value={c.name} className="bg-[#0A0E17] text-white">
                      {c.name} ({c.country})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => addStopToTrip(selectedCityToAdd)}
                  className="btn btn-secondary text-xs py-1.5 px-3"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Day-by-Day Activity Builder (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {(activeTrip.stops || []).map((stop, stopIdx) => {
            const stopCityName = stop.cityName || stop.city?.name || "Destination";
            const stopActivities = stop.activities || [];

            // Group activities by Day 1, Day 2, Day 3
            const days = [1, 2, 3];

            return (
              <div key={stop.id || stopIdx} className="glass-panel p-5 space-y-5 border border-white/10 shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{stopCityName} Itinerary</h3>
                      <p className="text-xs text-slate-400">Strictly isolated to {stopCityName} activities</p>
                    </div>
                  </div>

                  <button
                    onClick={() => openSearchForStop(stop.id)}
                    className="btn btn-primary text-xs py-1.5 px-3 shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Discover Activities</span>
                  </button>
                </div>

                {/* Day Sections */}
                <div className="space-y-4">
                  {days.map((dayNum) => {
                    const dayActivities = stopActivities.filter((a) => (a.dayNumber || 1) === dayNum);
                    const dayActivityHours = getDayActivityHours(stopActivities, dayNum);

                    return (
                      <div key={dayNum} className="p-4 rounded-xl bg-[#080C14] border border-white/10 space-y-3">
                        
                        {/* Day Header with Daily Capacity Indicator */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-white">DAY {dayNum}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-xs text-slate-400 font-semibold">{dayActivities.length} Activities</span>
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

                        {/* Activities List */}
                        {dayActivities.length === 0 ? (
                          <div className="text-center py-4 border border-dashed border-white/10 rounded-lg text-slate-500 text-xs">
                            No activities scheduled for Day {dayNum}. Add from discovery drawer.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {dayActivities.map((act) => {
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
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Budget & Time Analytics (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel p-5 space-y-5 border border-white/10 shadow-lg sticky top-24">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-3">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Budget & Schedule Breakdown
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

            {/* Category Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-white/10">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category Expenses</div>
              {Object.entries(categoryCosts).map(([cat, cost]) => (
                <div key={cat} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full bg-indigo-400`}></span>
                    {cat}
                  </span>
                  <span className="font-bold text-white">${cost}</span>
                </div>
              ))}
            </div>

            {/* Overall Schedule Validation Overview */}
            <div className="p-3.5 rounded-xl bg-[#080C14] border border-white/10 space-y-2">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Schedule Status</div>
              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Available Trip Time:</span>
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
                  <span>Remaining Hours:</span>
                  <span className={validation.remainingHours < 2 ? "text-amber-400" : "text-emerald-400"}>
                    {validation.remainingHours}h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Screen5_BuildItinerary;
