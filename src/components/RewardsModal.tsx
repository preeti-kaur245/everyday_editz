import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Gift, 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  History, 
  ArrowRight,
  Award
} from 'lucide-react';

export const RewardsModal: React.FC = () => {
  const { 
    isRewardsOpen, 
    setIsRewardsOpen, 
    rewardsBalance, 
    rewardsHistory, 
    referralCode,
    setIsCartOpen,
    showToast 
  } = useStore();

  if (!isRewardsOpen) return null;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://everyday_editz.in/?ref=${referralCode}`);
    showToast('Referral link copied! Share with friends to get ₹150 each.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-[#F7F5F0] sm:rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-screen sm:max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#242424] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-[#D9A6A0]" />
            <div>
              <h2 className="text-base font-bold">Editz Club Rewards</h2>
              <p className="text-[11px] text-[#B7A18D] font-mono">1 Point = ₹1 Instant Checkout Value</p>
            </div>
          </div>

          <button
            onClick={() => setIsRewardsOpen(false)}
            className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* Balance Spotlight Card */}
          <div className="bg-white p-6 rounded-2xl border border-black/8 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-black/50 font-medium">Available Balance</span>
              <div className="text-3xl font-bold font-mono text-[#242424] mt-0.5">
                {rewardsBalance} <span className="text-sm font-sans font-normal text-black/50">points</span>
              </div>
              <span className="text-xs text-[#536B57] font-semibold mt-1 block">
                Worth ₹{rewardsBalance} on your next order
              </span>
            </div>

            <button
              onClick={() => {
                setIsRewardsOpen(false);
                setIsCartOpen(true);
              }}
              className="px-4 py-2 bg-[#242424] hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Use in Bag
            </button>
          </div>

          {/* How to Earn Strip */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#536B57]">
              Ways to Accumulate Points
            </h4>

            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-black/8">
                <div className="w-8 h-8 rounded-full bg-[#536B57]/10 text-[#536B57] flex items-center justify-center mx-auto mb-1.5">
                  <Award className="w-4 h-4" />
                </div>
                <div className="font-bold text-[#242424]">10 Pts / ₹100</div>
                <div className="text-[10px] text-black/50 mt-0.5">On all purchases</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-black/8">
                <div className="w-8 h-8 rounded-full bg-[#D9A6A0]/20 text-[#242424] flex items-center justify-center mx-auto mb-1.5">
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="font-bold text-[#242424]">150 Pts</div>
                <div className="text-[10px] text-black/50 mt-0.5">Per friend referral</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-black/8">
                <div className="w-8 h-8 rounded-full bg-[#B7A18D]/20 text-[#242424] flex items-center justify-center mx-auto mb-1.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="font-bold text-[#242424]">50 Pts</div>
                <div className="text-[10px] text-black/50 mt-0.5">For verified review</div>
              </div>
            </div>
          </div>

          {/* Referral Code Box */}
          <div className="bg-white p-5 rounded-2xl border border-black/8 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#242424]">Your Personal Referral Code</h4>
                <p className="text-[11px] text-black/60">Friends get 10% off; you earn ₹150 store points.</p>
              </div>
              <span className="text-[11px] font-mono text-[#536B57] font-semibold">EDITZ CLUB</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex-1 px-3.5 py-2.5 bg-[#F7F5F0] rounded-xl border border-black/10 font-mono text-sm font-bold text-[#242424] tracking-wider select-all">
                {referralCode}
              </div>
              <button
                onClick={handleCopyReferral}
                className="px-4 py-2.5 bg-[#242424] text-white hover:bg-black text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>

          {/* Points History */}
          <div className="bg-white p-5 rounded-2xl border border-black/8 space-y-3">
            <h4 className="text-xs font-bold text-[#242424] flex items-center space-x-1.5">
              <History className="w-3.5 h-3.5 text-black/50" />
              <span>Points Activity Ledger</span>
            </h4>

            <div className="divide-y divide-black/5 text-xs">
              {rewardsHistory.map((tx) => (
                <div key={tx.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#242424]">{tx.title}</div>
                    <div className="text-[10px] text-black/40 font-mono">{tx.date}</div>
                  </div>
                  <span className={`font-mono font-bold ${tx.type === 'earned' ? 'text-emerald-700' : 'text-red-600'}`}>
                    {tx.type === 'earned' ? `+${tx.points}` : `-${tx.points}`} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
