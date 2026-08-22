import { useState } from "react";
import { useTripContext } from "../context/TripContext";
import { X, Sparkles, Calendar, DollarSign, MapPin, ArrowRight } from "lucide-react";

const Screen4_TripWizard = () => {
  const { isWizardOpen, setIsWizardOpen, createNewTrip, cities } = useTripContext();

  const [title, setTitle] = useState("European Summer Tour");
  const [startPlace, setStartPlace] = useState("Paris");
  const [startDate, setStartDate] = useState("2026-06-10");
  const [endDate, setEndDate] = useState("2026-06-20");
  const [budgetLimit, setBudgetLimit] = useState(2500);

  if (!isWizardOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewTrip({
      title,
      startPlace,
      startDate,
      endDate,
      budgetLimit
    });
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel relative w-full max-w-lg space-y-7 rounded-2xl border border-white/20 p-5 shadow-2xl animate-fadeIn sm:p-7">
        {/* Close Button */}
        <button
          onClick={() => setIsWizardOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Create Your Trip
          </div>
          <h2 className="text-2xl font-extrabold text-white">Start Building Your Journey</h2>
          <p className="text-xs text-slate-400">Set your starting destination, dates, and target budget (saved to DB)</p>
        </div>

        {/* Guided Step Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Where are you going? */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Where are you going?
            </label>
            <select
              value={startPlace}
              onChange={(e) => setStartPlace(e.target.value)}
              className="input-field bg-[#080C14] text-white cursor-pointer"
            >
              {(cities || []).map((city) => (
                <option key={city.id} value={city.name} className="bg-[#080C14] text-white">
                  {city.name}, {city.country} ({city.costIndex})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: When are you travelling? */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              When are you travelling?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 block mb-1">Start Date</span>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-1">End Date</span>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Trip name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Trip Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. European Summer Tour"
              className="input-field"
            />
          </div>

          {/* Step 4: Budget limit */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Target Trip Budget ($ USD)
            </label>
            <input
              type="number"
              required
              min="100"
              step="50"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(Number(e.target.value))}
              className="input-field"
            />
          </div>

          {/* Submit Action Button */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => setIsWizardOpen(false)}
              className="btn btn-secondary text-xs"
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-primary text-xs py-2.5 px-5">
              <span>Save & Build Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Screen4_TripWizard;
