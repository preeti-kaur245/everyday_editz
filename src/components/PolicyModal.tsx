import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  HelpCircle, 
  Mail, 
  Instagram,
  FileText, 
  ChevronDown, 
  Building, 
  CheckCircle2, 
  MapPin, 
  Lock, 
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';

export const PolicyModal: React.FC = () => {
  const { activePolicy, setActivePolicy, setIsReturnClaimOpen, settings } = useStore();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!activePolicy) return null;

  const brandName = settings.brandName || 'The Everyday Edit';
  const businessName = settings.businessName || 'Raftaar Solutions';
  const contactEmail = settings.contactEmail || 'manpreetkaurdeveloper2@gmail.com';
  const operationsAddress = settings.operationsAddress || 'Delhi–Jalandhar GT Road (NH-1), Sirhind Side, Mandi Gobindgarh, Punjab – 147301, India';
  const instagramUrl = settings.instagramUrl || 'https://www.instagram.com/everyday_editz.in/';
  const isInstagramConfigured = Boolean(instagramUrl && instagramUrl.trim().startsWith('http'));

  const faqs = [
    {
      q: 'Do you support Cash on Delivery (COD)?',
      a: 'No. To ensure rapid dispatch, zero unbox tampering, and direct courier priority, The Everyday Edit is 100% PREPAID. We support all secure Indian payment methods including UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay, Visa, MasterCard, and Netbanking.',
    },
    {
      q: 'What is your 7-day replacement guarantee?',
      a: 'If your item arrives with transit damage, a manufacturing defect, missing pieces, or does not match specifications, we provide an expedited doorstep replacement or full refund within 7 days of delivery.',
    },
    {
      q: 'Can I return an item if I change my mind?',
      a: 'Under our policy and Indian Consumer Protection (E-Commerce) Rules, change-of-mind returns are not accepted. Our curations are verified and documented prior to dispatch.',
    },
    {
      q: 'How fast do orders ship across India?',
      a: 'All orders are dispatched from our Raftaar Solutions fulfillment facility in Punjab within 24-48 business hours. Major Indian cities typically receive delivery in 2-4 business days via Express Logistics.',
    },
    {
      q: 'How do I contact customer support?',
      a: `You can reach our official support desk directly via email at ${contactEmail} or message our Instagram channel @everyday_editz.in with your Order ID for prompt assistance.`,
    },
  ];

  const tabs = [
    { id: 'contact', label: 'Studio Support & Contact' },
    { id: 'returns', label: 'Return Policy' },
    { id: 'replacements', label: 'Replacement Policy' },
    { id: 'refunds', label: 'Refund Policy' },
    { id: 'shipping', label: 'Shipping & Delivery' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'grievance', label: 'Grievance Officer' },
    { id: 'about', label: 'About Us' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#F7F5F0] sm:rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-screen sm:max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-white px-6 py-4 border-b border-black/8 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#536B57]">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-bold text-[#242424]">Consumer Information & Support Desk</span>
          </div>

          <button
            onClick={() => setActivePolicy(null)}
            className="p-1.5 text-black/60 hover:text-black rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Tab Navigation Bar */}
        <div className="bg-[#FAF8F5] border-b border-black/8 px-6 py-2 overflow-x-auto flex space-x-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePolicy(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activePolicy === tab.id
                  ? 'bg-[#242424] text-white shadow-xs'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 text-xs text-[#242424]/85 leading-relaxed">
          
          {/* STUDIO SUPPORT & CONTACT */}
          {activePolicy === 'contact' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#242424]">Studio Support & Contact</h3>
                  <p className="text-xs text-black/60 mt-0.5">Verified business identity, communication channels & operational location</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#536B57]/10 text-[#536B57] font-mono text-[11px] font-semibold">
                  Official Desk
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Brand & Entity */}
                <div className="p-4 bg-white rounded-2xl border border-black/8 space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-mono text-black/50 uppercase">
                    <Building className="w-3.5 h-3.5 text-[#536B57]" />
                    <span>Brand & Entity</span>
                  </div>
                  <div className="text-sm font-bold text-[#242424]">{brandName}</div>
                  <div className="text-xs text-black/70">
                    Business / Operations: <strong className="text-[#242424]">{businessName}</strong>
                  </div>
                </div>

                {/* Email Support */}
                <div className="p-4 bg-white rounded-2xl border border-black/8 space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-mono text-black/50 uppercase">
                    <Mail className="w-3.5 h-3.5 text-[#536B57]" />
                    <span>Email Support Desk</span>
                  </div>
                  <div>
                    <a 
                      href={`mailto:${contactEmail}`}
                      className="text-xs sm:text-sm font-semibold text-[#242424] hover:text-[#536B57] underline underline-offset-4 inline-flex items-center gap-1 group break-all"
                    >
                      <span>{contactEmail}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                    </a>
                  </div>
                  <p className="text-[11px] text-black/60">
                    Primary channel for order help, tracking requests, and customer inquiries.
                  </p>
                </div>

                {/* Instagram Channel */}
                <div className="p-4 bg-white rounded-2xl border border-black/8 space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-mono text-black/50 uppercase">
                    <Instagram className="w-3.5 h-3.5 text-[#536B57]" />
                    <span>Instagram Channel</span>
                  </div>
                  <div>
                    {isInstagramConfigured ? (
                      <a 
                        href={instagramUrl}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm font-semibold text-[#242424] hover:text-[#536B57] underline underline-offset-4 inline-flex items-center gap-1 group"
                      >
                        <span>@everyday_editz.in</span>
                        <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                      </a>
                    ) : (
                      <span className="text-xs text-black/50 italic">Channel Link Pending Configuration</span>
                    )}
                  </div>
                  <p className="text-[11px] text-black/60">
                    Direct messaging and new drop updates on Instagram.
                  </p>
                </div>

                {/* Operations & Dispatch Location */}
                <div className="p-4 bg-white rounded-2xl border border-black/8 space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-mono text-black/50 uppercase">
                    <MapPin className="w-3.5 h-3.5 text-[#536B57]" />
                    <span>Operations & Dispatch Facility</span>
                  </div>
                  <div className="text-xs font-medium text-[#242424] leading-relaxed">
                    {operationsAddress}
                  </div>
                  <p className="text-[10px] text-black/50 italic leading-relaxed">
                    * Operational hub for quality inspection, inventory management, and courier dispatch. Orders are accepted online.
                  </p>
                </div>

              </div>

              <div className="p-4 bg-white rounded-2xl border border-black/8 space-y-2">
                <h4 className="font-bold text-xs text-[#242424] uppercase tracking-wider font-mono">
                  Order Assistance Guidelines
                </h4>
                <p className="text-xs text-black/70">
                  When emailing about an existing order, please include your <strong>Order ID (e.g. ORD-IND-...)</strong> and registered email address to ensure immediate dispatch tracking and dispute assistance.
                </p>
              </div>
            </div>
          )}

          {/* 1. RETURN POLICY */}
          {activePolicy === 'returns' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#242424]">Return Policy</h3>
                <span className="px-2.5 py-1 rounded bg-[#536B57]/10 text-[#536B57] font-mono text-[11px] font-semibold">
                  Consumer Protection Compliant
                </span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-black/8 space-y-2">
                <h4 className="font-bold text-sm text-[#242424]">Zero Change-of-Mind Returns</h4>
                <p>
                  In accordance with the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong> and our strict quality hygiene benchmarks, {brandName} does not accept returns or cancellations motivated by buyer's remorse once an order has been delivered in accordance with advertised specifications.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#242424]">Eligible Grounds for Return & Claims:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-black/8">
                    <span className="font-bold text-black block mb-0.5">1. Transit Damage</span>
                    <p className="text-[11px] text-black/60">Product arrived physically crushed, cracked, leaked or deformed during courier transit.</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-black/8">
                    <span className="font-bold text-black block mb-0.5">2. Manufacturing Defect</span>
                    <p className="text-[11px] text-black/60">Internal mechanical/electronic fault preventing advertised function upon unboxing.</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-black/8">
                    <span className="font-bold text-black block mb-0.5">3. Incorrect Product</span>
                    <p className="text-[11px] text-black/60">Different SKU, color or model received from what was confirmed at checkout.</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-black/8">
                    <span className="font-bold text-black block mb-0.5">4. Incomplete Package</span>
                    <p className="text-[11px] text-black/60">Missing essential accessories, cables, attachments or parts listed on the package.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#536B57]/10 rounded-2xl border border-[#536B57]/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#242424]">Received a damaged or defective item?</div>
                  <div className="text-[11px] text-black/70">Submit your claim with unboxing photos within 7 days of delivery.</div>
                </div>
                <button
                  onClick={() => {
                    setActivePolicy(null);
                    setIsReturnClaimOpen(true);
                  }}
                  className="px-4 py-2 bg-[#242424] text-[#F7F5F0] rounded-xl text-xs font-semibold hover:bg-black transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Submit Claim</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D9A6A0]" />
                </button>
              </div>
            </div>
          )}

          {/* 2. REPLACEMENT POLICY */}
          {activePolicy === 'replacements' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#242424]">Replacement Guarantee & Process</h3>
              <p>
                We believe in zero-hassle accountability. When an authentic claim is verified by our quality control desk, we prioritize a swift 1-to-1 replacement at zero cost to the customer.
              </p>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-[#242424]">Step-by-Step Replacement Workflow:</h4>
                <ol className="list-decimal list-inside space-y-2 bg-white p-5 rounded-2xl border border-black/8">
                  <li>
                    <strong>Submission:</strong> Customer submits a claim via the online Return Desk within 7 calendar days of delivery, attaching photographs of the packaging, courier label, and defect.
                  </li>
                  <li>
                    <strong>Grievance Desk Review:</strong> Claim is assessed within 24 to 48 business hours by our quality inspection team at {businessName}.
                  </li>
                  <li>
                    <strong>Doorstep Reverse Pickup:</strong> Once approved, our courier partner arrives for reverse pickup at your registered shipping address.
                  </li>
                  <li>
                    <strong>Expedited Replacement Dispatch:</strong> A brand-new unit is dispatched via Express courier with priority tracking provided to your email.
                  </li>
                </ol>
              </div>

              <div className="p-4 bg-white rounded-xl border border-black/8">
                <span className="font-bold text-[#242424] block mb-1">Out of Stock Situations:</span>
                <p className="text-[11px] text-black/70">
                  If the required replacement SKU is temporarily out of stock in our fulfillment network, a 100% full refund is issued automatically to your original payment method.
                </p>
              </div>
            </div>
          )}

          {/* 3. REFUND POLICY */}
          {activePolicy === 'refunds' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#242424]">Refund Policy</h3>
              <p>
                All approved refunds are processed directly back to the original source account (UPI VPA, Credit/Debit Card, or Netbanking account) used during checkout.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded-xl border border-black/8">
                  <div className="font-bold text-sm text-[#242424] mb-1">UPI & Netbanking Refunds</div>
                  <p className="text-[11px] text-black/60">
                    Typically credited within <strong>24 to 48 banking hours</strong> of claim authorization.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-black/8">
                  <div className="font-bold text-sm text-[#242424] mb-1">Credit & Debit Cards</div>
                  <p className="text-[11px] text-black/60">
                    Credited within <strong>5 to 7 business days</strong> depending on your issuing bank's settlement cycle.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-black/8 text-[11px] space-y-1">
                <div className="font-bold text-[#242424]">Failed Online Transaction Policy:</div>
                <p className="text-black/70">
                  If money is debited from your bank account during a checkout interruption before order confirmation, our payment gateway auto-reverses the amount within 3-5 business days. You can also contact <a href={`mailto:${contactEmail}`} className="underline font-semibold">{contactEmail}</a> with your UPI RRN or Bank Reference Number.
                </p>
              </div>
            </div>
          )}

          {/* 4. SHIPPING POLICY */}
          {activePolicy === 'shipping' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#242424]">Shipping & Delivery Policy</h3>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-black/8">
                  <div className="font-bold text-sm text-[#242424] flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-[#536B57]" />
                    <span>Pan-India Courier Network</span>
                  </div>
                  <p className="mt-1 text-black/70">
                    Orders are processed and dispatched from the {businessName} operations facility in Punjab. We partner with Tier-1 logistics networks (Delhivery, Blue Dart, Xpressbees) to service PIN codes across India.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-black/8">
                    <div className="font-bold text-sm text-[#242424]">Metro Cities</div>
                    <p className="text-[11px] text-black/60 mt-1">2-4 Business Days (Delhi-NCR, Mumbai, Chandigarh, Bengaluru, Hyderabad, Pune)</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-black/8">
                    <div className="font-bold text-sm text-[#242424]">Rest of India</div>
                    <p className="text-[11px] text-black/60 mt-1">3-6 Business Days (Regional Towns & Express Delivery Zones)</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-black/8">
                  <div className="font-bold text-sm text-[#242424]">Complimentary Shipping Threshold</div>
                  <p className="mt-1 text-black/70">
                    All orders with cart value of <strong>₹499 or more</strong> qualify for Free Express Shipping. Standard delivery fee of ₹49 applies on orders below ₹499.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5. PRIVACY POLICY */}
          {activePolicy === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#242424]">Privacy & Data Protection Policy</h3>
              <p>
                {brandName} is committed to protecting your personal information in strict accordance with the Information Technology Act, 2000 and the Digital Personal Data Protection (DPDP) Act, 2023.
              </p>
              <div className="space-y-2 bg-white p-4 rounded-xl border border-black/8">
                <h4 className="font-bold text-sm text-[#242424]">1. Personal Information Collected:</h4>
                <p className="text-[11px] text-black/70">
                  Name, delivery address, contact email, and telephone number collected solely for fulfilling orders, sharing tracking notifications, and providing customer support.
                </p>
              </div>
              <div className="space-y-2 bg-white p-4 rounded-xl border border-black/8">
                <h4 className="font-bold text-sm text-[#242424]">2. Zero Sale of Personal Data:</h4>
                <p className="text-[11px] text-black/70">
                  We never rent, trade, or monetize customer data to third-party telemarketers or external advertising networks.
                </p>
              </div>
              <div className="space-y-2 bg-white p-4 rounded-xl border border-black/8">
                <h4 className="font-bold text-sm text-[#242424]">3. Payment Security:</h4>
                <p className="text-[11px] text-black/70">
                  We do NOT store customer credit card numbers, CVVs, or UPI PINs on our servers. All transactions are processed through PCI-DSS Level 1 compliant gateway partners.
                </p>
              </div>
            </div>
          )}

          {/* 6. TERMS AND CONDITIONS */}
          {activePolicy === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#242424]">Terms and Conditions of Sale</h3>
              <p>
                By placing an order on everyday_editz.in, you agree to the following terms:
              </p>
              <div className="space-y-2 bg-white p-4 rounded-xl border border-black/8 text-[11px] text-black/75">
                <p>
                  <strong>1. Prepaid Contract:</strong> A binding contract of sale is established upon successful receipt and verification of online payment. Cash on Delivery is not supported.
                </p>
                <p>
                  <strong>2. Pricing & GST:</strong> All prices listed on the website are in Indian National Rupees (INR) and inclusive of 18% GST. Official tax invoices are provided with every consignment.
                </p>
                <p>
                  <strong>3. Product Descriptions:</strong> Product images, dimensions, and specifications are documented accurately from physical specimens. Slight variations in packaging design by manufacturers do not constitute a defect.
                </p>
                <p>
                  <strong>4. Jurisdiction:</strong> Any dispute arising out of or related to website orders shall be subject to the exclusive jurisdiction of the competent courts in Fatehgarh Sahib / Punjab, India.
                </p>
              </div>
            </div>
          )}

          {/* 7. GRIEVANCE OFFICER & SUPPORT */}
          {activePolicy === 'grievance' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-[#536B57]" />
                <h3 className="text-xl font-bold text-[#242424]">Grievance Redressal Desk</h3>
              </div>

              <p>
                In compliance with Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020, details of our designated Grievance Redressal Officer are provided below:
              </p>

              <div className="bg-white p-5 rounded-2xl border border-black/8 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-black/8">
                  <div>
                    <div className="text-sm font-bold text-[#242424]">Customer Grievance Officer</div>
                    <div className="text-xs text-black/60">Quality Assurance & Redressal Desk · {businessName}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#536B57]/10 text-[#536B57] text-[10px] font-mono font-bold">
                    Official Appointment
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-black/80">
                    <Mail className="w-4 h-4 text-[#536B57] shrink-0" />
                    <span>Email: <a href={`mailto:${contactEmail}`} className="underline font-semibold">{contactEmail}</a></span>
                  </div>
                  <div className="flex items-start space-x-2 text-black/80">
                    <Building className="w-4 h-4 text-[#536B57] shrink-0 mt-0.5" />
                    <span>Operations Facility: {operationsAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-black/80">
                    <ShieldCheck className="w-4 h-4 text-[#536B57] shrink-0" />
                    <span>Acknowledgment SLA: <strong>Within 48 hours</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-black/80">
                    <CheckCircle2 className="w-4 h-4 text-[#536B57] shrink-0" />
                    <span>Redressal Resolution SLA: <strong>Within 30 calendar days</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#536B57]/10 rounded-2xl border border-[#536B57]/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#242424]">Have an active order issue?</div>
                  <div className="text-[11px] text-black/70">Submit your replacement or damaged product claim directly online.</div>
                </div>
                <button
                  onClick={() => {
                    setActivePolicy(null);
                    setIsReturnClaimOpen(true);
                  }}
                  className="px-4 py-2 bg-[#242424] text-[#F7F5F0] rounded-xl text-xs font-semibold hover:bg-black transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Submit Claim</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D9A6A0]" />
                </button>
              </div>
            </div>
          )}

          {/* ABOUT */}
          {activePolicy === 'about' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#242424]">About {brandName}</h3>
              <p className="text-sm text-[#242424]/80">
                {brandName} is a curated lifestyle discovery platform operated by <strong>{businessName}</strong>. Our mission is simple: bring high-utility, aesthetic, and reliable upgrades to modern Indian living.
              </p>
              <p>
                We physically test and inspect items before they enter our catalog. If a tool doesn't genuinely save you time, declutter your desk, or make your routine feel effortless and durable, we simply don't feature it.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-black/8">
                <div className="bg-white p-4 rounded-xl border border-black/8">
                  <h4 className="font-bold text-sm text-[#242424] mb-1">Our Standard</h4>
                  <p className="text-[11px] text-black/60">Tested personally by Raftaar Solutions before catalog listing.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-black/8">
                  <h4 className="font-bold text-sm text-[#242424] mb-1">Zero-Hype Promise</h4>
                  <p className="text-[11px] text-black/60">No fake countdowns, no manipulated reviews, and no hidden charges.</p>
                </div>
              </div>
            </div>
          )}

          {/* FAQ */}
          {activePolicy === 'faq' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#242424]">Frequently Asked Questions</h3>
              <div className="space-y-2">
                {faqs.map((f, i) => (
                  <div key={i} className="bg-white rounded-xl border border-black/8 overflow-hidden">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                      className="w-full text-left p-4 font-semibold text-xs text-[#242424] flex items-center justify-between cursor-pointer"
                    >
                      <span>{f.q}</span>
                      <ChevronDown className={`w-4 h-4 text-black/40 transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaqIndex === i && (
                      <div className="px-4 pb-4 text-xs text-black/70 border-t border-black/5 pt-3 leading-relaxed">
                        {f.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
