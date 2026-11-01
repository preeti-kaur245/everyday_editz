/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Bell, CheckCircle2 } from 'lucide-react';

export const ProductWaitlistModal: React.FC = () => {
  const { 
    isWaitlistOpen, 
    setIsWaitlistOpen, 
    waitlistProduct, 
    setWaitlistProduct, 
    joinWaitlist, 
    currentCustomer 
  } = useStore();

  const [customerName, setCustomerName] = useState(
    currentCustomer ? `${currentCustomer.firstName} ${currentCustomer.lastName}` : ''
  );
  const [email, setEmail] = useState(currentCustomer?.email || '');
  const [phone, setPhone] = useState(currentCustomer?.phoneNumber || '');
  const [expectedBudget, setExpectedBudget] = useState('Under ₹499');
  const [notificationConsent, setNotificationConsent] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!isWaitlistOpen || !waitlistProduct) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !email.trim()) return;

    joinWaitlist({
      customerName: customerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      interestedProduct: waitlistProduct.name,
      productId: waitlistProduct.id,
      productCategory: waitlistProduct.departments.join(', '),
      expectedBudget,
      notificationConsent,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsWaitlistOpen(false);
      setWaitlistProduct(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-[#F7F5F0] rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-white border-b border-black/8 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-[#D9A6A0]/20 flex items-center justify-center text-[#242424]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#242424]">Join Priority Waitlist</h3>
              <p className="text-[11px] text-black/50">Next batch restock alert for {waitlistProduct.name}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsWaitlistOpen(false);
              setWaitlistProduct(null);
            }}
            className="p-1 rounded-full hover:bg-black/5 text-black/50 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3 bg-white m-4 rounded-2xl border border-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-[#242424]">Priority Reserved!</h4>
            <p className="text-xs text-black/60">
              You are now on the waitlist in Sheet 5. You’ll be notified first before the new studio batch goes live!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div className="bg-white p-3.5 rounded-xl border border-black/6 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] flex items-center justify-center font-bold text-xs text-black/40 border border-black/6 shrink-0">
                ₹{waitlistProduct.price}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#242424] truncate">{waitlistProduct.name}</h4>
                <p className="text-[11px] text-[#536B57] font-medium">Limited Studio Batch</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242424] mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Divya Nambiar"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/10 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1">Contact Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98123 45678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/10 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="divya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/10 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242424] mb-1">Target Budget Range</label>
              <select
                value={expectedBudget}
                onChange={(e) => setExpectedBudget(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/10 focus:outline-hidden"
              >
                <option value="Under ₹299">Under ₹299</option>
                <option value="Under ₹499">Under ₹499</option>
                <option value="Under ₹999">Under ₹999</option>
                <option value="Above ₹999">Above ₹999</option>
              </select>
            </div>

            <label className="flex items-start space-x-2.5 cursor-pointer text-xs pt-1">
              <input
                type="checkbox"
                checked={notificationConsent}
                onChange={(e) => setNotificationConsent(e.target.checked)}
                className="mt-0.5 rounded text-[#242424]"
              />
              <span className="text-black/70">
                Send me a priority email alert with an exclusive early-bird coupon when back in stock.
              </span>
            </label>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-black/40 font-mono">
                Auto-synced to Sheet 5: Product Waitlist
              </span>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#242424] text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors cursor-pointer shadow-sm"
              >
                Join Waitlist
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
