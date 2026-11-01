import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product, ProductCategory } from '../types';
import { 
  ArrowUpDown, 
  Sparkles, 
  RotateCcw,
  Tag,
  Flame,
  Clock
} from 'lucide-react';

export const ShopAllSection: React.FC = () => {
  const { 
    products, 
    selectedNeed, 
    setSelectedNeed,
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery 
  } = useStore();

  const [activePriceTier, setActivePriceTier] = useState<string>('all');
  const [activeSort, setActiveSort] = useState<'recommended' | 'price-low' | 'price-high' | 'rating' | 'newest'>('recommended');
  const [onlyTrending, setOnlyTrending] = useState(false);
  const [onlyNewArrivals, setOnlyNewArrivals] = useState(false);

  // Categories list
  const categoryFilters: { id: ProductCategory; label: string }[] = [
    { id: 'workspace', label: 'Workspace' },
    { id: 'home-organise', label: 'Organise' },
    { id: 'travel', label: 'Travel' },
    { id: 'kitchen', label: 'Kitchen & Bar' },
    { id: 'lifestyle', label: 'Lifestyle' },
  ];

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesTag = item.tagline ? item.tagline.toLowerCase().includes(q) : false;
        const matchesCategory = item.category ? item.category.toLowerCase().includes(q) : false;
        const matchesNeed = item.needCategory ? item.needCategory.toLowerCase().includes(q) : false;
        const matchesDept = item.departments ? item.departments.some(d => d.toLowerCase().includes(q)) : false;
        const matchesSubcat = item.subcategories ? item.subcategories.some(s => s.toLowerCase().includes(q)) : false;
        if (!matchesName && !matchesTag && !matchesCategory && !matchesNeed && !matchesDept && !matchesSubcat) return false;
      }

      // Problem Need filter
      if (selectedNeed && item.needCategory !== selectedNeed) {
        return false;
      }

      // Category filter
      if (selectedCategory && item.category !== selectedCategory) {
        return false;
      }

      // Price Tiers
      if (activePriceTier === 'under-299' && item.price > 299) return false;
      if (activePriceTier === 'under-499' && item.price > 499) return false;
      if (activePriceTier === 'under-999' && item.price > 999) return false;

      // Badges
      if (onlyTrending && !item.isTrending) return false;
      if (onlyNewArrivals && !item.isNewArrival) return false;

      return true;
    }).sort((a, b) => {
      if (activeSort === 'price-low') return a.price - b.price;
      if (activeSort === 'price-high') return b.price - a.price;
      if (activeSort === 'rating') return b.rating - a.rating;
      if (activeSort === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
    });
  }, [products, searchQuery, selectedNeed, selectedCategory, activePriceTier, onlyTrending, onlyNewArrivals, activeSort]);

  const resetAllFilters = () => {
    setSelectedNeed(null);
    setSelectedCategory(null);
    setSearchQuery('');
    setActivePriceTier('all');
    setOnlyTrending(false);
    setOnlyNewArrivals(false);
    setActiveSort('recommended');
  };

  const hasActiveFilters = selectedNeed || selectedCategory || searchQuery || activePriceTier !== 'all' || onlyTrending || onlyNewArrivals;

  return (
    <section id="shop-all" className="py-12 sm:py-16 bg-[#F7F5F0] border-b border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-black/8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono tracking-wider text-[#536B57] uppercase mb-1.5">
              <span>Catalog Discovery</span>
              <span className="text-black/30">/</span>
              <span className="tabular-nums font-semibold">{filteredProducts.length} items found</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
              {selectedNeed ? `${selectedNeed}` : selectedCategory ? `${selectedCategory.toUpperCase()} COLLECTION` : 'The Full Everyday Catalogue'}
            </h2>
          </div>

          {/* Quick Price Segmented Buttons (Conforming to interactive filter rules) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#242424]/60 mr-1 hidden sm:inline">Price Picks:</span>
            
            {[
              { id: 'all', label: 'All Prices' },
              { id: 'under-299', label: 'Under ₹299' },
              { id: 'under-499', label: 'Under ₹499' },
              { id: 'under-999', label: 'Under ₹999' },
            ].map((tier) => (
              <button
                key={tier.id}
                onClick={() => setActivePriceTier(tier.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activePriceTier === tier.id
                    ? 'bg-[#242424] text-white shadow-xs'
                    : 'bg-white text-[#242424]/80 border border-black/8 hover:border-black/20'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Controls Row */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-black/8">
          
          {/* Categories Segmented Control */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedCategory === null
                  ? 'bg-[#F2EFE9] text-[#242424] font-semibold'
                  : 'text-[#242424]/70 hover:text-[#242424]'
              }`}
            >
              All Categories
            </button>
            {categoryFilters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#F2EFE9] text-[#242424] font-semibold border border-black/10'
                    : 'text-[#242424]/70 hover:text-[#242424]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Toggles & Sort Options */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Trending Button */}
            <button
              onClick={() => setOnlyTrending(!onlyTrending)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center space-x-1 cursor-pointer ${
                onlyTrending 
                  ? 'bg-[#D9A6A0]/25 text-[#242424] border border-[#D9A6A0]' 
                  : 'text-[#242424]/70 hover:text-[#242424]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#D9A6A0]" />
              <span>Trending Only</span>
            </button>

            {/* New Arrivals Button */}
            <button
              onClick={() => setOnlyNewArrivals(!onlyNewArrivals)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center space-x-1 cursor-pointer ${
                onlyNewArrivals 
                  ? 'bg-[#536B57]/20 text-[#242424] border border-[#536B57]' 
                  : 'text-[#242424]/70 hover:text-[#242424]'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#536B57]" />
              <span>New Arrivals</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 border-l border-black/10 pl-3">
              <ArrowUpDown className="w-3.5 h-3.5 text-black/50" />
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value as any)}
                className="bg-transparent text-xs font-medium text-[#242424] focus:outline-hidden cursor-pointer"
              >
                <option value="recommended">Curator's Pick</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="p-1.5 text-black/50 hover:text-black rounded-md hover:bg-[#F2EFE9] transition-colors"
                title="Reset all active filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-black/8 p-8 max-w-lg mx-auto">
            <Tag className="w-10 h-10 text-black/30 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-[#242424]">
              No exact matches in this view
            </h3>
            <p className="text-xs text-[#242424]/70 mt-1 mb-4">
              Try adjusting your price range or clearing the problem category filter.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 bg-[#242424] text-white text-xs font-medium rounded-lg hover:bg-black transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
