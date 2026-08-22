import { useState } from "react";
import { useTripContext } from "../context/TripContext";
import { X, Sparkles, Calendar, DollarSign, MapPin, ArrowRight, Image as ImageIcon } from "lucide-react";

const Screen4_TripWizard = () => {
  const { isWizardOpen, setIsWizardOpen, createNewTrip, cities } = useTripContext();

  const [title, setTitle] = useState("European Summer Tour");
  const [startPlace, setStartPlace] = useState("Paris");
  const [startDate, setStartDate] = useState("2026-06-10");
  const [endDate, setEndDate] = useState("2026-06-20");
  const [budgetLimit, setBudgetLimit] = useState(2500);
  const [coverUrl, setCoverUrl] = useState("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80");

  if (!isWizardOpen) return null;

  const presetCovers = [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewTrip({
      title,
      startPlace,
      startDate,
      endDate,
      budgetLimit,
      coverUrl
    });
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel relative w-full max-w-lg space-y-7 rounded-2xl border border-white/20 p-5 shadow-2xl animate-fadeIn sm:p-7 max-h-[90vh] overflow-y-auto">
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

          {/* Step 5: Trip Cover Image Selector (Step 3) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
              Trip Cover Photo (Optional)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {presetCovers.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCoverUrl(url)}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    coverUrl === url ? "border-indigo-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt={`Cover ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
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
