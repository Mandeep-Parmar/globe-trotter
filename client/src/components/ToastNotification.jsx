import React, { useEffect } from "react";
import { Info, AlertTriangle, CheckCircle, XCircle, X } from "lucide-react";

const ToastNotification = ({ toast, onClose }) => {
  if (!toast) return null;

  const { type = "info", title, message, id } = toast;

  const typeStyles = {
    info: {
      bg: "bg-slate-900/95 border-indigo-500/40 text-indigo-300",
      icon: <Info className="w-5 h-5 text-indigo-400 shrink-0" />
    },
    success: {
      bg: "bg-slate-900/95 border-emerald-500/40 text-emerald-300",
      icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
    },
    warning: {
      bg: "bg-slate-900/95 border-amber-500/40 text-amber-300",
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
    },
    error: {
      bg: "bg-slate-900/95 border-rose-500/40 text-rose-300",
      icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
    }
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div className="fixed bottom-6 right-6 z-[2000] max-w-md w-full animate-fadeIn">
      <div className={`glass-panel p-4 rounded-xl border ${style.bg} shadow-2xl flex items-start gap-3 relative`}>
        {style.icon}
        <div className="flex-1 space-y-0.5 min-w-0 pr-4">
          {title && <h4 className="text-xs font-bold text-white leading-snug">{title}</h4>}
          <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
