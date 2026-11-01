/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ProductEnquiryModal: React.FC = () => {
  const { 
    isEnquiryOpen, 
    setIsEnquiryOpen, 
    enquiryProduct, 
    setEnquiryProduct, 
    submitEnquiry, 
    currentCustomer 
  } = useStore();

  const [customerName, setCustomerName] = useState(
    currentCustomer ? `${currentCustomer.firstName} ${currentCustomer.lastName}` : ''
  );
  const [phone, setPhone] = useState(currentCustomer?.phoneNumber || '');
  const [email, setEmail] = useState(currentCustomer?.email || '');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isEnquiryOpen || !enquiryProduct) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !message.trim()) return;

    submitEnquiry({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || 'shopper@everydayeditz.in',
      productName: enquiryProduct.name,
      productId: enquiryProduct.id,
      productCategory: enquiryProduct.departments.join(', '),
      customerMessage: message.trim(),
      sourcePlatform: 'Website Product Modal',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsEnquiryOpen(false);
      setEnquiryProduct(null);
      setMessage('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-[#F7F5F0] rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-white border-b border-black/8 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-[#536B57]/15 flex items-center justify-center text-[#536B57]">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#242424]">Product Enquiry & Bulk Questions</h3>
              <p className="text-[11px] text-black/50">Direct enquiry for {enquiryProduct.name}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsEnquiryOpen(false);
              setEnquiryProduct(null);
            }}
            className="p-1 rounded-full hover:bg-black/5 text-black/50 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3 bg-white m-4 rounded-2xl border border-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-[#242424]">Enquiry Received & Recorded</h4>
            <p className="text-xs text-black/60">
              Your inquiry has been logged in our Google Sheets CRM. Our support team will review your inquiry and follow up via email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div className="bg-white p-3.5 rounded-xl border border-black/6 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] flex items-center justify-center font-bold text-xs text-black/40 border border-black/6 shrink-0">
                ₹{enquiryProduct.price}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#242424] truncate">{enquiryProduct.name}</h4>
                <p className="text-[11px] text-black/50">{enquiryProduct.tagline}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242424] mb-1">Your Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Priya Nair"
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
                <label className="block text-xs font-semibold text-[#242424] mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="priya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/10 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242424] mb-1">Your Message or Question *</label>
              <textarea
                rows={3}
                required
                placeholder="Ask about dimensions, materials, wholesale pricing, or bulk order requirements..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/10 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-black/40 font-mono">
                Auto-synced to Sheet 3: Product Enquiries
              </span>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#242424] text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Enquiry</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
