import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Clock, Sparkles } from 'lucide-react';

export const NewArrivalsSection: React.FC = () => {
  const { products } = useStore();

  const newProducts = products.filter((p) => p.isNewArrival).slice(0, 4);
  if (newProducts.length === 0) return null;

  return (
    <section id="new-arrivals-section" className="py-12 sm:py-16 bg-[#F7F5F0] border-b border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-black/8 gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-[#536B57] mb-1.5">
              <Clock className="w-3.5 h-3.5 text-[#536B57]" />
              <span>Fresh Studio Batch</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
              Recently Added to the Edit
            </h2>
            <p className="text-sm text-[#242424]/70 mt-1 max-w-xl">
              The newest verified arrivals across Women, Men, Kids, and Home & Lifestyle.
            </p>
          </div>
        </div>

        {/* 4-Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
