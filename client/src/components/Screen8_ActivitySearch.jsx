import React, { useState } from "react";
import { useTripContext } from "../context/TripContext";
import { ACTIVITIES, CITIES } from "../data/mockData";
import { X, Search, Sparkles, Clock, Plus, Check, MapPin, Star } from "lucide-react";

const Screen8_ActivitySearch = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    activeTrip,
    addActivityToStop,
    searchTargetStopId
  } = useTripContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCityFilter, setSelectedCityFilter] = useState("All");
  const [targetStopId, setTargetStopId] = useState(searchTargetStopId || (activeTrip?.stops[0]?.id));
  const [addedActivityIds, setAddedActivityIds] = useState([]);

  if (!isSearchOpen) return null;

  const categories = ["All", "Sightseeing", "Food", "Stay", "Transport"];

  // Filtered Activities
  const filteredActivities = ACTIVITIES.filter((act) => {
    const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || act.category === selectedCategory;
    const matchesCity = selectedCityFilter === "All" || act.cityName.toLowerCase() === selectedCityFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesCity;
  });

  const handleAdd = (activity) => {
    const activeStop = targetStopId || activeTrip?.stops[0]?.id;
    if (!activeStop) return;

    addActivityToStop(activeStop, activity, 1);
    setAddedActivityIds((prev) => [...prev, activity.id]);

    setTimeout(() => {
      setAddedActivityIds((prev) => prev.filter((id) => id !== activity.id));
    }, 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-5xl h-[85vh] flex flex-col p-6 relative border border-white/20 shadow-2xl animate-fadeIn overflow-hidden">
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
            Activity Discovery Engine
          </div>
          <h2 className="text-xl font-extrabold text-white">Discover & Add Activities</h2>
          <p className="text-xs text-slate-400">Search sightseeing, dining, stays, and transport</p>
        </div>

        {/* Filter Controls Bar */}
        <div className="py-3 space-y-3 flex-shrink-0 border-b border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 py-1.5 text-xs"
              />
            </div>

            {/* Target Stop Selector */}
            {activeTrip && activeTrip.stops.length > 0 && (
              <div className="flex items-center gap-2 bg-[#080C14] px-3 py-1.5 rounded-xl border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs text-slate-400 font-semibold">Assign to Stop:</span>
                <select
                  value={targetStopId || activeTrip.stops[0].id}
                  onChange={(e) => setTargetStopId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-indigo-400 border-none outline-none cursor-pointer"
                >
                  {activeTrip.stops.map((stop) => (
                    <option key={stop.id} value={stop.id} className="bg-[#080C14] text-white">
                      {stop.cityName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActivities.map((act) => {
              const isAdded = addedActivityIds.includes(act.id);

              return (
                <div
                  key={act.id}
                  className="glass-card p-3.5 flex flex-col justify-between space-y-3 border border-white/10 hover:border-indigo-500/40 transition-all"
                >
                  <div className="space-y-2.5">
                    {/* Image Aspect 16:10 */}
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
                          {act.cityName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {act.durationHours}h
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">
                        {act.title}
                      </h4>
                    </div>
                  </div>

                  {/* Card Footer: Price & Add Button */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-emerald-400">${act.cost}</span>

                    <button
                      onClick={() => handleAdd(act)}
                      disabled={isAdded}
                      className={`btn text-xs py-1 px-3 transition-all ${
                        isAdded
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
                          <span>+ Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-slate-400">
            {filteredActivities.length} activities available
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
