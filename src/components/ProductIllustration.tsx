import React from 'react';

interface ProductIllustrationProps {
  productId: string;
  variantColor?: string;
  className?: string;
}

export const ProductIllustration: React.FC<ProductIllustrationProps> = ({
  productId,
  variantColor,
  className = 'w-full h-full',
}) => {
  const getColor = (defaultHex: string) => variantColor || defaultHex;

  // Render high-fidelity departmental product graphics
  switch (productId) {
    // ==========================================
    // WOMEN'S PRODUCTS
    // ==========================================
    case 'prod-w-toiletry-org': {
      const bagColor = getColor('#D9A6A0');
      return (
        <div className={`relative flex items-center justify-center bg-[#FAF8F5] overflow-hidden p-6 ${className}`}>
          <div className="relative w-36 h-44 rounded-2xl shadow-md border border-black/10 flex flex-col justify-between p-3" style={{ backgroundColor: bagColor }}>
            <div className="flex justify-between items-center pb-2 border-b border-black/10">
              <div className="w-5 h-5 rounded-full bg-[#242424] flex items-center justify-center text-white text-[9px] font-mono">360°</div>
              <div className="text-[9px] font-mono font-bold text-[#242424] uppercase tracking-wider">HANGING DOORS</div>
            </div>
            <div className="space-y-1.5 my-auto">
              <div className="h-6 rounded bg-white/70 border border-black/5 flex items-center justify-center text-[8px] font-mono text-black/50">PVC POUCH 01</div>
              <div className="h-6 rounded bg-white/70 border border-black/5 flex items-center justify-center text-[8px] font-mono text-black/50">PVC POUCH 02</div>
              <div className="h-8 rounded bg-white/90 border border-black/5 flex items-center justify-center text-[8px] font-mono font-bold text-[#242424]">LEAKPROOF TIER</div>
            </div>
            <div className="pt-2 border-t border-black/10 text-center text-[8px] font-mono text-black/60">WATERPROOF TWILL</div>
          </div>
        </div>
      );
    }

    case 'prod-w-jewellery-case': {
      const boxColor = getColor('#D9A6A0');
      return (
        <div className={`relative flex items-center justify-center bg-[#F7F5F0] overflow-hidden p-6 ${className}`}>
          <div className="w-32 h-32 rounded-2xl shadow-lg border border-black/10 flex flex-col justify-between p-3" style={{ backgroundColor: boxColor }}>
            <div className="flex justify-between items-center text-[8px] font-mono text-[#242424]/70">
              <span>VELVET CASE</span>
              <span>TANGLE-FREE</span>
            </div>
            <div className="grid grid-cols-4 gap-1 py-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 rounded-full bg-white/40 border border-white/60 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#242424]/40" />
                </div>
              ))}
            </div>
            <div className="h-6 rounded-lg bg-white/50 flex items-center justify-between px-2 text-[8px] font-mono text-[#242424]">
              <span>NECKLACE HOOKS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#242424]" />
            </div>
          </div>
        </div>
      );
    }

    case 'prod-w-brush-set':
      return (
        <div className={`relative flex items-center justify-center bg-[#FAF8F5] overflow-hidden p-6 ${className}`}>
          <div className="flex space-x-1.5 items-end">
            {[28, 34, 38, 36, 32, 26, 22, 20].map((h, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-2.5 rounded-t-full bg-[#D9A6A0] shadow-xs" style={{ height: `${h * 0.4}px` }} />
                <div className="w-2 bg-[#B7A18D] border-x border-black/10" style={{ height: '14px' }} />
                <div className="w-2.5 rounded-b-md bg-[#242424]" style={{ height: `${h * 1.5}px` }} />
              </div>
            ))}
          </div>
          <div className="absolute bottom-3 text-[9px] font-mono text-black/50">8-PC VEGAN SET</div>
        </div>
      );

    case 'prod-w-vanity-mirror':
      return (
        <div className={`relative flex items-center justify-center bg-[#FAF8F5] overflow-hidden p-6 ${className}`}>
          <div className="w-28 h-40 rounded-2xl bg-white shadow-xl border-4 border-[#F7F5F0] flex flex-col items-center justify-between p-3 relative">
            <div className="w-full flex justify-between text-[7px] font-mono text-black/40">
              <span>HD GLASS</span>
              <span>3 MODES</span>
            </div>
            <div className="w-16 h-20 rounded-xl bg-gradient-to-tr from-amber-50 via-white to-pink-50 border border-black/5 flex items-center justify-center shadow-inner">
              <div className="w-6 h-6 rounded-full bg-amber-100/60 border border-amber-300/60 animate-pulse" />
            </div>
            <div className="w-4 h-4 rounded-full border border-black/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#242424]" />
            </div>
          </div>
        </div>
      );

    case 'prod-w-period-heating-bag':
      return (
        <div className={`relative flex items-center justify-center bg-[#FAF8F5] overflow-hidden p-6 ${className}`}>
          <div className="w-44 h-20 rounded-2xl bg-[#D9A6A0] shadow-md border border-black/10 flex items-center justify-between px-4">
            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-[10px] font-bold text-white">3s</div>
            <div className="text-center">
              <div className="text-[10px] font-bold text-[#242424]">SOOTHE HEAT BELT</div>
              <div className="text-[8px] font-mono text-white">65°C · PULSE MASSAGE</div>
            </div>
            <div className="w-6 h-6 rounded-lg bg-[#242424] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            </div>
          </div>
        </div>
      );

    // ==========================================
    // MEN'S PRODUCTS
    // ==========================================
    case 'prod-m-beard-kit':
      return (
        <div className={`relative flex items-center justify-center bg-[#F7F5F0] overflow-hidden p-6 ${className}`}>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-36 h-16 rounded-xl bg-[#5C4033] shadow-md border border-black/15 flex flex-col justify-between p-2 text-white">
              <div className="text-[8px] font-mono tracking-widest text-amber-200">SANDALWOOD COMB</div>
              <div className="flex justify-between border-t border-white/20 pt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((s) => (
                  <div key={s} className="w-1 h-5 bg-[#3B281E] rounded-b-xs" />
                ))}
              </div>
            </div>
            <div className="text-[9px] font-mono text-[#242424]/60">ANTISTATIC · STEEL SHEARS</div>
          </div>
        </div>
      );

    case 'prod-m-toiletry-kit':
      return (
        <div className={`relative flex items-center justify-center bg-[#FAF8F5] overflow-hidden p-6 ${className}`}>
          <div className="w-40 h-24 rounded-2xl bg-[#3B3A36] shadow-xl border-t-4 border-[#B7A18D] flex flex-col justify-between p-3 text-white">
            <div className="flex justify-between items-center text-[8px] font-mono text-amber-100/70">
              <span>WAXED CANVAS</span>
              <span>16 OZ HEAVY</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#B7A18D]" />
              </div>
              <div className="text-[10px] font-bold">DOPP WASHBAG</div>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/20" />
          </div>
        </div>
      );

    case 'prod-m-cable-pouch':
      return (
        <div className={`relative flex items-center justify-center bg-[#F7F5F0] overflow-hidden p-6 ${className}`}>
          <div className="w-36 h-36 rounded-2xl bg-[#242424] shadow-xl border border-white/10 flex flex-col justify-between p-3 text-white">
            <div className="flex justify-between text-[8px] font-mono text-zinc-400">
              <span>SHOCKPROOF EDC</span>
              <span>2-TIER</span>
            </div>
            <div className="grid grid-cols-3 gap-2 my-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex flex-col items-center justify-center">
                  <div className="w-3 h-1 bg-[#D9A6A0] rounded-full mb-1" />
                  <div className="w-4 h-4 rounded-full border border-zinc-600" />
                </div>
              ))}
            </div>
            <div className="text-center text-[8px] font-mono text-[#B7A18D]">CABLES & CHARGERS</div>
          </div>
        </div>
      );

    case 'prod-m-wallet-organiser':
      return (
        <div className={`relative flex items-center justify-center bg-[#F7F5F0] overflow-hidden p-6 ${className}`}>
          <div className="w-32 h-20 rounded-xl bg-zinc-900 shadow-xl border border-zinc-700 flex flex-col justify-between p-3 text-white relative">
            <div className="flex justify-between text-[8px] font-mono text-zinc-400">
              <span>CARBON FIBER</span>
              <span>RFID BLOCK</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-8 h-5 rounded border border-zinc-600 bg-zinc-800" />
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center text-[8px] font-mono">12+</div>
            </div>
            <div className="w-12 h-2 rounded bg-zinc-700 self-center" />
          </div>
        </div>
      );

    case 'prod-m-watch-case':
      return (
        <div className={`relative flex items-center justify-center bg-[#F7F5F0] overflow-hidden p-6 ${className}`}>
          <div className="w-44 h-24 rounded-2xl bg-[#242424] shadow-2xl border border-white/10 flex items-center justify-around px-3">
            {[1, 2, 3].map((w) => (
              <div key={w} className="w-11 h-16 rounded-xl bg-zinc-800 border border-zinc-700 flex flex-col items-center justify-center p-1">
                <div className="w-7 h-7 rounded-full border-2 border-[#B7A18D] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <div className="w-4 h-3 bg-zinc-900 rounded-sm mt-1" />
              </div>
            ))}
          </div>
        </div>
      );

    // ==========================================
    // KIDS' PRODUCTS
    // ==========================================
    case 'prod-k-drawing-board':
      return (
        <div className={`relative flex items-center justify-center bg-[#FAF8F5] overflow-hidden p-6 ${className}`}>
          <div className="w-36 h-48 rounded-2xl bg-zinc-900 border-4 border-emerald-600 shadow-xl flex flex-col justify-between p-3 relative">
            <div className="flex justify-between items-center text-[7px] font-mono text-emerald-400">
              <span>8.5" LCD DOODLE</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="w-full h-28 rounded-lg bg-black border border-emerald-900/60 p-2 flex flex-col items-center justify-center relative overflow-hidden">
              <svg className="w-20 h-16 stroke-cyan-400 fill-none stroke-2" viewBox="0 0 100 80">
                <path d="M 10 50 Q 25 15 50 40 T 90 20" strokeLinecap="round" />
                <circle cx="30" cy="30" r="5" stroke="#f43f5e" />
                <path d="M 60 55 L 75 70 L 90 50" stroke="#facc15" strokeLinecap="round" />
              </svg>
              <div className="absolute bottom-1 right-2 text-[6px] font-mono text-cyan-300">PRESSURE SENSITIVE</div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center text-[7px] text-zinc-300">🗑️</div>
              <div className="text-[7px] font-mono text-zinc-400">STYLUS INCLUDED</div>
            </div>
          </div>
        </div>
      );

    case 'prod-k-activity-books':
      return (
        <div className={`relative flex items-center justify-center bg-[#FAF8F5] overflow-hidden p-6 ${className}`}>
          <div className="w-36 h-44 rounded-2xl bg-gradient-to-br from-amber-100 via-emerald-50 to-sky-100 shadow-md border-2 border-emerald-300 flex flex-col justify-between p-3">
            <div className="flex justify-between items-center text-[8px] font-bold text-emerald-800 font-mono">
              <span>WIPE-CLEAN</span>
              <span>AGES 3-7</span>
            </div>
            <div className="w-full h-20 rounded-xl bg-white border border-emerald-200 flex flex-col items-center justify-center p-2 shadow-inner">
              <div className="text-[11px] font-bold text-emerald-900">MINDPLAY LOGIC</div>
              <div className="flex space-x-1 mt-1">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-blue-400" />
              </div>
            </div>
            <div className="text-center text-[8px] font-mono text-emerald-700">8 DRY-ERASE PENS</div>
          </div>
        </div>
      );

    case 'prod-k-building-blocks':
      return (
        <div className={`relative flex items-center justify-center bg-[#FAF8F5] overflow-hidden p-6 ${className}`}>
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="w-20 h-20 bg-red-400/80 rounded-xl transform rotate-12 shadow-md border-2 border-white flex items-center justify-center text-white font-bold text-xs">
              MAGNET
            </div>
            <div className="w-20 h-20 bg-cyan-400/80 rounded-xl transform -rotate-12 -ml-6 shadow-md border-2 border-white flex items-center justify-center text-white font-bold text-xs">
              3D TILE
            </div>
          </div>
          <div className="absolute bottom-2 text-[9px] font-mono text-emerald-800 font-bold">48-PC STEM SET</div>
        </div>
      );

    case 'prod-k-lunch-bag':
      return (
        <div className={`relative flex items-center justify-center bg-[#FAF8F5] overflow-hidden p-6 ${className}`}>
          <div className="w-36 h-36 rounded-2xl bg-amber-50 shadow-md border-2 border-amber-300 flex flex-col justify-between p-3">
            <div className="w-16 h-3 rounded-full bg-amber-400 self-center -mt-1" />
            <div className="w-full h-16 rounded-xl bg-white flex flex-col items-center justify-center border border-amber-200">
              <div className="text-[10px] font-bold text-amber-900">THERMAL FOIL</div>
              <div className="text-[8px] font-mono text-amber-700">WARM FOR 5 HOURS</div>
            </div>
            <div className="text-center text-[8px] font-mono text-black/50">LEAKPROOF LINING</div>
          </div>
        </div>
      );

    case 'prod-k-water-bottle':
      return (
        <div className={`relative flex items-center justify-center bg-[#FAF8F5] overflow-hidden p-6 ${className}`}>
          <div className="flex flex-col items-center">
            <div className="w-8 h-6 rounded-t-lg bg-[#536B57] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <div className="w-16 h-32 rounded-b-2xl bg-gradient-to-b from-emerald-100 to-sky-100 border border-emerald-300 shadow-md p-2 flex flex-col justify-between items-center">
              <div className="text-[7px] font-mono text-emerald-800">TRITAN BPA FREE</div>
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-[9px] font-bold text-emerald-900">600ml</div>
              <div className="w-8 h-1 rounded-full bg-emerald-300" />
            </div>
          </div>
        </div>
      );

    // ==========================================
    // HOME & LIFESTYLE PRODUCTS
    // ==========================================
    case 'prod-hl-drawer-dividers':
      return (
        <div className={`relative flex items-center justify-center bg-[#FAF8F5] overflow-hidden p-6 ${className}`}>
          <div className="space-y-2 w-44">
            {[1, 2, 3].map((d) => (
              <div key={d} className="h-6 rounded-lg bg-white shadow-sm border border-black/15 flex items-center justify-between px-2">
                <div className="w-2 h-2 rounded-full bg-[#536B57]" />
                <span className="text-[8px] font-mono text-black/60">SPRING-LOCK EXPANDABLE</span>
                <div className="w-2 h-2 rounded-full bg-[#536B57]" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'prod-hl-packing-cubes':
      return (
        <div className={`relative flex items-center justify-center bg-[#F7F5F0] overflow-hidden p-6 ${className}`}>
          <div className="grid grid-cols-2 gap-2 w-40">
            <div className="h-16 rounded-xl bg-[#536B57] text-white p-2 flex flex-col justify-between shadow-sm">
              <span className="text-[7px] font-mono">XL CUBE</span>
              <span className="text-[8px] font-bold">COMPRESSION</span>
            </div>
            <div className="h-16 rounded-xl bg-[#B7A18D] text-white p-2 flex flex-col justify-between shadow-sm">
              <span className="text-[7px] font-mono">MED CUBE</span>
              <span className="text-[8px] font-bold">50% LESS AIR</span>
            </div>
            <div className="col-span-2 h-8 rounded-lg bg-[#242424] text-white px-3 flex items-center justify-between">
              <span className="text-[8px] font-mono">SHOE BAG INCLUDED</span>
              <span className="text-[8px] font-bold text-[#D9A6A0]">SET OF 6</span>
            </div>
          </div>
        </div>
      );

    case 'prod-hl-fridge-bins':
      return (
        <div className={`relative flex items-center justify-center bg-[#FAF8F5] overflow-hidden p-6 ${className}`}>
          <div className="w-40 h-24 rounded-xl bg-white/80 backdrop-blur-xs border-2 border-black/10 shadow-md p-2 flex flex-col justify-between">
            <div className="flex justify-between items-center text-[8px] font-mono text-black/50">
              <span>CLEAR PET</span>
              <span>STACKABLE</span>
            </div>
            <div className="flex space-x-1.5 justify-center py-1">
              <div className="w-6 h-6 rounded-full bg-red-400/40" />
              <div className="w-6 h-6 rounded-full bg-emerald-400/40" />
              <div className="w-6 h-6 rounded-full bg-amber-400/40" />
            </div>
            <div className="w-12 h-2 rounded-full bg-black/10 self-center" />
          </div>
        </div>
      );

    default:
      return (
        <div className={`relative flex items-center justify-center bg-[#F7F5F0] p-6 ${className}`}>
          <div className="w-24 h-24 rounded-2xl bg-white shadow-xs border border-black/10 flex flex-col items-center justify-center text-center p-2">
            <div className="w-3 h-3 rounded-full bg-[#536B57] mb-1" />
            <span className="text-[9px] font-mono text-black/50 uppercase font-bold">EVERYDAY</span>
            <span className="text-[7px] font-mono text-black/40">STUDIO FIND</span>
          </div>
        </div>
      );
  }
};
