import React, { useState } from "react";
import { useTripContext } from "../context/TripContext";
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  ArrowRight,
  Sparkles,
  Trash2,
  Edit,
  Eye,
  CheckCircle2
} from "lucide-react";

const Screen6_MyTrips = () => {
  const { trips, loadTrip, openTripDetails, deleteTrip, setIsWizardOpen, setCurrentScreen } = useTripContext();
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Upcoming", "Ongoing", "Completed"];

  const now = new Date();

  // Dynamic Status Calculator Function (Rule 6)
  const getTripStatus = (trip) => {
    if (!trip.startDate || !trip.endDate) return "UPCOMING";
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    if (end < now) return "COMPLETED";
    if (start <= now && end >= now) return "ONGOING";
    return "UPCOMING";
  };

  // Filter trips based on selected tab
  const filteredTrips = (trips || []).filter((trip) => {
    const status = getTripStatus(trip);
    if (activeTab === "All") return true;
    return status.toUpperCase() === activeTab.toUpperCase();
  });

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "ONGOING":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 animate-pulse";
      case "COMPLETED":
        return "bg-slate-500/10 text-slate-400 border-slate-500/25";
      default:
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/25";
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 glass-panel border border-white/10 shadow-xl rounded-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Travel Portfolio
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">My Travel Itineraries</h1>
          <p className="text-xs text-slate-400">Manage all your upcoming, ongoing, and past multi-city trips</p>
        </div>

        <button
          onClick={() => setIsWizardOpen(true)}
          className="btn btn-primary text-xs py-2.5 px-5 shadow-lg shadow-indigo-500/25 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {tabs.map((tab) => {
          const count = tab === "All"
            ? (trips || []).length
            : (trips || []).filter((t) => getTripStatus(t).toUpperCase() === tab.toUpperCase()).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{tab} Trips</span>
              <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-bold">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-2xl border border-white/10 p-8 space-y-4">
          <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No {activeTab} Trips Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You don't have any trips matching the "{activeTab}" filter. Click below to start planning!
            </p>
          </div>
          <button
            onClick={() => setIsWizardOpen(true)}
            className="btn btn-primary text-xs py-2 px-4 shadow-md shadow-indigo-500/20 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Trip</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const status = getTripStatus(trip);
            const stopsCount = (trip.stops || []).length;
            const totalActivitiesCount = (trip.stops || []).reduce(
              (sum, s) => sum + (s.activities || []).length,
              0
            );

            const cityNames = (trip.stops || [])
              .map((s) => s.cityName || s.city?.name)
              .filter(Boolean)
              .join(" → ");

            return (
              <div
                key={trip.id}
                className="glass-panel overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                {/* Trip Banner Image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={
                      trip.coverUrl ||
                      trip.stops?.[0]?.city?.bannerUrl ||
                      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1422] via-black/30 to-black/40"></div>

                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border tracking-wider backdrop-blur-md ${getStatusBadgeStyle(status)}`}>
                      {status}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-extrabold border border-emerald-500/30">
                    ${trip.totalBudget || trip.budgetLimit || 2000} Budget
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white leading-snug drop-shadow-md">
                      {trip.title}
                    </h3>
                  </div>
                </div>

                {/* Trip Info Details */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>
                        {String(trip.startDate).split("T")[0]} → {String(trip.endDate).split("T")[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300 font-semibold">
                      <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="truncate">{cityNames || `${stopsCount} Destinations`}</span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span>{stopsCount} City Stop{stopsCount === 1 ? "" : "s"}</span>
                      <span>•</span>
                      <span>{totalActivitiesCount} Activities</span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="text-xs text-slate-500 hover:text-rose-400 p-1 flex items-center gap-1 transition-colors"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openTripDetails(trip.id)}
                        className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Details</span>
                      </button>

                      {status !== "COMPLETED" && (
                        <button
                          onClick={() => loadTrip(trip.id)}
                          className="btn btn-primary text-xs py-1.5 px-3 shadow-md shadow-indigo-500/20 flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Builder</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Screen6_MyTrips;
