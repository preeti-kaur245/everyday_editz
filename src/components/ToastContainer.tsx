import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#242424] text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2.5 border border-white/10 animate-in slide-in-from-bottom-2 duration-200"
        >
          {toast.type === 'info' ? (
            <Info className="w-4 h-4 text-[#D9A6A0] shrink-0" />
          ) : toast.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
