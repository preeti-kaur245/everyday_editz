import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, LogIn, Store } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AdminAccessDeniedPageProps {
  onNavigateHome: () => void;
  onNavigateToLogin: () => void;
}

export const AdminAccessDeniedPage: React.FC<AdminAccessDeniedPageProps> = ({
  onNavigateHome,
  onNavigateToLogin,
}) => {
  const { currentCustomer, adminLogout } = useStore();

  const handleSignOutCustomerAndGoLogin = () => {
    // If a customer is logged in, clear customer session and route to admin login
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('edz_customer_token');
      localStorage.removeItem('edz_customer_token');
      window.history.pushState(null, '', '/admin/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="min-h-screen bg-[#1F2022] text-[#F7F5F0] flex flex-col justify-between selection:bg-[#D9A6A0]/30 selection:text-white p-6 sm:p-12 font-sans">
      
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-8 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold">
              Security Notice · 403 Forbidden
            </div>
            <div className="text-sm font-bold text-white tracking-tight">
              The Everyday Edit — Administrative Gateway
            </div>
          </div>
        </div>

        <button
          onClick={onNavigateHome}
          className="text-xs text-white/60 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </button>
      </div>

      {/* Main Denial Card */}
      <div className="max-w-lg w-full mx-auto my-12 bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-300 font-mono text-[11px] font-bold uppercase tracking-wider">
            Access Denied · Role Insufficient
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
            Administrative Privileges Required
          </h1>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed mt-2">
            Your active session is identified as a customer account
            {currentCustomer?.email ? (
              <strong className="text-white block mt-1 font-mono text-xs">({currentCustomer.email})</strong>
            ) : null}.
          </p>
        </div>

        <div className="bg-black/30 p-4 rounded-2xl border border-white/5 text-left text-xs text-white/70 space-y-2">
          <div className="font-semibold text-white/90 flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-[#D9A6A0]" />
            <span>Strict RBAC Security Policy</span>
          </div>
          <p className="text-[11px] leading-relaxed text-white/60">
            Administrative dashboards, customer databases, supplier purchase costs, inventory management, and store settings are strictly restricted to verified administrators. Ordinary customer accounts cannot register for or access administrative privileges.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onNavigateHome}
            className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </button>

          <button
            onClick={handleSignOutCustomerAndGoLogin}
            className="flex-1 py-3 px-4 bg-[#D9A6A0] hover:bg-[#c9958f] text-[#242424] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Admin Sign In</span>
          </button>
        </div>

        <div className="text-[10px] font-mono text-white/40 pt-2">
          Incident timestamp logged in server audit trail.
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-white/40 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px]">
        <span>The Everyday Edit · Operations by Raftaar Solutions</span>
        <span>Secure Session Enforcement · Zero Trust</span>
      </div>

    </div>
  );
};

