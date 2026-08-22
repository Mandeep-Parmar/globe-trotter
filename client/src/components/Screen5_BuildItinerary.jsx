import React from "react";
import { useTripContext } from "../context/TripContext";
import { CITIES } from "../data/mockData";
import { MapPin, Calendar, Plus, Trash2, Sparkles, PieChart, Clock, Tag, AlertCircle, ArrowRight } from "lucide-react";

const Screen5_BuildItinerary = () => {
  const {
    activeTrip,
    addStopToTrip,
    removeStopFromTrip,
    openSearchForStop,
    removeActivityFromStop,
    setCurrentScreen,
    calculateTotalCost,
    calculateCategoryCosts
  } = useTripContext();

  if (!activeTrip) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-white">No Active Trip Selected</h2>
        <p className="text-slate-400 text-sm">Please create a new trip or select a sample trip from the dashboard.</p>
        <button onClick={() => setCurrentScreen("dashboard")} className="btn btn-primary">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const totalSpent = calculateTotalCost();
  const categoryCosts = calculateCategoryCosts();
  const isOverBudget = totalSpent > activeTrip.budgetLimit;

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Workspace Top Header Bar */}
      <div className="glass-panel p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Trip Workspace
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-0.5">{activeTrip.title}</h1>
          <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              {activeTrip.startDate} → {activeTrip.endDate}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              {activeTrip.stops.length} Cities
            </span>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen("view")}
          className="btn btn-primary text-xs py-2.5 px-5 shadow-md shadow-indigo-500/20"
        >
          <PieChart className="w-4 h-4" />
          <span>View Final Itinerary & Budget →</span>
        </button>
      </div>

      {/* Product Workspace 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (3 cols): Trip Stops Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel p-4 space-y-4 border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                Trip Stops
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {activeTrip.stops.length}
              </span>
            </div>

            {/* City Stops Timeline List */}
            <div className="space-y-2 relative before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
              {activeTrip.stops.map((stop, idx) => (
                <div
                  key={stop.id}
                  className="relative pl-7 p-3 rounded-xl bg-[#080C14]/60 border border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-all"
                >
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-500 border-2 border-[#080C14]"></div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-white">{stop.cityName}</h4>
                    <span className="text-[10px] text-slate-400">
                      {stop.activities.length} Activities
                    </span>
                  </div>

                  {activeTrip.stops.length > 1 && (
                    <button
                      onClick={() => removeStopFromTrip(stop.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Remove city stop"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add City Button */}
            <button
              onClick={() => {
                const availableCity = CITIES.find((c) => !activeTrip.stops.some((s) => s.cityName === c.name)) || CITIES[2];
                addStopToTrip(availableCity.name);
              }}
              className="btn btn-secondary w-full text-xs py-2"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>+ Add City Stop</span>
            </button>
          </div>
        </div>

        {/* Center Column (6 cols): Main Day-by-Day Itinerary Builder */}
        <div className="lg:col-span-6 space-y-6">
          {activeTrip.stops.map((stop, idx) => {
            const stopCost = stop.activities.reduce((sum, a) => sum + (a.cost || 0), 0);

            return (
              <div
                key={stop.id}
                className="glass-panel p-5 space-y-4 border border-white/10 relative"
              >
                {/* Stop Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                      {idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white">{stop.cityName}</h3>
                  </div>

                  <span className="text-xs font-bold text-indigo-400">
                    ${stopCost} Spent
                  </span>
                </div>

                {/* Activities List */}
                <div className="space-y-3">
                  {stop.activities.length === 0 ? (
                    <div className="p-5 rounded-xl bg-[#080C14]/40 border border-dashed border-white/10 text-center space-y-2">
                      <p className="text-xs text-slate-400">No activities added for {stop.cityName} yet.</p>
                      <button
                        onClick={() => openSearchForStop(stop.id)}
                        className="btn btn-outline text-xs py-1 px-3"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        + Add Activity
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {stop.activities.map((act) => (
                        <div
                          key={act.id}
                          className="glass-card p-3 flex items-center justify-between gap-3 bg-[#080C14]/60 border border-white/5"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={act.imageUrl}
                              alt={act.title}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <span className={`badge badge-${act.category.toLowerCase()}`}>
                                {act.category}
                              </span>
                              <h4 className="text-xs font-bold text-white truncate mt-0.5">{act.title}</h4>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <span>{act.durationHours}h</span>
                                <span>• Day {act.dayNumber || 1}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-emerald-400">${act.cost}</span>
                            <button
                              onClick={() => removeActivityFromStop(stop.id, act.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Activity Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => openSearchForStop(stop.id)}
                    className="btn btn-secondary text-xs py-1.5 px-3"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-400" />
                    <span>+ Add Activity in {stop.cityName}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (3 cols): Live Budget Summary Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel p-5 space-y-4 border border-white/10 sticky top-20">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" />
                Budget Summary
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isOverBudget ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}>
                {isOverBudget ? "Over Budget" : "On Track"}
              </span>
            </div>

            {/* Total Cost Counter */}
            <div className="space-y-1">
              <span className="text-xs text-slate-400">Estimated Total Cost</span>
              <div className={`text-2xl font-extrabold ${isOverBudget ? "text-rose-400" : "text-emerald-400"}`}>
                ${totalSpent}
                <span className="text-xs font-normal text-slate-400"> / ${activeTrip.budgetLimit}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mt-2 border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverBudget ? "bg-rose-500" : "bg-gradient-to-r from-indigo-500 to-emerald-400"
                  }`}
                  style={{ width: `${Math.min((totalSpent / activeTrip.budgetLimit) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-white/10">
              {Object.entries(categoryCosts).map(([cat, amount]) => (
                <div key={cat} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{cat}</span>
                  <span className="font-bold text-white">${amount}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentScreen("view")}
                className="btn btn-primary w-full text-xs py-2 px-4 shadow-sm"
              >
                <span>View Full Budget Report →</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Screen5_BuildItinerary;
