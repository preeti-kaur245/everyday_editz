import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Grid, Compass, Heart, ShoppingBag } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { 
    cartCount, 
    wishlist, 
    setIsCartOpen, 
    setIsReelsOpen,
    returnToHome,
    selectedDepartment
  } = useStore();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHomeClick = () => {
    returnToHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopClick = () => {
    if (selectedDepartment) {
      returnToHome();
      setTimeout(() => scrollTo('shop-by-departments'), 50);
    } else {
      scrollTo('shop-by-departments');
    }
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-black/10 px-3 py-2 flex items-center justify-around text-xs shadow-lg">
      {/* Home */}
      <button
        onClick={handleHomeClick}
        className={`flex flex-col items-center justify-center py-1 px-3 transition-colors cursor-pointer ${!selectedDepartment ? 'text-[#242424] font-semibold' : 'text-[#242424]/70 hover:text-[#242424]'}`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* Shop All */}
      <button
        onClick={handleShopClick}
        className="flex flex-col items-center justify-center py-1 px-3 text-[#242424]/70 hover:text-[#242424] transition-colors cursor-pointer"
      >
        <Grid className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-medium">Depts</span>
      </button>

      {/* See It in Action (Reels) */}
      <button
        onClick={() => setIsReelsOpen(true)}
        className="flex flex-col items-center justify-center py-1 px-3 text-[#536B57] hover:text-[#242424] transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-[#536B57]/15 flex items-center justify-center mb-0.5">
          <Compass className="w-4 h-4 text-[#536B57]" />
        </div>
        <span className="text-[10px] font-bold">Reels</span>
      </button>

      {/* Wishlist */}
      <button
        onClick={() => scrollTo('wishlist-section')}
        className="flex flex-col items-center justify-center py-1 px-3 text-[#242424]/70 hover:text-[#242424] transition-colors relative cursor-pointer"
      >
        <Heart className="w-5 h-5 mb-0.5" />
        {wishlist.length > 0 && (
          <span className="absolute top-1 right-3 w-3.5 h-3.5 rounded-full bg-[#D9A6A0] text-[#242424] text-[9px] font-bold flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
        <span className="text-[10px] font-medium">Saved</span>
      </button>

      {/* Cart Bag */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center justify-center py-1 px-3 text-[#242424] transition-colors relative cursor-pointer"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 mb-0.5 text-[#242424]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#242424] text-white text-[9px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold">Bag</span>
      </button>
    </nav>
  );
};
