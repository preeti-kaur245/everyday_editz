import React from 'react';
import { useStore } from '../context/StoreContext';
import { Department } from '../types';
import { ArrowUpRight, Sparkles, ShieldCheck, Heart } from 'lucide-react';

export const ShopByDepartmentSection: React.FC = () => {
  const { departments, products, navigateToDepartment } = useStore();

  const departmentMeta: Record<Department, {
    subtitle: string;
    highlights: string[];
    bgClass: string;
    badgeColor: string;
    cardBorder: string;
    promoTag: string;
  }> = {
    women: {
      subtitle: 'Everyday Beauty & Organisation',
      highlights: ['Travel Toiletry Organisers', 'Velvet Jewellery Cases', 'Anti-Frizz Hair Towels', 'Graphene Heating Belts'],
      bgClass: 'bg-gradient-to-br from-[#FAF5F2] via-[#F6ECE7] to-[#F1E2DC]',
      badgeColor: 'bg-[#D9A6A0] text-[#242424]',
      cardBorder: 'border-[#D9A6A0]/40',
      promoTag: '70% Marketing Focus · Trending Collection',
    },
    men: {
      subtitle: 'Grooming, Travel & Essentials',
      highlights: ['Sandalwood Beard Kits', 'Waxed Canvas Dopp Bags', 'Shockproof Tech Pouches', 'Shoe Care Sets'],
      bgClass: 'bg-gradient-to-br from-[#F2EFE9] via-[#E8E2D7] to-[#DFD7C9]',
      badgeColor: 'bg-[#242424] text-white',
      cardBorder: 'border-[#B7A18D]/40',
      promoTag: 'Precision Engineered for Daily Work & Travel',
    },
    kids: {
      subtitle: 'Little Things, Big Creativity',
      highlights: ['Reusable Wipe-Clean Activity Books', 'Talking Audio Flash Cards', 'Magnetic 3D Building Tiles', 'Spill-Proof Lunch Bags'],
      bgClass: 'bg-gradient-to-br from-[#F3F7F4] via-[#E4EFE7] to-[#D5E6D9]',
      badgeColor: 'bg-[#536B57] text-white',
      cardBorder: 'border-[#536B57]/30',
      promoTag: 'Zero-Screen Time · 100% Non-Toxic Safe',
    },
    'home-lifestyle': {
      subtitle: 'Make Everyday Living Easier',
      highlights: ['Expandable Drawer Dividers', 'Compression Packing Cubes', 'Clear Fridge Bins', 'Memory Foam Travel Pillows'],
      bgClass: 'bg-gradient-to-br from-[#F5F4F0] via-[#EAE7DF] to-[#E0DCCE]',
      badgeColor: 'bg-[#B7A18D] text-[#242424]',
      cardBorder: 'border-black/10',
      promoTag: 'Multi-Room Declutter Systems for Indian Living',
    },
  };

  return (
    <section id="shop-by-department" className="py-12 sm:py-16 bg-[#F7F5F0] border-b border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-black/8 gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-mono tracking-wider text-[#536B57] uppercase mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#536B57]" />
              <span>Core Departments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
              Shop by Department
            </h2>
            <p className="text-sm text-[#242424]/70 mt-1">
              Select your shopping focus to explore tailored tools, organizers, and everyday upgrades.
            </p>
          </div>
        </div>

        {/* 4 Asymmetric/Distinct Department Cards (Section 7) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* Card 1: WOMEN (Most visually prominent with 70% marketing weight - spans 7 cols on desktop) */}
          {(() => {
            const dept = departments.find((d) => d.id === 'women') || departments[0];
            const meta = departmentMeta['women'];
            const count = products.filter((p) => p.departments?.includes('women')).length;

            return (
              <div
                onClick={() => navigateToDepartment('women')}
                className={`lg:col-span-7 ${meta.bgClass} rounded-3xl p-7 sm:p-9 border ${meta.cardBorder} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${meta.badgeColor}`}>
                      WOMEN'S DEPARTMENT
                    </span>
                    <span className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#242424] group-hover:scale-110 transition-transform shadow-xs">
                      <ArrowUpRight className="w-5 h-5" />
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
                    Everyday Beauty & Organisation
                  </h3>
                  <p className="text-xs sm:text-sm text-[#242424]/75 mt-2 leading-relaxed max-w-lg">
                    {dept.description}
                  </p>

                  {/* Subcategories tags */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    {dept.subcategories.map((subcat) => (
                      <span
                        key={subcat}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToDepartment('women', subcat);
                        }}
                        className="px-3 py-1 bg-white/90 hover:bg-white text-xs text-[#242424] font-medium rounded-lg shadow-xs transition-colors border border-black/5"
                      >
                        {subcat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-black/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#536B57] font-semibold">{meta.promoTag}</span>
                  <span className="font-bold text-[#242424] underline underline-offset-4 group-hover:text-black">
                    Explore {count} Curations →
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Card 2: MEN (Spans 5 cols on desktop) */}
          {(() => {
            const dept = departments.find((d) => d.id === 'men') || departments[1];
            const meta = departmentMeta['men'];
            const count = products.filter((p) => p.departments?.includes('men')).length;

            return (
              <div
                onClick={() => navigateToDepartment('men')}
                className={`lg:col-span-5 ${meta.bgClass} rounded-3xl p-7 sm:p-9 border ${meta.cardBorder} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${meta.badgeColor}`}>
                      MEN'S DEPARTMENT
                    </span>
                    <span className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#242424] group-hover:scale-110 transition-transform shadow-xs">
                      <ArrowUpRight className="w-5 h-5" />
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#242424] tracking-tight">
                    Grooming, Travel & Essentials
                  </h3>
                  <p className="text-xs text-[#242424]/75 mt-2 leading-relaxed">
                    {dept.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-5">
                    {dept.subcategories.slice(0, 4).map((subcat) => (
                      <span
                        key={subcat}
                        className="px-2.5 py-1 bg-white/90 text-xs text-[#242424] font-medium rounded-lg shadow-xs border border-black/5"
                      >
                        {subcat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-black/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-black/60">{count} Curations</span>
                  <span className="font-bold text-[#242424] underline underline-offset-4">
                    Explore Men →
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Card 3: KIDS (Spans 5 cols on desktop) */}
          {(() => {
            const dept = departments.find((d) => d.id === 'kids') || departments[2];
            const meta = departmentMeta['kids'];
            const count = products.filter((p) => p.departments?.includes('kids')).length;

            return (
              <div
                onClick={() => navigateToDepartment('kids')}
                className={`lg:col-span-5 ${meta.bgClass} rounded-3xl p-7 sm:p-9 border ${meta.cardBorder} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${meta.badgeColor}`}>
                      KIDS' DEPARTMENT
                    </span>
                    <span className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#242424] group-hover:scale-110 transition-transform shadow-xs">
                      <ArrowUpRight className="w-5 h-5" />
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#242424] tracking-tight">
                    Little Things, Big Creativity
                  </h3>
                  <p className="text-xs text-[#242424]/75 mt-2 leading-relaxed">
                    {dept.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-5">
                    {dept.subcategories.slice(0, 3).map((subcat) => (
                      <span
                        key={subcat}
                        className="px-2.5 py-1 bg-white/90 text-xs text-[#242424] font-medium rounded-lg shadow-xs border border-black/5"
                      >
                        {subcat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-black/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-black/60">{count} Curations</span>
                  <span className="font-bold text-[#242424] underline underline-offset-4">
                    Explore Kids →
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Card 4: HOME & LIFESTYLE (Spans 7 cols on desktop) */}
          {(() => {
            const dept = departments.find((d) => d.id === 'home-lifestyle') || departments[3];
            const meta = departmentMeta['home-lifestyle'];
            const count = products.filter((p) => p.departments?.includes('home-lifestyle')).length;

            return (
              <div
                onClick={() => navigateToDepartment('home-lifestyle')}
                className={`lg:col-span-7 ${meta.bgClass} rounded-3xl p-7 sm:p-9 border ${meta.cardBorder} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${meta.badgeColor}`}>
                      HOME & LIFESTYLE
                    </span>
                    <span className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#242424] group-hover:scale-110 transition-transform shadow-xs">
                      <ArrowUpRight className="w-5 h-5" />
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
                    Make Everyday Living Easier
                  </h3>
                  <p className="text-xs sm:text-sm text-[#242424]/75 mt-2 leading-relaxed max-w-lg">
                    {dept.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-5">
                    {dept.subcategories.map((subcat) => (
                      <span
                        key={subcat}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToDepartment('home-lifestyle', subcat);
                        }}
                        className="px-3 py-1 bg-white/90 hover:bg-white text-xs text-[#242424] font-medium rounded-lg shadow-xs transition-colors border border-black/5"
                      >
                        {subcat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-black/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#536B57] font-semibold">{meta.promoTag}</span>
                  <span className="font-bold text-[#242424] underline underline-offset-4">
                    Explore {count} Curations →
                  </span>
                </div>
              </div>
            );
          })()}

        </div>

      </div>
    </section>
  );
};
