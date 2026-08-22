import { useTripContext } from "../context/TripContext";
import { Sparkles, Calendar, MapPin, ArrowLeft, Printer, Clock, Tag } from "lucide-react";

const Screen9_ItineraryViewBudget = () => {
  const { activeTrip, setCurrentScreen, calculateTotalCost, calculateCategoryCosts } = useTripContext();

  if (!activeTrip) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white">No Active Trip Selected</h2>
        <button onClick={() => setCurrentScreen("dashboard")} className="btn btn-primary mt-4">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const totalSpent = calculateTotalCost();
  const categoryCosts = calculateCategoryCosts();
  const isOverBudget = totalSpent > activeTrip.budgetLimit;

  // Flatten all activities with stop context
  const allActivities = activeTrip.stops.flatMap((stop) =>
    stop.activities.map((act) => ({ ...act, cityName: stop.cityName }))
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-16">
      {/* Top Header Card */}
      <div className="glass-panel flex flex-col justify-between gap-6 rounded-2xl border border-white/10 p-5 sm:p-7 md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Final Trip Showcase
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">{activeTrip.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1 text-indigo-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              {activeTrip.stops.map((s) => s.cityName).join(" → ")}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {activeTrip.startDate} — {activeTrip.endDate}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentScreen("builder")}
            className="btn btn-secondary text-xs py-2 px-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Edit Plan</span>
          </button>

          <button
            onClick={() => window.print()}
            className="btn btn-primary text-xs py-2 px-4 shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export / Print</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Showcase Structure */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 xl:gap-6">
        
        {/* Left Column (8 cols): Your Itinerary */}
        <div className="space-y-4 lg:col-span-8">
          <div className="glass-panel space-y-7 rounded-2xl border border-white/10 p-5 sm:p-7">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
              YOUR ITINERARY
            </h2>

            {allActivities.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">
                No activities added to this itinerary yet.
              </p>
            ) : (
              <div className="space-y-7">
                {activeTrip.stops.map((stop) => (
                  <div key={stop.id} className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-indigo-400 border-b border-white/5 pb-1">
                      <MapPin className="w-4 h-4" />
                      <span>{stop.cityName} Section</span>
                    </div>

                    <div className="space-y-3 sm:pl-2">
                      {stop.activities.map((act) => (
                        <div
                          key={act.id}
                          className="glass-card flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-[#080C14]/50 p-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`badge badge-${act.category.toLowerCase()}`}>
                                {act.category}
                              </span>
                              <h4 className="text-xs font-bold text-white">{act.title}</h4>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {act.durationHours} hours
                              </span>
                              <span className="flex items-center gap-1">
                                <Tag className="w-3 h-3 text-slate-500" />
                                Day {act.dayNumber || 1}
                              </span>
                            </div>
                          </div>

                          <div className="text-sm font-extrabold text-emerald-400">
                            ${act.cost}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Trip Budget Breakdown */}
        <div className="space-y-4 lg:col-span-4">
          <div className="glass-panel sticky top-20 space-y-6 rounded-2xl border border-white/10 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
              TRIP BUDGET
            </h2>

            {/* Total Budget Display */}
            <div className="space-y-1">
              <span className="text-xs text-slate-400">Total Estimated Spend</span>
              <div className={`text-3xl font-extrabold ${isOverBudget ? "text-rose-400" : "text-emerald-400"}`}>
                ${totalSpent}
              </div>
              <p className="text-xs text-slate-400">
                of <span className="font-semibold text-white">${activeTrip.budgetLimit}</span> budget limit
              </p>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden mt-3 border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverBudget ? "bg-rose-500" : "bg-gradient-to-r from-indigo-500 to-emerald-400"
                  }`}
                  style={{ width: `${Math.min((totalSpent / activeTrip.budgetLimit) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Category Expenses Stack */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Cost Breakdown
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Transport</span>
                  <span className="font-bold text-white">${categoryCosts.Transport || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Accommodation (Stay)</span>
                  <span className="font-bold text-white">${categoryCosts.Stay || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Activities</span>
                  <span className="font-bold text-white">${categoryCosts.Sightseeing || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Food & Dining</span>
                  <span className="font-bold text-white">${categoryCosts.Food || 0}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-400">
                Auto-calculated in real time
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Screen9_ItineraryViewBudget;
