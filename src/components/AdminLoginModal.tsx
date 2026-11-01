import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { 
    isAdminLoginModalOpen, 
    setIsAdminLoginModalOpen, 
    adminLogin, 
    showToast 
  } = useStore();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('Please enter your admin master key.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await adminLogin(password, username);
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Authentication rejected. Verify credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#F7F5F0] rounded-3xl shadow-2xl border border-black/15 overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="bg-[#242424] px-6 py-4 flex items-center justify-between text-[#F7F5F0]">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-[#D9A6A0]" />
            <span className="font-bold text-xs uppercase tracking-wider">Admin Security Gateway</span>
          </div>

          <button
            onClick={() => setIsAdminLoginModalOpen(false)}
            className="p-1 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 bg-[#242424]/5 rounded-2xl flex items-center justify-center mx-auto text-[#242424] border border-black/10">
              <KeyRound className="w-6 h-6 text-[#536B57]" />
            </div>
            <h3 className="text-lg font-bold text-[#242424]">The Everyday Edit — Admin Console</h3>
            <p className="text-xs text-black/60">
              Protected operations: Google Sheets Hub, Prepaid Orders, Inventory & Claim Arbitration.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#242424] mb-1">
                Admin Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/15 focus:outline-hidden focus:ring-1 focus:ring-black font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#242424]">
                  Master Secret Password
                </label>
                <span className="text-[10px] text-black/40 font-mono">5 Attempts / 15m Lock</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/15 focus:outline-hidden focus:ring-1 focus:ring-black font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#242424] hover:bg-black text-[#F7F5F0] rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying Session...' : 'Authenticate & Open Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D9A6A0]" />
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="pt-4 border-t border-black/8 text-[11px] text-black/50 space-y-1">
            <div className="flex items-center space-x-1.5 font-medium text-black/70">
              <ShieldCheck className="w-3.5 h-3.5 text-[#536B57]" />
              <span>Cryptographic Session Tokens & Audit Logging</span>
            </div>
            <p>
              All admin actions (stock overrides, refunds, customer data exports) are cryptographically authenticated and appended to the permanent audit trail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
