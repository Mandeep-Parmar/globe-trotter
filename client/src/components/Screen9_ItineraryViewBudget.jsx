import React from "react";
import { useTripContext } from "../context/TripContext";
import { getInterCityTravelHours } from "../data/travelMatrix";
import {
  getDayActivityHours,
  MAX_DAILY_ACTIVITY_HOURS,
  MAX_DAILY_SCHEDULE_HOURS,
  SAFETY_BUFFER_HOURS,
  validateItineraryTime
} from "../utils/timeCalculator";
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Printer,
  Share2,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Plane
} from "lucide-react";

const Screen9_ItineraryViewBudget = () => {
  const { activeTrip, setCurrentScreen, calculateTotalCost, calculateCategoryCosts } = useTripContext();

  if (!activeTrip) {
    return (
      <div className="text-center py-20 text-slate-400">
        No active trip to display. Please select or create a trip first.
      </div>
    );
  }

  const validation = validateItineraryTime(activeTrip);
  const totalCost = calculateTotalCost();
  const categoryCosts = calculateCategoryCosts();
  const budgetLimit = activeTrip.budgetLimit || activeTrip.totalBudget || 2000;
  const isOverBudget = totalCost > budgetLimit;

  return (
    <div className="space-y-8 pb-24">
      {/* View Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel border border-white/10 shadow-xl rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentScreen("builder")}
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Builder Workspace
            </button>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">{activeTrip.title}</h1>
          <p className="text-xs text-slate-400">Final Itinerary Plan & Financial Budget Analytics</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="btn btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Itinerary</span>
          </button>

          <button
            onClick={() => alert("Shareable itinerary link copied to clipboard!")}
            className="btn btn-primary text-xs py-2 px-4 shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Plan</span>
          </button>
        </div>
      </div>

      {/* 2-Column Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Itinerary Timeline Showcase (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {(activeTrip.stops || []).map((stop, stopIdx) => {
            const stopCityName = stop.cityName || stop.city?.name || "Destination";
            const stopActivities = stop.activities || [];
            const nextStop = activeTrip.stops[stopIdx + 1];
            const nextCityName = nextStop ? (nextStop.cityName || nextStop.city?.name) : null;
            const travelHours = nextCityName ? getInterCityTravelHours(stopCityName, nextCityName) : 0;

            const days = [1, 2, 3];

            return (
              <div key={stop.id || stopIdx} className="glass-panel p-6 space-y-6 border border-white/10 shadow-lg">
                {/* Stop Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold text-sm">
                      Stop {stopIdx + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{stopCityName}</h3>
                      <p className="text-xs text-slate-400">{stopActivities.length} Scheduled Activities</p>
                    </div>
                  </div>
                </div>

                {/* Day-by-Day Timeline */}
                <div className="space-y-6">
                  {days.map((dayNum) => {
                    const dayActivities = stopActivities.filter((a) => (a.dayNumber || 1) === dayNum);
                    const activityHours = getDayActivityHours(stopActivities, dayNum);
                    const stayHours = 8; // Overnight stay constant
                    const totalDayScheduled = activityHours + stayHours;
                    const remainingDayHours = Math.max(MAX_DAILY_SCHEDULE_HOURS - totalDayScheduled, 0);

                    return (
                      <div key={dayNum} className="space-y-3">
                        <div className="flex items-center justify-between bg-[#080C14] px-4 py-2 rounded-xl border border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-white">DAY {dayNum}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-xs text-slate-400 font-semibold">{dayActivities.length} Activities</span>
                          </div>

                          <div className="text-[11px] text-slate-400 font-semibold">
                            Used: <strong className="text-indigo-300">{totalDayScheduled}h</strong> / 24h ({remainingDayHours}h Free)
                          </div>
                        </div>

                        {/* Daily Breakdown Metrics Card */}
                        <div className="grid grid-cols-4 gap-2 text-center p-2 rounded-lg bg-white/5 text-[11px] text-slate-300">
                          <div>
                            <span className="text-slate-500 block text-[9px]">ACTIVITIES</span>
                            <strong className="text-indigo-400">{activityHours}h</strong> / 10h
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px]">TRAVEL</span>
                            <strong className="text-purple-400">{stopIdx > 0 && dayNum === 1 ? travelHours : 0}h</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px]">OVERNIGHT</span>
                            <strong className="text-sky-400">{stayHours}h</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px]">REMAINING</span>
                            <strong className="text-emerald-400">{remainingDayHours}h</strong>
                          </div>
                        </div>

                        {/* Day Activities List */}
                        {dayActivities.length === 0 ? (
                          <div className="text-xs text-slate-500 py-3 text-center border border-dashed border-white/5 rounded-lg">
                            Rest / Free Exploration Day
                          </div>
                        ) : (
                          <div className="space-y-2 pl-2 border-l-2 border-indigo-500/40">
                            {dayActivities.map((act) => (
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
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Inter-City Travel Duration Connector */}
                {nextCityName && (
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs text-indigo-300 font-semibold">
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-indigo-400" />
                      <span>Inter-City Travel to {nextCityName}</span>
                    </div>
                    <span>Estimated Duration: {travelHours} Hours</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Financial Cost Breakdown & Constraints (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 space-y-6 border border-white/10 shadow-lg sticky top-24">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-4">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Financial Cost Breakdown
            </h3>

            {/* Total Spend vs Target Budget */}
            <div className="p-4 rounded-xl bg-[#080C14] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Total Estimated Expenses:</span>
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
                <span>Target Budget Limit: ${budgetLimit}</span>
                <span className="font-bold">{isOverBudget ? "Over Budget" : `$${budgetLimit - totalCost} Remaining`}</span>
              </div>
            </div>

            {/* Category Expenses Breakdown */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Expense Categories</h4>
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

            {/* Constraints & Safety Buffer Metrics */}
            <div className="p-4 rounded-xl bg-[#080C14] border border-white/10 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Schedule & Buffer Validation</span>
                {validation.isBufferPreserved ? (
                  <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                    <CheckCircle className="w-3 h-3" /> Valid
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3 h-3" /> Buffer Alert
                  </span>
                )}
              </h4>

              <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                <div className="flex justify-between">
                  <span>Available Trip Hours:</span>
                  <strong className="text-white">{validation.availableHours}h</strong>
                </div>
                <div className="flex justify-between">
                  <span>Activities Scheduled:</span>
                  <strong className="text-indigo-300">{validation.totalActivityHours}h</strong>
                </div>
                <div className="flex justify-between">
                  <span>Inter-City Travel:</span>
                  <strong className="text-purple-300">{validation.totalTravelHours}h</strong>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-1.5 font-bold text-white">
                  <span>Protected Safety Buffer:</span>
                  <span className={validation.remainingHours < SAFETY_BUFFER_HOURS ? "text-amber-400" : "text-emerald-400"}>
                    {validation.remainingHours}h / {SAFETY_BUFFER_HOURS}h Minimum
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

export default Screen9_ItineraryViewBudget;
