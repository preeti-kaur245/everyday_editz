/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Customer } from '../types';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Gift, 
  CheckCircle2, 
  Lock, 
  LogOut, 
  Sparkles,
  ShieldCheck,
  MessageSquareQuote
} from 'lucide-react';

export const CustomerAccountModal: React.FC = () => {
  const { 
    isAccountOpen, 
    setIsAccountOpen, 
    currentCustomer, 
    setCurrentCustomer, 
    registerOrUpdateCustomer, 
    orders, 
    rewardsBalance, 
    referralCode,
    setIsTrackingOpen,
    setTrackingLookupId,
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'rewards' | 'register'>('profile');

  // Registration / Edit form state
  const [formData, setFormData] = useState({
    firstName: currentCustomer?.firstName || '',
    lastName: currentCustomer?.lastName || '',
    email: currentCustomer?.email || '',
    phoneNumber: currentCustomer?.phoneNumber || '',
    whatsappNumber: currentCustomer?.whatsappNumber || '',
    city: currentCustomer?.city || '',
    state: currentCustomer?.state || '',
    pincode: currentCustomer?.pincode || '',
    customerSegment: currentCustomer?.customerSegment || 'Women',
    marketingConsent: currentCustomer?.marketingConsent || false,
    whatsappConsent: currentCustomer?.whatsappConsent || false,
  });

  if (!isAccountOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.phoneNumber.trim()) {
      showToast('Please fill in required fields (Name, Email, Phone)', 'warning');
      return;
    }

    const updated = registerOrUpdateCustomer({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      whatsappNumber: formData.whatsappNumber.trim() || formData.phoneNumber.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
      customerSegment: formData.customerSegment as any,
      marketingConsent: formData.marketingConsent,
      whatsappConsent: formData.whatsappConsent,
    });

    setActiveTab('profile');
  };

  const handleSignOut = () => {
    setCurrentCustomer(null);
    showToast('Signed out of account', 'info');
    setIsAccountOpen(false);
  };

  const customerOrders = orders.filter(
    (o) =>
      o.customerId === currentCustomer?.id ||
      o.shippingAddress?.email.toLowerCase() === currentCustomer?.email.toLowerCase() ||
      o.shippingAddress?.phoneNumber === currentCustomer?.phoneNumber
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-[#F7F5F0] rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-black/8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#D9A6A0]/20 flex items-center justify-center text-[#242424]">
              <User className="w-5 h-5 text-[#242424]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#242424]">
                {currentCustomer ? `${currentCustomer.firstName}’s Everyday Account` : 'Sign In / Register'}
              </h2>
              <p className="text-xs text-black/50 font-mono">
                {currentCustomer ? `Customer ID: ${currentCustomer.id} · Connected to Sheets CRM` : 'Fast access to your orders, rewards & wishlist'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAccountOpen(false)}
            className="p-1.5 rounded-full hover:bg-black/5 text-black/60 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        {currentCustomer && (
          <div className="flex border-b border-black/8 bg-white/60 px-5 text-xs font-medium">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-[#242424] text-[#242424] font-semibold'
                  : 'border-transparent text-black/50 hover:text-black'
              }`}
            >
              Account Details
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'orders'
                  ? 'border-[#242424] text-[#242424] font-semibold'
                  : 'border-transparent text-black/50 hover:text-black'
              }`}
            >
              <span>My Orders</span>
              <span className="w-4 h-4 rounded-full bg-black/10 text-[10px] flex items-center justify-center">
                {customerOrders.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'rewards'
                  ? 'border-[#242424] text-[#242424] font-semibold'
                  : 'border-transparent text-black/50 hover:text-black'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#536B57]" />
              <span>Rewards ({rewardsBalance} pts)</span>
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* PROFILE / EDIT REGISTRATION VIEW */}
          {(activeTab === 'profile' || !currentCustomer) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-black/6 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-black/6">
                  <h3 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                    {currentCustomer ? 'Personal Information' : 'Quick Customer Registration'}
                  </h3>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                    Auto-synced to Google Sheets
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#242424] mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#F7F5F0] rounded-xl border border-black/10 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#242424] mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sharma"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#F7F5F0] rounded-xl border border-black/10 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#242424] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="ananya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#F7F5F0] rounded-xl border border-black/10 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#242424] mb-1">Phone Number (10 Digits) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98123 45678"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#F7F5F0] rounded-xl border border-black/10 focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#242424] mb-1">Alternative Contact (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+91 98123 45678"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#F7F5F0] rounded-xl border border-black/10 focus:outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#242424] mb-1">Primary Shopping Segment</label>
                    <select
                      value={formData.customerSegment}
                      onChange={(e) => setFormData({ ...formData, customerSegment: e.target.value as any })}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#F7F5F0] rounded-xl border border-black/10 focus:outline-hidden"
                    >
                      <option value="Women">Women (Beauty, Hair & Travel)</option>
                      <option value="Men">Men (Grooming, Tech & EDC)</option>
                      <option value="Kids">Kids (Creativity, Play & School)</option>
                      <option value="Household">Household & Living</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#242424] mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-[#F7F5F0] rounded-xl border border-black/10 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#242424] mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-[#F7F5F0] rounded-xl border border-black/10 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#242424] mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-[#F7F5F0] rounded-xl border border-black/10 focus:outline-hidden font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Explicit Customer Consent & Privacy (Requirement 7) */}
              <div className="bg-white p-4 rounded-2xl border border-black/6 space-y-2.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#242424]">
                  <ShieldCheck className="w-4 h-4 text-[#536B57]" />
                  <span>Privacy Notice & Communication Preferences</span>
                </div>
                <p className="text-[11px] text-black/60 leading-relaxed">
                  We collect only necessary information required to process and deliver your lifestyle upgrades. No passwords or card numbers are stored.
                </p>

                <div className="space-y-2 pt-2 border-t border-black/6">
                  <label className="flex items-start space-x-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={formData.marketingConsent}
                      onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
                      className="mt-0.5 rounded text-[#242424]"
                    />
                    <span className="text-black/80">
                      I agree to receive curated weekly editions and new product launches via email.
                    </span>
                  </label>

                  <label className="flex items-start space-x-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={formData.whatsappConsent}
                      onChange={(e) => setFormData({ ...formData, whatsappConsent: e.target.checked })}
                      className="mt-0.5 rounded text-[#242424]"
                    />
                    <span className="text-black/80">
                      I opt-in to receive priority order dispatch updates and notifications via SMS/Email.
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                {currentCustomer ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center space-x-1.5 text-xs text-black/60 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : <div />}

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#242424] text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors cursor-pointer shadow-sm"
                >
                  {currentCustomer ? 'Save Profile & Sync' : 'Register / Connect Profile'}
                </button>
              </div>
            </form>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && currentCustomer && (
            <div className="space-y-4">
              {customerOrders.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-black/6 text-center space-y-2">
                  <ShoppingBag className="w-8 h-8 text-black/30 mx-auto" />
                  <h4 className="text-sm font-semibold text-[#242424]">No orders placed yet</h4>
                  <p className="text-xs text-black/50">Your everyday curations will appear here once checked out.</p>
                </div>
              ) : (
                customerOrders.map((ord) => (
                  <div key={ord.id} className="bg-white p-5 rounded-2xl border border-black/6 space-y-3">
                    <div className="flex items-center justify-between border-b border-black/6 pb-2.5">
                      <div>
                        <div className="font-mono font-bold text-xs text-[#242424]">{ord.id}</div>
                        <div className="text-[10px] text-black/40 font-mono mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-sm text-[#242424]">₹{ord.total}</div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {ord.status}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-black/5 text-xs">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="py-2 flex justify-between items-center">
                          <div>
                            <span className="font-medium text-[#242424]">{item.product.name}</span>
                            <span className="text-black/50 ml-2">× {item.quantity}</span>
                          </div>
                          <span className="font-mono text-black/70">₹{item.product.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-black/6 flex items-center justify-between text-xs">
                      <div className="text-[11px] text-black/60 font-mono">
                        Tracking: <span className="font-bold text-[#242424]">{ord.trackingNumber}</span>
                      </div>
                      <button
                        onClick={() => {
                          setTrackingLookupId(ord.id);
                          setIsTrackingOpen(true);
                          setIsAccountOpen(false);
                        }}
                        className="text-xs text-[#536B57] font-semibold hover:underline cursor-pointer"
                      >
                        Track Delhivery Dispatch →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* REWARDS TAB */}
          {activeTab === 'rewards' && currentCustomer && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-black/6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-black/50 font-medium">Available Everyday Rewards</span>
                  <div className="text-3xl font-mono font-bold text-[#536B57] mt-1">{rewardsBalance} pts</div>
                  <span className="text-[11px] text-black/60">Equivalent to ₹{rewardsBalance} discount at checkout</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#536B57]/15 flex items-center justify-center text-[#536B57]">
                  <Gift className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-black/6 space-y-2">
                <span className="text-xs font-bold text-[#242424]">Your Exclusive Referral Code</span>
                <div className="p-3 bg-[#F7F5F0] rounded-xl flex items-center justify-between border border-black/8 font-mono text-xs">
                  <span className="font-bold text-[#242424]">{referralCode}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(referralCode);
                      showToast('Referral code copied to clipboard!');
                    }}
                    className="text-xs text-[#536B57] font-semibold hover:underline cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-[11px] text-black/50">
                  Share with friends: they get ₹50 off, and you earn 150 points when their order delivers.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
