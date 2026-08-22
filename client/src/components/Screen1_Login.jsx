import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { KeyRound, Mail, Sparkles, ArrowRight, UserPlus, Eye, EyeOff, Globe } from "lucide-react";

const Screen1_Login = ({ onSwitchToRegister }) => {
  const { login, authError, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Email and Password are required.");
      return;
    }

    const res = await login(email, password);
    if (!res.success) {
      setFormError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080C14] px-4 py-12 relative overflow-hidden select-none">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[35rem] h-[35rem] bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="glass-panel w-full max-w-md p-8 border border-white/10 shadow-2xl relative z-10 animate-fadeIn space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/25 mb-2">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">GlobeTrotter</h1>
          <p className="text-xs text-slate-400">Empowering Personalized Multi-City Travel Planning</p>
        </div>

        {/* Form Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Welcome Back
          </div>
          <h2 className="text-xl font-bold text-white">Sign In to Your Workspace</h2>
        </div>

        {/* Errors */}
        {(formError || authError) && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-semibold leading-relaxed">
            {formError || authError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter registered email"
              className="input-field"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-purple-400" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="input-field pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-3 text-sm mt-6 font-bold shadow-lg shadow-indigo-500/20"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-white/5 text-center">
          <button
            onClick={onSwitchToRegister}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-all hover:underline"
          >
            <UserPlus className="w-4 h-4" />
            <span>Need an account? Register here</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Screen1_Login;
