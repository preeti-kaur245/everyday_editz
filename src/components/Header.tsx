import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Department } from '../types';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  Gift, 
  SlidersHorizontal,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Flame,
  Clock,
  User
} from 'lucide-react';

interface HeaderProps {
  onNavigateHome: () => void;
  onNavigateShop?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome }) => {
  const { 
    cartCount, 
    wishlist, 
    departments,
    selectedDepartment,
    navigateToDepartment,
    returnToHome,
    setIsCartOpen, 
    setIsSearchOpen, 
    setIsAdminOpen, 
    setIsRewardsOpen,
    setIsAccountOpen,
    currentCustomer,
    setActivePriceTier
  } = useStore();

  const [activeMegaMenu, setActiveMegaMenu] = useState<Department | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDeptClick = (deptId: Department) => {
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    navigateToDepartment(deptId);
  };

  const handleSubcatClick = (deptId: Department, subcat: string) => {
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    navigateToDepartment(deptId, subcat);
  };

  const handleQuickCollection = (type: 'new' | 'trending') => {
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
    returnToHome();
    setTimeout(() => {
      const el = document.getElementById(type === 'new' ? 'new-arrivals-section' : 'trending-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F5F0]/95 backdrop-blur-md border-b border-black/8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden text-[#242424] hover:bg-black/5 rounded-lg cursor-pointer"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Wordmark */}
          <button
            onClick={() => {
              returnToHome();
              onNavigateHome();
            }}
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#242424] hover:opacity-85 transition-opacity whitespace-nowrap shrink-0 flex items-center space-x-1.5 text-left cursor-pointer"
          >
            <span>EVERYDAY_EDITZ</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A6A0]" />
          </button>
        </div>

        {/* Center: Desktop Navigation Bar with Mega-Menu (Section 1) */}
        <nav 
          onMouseLeave={() => setActiveMegaMenu(null)}
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#242424]/80 relative"
        >
          {/* Home */}
          <button
            onClick={() => {
              returnToHome();
              onNavigateHome();
            }}
            className={`hover:text-[#242424] transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 cursor-pointer ${
              selectedDepartment === null ? 'font-bold text-[#242424]' : ''
            }`}
          >
            Home
          </button>

          {/* Departments with Mega-Menu */}
          {departments.map((dept) => {
            const isSelected = selectedDepartment === dept.id;
            const isHovered = activeMegaMenu === dept.id;

            return (
              <div
                key={dept.id}
                onMouseEnter={() => setActiveMegaMenu(dept.id)}
                className="relative py-5"
              >
                <button
                  onClick={() => handleDeptClick(dept.id)}
                  className={`flex items-center space-x-1 hover:text-[#242424] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected ? 'font-bold text-[#242424]' : ''
                  }`}
                >
                  <span>{dept.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isHovered ? 'rotate-180' : ''}`} />
                </button>

                {/* Desktop Mega-Menu Dropdown */}
                {isHovered && (
                  <div 
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[540px] bg-white rounded-2xl shadow-xl border border-black/10 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/8">
                      <div>
                        <span className="text-xs font-mono uppercase tracking-wider text-[#536B57]">
                          Department of {dept.name}
                        </span>
                        <h4 className="text-sm font-bold text-[#242424] mt-0.5">{dept.tagline}</h4>
                      </div>
                      <button
                        onClick={() => handleDeptClick(dept.id)}
                        className="text-xs font-semibold text-[#536B57] hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <span>View All {dept.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {dept.subcategories.map((subcat) => (
                        <button
                          key={subcat}
                          onClick={() => handleSubcatClick(dept.id, subcat)}
                          className="p-3 text-left rounded-xl hover:bg-[#F7F5F0] transition-colors flex items-center justify-between group cursor-pointer border border-transparent hover:border-black/5"
                        >
                          <div>
                            <span className="text-xs font-semibold text-[#242424] group-hover:text-black">
                              {subcat}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-black/20 group-hover:text-[#242424] group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>

                    {/* Department mini banner footer */}
                    <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] text-[#242424]/60">
                      <span>Complimentary Pan-India shipping over ₹499</span>
                      <span className="font-mono text-[#536B57] font-semibold">100% Studio Tested</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* New Arrivals */}
          <button
            onClick={() => handleQuickCollection('new')}
            className="hover:text-[#242424] transition-colors whitespace-nowrap shrink-0 flex items-center space-x-1 hover:underline underline-offset-4 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#536B57]" />
            <span>New Arrivals</span>
          </button>

          {/* Trending */}
          <button
            onClick={() => handleQuickCollection('trending')}
            className="hover:text-[#242424] transition-colors whitespace-nowrap shrink-0 flex items-center space-x-1 text-[#242424] font-semibold cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-[#D9A6A0]" />
            <span>Trending</span>
          </button>
        </nav>

        {/* Right: Actions Cluster (Search, Wishlist, Bag, Rewards, Admin) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-[#242424]/75 hover:text-[#242424] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
            aria-label="Search catalogue"
            title="Search products"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Rewards button */}
          <button
            onClick={() => setIsRewardsOpen(true)}
            className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium text-[#242424] bg-[#B7A18D]/20 hover:bg-[#B7A18D]/30 transition-colors cursor-pointer"
            title="Editz Rewards Loyalty"
          >
            <Gift className="w-3.5 h-3.5 text-[#536B57]" />
            <span>Rewards</span>
          </button>

          {/* Customer Account Trigger */}
          <button
            onClick={() => setIsAccountOpen(true)}
            className="p-2 text-[#242424]/75 hover:text-[#242424] hover:bg-black/5 rounded-full transition-colors relative cursor-pointer"
            title={currentCustomer ? `Account: ${currentCustomer.firstName}` : "Sign In / Register"}
            aria-label="Customer Account"
          >
            <User className="w-5 h-5" />
            {currentCustomer && (
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#536B57] ring-2 ring-white" />
            )}
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={() => {
              returnToHome();
              setTimeout(() => {
                const el = document.getElementById('wishlist-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="p-2 text-[#242424]/75 hover:text-[#242424] hover:bg-black/5 rounded-full transition-colors relative cursor-pointer"
            aria-label="Wishlist"
            title="Saved finds"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D9A6A0] text-[#242424] font-bold text-[10px] flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-[#242424] text-[#F7F5F0] rounded-xl hover:bg-black transition-all shadow-sm cursor-pointer"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#D9A6A0]" />
            <span className="text-xs font-semibold tabular-nums">
              {cartCount > 0 ? `${cartCount} items` : 'Bag'}
            </span>
          </button>

          {/* Admin Dashboard trigger */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="p-2 text-[#242424]/60 hover:text-[#242424] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
            title="Store Admin Panel (No-Code)"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation (Section 1) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-black/10 px-6 py-6 space-y-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#536B57]">
              Departments & Curations
            </span>

            <div className="grid grid-cols-2 gap-2">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => handleDeptClick(dept.id)}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    selectedDepartment === dept.id
                      ? 'bg-[#242424] text-white border-[#242424]'
                      : 'bg-[#F7F5F0] text-[#242424] border-black/5 hover:border-black/20'
                  }`}
                >
                  <div className="font-bold text-xs">{dept.name}</div>
                  <div className={`text-[10px] line-clamp-1 mt-0.5 ${selectedDepartment === dept.id ? 'text-white/70' : 'text-black/50'}`}>
                    {dept.tagline}
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Collections */}
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => handleQuickCollection('new')}
                className="flex-1 py-2 text-xs font-medium rounded-lg bg-[#FAF8F5] border border-black/10 flex items-center justify-center space-x-1"
              >
                <Clock className="w-3.5 h-3.5 text-[#536B57]" />
                <span>New Arrivals</span>
              </button>
              <button
                onClick={() => handleQuickCollection('trending')}
                className="flex-1 py-2 text-xs font-medium rounded-lg bg-[#FAF8F5] border border-black/10 flex items-center justify-center space-x-1"
              >
                <Flame className="w-3.5 h-3.5 text-[#D9A6A0]" />
                <span>Trending</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
