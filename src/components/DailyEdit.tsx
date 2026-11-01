import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';

export const DailyEdit: React.FC = () => {
  const { products, settings, setIsAdminOpen } = useStore();

  // Daily Edit items (either flagged or first 4)
  const dailyEditProducts = products.filter((p) => p.isDailyEdit).slice(0, 4);
  const displayList = dailyEditProducts.length > 0 ? dailyEditProducts : products.slice(0, 4);

  // Today's formatted date (Indian locale)
  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <section id="daily-edit" className="py-12 sm:py-16 bg-[#F7F5F0] border-b border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-black/8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono tracking-wider text-[#536B57] uppercase mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#536B57]" />
              <span>Curated Selection</span>
              <span className="text-black/30">/</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-[#B7A18D]" />
                <span>{todayFormatted}</span>
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
              The Daily Edit: {settings.dailyEditTitle}
            </h2>
            <p className="text-sm text-[#242424]/70 mt-1 max-w-xl">
              {settings.dailyEditSubtitle}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <span className="text-xs text-[#242424]/60 hidden sm:inline">
              Curated by Raftaar Solutions
            </span>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/admin/login';
                }
              }}
              className="text-xs text-[#536B57] hover:underline underline-offset-2 font-mono flex items-center space-x-1 cursor-pointer"
            >
              <span>Admin Portal</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
