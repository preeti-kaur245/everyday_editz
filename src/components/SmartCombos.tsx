import React from 'react';
import { useStore } from '../context/StoreContext';
import { Layers, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { ProductIllustration } from './ProductIllustration';

export const SmartCombos: React.FC = () => {
  const { bundles, products, addBundleToCart, setSelectedProduct } = useStore();

  return (
    <section id="smart-combos" className="py-12 sm:py-16 bg-[#F7F5F0] border-b border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-black/8 gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-mono tracking-wider text-[#536B57] uppercase mb-1.5">
              <Layers className="w-3.5 h-3.5 text-[#536B57]" />
              <span>Coordinated Sets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
              Smart Combos & Bundles
            </h2>
            <p className="text-sm text-[#242424]/70 mt-1 max-w-xl">
              Curated everyday toolkits designed to work seamlessly together with bundle savings.
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Bundle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bundles.map((bundle) => {
            const bundleItems = products.filter((p) => bundle.productIds.includes(p.id));

            return (
              <div
                key={bundle.id}
                className="bg-white rounded-2xl border border-black/8 p-6 flex flex-col justify-between hover:border-black/15 transition-all shadow-xs"
              >
                <div>
                  {/* Top Bar with Badge & Savings */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-medium text-[#536B57] bg-[#536B57]/10 px-2.5 py-0.5 rounded">
                      {bundle.badge}
                    </span>
                    <span className="text-xs font-mono text-emerald-700 font-semibold">
                      Save ₹{bundle.savings}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#242424]">
                    {bundle.title}
                  </h3>
                  <p className="text-xs text-[#242424]/70 mt-1">
                    {bundle.description}
                  </p>

                  {/* Included Items Thumbnails Strip */}
                  <div className="my-5 grid grid-cols-3 gap-3">
                    {bundleItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedProduct(item)}
                        className="group/item flex flex-col items-center bg-[#F7F5F0] rounded-xl p-2.5 border border-black/5 hover:border-black/15 transition-all cursor-pointer text-center"
                        title={item.name}
                      >
                        <div className="w-full aspect-square rounded-lg bg-white overflow-hidden mb-2 relative">
                          <ProductIllustration productId={item.id} imageUrl={item.images?.[0]} className="w-full h-full scale-90" />
                        </div>
                        <span className="text-[11px] font-medium text-[#242424] line-clamp-1 group-hover/item:underline">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-black/50 font-mono mt-0.5">
                          ₹{item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Checklist bullets */}
                  <div className="space-y-1.5 text-xs text-[#242424]/80 py-2">
                    <div className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#536B57] shrink-0" />
                      <span>1-Box Combined Eco Packaging</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#536B57] shrink-0" />
                      <span>Complimentary Pan-India Express Delivery</span>
                    </div>
                  </div>
                </div>

                {/* Footer Price & Add Bundle CTA */}
                <div className="pt-4 mt-4 border-t border-black/8 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-black/40">Combo Price</div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xl font-bold text-[#242424] font-mono tabular-nums">
                        ₹{bundle.bundlePrice}
                      </span>
                      <del className="text-xs text-black/40 font-mono tabular-nums">
                        ₹{bundle.originalPrice}
                      </del>
                    </div>
                  </div>

                  <button
                    onClick={() => addBundleToCart(bundle)}
                    className="px-4 py-2.5 bg-[#242424] hover:bg-black text-[#F7F5F0] rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#D9A6A0]" />
                    <span>Get Smart Combo</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
