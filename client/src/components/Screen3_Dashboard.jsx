import React, { useState } from "react";
import { useTripContext } from "../context/TripContext";
import { Search, MapPin, Calendar, DollarSign, Sparkles, ArrowRight, Star, Compass, ShieldCheck, Trash2, Database } from "lucide-react";

const Screen3_Dashboard = () => {
  const { cities, trips, setIsWizardOpen, loadTrip, setCurrentScreen, addStopToTrip, deleteTrip, isDbConnected, dbStats } = useTripContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  const regions = ["All", "Europe", "Asia", "Americas"];

  const filteredCities = (cities || []).filter((city) => {
    const matchesSearch = (city.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (city.country || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === "All" || city.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111827] via-[#0F172A] to-[#0A0E18] border border-white/10 p-8 md:p-12 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Plan → Explore → Visualize → Budget
            </div>

            {isDbConnected && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Database className="w-3 h-3" />
                Live Database Active
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Empowering Personalized <span className="text-gradient">Travel Planning</span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Construct structured multi-city itineraries, discover top activities, auto-estimate budgets, and visualize day-by-day travel plans seamlessly.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setIsWizardOpen(true)}
              className="btn btn-primary text-sm py-3 px-6 shadow-lg shadow-indigo-500/25"
            >
              <span>Plan New Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {trips && trips.length > 0 && (
              <button
                onClick={() => loadTrip(trips[0].id)}
                className="btn btn-secondary text-sm py-3 px-6"
              >
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Open {trips[0].title}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Feature / Stats Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#0E1422]/80 border border-white/10 shadow-lg">
        <div className="flex items-center gap-3 p-2">
          <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">
              {dbStats?.totalCities || cities.length} Destinations
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">Multi-city stop support</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20 flex-shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">Auto Budgeting</h4>
            <p className="text-[11px] text-slate-400 leading-snug">Real-time cost breakdown</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/20 flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">
              {dbStats?.totalTrips || trips.length} Saved Trips
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">Day timelines & sync</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">
              {dbStats?.totalActivities || 19} Activities
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug">Live database catalog</p>
          </div>
        </div>
      </section>

      {/* Destination & Search Section */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">Popular Destinations</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-xs font-semibold text-slate-400 border border-white/10">
                {filteredCities.length} Destinations
              </span>
            </div>
            <p className="text-xs text-slate-400">Discover places and add them directly to your itinerary</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 py-2 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 bg-[#0E1422] p-1.5 rounded-xl border border-white/10 overflow-x-auto">
              {regions.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedRegion === region
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Cities Grid from DB */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <div
              key={city.id}
              className="glass-panel overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={city.bannerUrl}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1422] via-black/20 to-black/30"></div>
                
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white border border-white/10">
                    {city.country}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/30 backdrop-blur-md text-[11px] font-semibold text-indigo-300 border border-indigo-500/30">
                    {city.costIndex} Cost
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {city.popularity || city.rating || 4.8}
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md">{city.name}</h3>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {city.description}
                </p>

                <div className="pt-3 border-t border-white/10">
                  <button
                    onClick={() => {
                      addStopToTrip(city.name);
                      setCurrentScreen("builder");
                    }}
                    className="btn btn-secondary w-full text-xs py-2.5 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300 flex items-center justify-center gap-2 transition-all"
                  >
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>+ Add {city.name} to Trip</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Database Saved Itineraries Section */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">Saved Trips & Itineraries</h2>
            <p className="text-xs text-slate-400">Stored persistently in your database</p>
          </div>

          <button
            onClick={() => setIsWizardOpen(true)}
            className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <span>+ Create Another Trip</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(trips || []).map((trip) => (
            <div key={trip.id} className="glass-panel p-6 space-y-4 border border-white/10 hover:border-indigo-500/40 transition-all shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      {trip.status || "UPCOMING"} ITINERARY
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{trip.title}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold shrink-0">
                    ${trip.totalBudget || trip.budgetLimit || 2500} Budget
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{String(trip.startDate).split("T")[0]} → {String(trip.endDate).split("T")[0]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{(trip.stops || []).length} Stop{((trip.stops || []).length === 1) ? "" : "s"}</span>
                  </div>
                </div>

                {trip.stops && trip.stops.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {trip.stops.map((s, idx) => (
                      <span key={s.id || idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">
                        {s.cityName || s.city?.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => deleteTrip(trip.id)}
                  className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1.5 transition-colors p-1"
                  title="Delete trip from database"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <button
                  onClick={() => loadTrip(trip.id)}
                  className="btn btn-secondary text-xs py-2 px-4 hover:border-indigo-500/50 flex items-center gap-1.5"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-4 h-4 text-indigo-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Screen3_Dashboard;
