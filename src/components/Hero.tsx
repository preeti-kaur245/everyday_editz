import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowUpRight, Compass, ShieldCheck, Sparkles, Zap, PackageCheck } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const { settings, setIsReelsOpen, setSelectedProduct, products } = useStore();

  const featuredProduct = products.find((p) => p.id === 'prod-magdock-pad') || products[0];

  return (
    <section className="relative overflow-hidden bg-[#F7F5F0] pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-black/8">
      {/* Subtle architectural grid line background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-stretch">
          
          {/* Left Column: Brand Statement & Primary Direct Route */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Quiet unboxed kicker */}
              <div className="flex items-center space-x-2 text-xs font-mono tracking-wider text-[#536B57] uppercase mb-4">
                <span className="w-2 h-2 rounded-full bg-[#536B57]" />
                <span>The Curated Indian Life-Store</span>
                <span className="text-black/30">/</span>
                <span>Batch #04 Winter 2026</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#242424] tracking-tight leading-[1.08] text-balance mb-6">
                {settings.heroHeadline}
              </h1>

              {/* Refined Subtitle */}
              <p className="text-base sm:text-lg text-[#242424]/80 leading-relaxed max-w-xl mb-8">
                {settings.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={onExploreClick}
                  className="px-6 py-3.5 bg-[#242424] text-[#F7F5F0] rounded-xl hover:bg-black transition-all font-medium text-sm flex items-center space-x-2 shadow-sm cursor-pointer"
                >
                  <span>Explore The Edit</span>
                  <ArrowUpRight className="w-4 h-4 text-[#D9A6A0]" />
                </button>

                <button
                  onClick={() => setIsReelsOpen(true)}
                  className="px-5 py-3.5 bg-white border border-black/15 text-[#242424] rounded-xl hover:bg-[#F2EFE9] transition-all font-medium text-sm flex items-center space-x-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#536B57]" />
                  <span>See It In Action</span>
                </button>
              </div>
            </div>

            {/* Proof Metric Strip (Adjacent to Claim) */}
            <div className="pt-10 mt-8 border-t border-black/8 grid grid-cols-3 gap-4 text-[#242424]">
              <div>
                <div className="text-xl sm:text-2xl font-bold tabular-nums">100%</div>
                <div className="text-xs text-[#242424]/70 mt-0.5">Physical Studio Tested</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold tabular-nums">48 Hrs</div>
                <div className="text-xs text-[#242424]/70 mt-0.5">Dispatched from BLR</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold tabular-nums">7 Days</div>
                <div className="text-xs text-[#242424]/70 mt-0.5">Replacement Promise</div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Campaign Spotlight Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative flex-1 bg-white rounded-2xl border border-black/10 p-6 flex flex-col justify-between shadow-sm overflow-hidden group">
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between text-xs text-[#242424]/60 font-mono mb-4">
                <span className="flex items-center space-x-1.5 text-[#536B57]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-semibold uppercase tracking-wider">Spotlight Item</span>
                </span>
                <span className="tabular-nums">₹{featuredProduct.price} · <del className="text-black/40">₹{featuredProduct.originalPrice}</del></span>
              </div>

              {/* Product Visual Mockup */}
              <div 
                onClick={() => setSelectedProduct(featuredProduct)}
                className="my-auto py-6 flex items-center justify-center cursor-pointer group-hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="w-full max-w-xs aspect-4/3 rounded-xl bg-[#F2EFE9] border border-black/5 p-4 flex flex-col justify-between relative shadow-inner">
                  {/* Visual card content */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-black/50">
                    <span>MAGDOCK PAD</span>
                    <span className="text-[#536B57] font-semibold">40% OFF</span>
                  </div>

                  <div className="w-full h-24 bg-[#B7A18D] rounded-lg shadow-sm border border-black/10 flex items-center justify-center p-3 relative">
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#242424] flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#D9A6A0]" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-white tracking-tight">MagDock Desk Pad</div>
                      <div className="text-[9px] text-white/80">Reversible Vegan Leather + Cork</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-black/60 pt-2 border-t border-black/5">
                    <span>Includes 2 Magnetic Cable Anchors</span>
                    <span className="font-semibold text-[#242424]">₹899</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="pt-4 border-t border-black/8 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#242424]">
                    {featuredProduct.name}
                  </h3>
                  <p className="text-xs text-[#242424]/70 line-clamp-1 mt-0.5">
                    {featuredProduct.tagline}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedProduct(featuredProduct)}
                  className="px-3.5 py-1.5 bg-[#F2EFE9] hover:bg-[#242424] hover:text-white transition-colors text-xs font-medium rounded-lg shrink-0 ml-3 cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
