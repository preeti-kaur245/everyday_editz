import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProblemNeed } from '../types';
import { 
  FolderCheck, 
  Sparkles, 
  PlaneTakeoff, 
  Laptop, 
  Coffee, 
  Gift, 
  ArrowUpRight 
} from 'lucide-react';

interface NeedCategoryItem {
  id: ProblemNeed;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  count: number;
}

export const ShopByNeed: React.FC = () => {
  const { products, selectedNeed, setSelectedNeed } = useStore();

  const needCategories: NeedCategoryItem[] = [
    {
      id: 'Organise My Space',
      title: 'Organise My Space',
      subtitle: 'Cable management, trays & clutter killers',
      icon: FolderCheck,
      count: products.filter((p) => p.needCategory === 'Organise My Space').length,
    },
    {
      id: 'Make Life Easier',
      title: 'Make Life Easier',
      subtitle: 'Smart heat sealers, micro vacuums & lights',
      icon: Sparkles,
      count: products.filter((p) => p.needCategory === 'Make Life Easier').length,
    },
    {
      id: 'Travel Smarter',
      title: 'Travel Smarter',
      subtitle: 'Pocket steamers, RFID cards & pack tools',
      icon: PlaneTakeoff,
      count: products.filter((p) => p.needCategory === 'Travel Smarter').length,
    },
    {
      id: 'Upgrade My Workspace',
      title: 'Upgrade My Workspace',
      subtitle: 'Desk pads, bamboo risers & acoustic tools',
      icon: Laptop,
      count: products.filter((p) => p.needCategory === 'Upgrade My Workspace').length,
    },
    {
      id: 'Everyday Essentials',
      title: 'Everyday Essentials',
      subtitle: 'Tech cleaning pens & nano misters',
      icon: Coffee,
      count: products.filter((p) => p.needCategory === 'Everyday Essentials').length,
    },
    {
      id: 'Gifts Worth Giving',
      title: 'Gifts Worth Giving',
      subtitle: 'Ceramic travel tumblers & beverage chillers',
      icon: Gift,
      count: products.filter((p) => p.needCategory === 'Gifts Worth Giving').length,
    },
  ];

  const handleSelectNeed = (need: ProblemNeed) => {
    if (selectedNeed === need) {
      setSelectedNeed(null);
    } else {
      setSelectedNeed(need);
      const shopSection = document.getElementById('shop-all');
      if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="shop-by-need" className="py-12 sm:py-16 bg-[#F7F5F0] border-b border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-black/8 gap-4">
          <div>
            <div className="text-xs font-mono tracking-wider text-[#536B57] uppercase mb-1.5">
              Problem-Solving Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
              Shop by Your Need
            </h2>
            <p className="text-sm text-[#242424]/70 mt-1">
              Select a daily friction point to browse curated design solutions.
            </p>
          </div>

          {selectedNeed && (
            <button
              onClick={() => setSelectedNeed(null)}
              className="text-xs font-mono text-[#D9A6A0] hover:text-[#242424] underline underline-offset-2 cursor-pointer self-start sm:self-auto"
            >
              Clear filter ({selectedNeed})
            </button>
          )}
        </div>

        {/* 6 Problem Need Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {needCategories.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedNeed === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleSelectNeed(item.id)}
                className={`group p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#242424] text-white border-[#242424] shadow-md -translate-y-0.5'
                    : 'bg-white hover:bg-[#FAF8F5] border-black/8 hover:border-black/15 text-[#242424]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-white/10 text-[#D9A6A0]' 
                        : 'bg-[#F7F5F0] text-[#536B57] group-hover:bg-[#B7A18D]/20'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <ArrowUpRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                      isSelected ? 'text-[#D9A6A0]' : 'text-black/30 group-hover:text-black'
                    }`} />
                  </div>

                  <h3 className="text-base font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${
                    isSelected ? 'text-white/70' : 'text-[#242424]/65'
                  }`}>
                    {item.subtitle}
                  </p>
                </div>

                <div className={`pt-4 mt-4 border-t text-[11px] font-mono flex items-center justify-between ${
                  isSelected ? 'border-white/15 text-white/50' : 'border-black/5 text-black/40'
                }`}>
                  <span>{item.count} curated items</span>
                  <span className="font-sans font-medium hover:underline">
                    {isSelected ? 'Active Filter' : 'Explore'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
