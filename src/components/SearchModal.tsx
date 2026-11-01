import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Search, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Shield
} from 'lucide-react';
import { ProductIllustration } from './ProductIllustration';

export const SearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    products, 
    setSelectedProduct, 
    addToCart,
    setSearchQuery 
  } = useStore();

  const [term, setTerm] = useState('');
  const [saveHistory, setSaveHistory] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Vegan leather desk pad',
    'Heat bag sealer',
    'Travel clothes steamer',
  ]);

  const popularSearches = [
    'Travel toiletry organiser',
    'Silicone scalp massager',
    'Cable organiser pouch',
    'Period heating bag',
    'Shoe cleaning kit',
    'Kids activity books',
    'Desk cable management',
    'Packing cube sets',
  ];

  const results = useMemo(() => {
    if (!term.trim()) return [];
    const q = term.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.tagline ? p.tagline.toLowerCase().includes(q) : false) ||
        (p.category ? p.category.toLowerCase().includes(q) : false) ||
        (p.needCategory ? p.needCategory.toLowerCase().includes(q) : false) ||
        (p.departments ? p.departments.some((d) => d.toLowerCase().includes(q)) : false) ||
        (p.subcategories ? p.subcategories.some((s) => s.toLowerCase().includes(q)) : false)
    ).slice(0, 8);
  }, [term, products]);

  if (!isSearchOpen) return null;

  const handleSelectRecent = (queryText: string) => {
    setTerm(queryText);
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
  };

  const handleSelectProduct = (product: any) => {
    if (saveHistory && term.trim() && !recentSearches.includes(term.trim())) {
      setRecentSearches((prev) => [term.trim(), ...prev.slice(0, 4)]);
    }
    setSelectedProduct(product);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 pt-12 sm:pt-20 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-[#F7F5F0] rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-black/8 flex items-center space-x-3">
          <Search className="w-5 h-5 text-black/50 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search curations, problems, categories... (e.g. cable, desk, travel)"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none focus:outline-hidden text-[#242424] placeholder:text-black/40 font-medium"
          />
          {term && (
            <button
              onClick={() => setTerm('')}
              className="text-xs text-black/40 hover:text-black p-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-black/60 hover:text-black rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          
          {/* Active Live Results */}
          {term.trim() ? (
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#536B57] uppercase tracking-wider mb-3">
                <span>Matching Curations ({results.length})</span>
                <span className="text-black/40">Press Esc to exit</span>
              </div>

              {results.length > 0 ? (
                <div className="space-y-2.5">
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="bg-white p-3.5 rounded-xl border border-black/8 hover:border-black/20 transition-all flex items-center justify-between cursor-pointer group shadow-xs"
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-[#F7F5F0] overflow-hidden shrink-0">
                          <ProductIllustration productId={product.id} imageUrl={product.images?.[0]} className="w-full h-full scale-75" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-[#242424] truncate group-hover:text-black">
                            {product.name}
                          </h4>
                          <span className="text-[10px] text-black/50 font-mono">
                            {product.needCategory} · {product.discountPercent}% OFF
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        <span className="text-xs font-bold font-mono text-[#242424]">
                          ₹{product.price}
                        </span>
                        <ArrowRight className="w-4 h-4 text-black/30 group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-black/50">
                  No curations match "{term}". Try searching for "desk", "steamer", or "organize".
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Popular Searches Tags */}
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-[#536B57] mb-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Popular Searches in India</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setTerm(tag)}
                      className="px-3 py-1.5 bg-white hover:bg-[#FAF8F5] border border-black/8 hover:border-black/15 text-xs text-[#242424]/80 rounded-lg transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-black/50 mb-3">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      onClick={handleClearHistory}
                      className="text-[10px] text-black/40 hover:text-black underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {recentSearches.map((rec) => (
                      <div
                        key={rec}
                        onClick={() => handleSelectRecent(rec)}
                        className="py-1.5 px-3 rounded-lg hover:bg-white text-xs text-[#242424] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span>{rec}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-black/30" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy control */}
              <div className="pt-4 border-t border-black/8 flex items-center justify-between text-xs text-black/60">
                <span className="flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#536B57]" />
                  <span>Store search history locally</span>
                </span>
                <button
                  onClick={() => setSaveHistory(!saveHistory)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    saveHistory ? 'bg-[#536B57]' : 'bg-zinc-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    saveHistory ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
