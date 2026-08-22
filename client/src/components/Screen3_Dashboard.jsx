import { useState } from "react";
import { useTripContext } from "../context/TripContext";
import { CITIES, SAMPLE_TRIPS } from "../data/mockData";
import { Search, MapPin, Calendar, DollarSign, Sparkles, ArrowRight, Star, Compass, ShieldCheck } from "lucide-react";

const Screen3_Dashboard = () => {
  const { setIsWizardOpen, loadSampleTrip, setCurrentScreen, addStopToTrip } = useTripContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  const regions = ["All", "Europe", "Asia", "Americas"];

  const filteredCities = CITIES.filter((city) => {
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          city.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === "All" || city.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-400/15 bg-gradient-to-br from-[#17203a] via-[#10182a] to-[#0A0E18] p-6 shadow-2xl sm:p-8 md:p-10">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            Plan → Explore → Visualize → Budget
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Plan smarter. <span className="text-gradient">Travel farther.</span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Keep every stop, activity, and expense together in one simple travel workspace.
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

            <button
              onClick={() => loadSampleTrip("trip-sample-1")}
              className="btn btn-secondary text-sm py-3 px-6"
            >
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Explore Euro Sample Demo</span>
            </button>
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-black/15 p-4 backdrop-blur-sm">
          <div className="border-b border-white/10 pb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-300">One workspace</p>
            <p className="mt-1 text-sm font-semibold text-white">From idea to itinerary</p>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Destinations</span><span className="font-bold text-white">Curated</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Budget tracking</span><span className="font-bold text-emerald-300">Live</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Daily agenda</span><span className="font-bold text-sky-300">Organized</span>
          </div>
        </div>
        </div>
      </section>

      {/* Feature Strip (Compact Benefit Section) */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">Multi-City Stops</h4>
            <p className="text-[11px] text-slate-400 leading-snug">Organize multi-stop journeys</p>
          </div>
        </div>

        <div className="glass-panel flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5">
          <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20 flex-shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">Auto Budgeting</h4>
            <p className="text-[11px] text-slate-400 leading-snug">Real-time cost breakdown</p>
          </div>
        </div>

        <div className="glass-panel flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5">
          <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/20 flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">Day Timelines</h4>
            <p className="text-[11px] text-slate-400 leading-snug">Structured daily plans</p>
          </div>
        </div>

        <div className="glass-panel flex items-center gap-3 p-4 transition-transform hover:-translate-y-0.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">Real-Time Search</h4>
            <p className="text-[11px] text-slate-400 leading-snug">Filtered activity catalog</p>
          </div>
        </div>
      </section>

      {/* Destination & Search Section */}
      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-5 border-b border-white/[0.08] pb-5 lg:flex-row lg:items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">Popular Destinations</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-xs font-semibold text-slate-400 border border-white/10">
                {filteredCities.length} Destinations
              </span>
            </div>
            <p className="text-xs text-slate-400">Discover places and include them in your itinerary</p>
          </div>

          {/* Search Input & Spaced Filter Pills */}
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

            {/* Filter Pills with explicit spacing */}
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

        {/* Premium Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <div
              key={city.id}
              className="glass-panel overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              {/* Image Aspect Ratio 16:10 with Dark Bottom Gradient */}
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
                  {city.rating}
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md">{city.name}</h3>
                </div>
              </div>

              {/* Card Body */}
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

      {/* Featured Community Itineraries */}
      <section className="space-y-5 pt-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Featured Itineraries</h2>
          <p className="text-xs text-slate-400">Pre-built multi-city plans ready to inspect and customize</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_TRIPS.map((trip) => (
            <div key={trip.id} className="glass-panel p-6 space-y-4 border border-white/10 hover:border-indigo-500/40 transition-all shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Sample Itinerary</span>
                  <h3 className="text-lg font-bold text-white mt-1">{trip.title}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  ${trip.budgetLimit} Budget
                </span>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>{trip.startDate} → {trip.endDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>{trip.stops.length} Cities</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => loadSampleTrip(trip.id)}
                  className="btn btn-secondary text-xs py-2 px-4 hover:border-indigo-500/50"
                >
                  <span>Explore Plan</span>
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
