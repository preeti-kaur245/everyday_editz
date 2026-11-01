import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { ProductIllustration } from './ProductIllustration';

export const WishlistSection: React.FC = () => {
  const { wishlist, products, addToCart, toggleWishlist, setSelectedProduct } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  if (savedProducts.length === 0) return null;

  return (
    <section id="wishlist-section" className="py-12 sm:py-16 bg-[#F7F5F0] border-b border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/8">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-[#D9A6A0] mb-1">
              <Heart className="w-3.5 h-3.5 fill-[#D9A6A0]" />
              <span>Saved For Later</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
              Your Wishlist ({savedProducts.length})
            </h2>
          </div>

          <span className="text-xs text-black/50 font-mono hidden sm:inline">
            Saved across sessions
          </span>
        </div>

        {/* Saved Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-black/8 overflow-hidden flex flex-col justify-between hover:shadow-sm transition-all"
            >
              <div 
                onClick={() => setSelectedProduct(product)}
                className="w-full aspect-4/3 bg-[#F2EFE9] overflow-hidden cursor-pointer relative"
              >
                <ProductIllustration productId={product.id} className="w-full h-full" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-black/40 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h4 
                    onClick={() => setSelectedProduct(product)}
                    className="text-xs font-semibold text-[#242424] truncate cursor-pointer hover:underline"
                  >
                    {product.name}
                  </h4>
                  <div className="text-xs font-bold font-mono text-[#242424] mt-1">
                    ₹{product.price}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-black/5">
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      toggleWishlist(product.id);
                    }}
                    className="w-full py-2 bg-[#242424] hover:bg-black text-white text-xs font-medium rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D9A6A0]" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
