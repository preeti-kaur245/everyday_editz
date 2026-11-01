/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, CheckCircle2, MessageSquareHeart } from 'lucide-react';

export const CustomerFeedbackModal: React.FC = () => {
  const { 
    isFeedbackOpen, 
    setIsFeedbackOpen, 
    feedbackProduct, 
    setFeedbackProduct, 
    submitFeedback, 
    currentCustomer 
  } = useStore();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState(
    currentCustomer ? `${currentCustomer.firstName} ${currentCustomer.lastName}` : ''
  );
  const [orderId, setOrderId] = useState('EE-IND-2026-8942');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isFeedbackOpen || !feedbackProduct) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    submitFeedback({
      customerId: currentCustomer?.id,
      customerName: customerName.trim(),
      orderId: orderId.trim() || undefined,
      productName: feedbackProduct.name,
      productId: feedbackProduct.id,
      rating,
      feedback: comment.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsFeedbackOpen(false);
      setFeedbackProduct(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-[#F7F5F0] rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-white border-b border-black/8 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-[#536B57]/15 flex items-center justify-center text-[#536B57]">
              <MessageSquareHeart className="w-4 h-4 text-[#536B57]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#242424]">Customer Feedback & Review</h3>
              <p className="text-[11px] text-black/50">Sharing feedback for {feedbackProduct.name}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsFeedbackOpen(false);
              setFeedbackProduct(null);
            }}
            className="p-1 rounded-full hover:bg-black/5 text-black/50 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3 bg-white m-4 rounded-2xl border border-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-[#242424]">Thank you for your feedback!</h4>
            <p className="text-xs text-black/60">
              Your review is recorded in Sheet 6 (Customer Feedback) and published to our verified reviews section.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {/* Star Rating */}
            <div className="bg-white p-4 rounded-2xl border border-black/6 text-center space-y-2">
              <span className="text-xs font-semibold text-[#242424]">Rate your daily experience</span>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-black/20'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-[11px] font-mono text-black/50">
                {rating === 5 ? 'Exceptional Upgrade' : rating === 4 ? 'Great Daily Value' : rating === 3 ? 'Good / Average' : 'Needs Improvement'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya S."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/10 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1">Order ID (Optional)</label>
                <input
                  type="text"
                  placeholder="EE-IND-2026-8942"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/10 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242424] mb-1">Detailed Review / Feedback *</label>
              <textarea
                rows={3}
                required
                placeholder="How does this item improve your daily routine? Build quality, durability, usability..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/10 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-black/40 font-mono">
                Auto-synced to Sheet 6: Customer Feedback
              </span>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#242424] text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors cursor-pointer shadow-sm"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
