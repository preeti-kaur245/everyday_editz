import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Sparkles, Truck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings, applyCoupon, setIsCartOpen } = useStore();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#242424] text-[#F7F5F0] text-xs py-2 px-4 border-b border-black/10 relative z-30 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Indicator */}
        <div className="hidden sm:flex items-center space-x-2 text-[#B7A18D] text-[11px] font-mono uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5 text-[#D9A6A0]" />
          <span>India Express</span>
        </div>

        {/* Center message */}
        <div className="flex-1 text-center flex items-center justify-center space-x-2 text-xs sm:text-sm">
          <span className="font-medium tracking-tight text-white">
            {settings.announcementText}
          </span>
          <span className="text-[#B7A18D] hidden md:inline">·</span>
          <button
            onClick={() => {
              applyCoupon('FIRST10');
              setIsCartOpen(true);
            }}
            className="hidden md:inline-flex items-center space-x-1 text-[#D9A6A0] hover:text-white underline underline-offset-2 transition-colors font-medium text-xs cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>{settings.announcementSubtext}</span>
          </button>
        </div>

        {/* Right close button */}
        <button
          onClick={() => setDismissed(true)}
          className="text-[#B7A18D] hover:text-white transition-colors p-1"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
