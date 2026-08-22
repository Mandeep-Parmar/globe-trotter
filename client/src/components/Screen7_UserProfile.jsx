import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTripContext } from "../context/TripContext";
import { User, Mail, Phone, MapPin, Edit3, Calendar, Compass, Save, X, Plus, Trash2 } from "lucide-react";

const Screen7_UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const { trips, cities, loadSampleTrip, setCurrentScreen } = useTripContext();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [city, setCity] = useState(user?.city || "");
  const [country, setCountry] = useState(user?.country || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  if (!user) return null;

  // Filter trips belonging to this user
  const userTrips = trips.filter((t) => t.userId === user.id || !t.userId);

  const handleSave = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");

    if (!firstName || !lastName) {
      setEditError("First Name and Last Name are required.");
      return;
    }

    const payload = { firstName, lastName, phone, city, country, bio, avatarUrl };
    const res = await updateProfile(payload);
    if (res.success) {
      setEditSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setEditSuccess(""), 3000);
    } else {
      setEditError(res.message || "Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setPhone(user.phone || "");
    setCity(user.city || "");
    setCountry(user.country || "");
    setBio(user.bio || "");
    setAvatarUrl(user.avatarUrl || "");
    setIsEditing(false);
    setEditError("");
  };

  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  ];

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Page Title Header */}
      <div className="glass-panel p-6 border border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">User Profile & Account</h1>
          <p className="text-xs text-slate-400">Manage your credentials, destinations, and personal trips workspace</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Profile Card & Editing */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Profile Overview</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 hover:border-indigo-500/40 hover:text-indigo-400"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {editSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                {editSuccess}
              </div>
            )}

            {editError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-semibold">
                {editError}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                {/* Avatar Picker */}
                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                  <img src={avatarUrl} alt="Preview Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-300">Choose Profile Image</span>
                    <div className="flex items-center gap-2">
                      {avatars.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatarUrl(url)}
                          className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${
                            avatarUrl === url ? "border-indigo-500 scale-105" : "border-transparent opacity-60"
                          }`}
                        >
                          <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input-field py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input-field py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="input-field py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="input-field py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">Bio</label>
                  <textarea
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="input-field py-2 text-xs resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={handleCancel} className="btn btn-secondary text-xs py-1.5 px-3">
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                  <button type="submit" className="btn btn-primary text-xs py-1.5 px-4 shadow-sm">
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* User Card */}
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                    alt={user.firstName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/30"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">{user.firstName} {user.lastName}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>

                {/* Details List */}
                <div className="space-y-3.5 text-xs border-t border-white/5 pt-4">
                  {user.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                        <p className="text-white mt-0.5">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {(user.city || user.country) && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                        <p className="text-white mt-0.5">
                          {[user.city, user.country].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Compass className="w-4 h-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Travel Style / Bio</p>
                      <p className="text-slate-300 mt-0.5 leading-relaxed">
                        {user.bio || "No biography added yet. Complete your profile to share your travel style!"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 cols): Trips & Wishlist */}
        <div className="lg:col-span-7 space-y-6">
          {/* User Personal Trips (Screen 6 Subset) */}
          <div className="glass-panel p-6 border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              My Trips Workspace ({userTrips.length})
            </h2>

            {userTrips.length === 0 ? (
              <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/5 space-y-3">
                <p className="text-xs text-slate-400">You haven't built any multi-city itineraries yet.</p>
                <button
                  onClick={() => setCurrentScreen("dashboard")}
                  className="btn btn-secondary text-xs py-2"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Start New Trip</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
                {userTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4 hover:border-indigo-500/20 transition-all group"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        {trip.status || "UPCOMING"}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5 truncate">{trip.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {trip.stops?.length || 0} stops • {trip.startDate?.split("T")[0] || trip.startDate} to {trip.endDate?.split("T")[0] || trip.endDate}
                      </p>
                    </div>
                    <button
                      onClick={() => loadSampleTrip(trip.id)}
                      className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
                    >
                      <span>Open</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Cities / Destination Wishlist (Screen 7 Wishlist) */}
          <div className="glass-panel p-6 border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-400" />
              Saved Destinations Wishlist
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cities.slice(0, 3).map((city) => (
                <div
                  key={city.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 hover:border-purple-500/20 transition-all cursor-pointer"
                  onClick={() => setCurrentScreen("dashboard")}
                >
                  <img src={city.bannerUrl} alt={city.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{city.name}</h4>
                    <span className="text-[9px] text-slate-400">{city.country} • {city.costIndex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen7_UserProfile;
