import { useTripContext } from "../context/TripContext";
import { useAuth } from "../context/AuthContext";
import { Globe, Compass, Plus, MapPin, PieChart, Sparkles, Database, CheckCircle2, AlertCircle, User, RefreshCw, LogOut } from "lucide-react";

const Navbar = () => {
  const {
    currentScreen,
    setCurrentScreen,
    setIsWizardOpen,
    setIsSearchOpen,
    activeTrip,
    isDbConnected,
    toast,
    refreshData,
    isLoading
  } = useTripContext();

  const { user, logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080C14]/90 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex min-h-10 items-center justify-between gap-3">
          {/* Brand Logo & DB Health Badge */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setCurrentScreen("dashboard")}
              className="flex shrink-0 items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold leading-none tracking-tight text-white">
                  GlobeTrotter
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  MVP
                </span>
              </div>
            </div>

            {/* Live Database Status Indicator */}
            <div
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                isDbConnected
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-sm shadow-emerald-500/10"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/25 animate-pulse"
              }`}
              title={isDbConnected ? "Connected to Backend Database API (port 5000)" : "Connecting to Database API..."}
            >
              <Database className="w-3 h-3" />
              <span>{isDbConnected ? "DB Connected" : "Connecting..."}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isDbConnected ? "bg-emerald-400" : "bg-amber-400"}`}></span>
            </div>
          </div>

          {/* Minimalist Navigation */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.025] p-1">
            <button
              onClick={() => setCurrentScreen("dashboard")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                currentScreen === "dashboard"
                  ? "bg-indigo-500/15 text-indigo-300 shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Dashboard
            </button>

            <button
              onClick={() => setCurrentScreen("builder")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                currentScreen === "builder"
                  ? "bg-purple-500/15 text-purple-300 shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Itinerary Builder
              {activeTrip && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition-all hover:bg-white/5 hover:text-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Discover Activities
            </button>

            <button
              onClick={() => setCurrentScreen("view")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                currentScreen === "view"
                  ? "bg-emerald-500/15 text-emerald-300 shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              View & Budget
            </button>

            <button
              onClick={() => setCurrentScreen("profile")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                currentScreen === "profile"
                  ? "bg-indigo-500/15 text-indigo-300 shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <User className="w-3.5 h-3.5 animate-pulse" />
              My Profile
            </button>
          </nav>

          {/* User & Primary CTA Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sync Refresh Button */}
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 transition-all"
              title="Refresh Data from Database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
            </button>

            {/* User Pill */}
            {user && (
              <div 
                onClick={() => setCurrentScreen("profile")}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs cursor-pointer hover:bg-white/10 transition-colors"
              >
                <img
                  src={user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                  alt={user.firstName}
                  className="w-5 h-5 rounded-full object-cover border border-white/10"
                />
                <span className="font-semibold text-slate-300 hidden sm:inline">{user.firstName}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    logout();
                  }}
                  className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Plan Trip CTA */}
            <button
              onClick={() => setIsWizardOpen(true)}
              className="btn btn-primary text-xs py-2 px-3 sm:px-4 shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Plan Trip</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Dynamic Toast Notification */}
      {toast && (
        <div className="fixed top-16 right-4 z-50 animate-fadeIn transition-all duration-300">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl text-xs font-semibold ${
            toast.type === "success"
              ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/30 shadow-emerald-950/50"
              : toast.type === "error"
              ? "bg-rose-950/90 text-rose-200 border-rose-500/30 shadow-rose-950/50"
              : "bg-indigo-950/90 text-indigo-200 border-indigo-500/30 shadow-indigo-950/50"
          }`}>
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
