import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Department, Product } from '../types';
import { ProductCard } from './ProductCard';
import { 
  ArrowLeft, 
  Sparkles, 
  Flame, 
  Clock, 
  ArrowUpDown, 
  Search, 
  ShieldCheck, 
  Heart,
  SlidersHorizontal
} from 'lucide-react';

interface DepartmentLandingPageProps {
  departmentId: Department;
}

export const DepartmentLandingPage: React.FC<DepartmentLandingPageProps> = ({ departmentId }) => {
  const { 
    departments, 
    products, 
    selectedSubcategory, 
    setSelectedSubcategory, 
    returnToHome,
    activePriceTier,
    setActivePriceTier
  } = useStore();

  const [departmentSearch, setDepartmentSearch] = useState('');
  const [onlyBestSellers, setOnlyBestSellers] = useState(false);
  const [onlyNewArrivals, setOnlyNewArrivals] = useState(false);
  const [onlyTrending, setOnlyTrending] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');

  const currentDept = departments.find((d) => d.id === departmentId) || departments[0];

  // Filter products strictly belonging to this department
  const departmentProducts = useMemo(() => {
    return products.filter((p) => {
      // Must belong to this department
      if (!p.departments || !p.departments.includes(departmentId)) {
        return false;
      }

      // Subcategory filter
      if (selectedSubcategory && !p.subcategories?.includes(selectedSubcategory)) {
        return false;
      }

      // Price Tier filter
      if (activePriceTier === 'under-199' && p.price > 199) return false;
      if (activePriceTier === 'under-299' && p.price > 299) return false;
      if (activePriceTier === 'under-499' && p.price > 499) return false;
      if (activePriceTier === 'under-999' && p.price > 999) return false;

      // Badge filters
      if (onlyBestSellers && !p.isBestSeller) return false;
      if (onlyNewArrivals && !p.isNewArrival) return false;
      if (onlyTrending && !p.isTrending) return false;

      // Department Search query
      if (departmentSearch.trim()) {
        const q = departmentSearch.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesTag = p.tagline.toLowerCase().includes(q);
        const matchesSub = p.subcategories?.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesTag && !matchesSub) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [products, departmentId, selectedSubcategory, activePriceTier, onlyBestSellers, onlyNewArrivals, onlyTrending, departmentSearch, sortBy]);

  // Distinct visual styling per department (Section 12)
  const getDepartmentHeroTheme = () => {
    switch (departmentId) {
      case 'women':
        return {
          bgGradient: 'from-[#FAF6F4] via-[#F7F2EE] to-[#F7F5F0]',
          accentBorder: 'border-[#D9A6A0]/40',
          badgeText: 'text-[#8C5E58]',
          badgeBg: 'bg-[#D9A6A0]/20',
          heroIcon: '✨',
          leadProof: 'Dermatologically Safe & Studio Curated for Modern Women',
        };
      case 'men':
        return {
          bgGradient: 'from-[#F2EFE9] via-[#EBE7DF] to-[#F7F5F0]',
          accentBorder: 'border-[#B7A18D]/40',
          badgeText: 'text-[#4A3E35]',
          badgeBg: 'bg-[#B7A18D]/20',
          heroIcon: '⚡',
          leadProof: 'Built Tough with Aircraft Alloys & Waxed Heavy Canvas',
        };
      case 'kids':
        return {
          bgGradient: 'from-[#F3F7F4] via-[#EBF2ED] to-[#F7F5F0]',
          accentBorder: 'border-[#536B57]/30',
          badgeText: 'text-[#354838]',
          badgeBg: 'bg-[#536B57]/15',
          heroIcon: '🎨',
          leadProof: '100% Non-Toxic, BPA-Free & Child Safety Certified',
        };
      case 'home-lifestyle':
      default:
        return {
          bgGradient: 'from-[#F4F3EF] via-[#EFECE5] to-[#F7F5F0]',
          accentBorder: 'border-black/10',
          badgeText: 'text-[#242424]',
          badgeBg: 'bg-black/5',
          heroIcon: '🏡',
          leadProof: 'Space-Saving Tools to Declutter Indian Living Spaces',
        };
    }
  };

  const theme = getDepartmentHeroTheme();

  return (
    <div className="min-h-screen bg-[#F7F5F0] pb-16">
      
      {/* Department Hero Banner */}
      <section className={`relative overflow-hidden bg-gradient-to-b ${theme.bgGradient} border-b border-black/8 pt-8 pb-12 sm:pt-12 sm:pb-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Back Button */}
          <div className="mb-6">
            <button
              onClick={returnToHome}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-[#242424]/70 hover:text-black transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Curations & Home</span>
            </button>
          </div>

          <div className="max-w-3xl">
            <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider mb-3 ${theme.badgeBg} ${theme.badgeText}`}>
              <span>{theme.heroIcon}</span>
              <span>{currentDept.name}’s Department</span>
              <span>·</span>
              <span>{departmentProducts.length} Verified Finds</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-[#242424] tracking-tight mb-4">
              {currentDept.tagline}
            </h1>

            <p className="text-sm sm:text-base text-[#242424]/80 leading-relaxed mb-6">
              {currentDept.description}
            </p>

            <div className="flex items-center space-x-2 text-xs font-mono text-[#536B57]">
              <ShieldCheck className="w-4 h-4" />
              <span>{theme.leadProof}</span>
            </div>
          </div>

        </div>
      </section>

      {/* Sticky Subcategory & Filter Bar */}
      <div className="sticky top-18 z-30 bg-white/95 backdrop-blur-md border-b border-black/8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          
          {/* Subcategories Horizontal Scroll */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedSubcategory(null)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedSubcategory === null
                  ? 'bg-[#242424] text-white shadow-xs'
                  : 'bg-[#F7F5F0] text-[#242424]/80 hover:bg-[#F2EFE9]'
              }`}
            >
              All {currentDept.name} ({products.filter((p) => p.departments?.includes(departmentId)).length})
            </button>

            {currentDept.subcategories.map((subcat) => {
              const isSubSelected = selectedSubcategory === subcat;
              const subCount = products.filter(
                (p) => p.departments?.includes(departmentId) && p.subcategories?.includes(subcat)
              ).length;

              return (
                <button
                  key={subcat}
                  onClick={() => setSelectedSubcategory(isSubSelected ? null : subcat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSubSelected
                      ? 'bg-[#242424] text-white shadow-xs'
                      : 'bg-[#F7F5F0] text-[#242424]/80 hover:bg-[#F2EFE9]'
                  }`}
                >
                  {subcat} <span className="opacity-60 text-[10px]">({subCount})</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Controls (Price, Badges, Search within Department, Sort) */}
          <div className="mt-3 pt-3 border-t border-black/5 flex flex-wrap items-center justify-between gap-3">
            
            {/* Price Segmented Filters (Section 11) */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-mono text-black/50 hidden sm:inline mr-1">Price:</span>
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under-199', label: 'Under ₹199' },
                { id: 'under-299', label: 'Under ₹299' },
                { id: 'under-499', label: 'Under ₹499' },
                { id: 'under-999', label: 'Under ₹999' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setActivePriceTier(tier.id as any)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer font-medium ${
                    activePriceTier === tier.id
                      ? 'bg-[#242424] text-white'
                      : 'bg-[#FAF8F5] text-black/70 hover:bg-[#F2EFE9] border border-black/5'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            {/* Quick Badges & Search */}
            <div className="flex items-center space-x-3">
              {/* Best Sellers */}
              <button
                onClick={() => setOnlyBestSellers(!onlyBestSellers)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer flex items-center space-x-1 ${
                  onlyBestSellers ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-black/70 border-black/10'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Best Sellers</span>
              </button>

              {/* Trending */}
              <button
                onClick={() => setOnlyTrending(!onlyTrending)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer flex items-center space-x-1 ${
                  onlyTrending ? 'bg-[#D9A6A0]/30 text-black border-[#D9A6A0]' : 'bg-white text-black/70 border-black/10'
                }`}
              >
                <Flame className="w-3 h-3 text-[#D9A6A0]" />
                <span>Trending</span>
              </button>

              {/* In-Department Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-black/40" />
                <input
                  type="text"
                  placeholder={`Search ${currentDept.name}...`}
                  value={departmentSearch}
                  onChange={(e) => setDepartmentSearch(e.target.value)}
                  className="w-36 sm:w-48 pl-8 pr-2 py-1 text-xs bg-[#FAF8F5] rounded-lg border border-black/10 focus:outline-hidden"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-black/40" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs bg-transparent border-none text-[#242424] font-medium focus:outline-hidden cursor-pointer"
                >
                  <option value="recommended">Best Match</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Department Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {departmentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departmentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-black/8 p-8 max-w-md mx-auto">
            <SlidersHorizontal className="w-10 h-10 text-black/30 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#242424]">No matching items found</h3>
            <p className="text-xs text-[#242424]/70 mt-1 mb-4">
              Try resetting the price tier filter or clearing your search.
            </p>
            <button
              onClick={() => {
                setSelectedSubcategory(null);
                setActivePriceTier('all');
                setDepartmentSearch('');
                setOnlyBestSellers(false);
                setOnlyTrending(false);
              }}
              className="px-4 py-2 bg-[#242424] text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
