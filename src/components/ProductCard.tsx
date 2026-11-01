import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, Plus, Star, Eye } from 'lucide-react';
import { ProductIllustration } from './ProductIllustration';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    setSelectedProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist 
  } = useStore();

  const isFavorited = isInWishlist(product.id);
  const [imgError, setImgError] = React.useState(false);
  const coverImage = product.images && product.images.length > 0 ? product.images[0] : null;
  const hasMultipleImages = Boolean(product.images && product.images.length > 1);

  return (
    <div className="group relative bg-white rounded-2xl border border-black/8 hover:border-black/15 transition-all duration-200 flex flex-col justify-between overflow-hidden hover:-translate-y-0.5 hover:shadow-md">
      
      {/* Top Image Showcase Area (65-70% height) */}
      <div 
        onClick={() => setSelectedProduct(product)}
        className="relative w-full aspect-4/3 bg-[#F2EFE9] overflow-hidden cursor-pointer"
      >
        {/* Product Image or Vector Illustration */}
        {coverImage && !imgError ? (
          <img
            src={coverImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <ProductIllustration 
            productId={product.id} 
            className="w-full h-full transform group-hover:scale-105 transition-transform duration-300" 
          />
        )}

        {/* Multi-image indicator */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-1.5 py-0.5 rounded pointer-events-none flex items-center space-x-1">
            <span>{product.images.length} photos</span>
          </div>
        )}

        {/* Top Badges / Indicators */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center space-x-1.5">
            {product.isBestSeller ? (
              <span className="text-[10px] font-mono font-bold tracking-wider text-amber-900 bg-amber-100/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
                BEST SELLER
              </span>
            ) : product.isNewArrival ? (
              <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-900 bg-emerald-100/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
                NEW
              </span>
            ) : product.isTrending ? (
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#242424] bg-[#D9A6A0]/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
                TRENDING
              </span>
            ) : product.discountPercent > 0 ? (
              <span className="text-[10px] font-mono font-semibold tracking-wider text-[#536B57] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
                {product.discountPercent}% OFF
              </span>
            ) : null}

            {product.videoCaption && (
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#242424] bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-xs flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>VIDEO</span>
              </span>
            )}
          </div>

          {/* Wishlist toggle button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-black/5 flex items-center justify-center text-[#242424] hover:text-[#D9A6A0] transition-colors shadow-xs cursor-pointer"
            aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isFavorited ? 'fill-[#D9A6A0] text-[#D9A6A0]' : 'text-current'
              }`} 
            />
          </button>
        </div>

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="w-full py-2 bg-white/95 backdrop-blur-md text-[#242424] text-xs font-semibold rounded-lg shadow-sm border border-black/5 hover:bg-white flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#536B57]" />
            <span>Quick Editorial View</span>
          </button>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          {/* Unboxed Quiet Metadata */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#242424]/60 font-mono uppercase tracking-wider mb-1.5 flex-wrap">
            <span>{product.subcategories?.[0] || product.needCategory || 'Everyday Edit'}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center text-[#242424]/75">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-0.5" />
              <span>{product.rating}</span>
              <span className="text-black/40 ml-0.5">({product.reviewCount})</span>
            </span>
            {product.ageSuitability && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#536B57] font-semibold">{product.ageSuitability}</span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => setSelectedProduct(product)}
            className="text-sm font-semibold text-[#242424] leading-snug line-clamp-2 hover:text-black transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short tagline and description preview */}
          <p className="text-xs text-[#242424]/75 line-clamp-1 mt-1 font-medium">
            {product.tagline}
          </p>
          {product.editorial?.problemItSolves && (
            <p className="text-[11px] text-[#242424]/60 line-clamp-2 mt-1 leading-snug">
              {product.editorial.problemItSolves}
            </p>
          )}
        </div>

        {/* Price & Buy Action row */}
        <div className="pt-3 mt-3 border-t border-black/5 flex items-center justify-between">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-base font-bold text-[#242424] font-mono tabular-nums">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <del className="text-xs text-black/40 font-mono tabular-nums">
                ₹{product.originalPrice}
              </del>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="px-3 py-1.5 bg-[#F7F5F0] hover:bg-[#242424] text-[#242424] hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 border border-black/8 hover:border-[#242424] cursor-pointer"
            aria-label={`Add ${product.name} to bag`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

      </div>
    </div>
  );
};
