import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-200">
      <div
        className={`flex items-start justify-between p-4 rounded-2xl shadow-xl border ${
          isSuccess
            ? 'bg-emerald-950 text-white border-emerald-800'
            : isError
            ? 'bg-rose-950 text-white border-rose-800'
            : 'bg-slate-900 text-white border-slate-800'
        }`}
      >
        <div className="flex items-start space-x-3">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}
          <div>
            <h4 className="text-sm font-bold">
              {toast.title || (isSuccess ? 'Success' : isError ? 'Error' : 'Notification')}
            </h4>
            <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
              {toast.message}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

