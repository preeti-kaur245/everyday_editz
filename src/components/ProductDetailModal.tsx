import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Zap, 
  Star, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Share2,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';
import { ProductIllustration } from './ProductIllustration';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    setIsCheckoutOpen,
    products,
    showToast,
    setIsEnquiryOpen,
    setEnquiryProduct,
    setIsWaitlistOpen,
    setWaitlistProduct,
    submitFeedback,
    currentCustomer
  } = useStore();

  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedColorHex, setSelectedColorHex] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'editorial' | 'specs' | 'how-to' | 'reviews'>('editorial');
  const [pincodeQuery, setPincodeQuery] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imgErrorMap, setImgErrorMap] = useState<Record<number, boolean>>({});

  // New review form state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!selectedProduct) return null;

  const product = selectedProduct;
  const isFavorited = isInWishlist(product.id);

  // Gallery and active image state
  const imagesList = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = imagesList[activeImageIndex] || imagesList[0];
  const isCurrentImageErrored = Boolean(imgErrorMap[activeImageIndex]);

  React.useEffect(() => {
    setActiveImageIndex(0);
    setImgErrorMap({});
  }, [product.id]);

  // Set default variant if unselected
  const currentVariant = selectedVariant || (product.variants && product.variants[0]?.options[0]?.label);

  const handleSelectVariantOption = (option: { label: string; colorHex?: string }) => {
    setSelectedVariant(option.label);
    if (option.colorHex) {
      setSelectedColorHex(option.colorHex);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, currentVariant);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeQuery.length === 6) {
      setPincodeResult('Express Delivery available: 2-3 business days via Delhivery');
    } else {
      setPincodeResult('Please enter a valid 6-digit Indian PIN code');
    }
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `${product.name} — ${product.tagline}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied!');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    setIsSubmittingReview(true);
    submitFeedback({
      customerId: currentCustomer?.id,
      customerName: newReviewAuthor.trim(),
      productName: product.name,
      productId: product.id,
      rating: newReviewRating,
      feedback: newReviewComment.trim(),
    });

    setIsSubmittingReview(false);
    setNewReviewAuthor('');
    setNewReviewCity('');
    setNewReviewComment('');
  };

  // Frequently bought together item
  const fbtItem = product.frequentlyBoughtWith
    ? products.find((p) => p.id === product.frequentlyBoughtWith?.[0])
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Modal Card Box */}
      <div className="relative w-full max-w-5xl bg-[#F7F5F0] sm:rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-screen sm:max-h-[92vh]">
        
        {/* Sticky Top Header on Modal */}
        <div className="sticky top-0 z-30 bg-[#F7F5F0]/95 backdrop-blur-md px-6 py-4 border-b border-black/8 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#536B57] uppercase tracking-wider flex-wrap">
            <span>{product.departments?.join(' · ') || 'Everyday Edit'}</span>
            <span className="text-black/30">/</span>
            <span>{product.subcategories?.[0] || 'Curated Tool'}</span>
            <span className="text-black/30">/</span>
            <span>SKU: {product.id}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShareProduct}
              className="p-2 text-[#242424]/60 hover:text-black rounded-full hover:bg-black/5 transition-colors cursor-pointer"
              title="Share product"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-2 text-[#242424]/70 hover:text-black rounded-full hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-10">
          
          {/* Main 2-Column Product Purchase Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 6-cols: Visual Showcase Gallery */}
            <div className="lg:col-span-6 flex flex-col space-y-4">
              <div className="w-full aspect-4/3 rounded-2xl bg-white border border-black/8 shadow-sm overflow-hidden relative group">
                {currentImage && !isCurrentImageErrored ? (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                    onError={() => setImgErrorMap(prev => ({ ...prev, [activeImageIndex]: true }))}
                  />
                ) : (
                  <ProductIllustration 
                    productId={product.id} 
                    variantColor={selectedColorHex}
                    className="w-full h-full"
                  />
                )}

                {/* Discount Badge */}
                {product.discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-[#242424] text-[#F7F5F0] text-xs font-mono font-semibold px-2.5 py-1 rounded shadow-xs">
                    SAVE {product.discountPercent}%
                  </span>
                )}

                {/* Multiple image counter pill */}
                {imagesList.length > 1 && (
                  <span className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {activeImageIndex + 1} / {imagesList.length}
                  </span>
                )}
              </div>

              {/* Multiple Uploaded Photos Thumbnails Gallery */}
              {imagesList.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                  {imagesList.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImageIndex === idx 
                          ? 'border-[#242424] ring-2 ring-[#242424]/20 shadow-sm' 
                          : 'border-black/10 hover:border-black/30 opacity-70 hover:opacity-100'
                      }`}
                      title={`View image ${idx + 1}`}
                    >
                      <img src={imgUrl} alt={`${product.name} photo ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] font-mono text-center py-0.5">
                          COVER
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Verified Trust Strip */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-[#242424]/80 py-3 bg-white rounded-xl border border-black/8">
                <div className="flex flex-col items-center justify-center p-1">
                  <Truck className="w-4 h-4 text-[#536B57] mb-1" />
                  <span className="font-medium text-[11px]">Free Ship ₹499+</span>
                </div>
                <div className="flex flex-col items-center justify-center p-1 border-x border-black/8">
                  <RotateCcw className="w-4 h-4 text-[#536B57] mb-1" />
                  <span className="font-medium text-[11px]">7-Day Replace</span>
                </div>
                <div className="flex flex-col items-center justify-center p-1">
                  <ShieldCheck className="w-4 h-4 text-[#536B57] mb-1" />
                  <span className="font-medium text-[11px]">Studio Tested</span>
                </div>
              </div>
            </div>

            {/* Right 6-cols: Purchase Module */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              <div>
                {/* Ratings */}
                <div className="flex items-center space-x-2 text-xs font-mono text-[#242424]/70 mb-2">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-3.5 h-3.5 ${star <= Math.round(product.rating) ? 'fill-amber-500' : 'text-zinc-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="font-bold text-[#242424]">{product.rating}</span>
                  <span className="text-black/40">·</span>
                  <span className="underline underline-offset-2 cursor-pointer" onClick={() => setActiveTab('reviews')}>
                    {product.reviewCount} Verified Indian Buyers
                  </span>
                </div>

                {/* Title & Tagline */}
                <h1 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-[#242424]/75 mt-1.5 leading-relaxed">
                  {product.tagline}
                </p>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-[#242424] font-mono tabular-nums">
                    ₹{product.price}
                  </span>
                  <del className="text-base text-black/40 font-mono tabular-nums">
                    ₹{product.originalPrice}
                  </del>
                  <span className="text-xs font-mono text-[#536B57] font-semibold bg-[#536B57]/10 px-2 py-0.5 rounded">
                    You Save ₹{product.originalPrice - product.price}
                  </span>
                </div>
                <div className="text-[11px] text-[#242424]/60 mt-1">
                  Inclusive of all taxes & GST invoices provided.
                </div>

                {product.ageSuitability && (
                  <div className="mt-3 p-2.5 rounded-xl bg-[#536B57]/10 text-xs font-mono text-[#536B57] space-y-0.5">
                    <div className="font-bold flex items-center space-x-1">
                      <span>✓ Age Recommended: {product.ageSuitability}</span>
                    </div>
                    {product.safetyInformation && (
                      <div className="text-[11px] text-[#242424]/75 font-sans">
                        {product.safetyInformation}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-black/8">
                  {product.variants.map((vGroup, idx) => (
                    <div key={idx}>
                      <div className="text-xs font-semibold text-[#242424] mb-2 flex items-center justify-between">
                        <span>Select {vGroup.name}:</span>
                        <span className="text-[#536B57] font-normal font-mono">{currentVariant}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {vGroup.options.map((opt) => {
                          const isOptSelected = currentVariant === opt.label;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => handleSelectVariantOption(opt)}
                              className={`px-3 py-2 text-xs font-medium rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
                                isOptSelected
                                  ? 'border-[#242424] bg-white text-[#242424] shadow-xs ring-1 ring-[#242424]'
                                  : 'border-black/10 bg-[#F7F5F0] hover:bg-white text-[#242424]/80'
                              }`}
                            >
                              {opt.colorHex && (
                                <span 
                                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                                  style={{ backgroundColor: opt.colorHex }}
                                />
                              )}
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Stepper & Stock status */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-medium text-[#242424]">Quantity:</span>
                  <div className="flex items-center border border-black/15 bg-white rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-black/60 hover:text-black cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-bold font-mono tabular-nums">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="p-2 text-black/60 hover:text-black cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-mono text-[#536B57] flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-[#536B57]" />
                  <span>In Stock ({product.stockCount} left)</span>
                </div>
              </div>

              {/* Purchase Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => addToCart(product, quantity, currentVariant)}
                  className="w-full py-3.5 bg-white border border-[#242424] text-[#242424] hover:bg-[#F2EFE9] font-semibold text-sm rounded-xl transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-[#242424] hover:bg-black text-[#F7F5F0] font-semibold text-sm rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#D9A6A0]" />
                  <span>Buy Now (Express)</span>
                </button>
              </div>

              {/* Wishlist toggle secondary */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-full py-2.5 text-xs font-medium text-[#242424]/80 hover:text-[#242424] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#D9A6A0] text-[#D9A6A0]' : ''}`} />
                <span>{isFavorited ? 'Saved in your Wishlist' : 'Save to Wishlist'}</span>
              </button>

              {/* Indian PIN Code Delivery Checker */}
              <div className="bg-white p-3.5 rounded-xl border border-black/8">
                <form onSubmit={checkPincode} className="flex items-center space-x-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit PIN code"
                    value={pincodeQuery}
                    onChange={(e) => setPincodeQuery(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 text-xs px-3 py-2 bg-[#F7F5F0] rounded-lg border border-black/10 focus:outline-hidden font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#242424] text-white text-xs font-medium rounded-lg hover:bg-black cursor-pointer shrink-0"
                  >
                    Check PIN
                  </button>
                </form>
                {pincodeResult && (
                  <p className="text-[11px] text-[#536B57] mt-2 font-medium">
                    {pincodeResult}
                  </p>
                )}
              </div>

              {/* CRM Interactive Touchpoints: Enquiry & Waitlist */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setEnquiryProduct(product);
                    setIsEnquiryOpen(true);
                  }}
                  className="py-2.5 px-3 bg-white hover:bg-black/5 text-[#242424] text-xs font-semibold rounded-xl border border-black/10 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Ask a Question / Enquiry</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWaitlistProduct(product);
                    setIsWaitlistOpen(true);
                  }}
                  className="py-2.5 px-3 bg-[#D9A6A0]/15 hover:bg-[#D9A6A0]/25 text-[#242424] text-xs font-semibold rounded-xl border border-[#D9A6A0]/30 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Join VIP Waitlist</span>
                </button>
              </div>

            </div>

          </div>

          {/* Frequently Bought Together Bundle suggestion */}
          {fbtItem && (
            <div className="bg-white rounded-2xl border border-black/8 p-5">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#536B57] mb-3">
                Frequently Bought Together
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl bg-[#F7F5F0] overflow-hidden shrink-0">
                    <ProductIllustration productId={product.id} className="w-full h-full scale-75" />
                  </div>
                  <span className="text-lg font-bold text-black/40">+</span>
                  <div className="w-16 h-16 rounded-xl bg-[#F7F5F0] overflow-hidden shrink-0">
                    <ProductIllustration productId={fbtItem.id} className="w-full h-full scale-75" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#242424]">
                      {product.name.slice(0, 30)}... + {fbtItem.name.slice(0, 30)}...
                    </h4>
                    <div className="text-xs font-mono text-[#242424] font-bold mt-0.5">
                      Combined: ₹{product.price + fbtItem.price}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart(product, 1);
                    addToCart(fbtItem, 1);
                    showToast('Added duo pairing to bag!');
                  }}
                  className="px-4 py-2 bg-[#F7F5F0] hover:bg-[#242424] hover:text-white text-xs font-semibold rounded-xl border border-black/10 transition-colors shrink-0 cursor-pointer"
                >
                  Add Both to Bag
                </button>
              </div>
            </div>
          )}

          {/* 10-Point Editorial Description Panels Tabs */}
          <div className="bg-white rounded-2xl border border-black/8 overflow-hidden">
            
            {/* Tabs Header */}
            <div className="flex border-b border-black/8 bg-[#FAF8F5] overflow-x-auto no-scrollbar">
              {[
                { id: 'editorial', label: '1. The Everyday Edit & Story' },
                { id: 'specs', label: '2. Specifications & Dimensions' },
                { id: 'how-to', label: '3. How to Use & Notes' },
                { id: 'reviews', label: `4. Reviews (${product.reviews.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-[#242424] text-[#242424] bg-white'
                      : 'border-transparent text-[#242424]/60 hover:text-[#242424]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Editorial & Problem It Solves */}
            {activeTab === 'editorial' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#536B57] mb-1">
                    The Everyday Edit
                  </h3>
                  <p className="text-sm text-[#242424]/85 leading-relaxed">
                    {product.editorial.everydayEdit}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-black/5">
                  <div>
                    <h4 className="text-xs font-bold text-[#242424] mb-2 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D9A6A0]" />
                      <span>Why You'll Love It</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-[#242424]/80">
                      {product.editorial.whyYouLoveIt.map((benefit, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-[#536B57] shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#242424] mb-2 flex items-center space-x-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#536B57]" />
                      <span>The Problem It Solves</span>
                    </h4>
                    <p className="text-xs text-[#242424]/80 leading-relaxed bg-[#F7F5F0] p-3.5 rounded-xl border border-black/5">
                      {product.editorial.problemItSolves}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5">
                  <h4 className="text-xs font-bold text-[#242424] mb-2">Key Features</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#242424]/80">
                    {product.editorial.keyFeatures.map((feat, i) => (
                      <div key={i} className="flex items-center space-x-2 bg-[#FAF8F5] p-2.5 rounded-lg border border-black/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#536B57]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Specs & Dimensions */}
            {activeTab === 'specs' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#536B57] mb-3">
                    Technical Specifications
                  </h3>
                  <div className="border border-black/8 rounded-xl overflow-hidden divide-y divide-black/8 text-xs">
                    {Object.entries(product.editorial.specifications).map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row py-2.5 px-4 bg-white sm:even:bg-[#FAF8F5]">
                        <span className="w-48 font-medium text-[#242424]/70">{key}</span>
                        <span className="text-[#242424] font-mono mt-0.5 sm:mt-0">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-black/5 text-xs">
                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-black/5">
                    <span className="font-bold text-[#242424] block mb-1">Materials & Build</span>
                    <p className="text-[#242424]/80">{product.editorial.materialAndDimensions.material}</p>
                    <p className="text-black/50 font-mono mt-1">{product.editorial.materialAndDimensions.dimensions} · {product.editorial.materialAndDimensions.weight}</p>
                  </div>

                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-black/5">
                    <span className="font-bold text-[#242424] block mb-1">Package Contents</span>
                    <ul className="space-y-1 text-[#242424]/80">
                      {product.editorial.packageContents.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: How to Use & Notes */}
            {activeTab === 'how-to' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#536B57] mb-3">
                    Step-by-Step Usage Guide
                  </h3>
                  <div className="space-y-3">
                    {product.editorial.howToUse.map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-3 text-xs bg-[#FAF8F5] p-3 rounded-xl border border-black/5">
                        <span className="w-5 h-5 rounded-full bg-[#242424] text-white flex items-center justify-center font-mono text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-[#242424]/85 leading-relaxed pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5">
                  <h4 className="text-xs font-bold text-[#242424] mb-2 flex items-center space-x-1.5 text-amber-700">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Important Product Notes & Limitations</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#242424]/80 bg-amber-50/50 p-4 rounded-xl border border-amber-200/40">
                    {product.editorial.limitations.map((note, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 4: Genuine Reviews */}
            {activeTab === 'reviews' && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-black/8">
                  <div>
                    <h3 className="text-sm font-bold text-[#242424]">
                      Verified Indian Customer Reviews
                    </h3>
                    <p className="text-xs text-[#242424]/60">
                      Real feedback from verified purchasers across Indian cities.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono text-[#242424]">{product.rating} / 5.0</div>
                    <div className="text-[11px] text-[#536B57] font-semibold">100% Genuine Reviews</div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-black/5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-[#242424]">{rev.author}</span>
                          <span className="text-[10px] text-black/40">({rev.location})</span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] font-mono text-[#536B57] bg-[#536B57]/10 px-1.5 py-0.5 rounded">
                              Verified Order
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-black/40 font-mono">{rev.date}</span>
                      </div>

                      <div className="flex items-center text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-500' : 'text-zinc-300'}`} />
                        ))}
                      </div>

                      <h5 className="text-xs font-semibold text-[#242424]">{rev.title}</h5>
                      <p className="text-xs text-[#242424]/80 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Add a Verified Review Form */}
                <form onSubmit={handleAddReview} className="pt-6 border-t border-black/8 space-y-3">
                  <h4 className="text-xs font-bold text-[#242424]">Write a Review</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      required
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="text-xs px-3 py-2 bg-white rounded-lg border border-black/10 focus:outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="Your City (e.g. Mumbai, New Delhi, Ludhiana)"
                      value={newReviewCity}
                      onChange={(e) => setNewReviewCity(e.target.value)}
                      className="text-xs px-3 py-2 bg-white rounded-lg border border-black/10 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-[#242424]/70">Your Rating:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setNewReviewRating(num)}
                          className="p-1 cursor-pointer"
                        >
                          <Star className={`w-4 h-4 ${num <= newReviewRating ? 'text-amber-500 fill-amber-500' : 'text-zinc-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Describe how this item upgraded your daily routine..."
                    required
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-black/10 focus:outline-hidden"
                  />

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-4 py-2 bg-[#242424] text-white text-xs font-semibold rounded-lg hover:bg-black transition-colors cursor-pointer"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Post Verified Review'}
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
