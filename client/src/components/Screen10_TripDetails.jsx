import React, { useState } from "react";
import { useTripContext } from "../context/TripContext";
import { getInterCityTravelHours } from "../data/travelMatrix";
import {
  getGlobalDaysCount,
  getGlobalDayActivityHours,
  MAX_DAILY_SCHEDULE_HOURS,
  SAFETY_BUFFER_HOURS,
  validateItineraryTime
} from "../utils/timeCalculator";
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  DollarSign,
  Printer,
  Share2,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Edit,
  Plus,
  Plane,
  Copy,
  List,
  Grid,
  Link as LinkIcon
} from "lucide-react";

const Screen10_TripDetails = () => {
  const {
    activeTrip,
    setCurrentScreen,
    calculateTotalCost,
    calculateCategoryCosts,
    openSearchForStop,
    loadTrip,
    showToast
  } = useTripContext();

  const [viewMode, setViewMode] = useState("list"); // "list" | "calendar"

  if (!activeTrip) {
    return (
      <div className="text-center py-20 text-slate-400">
        No active trip selected. Select a trip from My Trips.
      </div>
    );
  }

  const now = new Date();
  const start = new Date(activeTrip.startDate);
  const end = new Date(activeTrip.endDate);

  const status = end < now ? "COMPLETED" : start <= now && end >= now ? "ONGOING" : "UPCOMING";

  const validation = validateItineraryTime(activeTrip);
  const totalCost = calculateTotalCost();
  const categoryCosts = calculateCategoryCosts();
  const budgetLimit = activeTrip.budgetLimit || activeTrip.totalBudget || 2000;
  const isOverBudget = totalCost > budgetLimit;

  const totalGlobalDays = getGlobalDaysCount(activeTrip.startDate, activeTrip.endDate);
  const globalDaysArray = Array.from({ length: totalGlobalDays }, (_, i) => i + 1);

  // Copy Shareable URL Generator (Step 1)
  const handleCopyShareableLink = () => {
    const shareableUrl = `${window.location.origin}/?tripId=${activeTrip.id}`;
    navigator.clipboard.writeText(shareableUrl);
    showToast(`Shareable trip link copied to clipboard!`, "Link Copied", "success");
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 glass-panel border border-white/10 shadow-xl rounded-2xl">
        <div className="space-y-2">
          <button
            onClick={() => setCurrentScreen("my-trips")}
            className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to My Trips
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">{activeTrip.title}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
              status === "ONGOING"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                : status === "COMPLETED"
                ? "bg-slate-500/10 text-slate-400 border-slate-500/25"
                : "bg-indigo-500/10 text-indigo-400 border-indigo-500/25"
            }`}>
              {status}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            {activeTrip.description || `A ${totalGlobalDays}-day multi-city journey across ${(activeTrip.stops || []).length} destinations.`}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Shareable Link Generator (Step 1) */}
          <button
            onClick={handleCopyShareableLink}
            className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
            title="Copy Public Sharable Link"
          >
            <LinkIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>Share Link</span>
          </button>

          <button
            onClick={() => window.print()}
            className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {status !== "COMPLETED" ? (
            <button
              onClick={() => loadTrip(activeTrip.id)}
              className="btn btn-primary text-xs py-2.5 px-5 shadow-lg shadow-indigo-500/20 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Workspace</span>
            </button>
          ) : (
            <button
              onClick={() => showToast("Trip itinerary copied to your account!", "Trip Copied", "success")}
              className="btn btn-primary text-xs py-2.5 px-5 shadow-lg shadow-indigo-500/20 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Trip</span>
            </button>
          )}
        </div>
      </div>

      {/* 2-Column Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Full Master Timeline with View Mode Toggle (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 space-y-6 border border-white/10 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Full Trip Itinerary</h3>
                <p className="text-xs text-slate-400">
                  {totalGlobalDays} Days • {validation.availableHours}h Fixed Duration
                </p>
              </div>

              {/* View Mode Toggle (List vs Calendar Grid - Step 2) */}
              <div className="flex items-center gap-1 bg-[#080C14] p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    viewMode === "list"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List View</span>
                </button>

                <button
                  onClick={() => setViewMode("calendar")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    viewMode === "calendar"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Calendar View</span>
                </button>
              </div>
            </div>

            {/* List View Rendering */}
            {viewMode === "list" ? (
              <div className="space-y-6">
                {globalDaysArray.map((globalDayNum) => {
                  const activityHours = getGlobalDayActivityHours(activeTrip.stops, globalDayNum);
                  const stayHours = 8;
                  const totalDayScheduled = activityHours + stayHours;

                  return (
                    <div key={globalDayNum} className="space-y-4 p-4 rounded-xl bg-[#080C14] border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-white">DAY {globalDayNum}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-xs text-slate-400 font-semibold">{activeTrip.title}</span>
                        </div>

                        <div className="text-[11px] text-slate-400 font-semibold">
                          Scheduled: <strong className="text-indigo-300">{totalDayScheduled}h</strong> / 24h
                        </div>
                      </div>

                      <div className="space-y-3">
                        {(activeTrip.stops || []).map((stop, stopIdx) => {
                          const stopCityName = stop.cityName || stop.city?.name || "Destination";
                          const dayStopActivities = (stop.activities || []).filter(
                            (a) => (a.globalDayNumber || a.dayNumber || 1) === globalDayNum
                          );

                          if (dayStopActivities.length === 0) return null;

                          return (
                            <div key={stop.id || stopIdx} className="space-y-2">
                              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-indigo-400" />
                                {stopCityName}
                              </div>

                              <div className="space-y-2 pl-2 border-l-2 border-indigo-500/40">
                                {dayStopActivities.map((act) => (
                                  <div
                                    key={act.id}
                                    className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                                  >
                                    <div className="space-y-1">
                                      <span className={`badge badge-${(act.category || "Sightseeing").toLowerCase()}`}>
                                        {act.category || "Sightseeing"}
                                      </span>
                                      <h5 className="text-xs font-bold text-white">{act.customTitle || act.title}</h5>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className="text-xs font-extrabold text-emerald-400 block">${act.cost || act.estimatedCost || 0}</span>
                                      <span className="text-[10px] text-purple-300 font-semibold flex items-center justify-end gap-1">
                                        <Clock className="w-3 h-3" />
                                        {act.durationHours || 2}h
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}

                        {activityHours === 0 && (
                          <div className="text-xs text-slate-500 py-3 text-center border border-dashed border-white/5 rounded-lg">
                            Rest / Free Exploration Day
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Calendar Grid View Rendering (Step 2) */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {globalDaysArray.map((globalDayNum) => {
                  const activityHours = getGlobalDayActivityHours(activeTrip.stops, globalDayNum);

                  return (
                    <div
                      key={globalDayNum}
                      className="p-4 rounded-xl bg-[#080C14] border border-white/10 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-xs font-extrabold text-indigo-400">Day {globalDayNum}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{activityHours}h / 10h</span>
                        </div>

                        <div className="space-y-1.5 min-h-[100px]">
                          {(activeTrip.stops || []).map((stop) => {
                            const dayActivities = (stop.activities || []).filter(
                              (a) => (a.globalDayNumber || a.dayNumber || 1) === globalDayNum
                            );
                            if (dayActivities.length === 0) return null;

                            return dayActivities.map((act) => (
                              <div
                                key={act.id}
                                className="p-2 rounded bg-white/5 border border-white/5 text-[11px] space-y-0.5"
                              >
                                <span className="font-bold text-white block truncate">{act.customTitle || act.title}</span>
                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                  <span>{stop.cityName || stop.city?.name}</span>
                                  <span className="text-emerald-400 font-semibold">${act.cost || act.estimatedCost || 0}</span>
                                </div>
                              </div>
                            ));
                          })}

                          {activityHours === 0 && (
                            <div className="text-[11px] text-slate-500 italic py-6 text-center">
                              No Activities
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Sleep/Rest: 8h</span>
                        <span className="text-indigo-300 font-bold">Total: {activityHours + 8}h</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Financial Budget Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 space-y-6 border border-white/10 shadow-lg sticky top-24">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-4">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Financial Budget Overview
            </h3>

            <div className="p-4 rounded-xl bg-[#080C14] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Total Cost:</span>
                <span className={`text-xl font-extrabold ${isOverBudget ? "text-rose-400" : "text-emerald-400"}`}>
                  ${totalCost}
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isOverBudget ? "bg-rose-500" : "bg-emerald-500"}`}
                  style={{ width: `${Math.min((totalCost / budgetLimit) * 100, 100)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Budget Limit: ${budgetLimit}</span>
                <span className="font-bold">{isOverBudget ? "Over Budget" : `$${budgetLimit - totalCost} Left`}</span>
              </div>
            </div>

            {/* Category Expenses Breakdown */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Expenses by Category</h4>
              {Object.entries(categoryCosts).map(([cat, cost]) => {
                const percentage = totalCost > 0 ? Math.round((cost / totalCost) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{cat}</span>
                      <span className="text-white">${cost} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Screen10_TripDetails;
