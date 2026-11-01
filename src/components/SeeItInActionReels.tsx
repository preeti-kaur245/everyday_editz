import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  ShoppingBag, 
  Heart, 
  X, 
  ExternalLink,
  Sparkles,
  Share2
} from 'lucide-react';
import { ProductIllustration } from './ProductIllustration';

export const SeeItInActionReels: React.FC = () => {
  const { 
    products, 
    isReelsOpen, 
    setIsReelsOpen, 
    activeReelIndex, 
    setActiveReelIndex,
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    setSelectedProduct,
    showToast
  } = useStore();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Must not autoplay sound
  const [progress, setProgress] = useState(0);

  // Filter products that have video captions/features
  const reelProducts = products.filter((p) => p.videoCaption);
  const currentProduct = reelProducts[activeReelIndex] || reelProducts[0];

  // Simulated video playback progress loop
  useEffect(() => {
    if (!isReelsOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Auto advance to next reel after 100%
          setActiveReelIndex((activeReelIndex + 1) % reelProducts.length);
          return 0;
        }
        return prev + 1.2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isReelsOpen, isPlaying, activeReelIndex, reelProducts.length, setActiveReelIndex]);

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0);
    setIsPlaying(true);
  }, [activeReelIndex]);

  if (!isReelsOpen || !currentProduct) return null;

  const handleNext = () => {
    setActiveReelIndex((activeReelIndex + 1) % reelProducts.length);
  };

  const handlePrev = () => {
    setActiveReelIndex((activeReelIndex - 1 + reelProducts.length) % reelProducts.length);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentProduct.name,
        text: `Check out ${currentProduct.name} on EVERYDAY_EDITZ!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      
      {/* Top Close Bar */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-3">
        <button
          onClick={() => setIsReelsOpen(false)}
          className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close Reels"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main 9:16 Reel Container */}
      <div className="relative w-full sm:max-w-md h-full sm:h-[88vh] sm:rounded-3xl bg-[#1A1A1A] overflow-hidden flex flex-col justify-between shadow-2xl border border-white/10">
        
        {/* Top Progress bar */}
        <div className="absolute top-2 inset-x-2 z-30 flex items-center space-x-1.5 px-2">
          {reelProducts.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all ${
                  idx === activeReelIndex ? 'duration-100' : 'duration-0'
                }`}
                style={{
                  width: idx === activeReelIndex ? `${progress}%` : idx < activeReelIndex ? '100%' : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Brand header over video */}
        <div className="absolute top-6 inset-x-4 z-30 flex items-center justify-between text-white text-xs">
          <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A6A0]" />
            <span className="font-semibold font-mono">SEE IT IN ACTION</span>
            <span className="text-white/40">·</span>
            <span>{activeReelIndex + 1}/{reelProducts.length}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Video Canvas Simulator with high-fidelity visual product reel */}
        <div 
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative w-full h-full flex items-center justify-center cursor-pointer select-none overflow-hidden"
        >
          {/* Dynamic visual representation of the product demo */}
          <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-b from-stone-900 via-stone-800 to-black">
            
            {/* Ambient Lighting Studio Glow */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#B7A18D]/30 via-transparent to-transparent" />

            {/* Product vector demonstration */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              <ProductIllustration productId={currentProduct.id} className="w-full h-full scale-110 drop-shadow-2xl" />
            </div>

            {/* Play/Pause Watermark when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white">
                  <Play className="w-7 h-7 fill-white ml-1" />
                </div>
              </div>
            )}
          </div>

          {/* Right Floating Quick Actions (Like, Share, Prev, Next) */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute right-3 bottom-32 z-30 flex flex-col items-center space-y-4 text-white"
          >
            {/* Wishlist */}
            <button
              onClick={() => toggleWishlist(currentProduct.id)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors">
                <Heart className={`w-5 h-5 ${isInWishlist(currentProduct.id) ? 'fill-[#D9A6A0] text-[#D9A6A0]' : 'text-white'}`} />
              </div>
              <span className="text-[10px] mt-1 font-mono text-white/80">Save</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] mt-1 font-mono text-white/80">Share</span>
            </button>

            {/* Prev Reel */}
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
              title="Previous demonstration"
            >
              <ChevronUp className="w-5 h-5 text-white" />
            </button>

            {/* Next Reel */}
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
              title="Next demonstration"
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Bottom Product Overlay Card & Direct Add-to-Cart */}
        <div className="relative z-30 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
          {/* Caption */}
          <p className="text-white text-xs leading-relaxed mb-3 line-clamp-2">
            {currentProduct.videoCaption}
          </p>

          {/* Interactive Floating Product Dock */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center justify-between">
            <div 
              onClick={() => {
                setSelectedProduct(currentProduct);
                setIsReelsOpen(false);
              }}
              className="flex items-center space-x-3 cursor-pointer flex-1 mr-2"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                <ProductIllustration productId={currentProduct.id} className="w-full h-full scale-75" />
              </div>
              <div className="min-w-0">
                <h4 className="text-white text-xs font-semibold truncate">
                  {currentProduct.name}
                </h4>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className="text-white font-mono font-bold text-sm">₹{currentProduct.price}</span>
                  <del className="text-white/50 font-mono text-xs">₹{currentProduct.originalPrice}</del>
                </div>
              </div>
            </div>

            {/* Direct Add to Cart Action */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => {
                  setSelectedProduct(currentProduct);
                  setIsReelsOpen(false);
                }}
                className="p-2 text-white/80 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Full product specs"
              >
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  addToCart(currentProduct, 1);
                }}
                className="px-3.5 py-2 bg-[#D9A6A0] hover:bg-[#c9958f] text-[#242424] rounded-xl font-semibold text-xs flex items-center space-x-1.5 shadow-md cursor-pointer transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
