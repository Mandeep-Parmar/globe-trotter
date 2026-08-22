import React, { useState } from "react";
import { useTripContext } from "../context/TripContext";
import { getDayActivityHours, MAX_DAILY_ACTIVITY_HOURS } from "../utils/timeCalculator";
import { X, Search, Sparkles, Clock, Plus, Check, MapPin, Star, AlertCircle } from "lucide-react";

const Screen8_ActivitySearch = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    cities,
    activities,
    activeTrip,
    addActivityToStop,
    searchTargetStopId
  } = useTripContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDay, setSelectedDay] = useState(1);
  const [addedActivityIds, setAddedActivityIds] = useState([]);

  if (!isSearchOpen || !activeTrip) return null;

  const categories = ["All", "Sightseeing", "Food", "Stay", "Transport"];

  // Find the target stop for activity addition
  const currentTargetStopId = searchTargetStopId || (activeTrip.stops && activeTrip.stops[0]?.id);
  const currentTargetStop = (activeTrip.stops || []).find((s) => s.id === currentTargetStopId) || activeTrip.stops[0];

  const targetCityName = currentTargetStop?.cityName || currentTargetStop?.city?.name || "";
  const targetCityId = currentTargetStop?.cityId || currentTargetStop?.city?.id;

  // HARD RULE 1: City-Specific Activity Filtering
  // Only activities belonging to that exact city can be shown and added to that stop!
  const cityFilteredActivities = (activities || []).filter((act) => {
    const actCityId = act.cityId || act.city?.id;
    const actCityName = act.cityName || act.city?.name || "";

    if (targetCityId && actCityId) {
      return actCityId === targetCityId;
    }
    if (targetCityName && actCityName) {
      return actCityName.toLowerCase() === targetCityName.toLowerCase();
    }
    return false;
  });

  // Additional user filters (Search text + Category tabs)
  const filteredActivities = cityFilteredActivities.filter((act) => {
    const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || act.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate current activity hours on selected day
  const currentDayActivityHours = getDayActivityHours(currentTargetStop?.activities || [], selectedDay);

  const handleAdd = (activity) => {
    if (!currentTargetStop) return;

    const success = addActivityToStop(currentTargetStop.id, activity, selectedDay);
    if (success) {
      setAddedActivityIds((prev) => [...prev, activity.id]);
      setTimeout(() => {
        setAddedActivityIds((prev) => prev.filter((id) => id !== activity.id));
      }, 2000);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-5xl h-[88vh] flex flex-col p-6 relative border border-white/20 shadow-2xl animate-fadeIn overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsSearchOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Drawer Header */}
        <div className="space-y-1 pb-3 border-b border-white/10 flex-shrink-0">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Intelligent Activity Discovery
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>Activities for</span>
                <span className="text-indigo-400 underline decoration-indigo-500/40">{targetCityName}</span>
              </h2>
              <p className="text-xs text-slate-400">Strictly filtered to {targetCityName} destination stop</p>
            </div>

            {/* Daily Capacity Meter */}
            <div className="bg-[#080C14] px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Day {selectedDay} Capacity</div>
                <div className="text-xs font-extrabold text-indigo-300">
                  {currentDayActivityHours}h / {MAX_DAILY_ACTIVITY_HOURS}h Max
                </div>
              </div>
              <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${currentDayActivityHours >= 10
                      ? "bg-rose-500"
                      : currentDayActivityHours >= 7
                        ? "bg-amber-500"
                        : "bg-indigo-500"
                    }`}
                  style={{ width: `${Math.min((currentDayActivityHours / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls & Day Selector */}
        <div className="py-3 space-y-3 flex-shrink-0 border-b border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${targetCityName} activities...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 py-1.5 text-xs"
              />
            </div>

            {/* Target Day Selector */}
            <div className="flex items-center gap-2 bg-[#080C14] px-3 py-1.5 rounded-xl border border-white/10">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs text-slate-400 font-semibold">Target Day:</span>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-indigo-400 border-none outline-none cursor-pointer"
              >
                <option value={1} className="bg-[#080C14] text-white">Day 1</option>
                <option value={2} className="bg-[#080C14] text-white">Day 2</option>
                <option value={3} className="bg-[#080C14] text-white">Day 3</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-[#080C14]/60 text-slate-400 hover:text-white"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Cards Scrollable Grid */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 glass-panel rounded-2xl border border-white/10 space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-500" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">No activities found for {targetCityName}</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Strict city isolation is active. Activities from other cities (e.g. Rome, Tokyo) cannot be shown in {targetCityName}.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredActivities.map((act) => {
                const isAdded = addedActivityIds.includes(act.id);
                const duration = act.durationHours || act.duration || 2;
                const cost = act.cost || act.estimatedCost || 0;

                return (
                  <div
                    key={act.id}
                    className="glass-card p-3.5 flex flex-col justify-between space-y-3 border border-white/10 hover:border-indigo-500/40 transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                        <img
                          src={act.imageUrl}
                          alt={act.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <span className={`badge badge-${act.category.toLowerCase()}`}>
                            {act.category}
                          </span>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-xs font-bold text-amber-400 border border-white/10 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          4.8
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="text-indigo-400 font-semibold flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {targetCityName}
                          </span>
                          <span className="flex items-center gap-1 text-slate-300 font-bold">
                            <Clock className="w-3 h-3 text-purple-400" />
                            {duration}h Duration
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">
                          {act.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                          {act.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-emerald-400">
                        ${cost}
                      </span>

                      <button
                        onClick={() => handleAdd(act)}
                        disabled={isAdded}
                        className={`btn text-xs py-1 px-3 transition-all ${isAdded
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "btn-primary shadow-sm"
                          }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added ✓</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Add ({duration}h)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-slate-400">
            {filteredActivities.length} activities in {targetCityName}
          </span>

          <button
            onClick={() => setIsSearchOpen(false)}
            className="btn btn-secondary text-xs py-1.5 px-4"
          >
            Done & Return to Builder
          </button>
        </div>
      </div>
    </div>
  );
};

export default Screen8_ActivitySearch;
