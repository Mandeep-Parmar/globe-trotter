import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Sparkles, ArrowRight, UserPlus, MapPin, Phone, Mail, KeyRound, Globe, User, Edit3 } from "lucide-react";

const Screen2_Register = ({ onSwitchToLogin }) => {
  const { register, authError, isLoading } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
  
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!firstName || !lastName || !email || !password) {
      setFormError("First Name, Last Name, Email, and Password are required.");
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      password,
      phone,
      city,
      country,
      bio,
      avatarUrl
    };

    const res = await register(payload);
    if (!res.success) {
      setFormError(res.message);
    }
  };

  // List of pre-defined traveler avatars that user can select
  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080C14] px-4 py-12 relative overflow-hidden select-none">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[35rem] h-[35rem] bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="glass-panel w-full max-w-2xl p-8 border border-white/10 shadow-2xl relative z-10 animate-fadeIn space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">GlobeTrotter</h1>
              <p className="text-[10px] text-slate-400">Join the Personalized Travel Planning Ecosystem</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Create Account
          </div>
        </div>

        {/* Errors */}
        {(formError || authError) && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-semibold leading-relaxed">
            {formError || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Selector */}
          <div className="flex flex-col items-center sm:flex-row gap-6 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="relative">
              <img
                src={avatarUrl}
                alt="Selected Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
              />
              <div className="absolute bottom-0 right-0 p-1 bg-indigo-600 rounded-full text-white border border-[#080C14]">
                <Edit3 className="w-3 h-3" />
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300">Choose Profile Picture</span>
              <div className="flex items-center gap-3">
                {avatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                      avatarUrl === url ? "border-indigo-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Alex"
                className="input-field"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Traveler"
                className="input-field"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex@example.com"
                className="input-field"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create secure password"
                className="input-field"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 019-9234"
                className="input-field"
              />
            </div>

            {/* Location (City & Country) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Rome"
                  className="input-field"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Italy"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Bio / Additional Info */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Additional Information (Bio)</label>
            <textarea
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your travel style, destinations you love, or what you hope to explore..."
              className="input-field resize-none"
            ></textarea>
          </div>

          {/* Register Action Buttons */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="btn btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary text-xs py-2.5 px-6 font-bold shadow-md"
            >
              {isLoading ? (
                <span>Registering User...</span>
              ) : (
                <>
                  <span>Register User</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-white/5 text-center">
          <button
            onClick={onSwitchToLogin}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-all hover:underline"
          >
            <UserPlus className="w-4 h-4" />
            <span>Already have an account? Sign In here</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Screen2_Register;
