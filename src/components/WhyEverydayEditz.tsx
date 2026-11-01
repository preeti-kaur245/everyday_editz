import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  Lock, 
  Mail, 
  Instagram, 
  MapPin,
  Building,
  Check,
  ArrowUpRight,
  HelpCircle,
  Clock
} from 'lucide-react';

export const WhyEverydayEditz: React.FC = () => {
  const { 
    setActivePolicy, 
    setIsTrackingOpen, 
    setIsReturnClaimOpen, 
    showToast,
    settings 
  } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const pillars = [
    {
      title: 'Hand-Tested Curations',
      description: 'Tested and verified by Raftaar Solutions before reaching the catalog. High-utility daily upgrades only.',
      icon: Sparkles,
      tag: '01 · Quality Standard',
    },
    {
      title: 'Clear Product Specifications',
      description: 'Exact materials, real dimensions, and honest functional details. Zero fabricated claims or inflated specs.',
      icon: Eye,
      tag: '02 · Honest Specs',
    },
    {
      title: 'Transparent Pricing & GST',
      description: 'No inflated fake MRPs or countdown tricks. Clear discounts and inclusive 18% GST invoice on every order.',
      icon: ShieldCheck,
      tag: '03 · True Pricing',
    },
    {
      title: 'Secure Indian Checkout',
      description: 'Bank-grade 256-bit encryption with instant UPI (GPay, PhonePe, Paytm, BHIM), RuPay, and Cards.',
      icon: Lock,
      tag: '04 · 100% Prepaid Security',
    },
    {
      title: 'Direct Support Desk',
      description: 'Direct communication via email and Instagram. Clear, responsive assistance without bot runarounds.',
      icon: Mail,
      tag: '05 · Verified Assistance',
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    showToast('Subscribed! Check your inbox for your 10% welcome voucher.');
  };

  const handleOpenAdminLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
      window.history.pushState(null, '', baseUrl + '/admin/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const instagramUrl = settings.instagramUrl || 'https://www.instagram.com/everyday_editz.in/';
  const isInstagramConfigured = Boolean(instagramUrl && instagramUrl.trim().startsWith('http'));
  const contactEmail = settings.contactEmail || 'manpreetkaurdeveloper2@gmail.com';
  const locationAddress = settings.operationsAddress || 'Delhi–Jalandhar GT Road (NH-1), Sirhind Side, Mandi Gobindgarh, Punjab – 147301, India';
  const brandName = settings.brandName || 'The Everyday Edit';
  const businessName = settings.businessName || 'Raftaar Solutions';

  return (
    <section className="bg-white border-b border-black/8 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section 1: Trust & Transparency */}
        <div id="trust-transparency" className="scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-[#536B57]">
              Trust & Transparency
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight mt-1">
              Why Shop With The Everyday Edit?
            </h2>
            <p className="text-xs sm:text-sm text-[#242424]/70 mt-2 leading-relaxed">
              We believe everyday objects shape how calm, productive, and organised your day feels. We maintain uncompromising standards for product authenticity and transparent operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div 
                  key={idx}
                  className="bg-[#F7F5F0] p-5 rounded-2xl border border-black/5 flex flex-col justify-between hover:border-black/15 transition-all"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white text-[#536B57] flex items-center justify-center mb-4 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#242424]">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#242424]/70 mt-1.5 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-black/5 text-[10px] font-mono text-[#536B57]">
                    {p.tag}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Studio Support & Contact */}
        <div id="studio-support-contact" className="scroll-mt-24 bg-[#F7F5F0] rounded-3xl p-6 sm:p-10 border border-black/8">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-[#536B57] flex items-center space-x-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>Studio Support & Contact</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight mt-1">
              Verified Business & Operations Desk
            </h3>
            <p className="text-xs sm:text-sm text-[#242424]/70 mt-2 leading-relaxed">
              Transparent identity and direct communication channels. We provide honest assistance for order inquiries, returns, and product questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Identity */}
            <div className="bg-white p-6 rounded-2xl border border-black/5 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#F7F5F0] text-[#536B57] flex items-center justify-center mb-3">
                  <Building className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-black/50">
                  Business Entity
                </div>
                <div className="text-base font-bold text-[#242424] mt-1">
                  {brandName}
                </div>
                <div className="text-xs text-black/70 mt-1">
                  Operations: <strong className="text-[#242424]">{businessName}</strong>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-black/5 text-[11px] text-black/50 font-mono">
                Indian Registered Operations
              </div>
            </div>

            {/* Email Contact */}
            <div className="bg-white p-6 rounded-2xl border border-black/5 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#F7F5F0] text-[#536B57] flex items-center justify-center mb-3">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-black/50">
                  Email Support
                </div>
                <div className="mt-1">
                  <a 
                    href={`mailto:${contactEmail}`}
                    className="text-xs sm:text-sm font-semibold text-[#242424] hover:text-[#536B57] underline underline-offset-4 break-all inline-flex items-center gap-1 group"
                  >
                    <span>{contactEmail}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                  </a>
                </div>
                <p className="text-xs text-black/60 mt-2">
                  Click to email our support desk for tracking, invoices, or product inquiries.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-black/5 text-[11px] text-[#536B57] font-mono">
                Primary Contact Channel
              </div>
            </div>

            {/* Instagram Contact */}
            <div className="bg-white p-6 rounded-2xl border border-black/5 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#F7F5F0] text-[#536B57] flex items-center justify-center mb-3">
                  <Instagram className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-black/50">
                  Instagram Channel
                </div>
                <div className="mt-1">
                  {isInstagramConfigured ? (
                    <a 
                      href={instagramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-semibold text-[#242424] hover:text-[#536B57] underline underline-offset-4 inline-flex items-center gap-1 group"
                    >
                      <span>@everyday_editz.in</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                    </a>
                  ) : (
                    <span className="text-xs text-black/50 italic">
                      Channel Link Pending Configuration
                    </span>
                  )}
                </div>
                <p className="text-xs text-black/60 mt-2">
                  Follow for daily product drops, design previews, and direct messaging.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-black/5 text-[11px] text-[#536B57] font-mono">
                Verified Social Link
              </div>
            </div>

            {/* Location & Operations Hub */}
            <div className="bg-white p-6 rounded-2xl border border-black/5 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#F7F5F0] text-[#536B57] flex items-center justify-center mb-3">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-black/50">
                  Operations & Dispatch Facility
                </div>
                <p className="text-xs text-[#242424] font-medium leading-relaxed mt-1">
                  {locationAddress}
                </p>
                <p className="text-[10px] text-black/50 mt-2 italic leading-relaxed">
                  * Note: Operational hub for inventory inspection and nationwide courier dispatch. Orders are processed online.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-black/5 text-[11px] text-black/50 font-mono">
                Punjab, India – 147301
              </div>
            </div>

          </div>
        </div>

        {/* Section 3: Newsletter & Community Signup */}
        <div className="bg-[#242424] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <span className="text-xs font-mono text-[#D9A6A0] uppercase tracking-wider">
              The Sunday Dispatch
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-white">
              Little Finds, Delivered to Your Inbox.
            </h3>
            <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
              Every Sunday morning, we share functional discoveries, desk setup ideas, and exclusive subscriber batch pricing.
            </p>
          </div>

          <div className="w-full md:max-w-md">
            {subscribed ? (
              <div className="bg-white/10 p-4 rounded-2xl border border-white/20 flex items-center space-x-3 text-white">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium">
                  Welcome to the Club! Your 10% promo code <strong>FIRST10</strong> is active.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-hidden focus:ring-1 focus:ring-[#D9A6A0]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#D9A6A0] hover:bg-[#c9958f] text-[#242424] font-semibold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    Join Club
                  </button>
                </div>
                <p className="text-[10px] text-white/40">
                  Zero spam. Unsubscribe anytime in 1-click.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Section 4: Site Footer Links */}
        <div className="pt-8 border-t border-black/8 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs text-[#242424]/75">
          <div className="col-span-2 space-y-3">
            <div className="text-lg font-bold text-[#242424] tracking-tight">
              {brandName.toUpperCase().replace(/\s+/g, '_')}
            </div>
            <p className="text-xs text-black/60 max-w-xs leading-relaxed">
              Little Finds. Big Everyday Upgrades. Curated functional lifestyle essentials for modern Indian living. Operations and nationwide fulfillment managed by {businessName}.
            </p>
            <div className="flex items-center space-x-3 pt-2 text-[#242424]">
              {isInstagramConfigured && (
                <a 
                  href={instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 rounded-full bg-[#F7F5F0] hover:bg-[#B7A18D]/20 transition-colors" 
                  title="Official Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              <a 
                href={`mailto:${contactEmail}`} 
                className="p-2 rounded-full bg-[#F7F5F0] hover:bg-[#B7A18D]/20 transition-colors cursor-pointer" 
                title="Email Support"
              >
                <Mail className="w-4 h-4" />
              </a>
              <button 
                onClick={() => setActivePolicy('contact')} 
                className="p-2 rounded-full bg-[#F7F5F0] hover:bg-[#B7A18D]/20 transition-colors cursor-pointer" 
                title="Studio Support & Contact"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <span className="font-bold text-[#242424] block mb-3 font-mono text-[11px] uppercase tracking-wider">
              Explore
            </span>
            <ul className="space-y-2">
              <li><a href="#daily-edit" className="hover:text-black">The Daily Edit</a></li>
              <li><a href="#shop-by-need" className="hover:text-black">Shop by Need</a></li>
              <li><a href="#smart-combos" className="hover:text-black">Smart Combos</a></li>
              <li><a href="#shop-all" className="hover:text-black">Shop All Catalogue</a></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-[#242424] block mb-3 font-mono text-[11px] uppercase tracking-wider">
              Customer Care
            </span>
            <ul className="space-y-2">
              <li><button onClick={() => setIsTrackingOpen(true)} className="hover:text-black cursor-pointer">Track Your Shipment</button></li>
              <li><button onClick={() => setActivePolicy('contact')} className="hover:text-black cursor-pointer">Studio Support & Contact</button></li>
              <li><button onClick={() => setActivePolicy('shipping')} className="hover:text-black cursor-pointer">Shipping & Delivery Policy</button></li>
              <li><button onClick={() => setActivePolicy('returns')} className="hover:text-black cursor-pointer">Return & Replacement Policy</button></li>
              <li><button onClick={() => setIsReturnClaimOpen(true)} className="text-[#536B57] font-semibold hover:underline cursor-pointer">Submit a Claim (7-Day)</button></li>
              <li><button onClick={() => setActivePolicy('refunds')} className="hover:text-black cursor-pointer">Refund Policy</button></li>
              <li><button onClick={() => setActivePolicy('grievance')} className="hover:text-black cursor-pointer">Grievance Redressal</button></li>
              <li><button onClick={() => setActivePolicy('faq')} className="hover:text-black cursor-pointer">Help & FAQs</button></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-[#242424] block mb-3 font-mono text-[11px] uppercase tracking-wider">
              About & Legal
            </span>
            <ul className="space-y-2">
              <li><button onClick={() => setActivePolicy('about')} className="hover:text-black cursor-pointer">About Our Brand</button></li>
              <li><button onClick={() => setActivePolicy('privacy')} className="hover:text-black cursor-pointer">Privacy Policy (DPDP Act)</button></li>
              <li><button onClick={() => setActivePolicy('terms')} className="hover:text-black cursor-pointer">Terms & Conditions</button></li>
              <li>
                {/* Dedicated Footer Admin Link: always routes to /admin/login */}
                <a 
                  href={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/admin/login`}
                  onClick={handleOpenAdminLogin}
                  className="text-[#536B57] font-semibold hover:underline cursor-pointer flex items-center space-x-1"
                  title="Administrative Portal Gateway"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Dashboard</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-black/8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-black/50 font-mono gap-2">
          <span>© 2026 {brandName} (everyday_editz.in) · Business & Operations: {businessName} · All Rights Reserved.</span>
          <span>Operations Facility: Mandi Gobindgarh, Punjab – 147301, India</span>
        </div>

      </div>
    </section>
  );
};
