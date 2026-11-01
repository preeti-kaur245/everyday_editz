import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Search, 
  Package, 
  CheckCircle, 
  Truck, 
  MapPin, 
  Clock, 
  ExternalLink,
  Bell
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const { 
    isTrackingOpen, 
    setIsTrackingOpen, 
    orders, 
    trackingLookupId, 
    setTrackingLookupId,
    setIsReturnClaimOpen,
    setReturnClaimPrefillOrder,
    showToast 
  } = useStore();

  const [inputQuery, setInputQuery] = useState(trackingLookupId || 'EE-IND-2026-8942');
  const [searchedOrder, setSearchedOrder] = useState<any>(
    orders.find((o) => o.id === (trackingLookupId || 'EE-IND-2026-8942')) || orders[0] || null
  );

  if (!isTrackingOpen) return null;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputQuery.trim().toUpperCase();
    const match = orders.find(
      (o) => o.id.toUpperCase() === clean || o.trackingNumber?.toUpperCase() === clean
    );

    if (match) {
      setSearchedOrder(match);
      setTrackingLookupId(match.id);
    } else {
      showToast('Order not found. Please check Order ID.', 'warning');
    }
  };

  const getStepProgress = (status: string) => {
    switch (status) {
      case 'Confirmed': return 1;
      case 'Packed': return 2;
      case 'Shipped': return 3;
      case 'Out for Delivery': return 4;
      case 'Delivered': return 5;
      default: return 1;
    }
  };

  const currentStep = searchedOrder ? getStepProgress(searchedOrder.status) : 1;

  const timelineSteps = [
    { title: 'Order Confirmed', subtitle: 'Studio verification completed', icon: CheckCircle },
    { title: 'Quality Packed', subtitle: 'Inspected at Raftaar Solutions Hub', icon: Package },
    { title: 'In Transit', subtitle: 'Dispatched via Delhivery Express', icon: Truck },
    { title: 'Out for Delivery', subtitle: 'Assigned to local courier agent', icon: Clock },
    { title: 'Delivered', subtitle: 'Doorstep handover complete', icon: MapPin },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-xl bg-[#F7F5F0] sm:rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-screen sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-black/8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-[#536B57]" />
            <h2 className="text-base font-bold text-[#242424]">Live Shipment Tracker</h2>
          </div>

          <button
            onClick={() => setIsTrackingOpen(false)}
            className="p-1.5 text-black/60 hover:text-black rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input form */}
        <div className="p-6 bg-white border-b border-black/8">
          <form onSubmit={handleLookup} className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter Order ID (e.g. EE-IND-2026-8942)"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 bg-[#F7F5F0] rounded-xl border border-black/10 focus:outline-hidden font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#242424] text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors cursor-pointer shrink-0"
            >
              Track Status
            </button>
          </form>
        </div>

        {/* Timeline Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {searchedOrder ? (
            <div className="space-y-6">
              
              {/* Order Meta Header */}
              <div className="bg-white p-4 rounded-2xl border border-black/8 flex items-center justify-between text-xs">
                <div>
                  <span className="text-black/50">Tracking Order:</span>
                  <div className="font-bold font-mono text-sm text-[#242424]">{searchedOrder.id}</div>
                  <div className="text-[11px] text-[#536B57] font-medium mt-0.5">
                    Carrier: {searchedOrder.courierName} ({searchedOrder.trackingNumber})
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-black/50">Current Status:</span>
                  <div className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 mt-0.5">
                    {searchedOrder.status}
                  </div>
                </div>
              </div>

              {/* Vertical Stepper Timeline */}
              <div className="bg-white p-6 rounded-2xl border border-black/8 space-y-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#536B57]">
                  Shipment Milestones
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/10">
                  {timelineSteps.map((step, idx) => {
                    const stepNumber = idx + 1;
                    const isDone = currentStep >= stepNumber;
                    const isCurrent = currentStep === stepNumber;
                    const Icon = step.icon;

                    return (
                      <div key={idx} className="relative flex items-start space-x-3">
                        {/* Bullet Marker */}
                        <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isDone 
                            ? 'bg-[#536B57] border-[#536B57] text-white' 
                            : 'bg-white border-black/20 text-black/30'
                        }`}>
                          <Icon className="w-2.5 h-2.5" />
                        </div>

                        <div>
                          <div className={`text-xs font-bold ${isCurrent ? 'text-[#536B57]' : isDone ? 'text-[#242424]' : 'text-black/40'}`}>
                            {step.title}
                          </div>
                          <div className="text-[11px] text-black/60 mt-0.5">
                            {step.subtitle}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Destination Address */}
              <div className="bg-white p-4 rounded-2xl border border-black/8 text-xs text-[#242424]/80 space-y-1">
                <span className="font-bold text-[#242424] block mb-1">Destination Address</span>
                <div>{searchedOrder.shippingAddress.fullName}</div>
                <div>{searchedOrder.shippingAddress.flatHouseNo}, {searchedOrder.shippingAddress.streetArea}</div>
                <div>{searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.state} - {searchedOrder.shippingAddress.pincode}</div>
              </div>

              {/* Status alerts CTA */}
              <button
                onClick={() => showToast('Subscribed for live dispatch & tracking updates!')}
                className="w-full py-2.5 bg-[#536B57]/10 text-[#536B57] hover:bg-[#536B57]/20 font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 border border-[#536B57]/20 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>Get Instant Dispatch & Tracking Updates</span>
              </button>

              {/* Damaged / Defective Claim Button */}
              <button
                onClick={() => {
                  setReturnClaimPrefillOrder(searchedOrder.id);
                  setIsTrackingOpen(false);
                  setIsReturnClaimOpen(true);
                }}
                className="w-full py-2.5 bg-[#242424] text-[#F7F5F0] hover:bg-black font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <span>Report Damaged / Defective Item (7-Day Replacement)</span>
              </button>

            </div>
          ) : (
            <div className="py-12 text-center text-xs text-black/50">
              No order found matching "{inputQuery}".
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
