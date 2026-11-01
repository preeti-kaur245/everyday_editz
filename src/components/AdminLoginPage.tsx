import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  Store,
  CheckCircle2,
  RefreshCw,
  Mail,
  Building
} from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: (targetTab?: string) => void;
  onNavigateHome: () => void;
  redirectTarget?: string;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigateHome,
  redirectTarget,
}) => {
  const { adminLogin, showToast, settings } = useStore();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password Recovery state
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('manpreetkaurdeveloper2@gmail.com');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'reset'>('request');
  const [recoverySuccessMsg, setRecoverySuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('Please enter your administrator password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await adminLogin(password, username);
    setIsLoading(false);

    if (res.success) {
      showToast('Admin session verified successfully', 'success');
      onLoginSuccess(redirectTarget);
    } else {
      setErrorMessage(res.error || 'Authentication rejected. Verify credentials.');
    }
  };

  const handleRequestRecoveryToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.trim() }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setRecoverySuccessMsg(data.message || 'Recovery instructions and token generated.');
        if (data.token) {
          // In development/local test mode, populate token for convenience
          setRecoveryToken(data.token);
        }
        setRecoveryStep('reset');
      } else {
        setErrorMessage(data.error || 'Unable to process recovery request.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Network error during password recovery.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryToken.trim() || !newPassword.trim()) {
      setErrorMessage('Both recovery token and new password are required.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: recoveryToken.trim(), newPassword: newPassword.trim() }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        showToast('Password reset successfully! Please sign in with your new password.', 'success');
        setIsRecoveryMode(false);
        setRecoveryStep('request');
        setPassword('');
        setRecoverySuccessMsg(null);
      } else {
        setErrorMessage(data.error || 'Password reset failed. Token may be invalid or expired.');
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Failed to connect to password reset server.');
    }
  };

  const brandName = settings.brandName || 'The Everyday Edit';
  const businessName = settings.businessName || 'Raftaar Solutions';

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#242424] flex flex-col justify-between selection:bg-[#D9A6A0]/30 selection:text-[#242424] p-4 sm:p-8 font-sans">
      
      {/* Top Navbar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-black/8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#242424] text-white flex items-center justify-center font-bold text-xs tracking-wider">
            EE
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#536B57] font-semibold">
              Administrative Console
            </div>
            <div className="text-sm font-bold text-[#242424] tracking-tight">
              {brandName}
            </div>
          </div>
        </div>

        <button
          onClick={onNavigateHome}
          className="text-xs text-black/70 hover:text-black flex items-center space-x-1.5 transition-colors cursor-pointer py-1.5 px-3 rounded-lg bg-white border border-black/10 hover:border-black/25 shadow-xs"
        >
          <Store className="w-3.5 h-3.5 text-[#536B57]" />
          <span>Return to Storefront</span>
        </button>
      </div>

      {/* Main Gateway Card */}
      <div className="max-w-md w-full mx-auto my-8 bg-white border border-black/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Card Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 bg-[#242424] text-[#D9A6A0] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#242424] tracking-tight">
            {isRecoveryMode ? 'Admin Password Recovery' : 'Admin Security Gateway'}
          </h1>
          <p className="text-xs text-black/60 leading-relaxed max-w-xs mx-auto">
            {isRecoveryMode 
              ? 'Secure cryptographic password recovery for authorized administrative accounts.'
              : 'Restricted administrative access. Authenticate to manage Google Sheets, orders, inventory, and suppliers.'
            }
          </p>
        </div>

        {/* Operational Entity Notice */}
        <div className="px-3 py-2 bg-[#F7F5F0] rounded-xl border border-black/6 flex items-center justify-between text-[11px] font-mono text-black/60">
          <span className="flex items-center space-x-1.5">
            <Building className="w-3 h-3 text-[#536B57]" />
            <span>Operations: <strong>{businessName}</strong></span>
          </span>
          <span className="text-[#536B57] font-semibold">Admin RBAC</span>
        </div>

        {/* Redirect Notice if routed from protected URL */}
        {redirectTarget && !isRecoveryMode && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>You must sign in to view administrative route: <strong className="font-mono">{redirectTarget}</strong></span>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notice */}
        {recoverySuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start space-x-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{recoverySuccessMsg}</span>
          </div>
        )}

        {/* Form: Normal Login vs Recovery */}
        {!isRecoveryMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#242424] mb-1">
                Admin Identifier / Email
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin or email"
                className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] rounded-xl border border-black/15 focus:outline-hidden focus:ring-1 focus:ring-black font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#242424]">
                  Administrator Password
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
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] rounded-xl border border-black/15 focus:outline-hidden focus:ring-1 focus:ring-black font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-black/50 font-mono">Server-Side Auth</span>
              <button
                type="button"
                onClick={() => {
                  setIsRecoveryMode(true);
                  setErrorMessage(null);
                  setRecoverySuccessMsg(null);
                }}
                className="text-[#536B57] font-semibold hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#242424] hover:bg-black text-[#F7F5F0] rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D9A6A0]" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate & Access Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D9A6A0]" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Password Recovery Flow */
          <div className="space-y-4">
            {recoveryStep === 'request' ? (
              <form onSubmit={handleRequestRecoveryToken} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#242424] mb-1">
                    Pre-Authorised Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="manpreetkaurdeveloper2@gmail.com"
                    className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] rounded-xl border border-black/15 focus:outline-hidden focus:ring-1 focus:ring-black font-mono"
                  />
                  <p className="text-[10px] text-black/50 mt-1">
                    Only pre-authorised administrator email accounts can receive recovery tokens.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecoveryMode(false);
                      setErrorMessage(null);
                    }}
                    className="flex-1 py-2.5 bg-[#F7F5F0] hover:bg-black/5 text-[#242424] font-semibold text-xs rounded-xl transition-all cursor-pointer border border-black/10"
                  >
                    Back to Login
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 bg-[#242424] hover:bg-black text-[#F7F5F0] font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-md disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Generating...' : 'Request Token'}</span>
                    <ArrowRight className="w-3 h-3 text-[#D9A6A0]" />
                  </button>
                </div>
              </form>
            ) : (
              /* Reset Step with Token */
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#242424] mb-1">
                    Cryptographic Recovery Token
                  </label>
                  <input
                    type="text"
                    required
                    value={recoveryToken}
                    onChange={(e) => setRecoveryToken(e.target.value)}
                    placeholder="Enter 15-minute recovery token"
                    className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] rounded-xl border border-black/15 focus:outline-hidden focus:ring-1 focus:ring-black font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#242424] mb-1">
                    New Master Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Set new secure administrator password"
                    className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] rounded-xl border border-black/15 focus:outline-hidden focus:ring-1 focus:ring-black font-mono"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecoveryMode(false);
                      setRecoveryStep('request');
                      setErrorMessage(null);
                    }}
                    className="flex-1 py-2.5 bg-[#F7F5F0] hover:bg-black/5 text-[#242424] font-semibold text-xs rounded-xl transition-all cursor-pointer border border-black/10"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 bg-[#242424] hover:bg-black text-[#F7F5F0] font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-md disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Updating...' : 'Set Password'}</span>
                    <ArrowRight className="w-3 h-3 text-[#D9A6A0]" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Security Disclosures */}
        <div className="pt-4 border-t border-black/8 text-[11px] text-black/50 space-y-2">
          <div className="flex items-center space-x-1.5 font-medium text-black/70">
            <ShieldCheck className="w-3.5 h-3.5 text-[#536B57]" />
            <span>Zero-Trust Endpoint Protection</span>
          </div>
          <p className="leading-relaxed">
            All administrative actions (orders, inventory modifications, supplier costs, Google Sheets synchronization) require a valid cryptographic token verified server-side.
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-black/50 pt-6 border-t border-black/8 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px]">
        <span>The Everyday Edit · Business & Operations: {businessName}</span>
        <span>Mandi Gobindgarh, Punjab – 147301, India</span>
      </div>

    </div>
  );
};

