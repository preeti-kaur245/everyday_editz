import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  RotateCcw, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Package, 
  ShieldAlert, 
  FileText,
  Trash2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ReturnClaim } from '../types';

export const ReturnClaimModal: React.FC = () => {
  const { 
    isReturnClaimOpen, 
    setIsReturnClaimOpen, 
    returnClaimPrefillOrder, 
    orders, 
    currentCustomer,
    submitReturnClaim,
    showToast 
  } = useStore();

  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [issueType, setIssueType] = useState<ReturnClaim['issueType']>('Damaged in Transit');
  const [description, setDescription] = useState('');
  const [evidenceImages, setEvidenceImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedClaimId, setSubmittedClaimId] = useState<string | null>(null);

  useEffect(() => {
    if (returnClaimPrefillOrder) {
      setOrderId(returnClaimPrefillOrder);
      const matchedOrder = orders.find(o => o.id === returnClaimPrefillOrder);
      if (matchedOrder) {
        setCustomerName(matchedOrder.shippingAddress?.fullName || '');
        setCustomerEmail(matchedOrder.shippingAddress?.email || '');
        setCustomerPhone(matchedOrder.shippingAddress?.phoneNumber || '');
        if (matchedOrder.items.length > 0) {
          setProductId(matchedOrder.items[0].product.id);
          setProductName(matchedOrder.items[0].product.name);
        }
      }
    } else if (currentCustomer) {
      setCustomerName(`${currentCustomer.firstName} ${currentCustomer.lastName}`);
      setCustomerEmail(currentCustomer.email);
      setCustomerPhone(currentCustomer.phoneNumber);
    }
  }, [returnClaimPrefillOrder, orders, currentCustomer, isReturnClaimOpen]);

  // When order ID is entered, try to match items
  const matchedOrder = orders.find(o => o.id.trim().toUpperCase() === orderId.trim().toUpperCase());

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (evidenceImages.length + files.length > 4) {
      showToast('Maximum 4 photos allowed for evidence', 'warning');
      return;
    }

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`File ${file.name} is larger than 5MB`, 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEvidenceImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setEvidenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId.trim()) {
      showToast('Please provide your Order ID', 'warning');
      return;
    }
    if (!customerEmail.trim() || !customerPhone.trim()) {
      showToast('Customer contact email and phone are mandatory', 'warning');
      return;
    }
    if (!productName.trim()) {
      showToast('Please specify the affected product name', 'warning');
      return;
    }
    if (description.trim().length < 20) {
      showToast('Please provide at least 20 characters describing the defect or damage', 'warning');
      return;
    }

    // Check for change of mind wording
    const forbiddenPhrases = ['change of mind', 'not needed', 'bought by mistake', 'disliked color', 'don\'t want it'];
    const lowerDesc = description.toLowerCase();
    if (forbiddenPhrases.some(p => lowerDesc.includes(p))) {
      showToast('Change of mind returns are not eligible under store policy & Consumer Protection Rules.', 'warning');
      return;
    }

    setIsSubmitting(true);
    const result = await submitReturnClaim({
      orderId: orderId.trim().toUpperCase(),
      customerId: currentCustomer?.id,
      customerName: customerName.trim() || 'Valued Customer',
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      productId: productId || 'custom-claim',
      productName: productName.trim(),
      issueType,
      description: description.trim(),
      evidenceImages,
    });

    setIsSubmitting(false);
    if (result.success && result.claimId) {
      setSubmittedClaimId(result.claimId);
    } else {
      showToast(result.error || 'Failed to submit claim. Please try again.', 'warning');
    }
  };

  const handleClose = () => {
    setIsReturnClaimOpen(false);
    setSubmittedClaimId(null);
  };

  if (!isReturnClaimOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#F7F5F0] sm:rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-screen sm:max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-white px-6 py-4 border-b border-black/8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-4 h-4 text-[#536B57]" />
            <span className="font-bold text-sm text-[#242424]">Return & Replacement Desk</span>
            <span className="text-black/30">·</span>
            <span className="text-[11px] text-[#536B57] font-mono">7-Day Guarantee</span>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-black/60 hover:text-black rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 text-xs">
          {submittedClaimId ? (
            /* Success confirmation screen */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-[#536B57]/10 text-[#536B57] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-[#242424]">Claim Registered Successfully</h3>
              <div className="bg-white p-5 rounded-2xl border border-black/8 max-w-md mx-auto text-left space-y-2">
                <div className="text-xs text-black/50">Claim Reference ID:</div>
                <div className="font-mono text-base font-bold text-[#242424]">{submittedClaimId}</div>
                <div className="text-xs text-black/70 pt-2 border-t border-black/5">
                  Order ID: <span className="font-mono font-medium text-black">{orderId}</span>
                </div>
                <div className="text-xs text-black/70">
                  Item: <span className="font-medium text-black">{productName}</span>
                </div>
                <div className="text-xs text-black/70">
                  Nature: <span className="font-medium text-black">{issueType}</span>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-black/8 max-w-md mx-auto text-xs text-black/70 text-left space-y-2">
                <div className="font-semibold text-[#242424] flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#536B57]" />
                  <span>Next Steps & Review Timeline</span>
                </div>
                <p>
                  1. Our Grievance & Quality Assessment Officer reviews photos and description within <strong>24–48 business hours</strong>.
                </p>
                <p>
                  2. Upon verification, a free reverse pickup and replacement dispatch or instant refund will be scheduled.
                </p>
                <p>
                  3. An email update has been dispatched to <strong>{customerEmail}</strong>.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#242424] text-[#F7F5F0] rounded-xl text-xs font-semibold hover:bg-black transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            /* Claim Submission Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Policy Banner Notice */}
              <div className="p-4 rounded-2xl bg-white border border-black/8 space-y-1.5">
                <div className="flex items-center space-x-2 text-[#242424] font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 text-[#D9A6A0]" />
                  <span>Indian E-Commerce Consumer Protection Policy</span>
                </div>
                <p className="text-[11px] text-black/70 leading-relaxed">
                  Replacement or refund is provided for transit damage, manufacturing defects, missing pieces, or incorrect items reported within <strong>7 days of delivery</strong>. In accordance with legal guidelines, <em>change-of-mind</em> cancellations or returns after receipt are not applicable.
                </p>
              </div>

              {/* Order & Customer Lookup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#242424] mb-1">
                    Order ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. EE-IND-2026-1042"
                    className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/15 font-mono focus:outline-hidden focus:ring-1 focus:ring-black"
                  />
                  {matchedOrder && (
                    <span className="text-[10px] text-[#536B57] font-medium mt-1 inline-block">
                      ✓ Order located (₹{matchedOrder.total} · {matchedOrder.status})
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#242424] mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ananya Sen"
                    className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/15 focus:outline-hidden focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#242424] mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. ananya@gmail.com"
                    className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/15 focus:outline-hidden focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#242424] mb-1">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/15 focus:outline-hidden focus:ring-1 focus:ring-black font-mono"
                  />
                </div>
              </div>

              {/* Product and Issue Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#242424] mb-1">
                    Product Being Claimed <span className="text-red-500">*</span>
                  </label>
                  {matchedOrder && matchedOrder.items.length > 0 ? (
                    <select
                      value={productName}
                      onChange={(e) => {
                        const sel = matchedOrder.items.find(i => i.product.name === e.target.value);
                        setProductName(e.target.value);
                        if (sel) setProductId(sel.product.id);
                      }}
                      className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/15 focus:outline-hidden"
                    >
                      {matchedOrder.items.map(item => (
                        <option key={item.product.id} value={item.product.name}>
                          {item.product.name} (Qty: {item.quantity})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. Travel Toiletry Organiser"
                      className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/15 focus:outline-hidden focus:ring-1 focus:ring-black"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#242424] mb-1">
                    Nature of Issue <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-black/15 focus:outline-hidden"
                  >
                    <option value="Damaged in Transit">Damaged in Transit (Broken/Dented)</option>
                    <option value="Defective Item">Manufacturing Defect (Non-functional)</option>
                    <option value="Incorrect Product">Incorrect Product Received</option>
                    <option value="Incomplete Package">Incomplete Package (Missing parts)</option>
                    <option value="Misdescribed">Substantially Different from Specification</option>
                  </select>
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-semibold text-[#242424] mb-1">
                  Detailed Explanation <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe the exact defect or damage in detail. Note: claims mentioning 'change of mind' or 'no longer needed' cannot be approved."
                  className="w-full text-xs p-3.5 bg-white rounded-xl border border-black/15 focus:outline-hidden focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Evidence Photo Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#242424]">
                    Evidence Photos (Packaging, shipping label & defect)
                  </label>
                  <span className="text-[10px] text-black/50 font-mono">Max 4 photos (JPG/PNG)</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {evidenceImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-black/15 group bg-white">
                      <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {evidenceImages.length < 4 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-black/20 hover:border-black/50 bg-white flex flex-col items-center justify-center cursor-pointer transition-colors p-2 text-center">
                      <Upload className="w-5 h-5 text-black/40 mb-1" />
                      <span className="text-[10px] text-black/60 font-medium">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between border-t border-black/8">
                <span className="text-[11px] text-black/50 font-mono">
                  Grievance Desk Response: &lt; 48h
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#242424] hover:bg-black text-[#F7F5F0] rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Registering Claim...' : 'Submit Claim for Review'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D9A6A0]" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
