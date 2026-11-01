import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Flame, Compass } from 'lucide-react';

export const TrendingSection: React.FC = () => {
  const { products, setIsReelsOpen } = useStore();

  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 4);
  if (trendingProducts.length === 0) return null;

  return (
    <section id="trending-section" className="py-12 sm:py-16 bg-[#F7F5F0] border-b border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-black/8 gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-[#D9A6A0] mb-1.5">
              <Flame className="w-3.5 h-3.5 fill-[#D9A6A0]" />
              <span>High Velocity Demand</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
              Trending Products This Week
            </h2>
            <p className="text-sm text-[#242424]/70 mt-1 max-w-xl">
              Most saved and ordered tools across Indian cities over the last 7 days.
            </p>
          </div>

          <button
            onClick={() => setIsReelsOpen(true)}
            className="text-xs font-semibold text-[#536B57] flex items-center space-x-1 font-mono hover:underline cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Watch In Action (Reels)</span>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
