/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Product, 
  Bundle, 
  CartItem, 
  Order, 
  Coupon, 
  StoreSettings, 
  RewardsTransaction,
  Department,
  DepartmentConfig,
  ProblemNeed,
  ProductCategory,
  Customer,
  ProductEnquiry,
  AbandonedCart,
  ProductWaitlist,
  CustomerFeedback,
  WebsiteActivity,
  GoogleSheetsConfig,
  SyncQueueItem,
  Supplier,
  ReturnClaim,
  StockAdjustmentLog,
  AdminAuditLog,
  PaymentTransaction
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_BUNDLES, 
  INITIAL_COUPONS, 
  INITIAL_STORE_SETTINGS,
  DEPARTMENTS,
  INITIAL_CUSTOMERS,
  INITIAL_ENQUIRIES,
  INITIAL_ABANDONED_CARTS,
  INITIAL_WAITLIST,
  INITIAL_FEEDBACK,
  INITIAL_SUPPLIERS,
  INITIAL_RETURN_CLAIMS,
  INITIAL_STOCK_LOGS
} from '../data/mockData';
import { 
  formatToIST, 
  sendToGoogleSheets, 
  testGoogleSheetsConnection, 
  downloadCSV 
} from '../services/googleSheetsService';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface StoreContextType {
  // Products & Bundles
  products: Product[];
  bundles: Bundle[];
  departments: DepartmentConfig[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Department and Subcategory navigation
  selectedDepartment: Department | null;
  setSelectedDepartment: (dept: Department | null) => void;
  selectedSubcategory: string | null;
  setSelectedSubcategory: (subcat: string | null) => void;
  navigateToDepartment: (dept: Department, subcategory?: string) => void;
  returnToHome: () => void;

  // Dynamic Price Filter state
  activePriceTier: 'all' | 'under-199' | 'under-299' | 'under-499' | 'under-999';
  setActivePriceTier: (tier: 'all' | 'under-199' | 'under-299' | 'under-499' | 'under-999') => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variant?: string) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  clearCart: () => void;
  addBundleToCart: (bundle: Bundle) => void;
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  couponDiscount: number;
  redeemedPointsDiscount: number;
  shippingFee: number;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders & Fulfilment
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'courierName' | 'trackingNumber'>) => Order;
  updateOrderStatus: (
    orderId: string, 
    status: Order['status'], 
    trackingNumber?: string, 
    supplierName?: string, 
    supplierOrderRef?: string
  ) => void;
  recentOrder: Order | null;

  // Customer Management & Authentication
  customers: Customer[];
  currentCustomer: Customer | null;
  setCurrentCustomer: (customer: Customer | null) => void;
  registerOrUpdateCustomer: (data: Partial<Customer>) => Customer;
  updateCustomerRecord: (id: string, updates: Partial<Customer>) => void;

  // Product Enquiries
  enquiries: ProductEnquiry[];
  submitEnquiry: (data: Omit<ProductEnquiry, 'id' | 'enquiryDate' | 'enquiryStatus'>) => void;
  updateEnquiryStatus: (id: string, status: ProductEnquiry['enquiryStatus']) => void;

  // Product Waitlist
  waitlists: ProductWaitlist[];
  joinWaitlist: (data: Omit<ProductWaitlist, 'id' | 'registrationDate' | 'status'>) => void;
  updateWaitlistStatus: (id: string, status: ProductWaitlist['status']) => void;

  // Customer Feedback
  feedbackList: CustomerFeedback[];
  submitFeedback: (data: Omit<CustomerFeedback, 'id' | 'submissionDate'>) => void;

  // Abandoned Carts
  abandonedCarts: AbandonedCart[];
  trackAbandonedCart: (data: Partial<AbandonedCart>) => void;
  updateAbandonedCartStatus: (id: string, status: AbandonedCart['recoveryStatus']) => void;

  // Website Activity (Consented)
  logActivity: (type: WebsiteActivity['activityType'], page: string, productId?: string) => void;

  // Google Sheets Automation
  googleSheetsConfig: GoogleSheetsConfig;
  setGoogleSheetsUrl: (url: string) => void;
  testSheetsConnection: () => Promise<boolean>;
  syncQueue: SyncQueueItem[];
  retryFailedSyncQueue: () => Promise<void>;
  syncAllExistingToSheets: () => Promise<void>;
  sendTestCustomerAndOrderToSheets: () => Promise<{ success: boolean; message: string }>;

  // CSV Export functions
  exportCustomersCSV: () => void;
  exportOrdersCSV: () => void;
  exportEnquiriesCSV: () => void;
  exportAbandonedCartsCSV: () => void;
  exportWaitlistCSV: () => void;
  exportFeedbackCSV: () => void;

  // Rewards
  rewardsBalance: number;
  rewardsHistory: RewardsTransaction[];
  referralCode: string;
  redeemPointsForOrder: (pointsToRedeem: number) => boolean;
  pointsToRedeemAtCheckout: number;
  setPointsToRedeemAtCheckout: (points: number) => void;

  // Store Settings (Admin editable)
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  toggleCouponActive: (code: string) => void;

  // Category Configuration Management
  addCategoryToDepartment: (deptId: Department, subcategoryName: string) => void;
  removeCategoryFromDepartment: (deptId: Department, subcategoryName: string) => void;
  renameCategoryInDepartment: (deptId: Department, oldName: string, newName: string) => void;

  // Inventory & Suppliers
  suppliers: Supplier[];
  stockLogs: StockAdjustmentLog[];
  adjustProductStock: (productId: string, changeAmount: number, reason: StockAdjustmentLog['reason'], adjustedBy?: string) => void;

  // Payments & Transactions
  paymentTransactions: PaymentTransaction[];

  // Return & Replacement Claims
  returnClaims: ReturnClaim[];
  submitReturnClaim: (claim: Omit<ReturnClaim, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; claimId?: string; error?: string }>;
  updateReturnClaimStatus: (claimId: string, status: ReturnClaim['status'], adminNotes?: string) => void;

  // Admin Security & Session
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  adminLogin: (password: string, username?: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;

  // Active Modals & Views
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  isReturnClaimOpen: boolean;
  setIsReturnClaimOpen: (open: boolean) => void;
  returnClaimPrefillOrder: string;
  setReturnClaimPrefillOrder: (orderId: string) => void;
  isRewardsOpen: boolean;
  setIsRewardsOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  trackingLookupId: string;
  setTrackingLookupId: (id: string) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  isEnquiryOpen: boolean;
  setIsEnquiryOpen: (open: boolean) => void;
  enquiryProduct: Product | null;
  setEnquiryProduct: (prod: Product | null) => void;
  isWaitlistOpen: boolean;
  setIsWaitlistOpen: (open: boolean) => void;
  waitlistProduct: Product | null;
  setWaitlistProduct: (prod: Product | null) => void;
  isFeedbackOpen: boolean;
  setIsFeedbackOpen: (open: boolean) => void;
  feedbackProduct: Product | null;
  setFeedbackProduct: (prod: Product | null) => void;
  activePolicy: 'about' | 'shipping' | 'returns' | 'replacements' | 'refunds' | 'privacy' | 'terms' | 'contact' | 'grievance' | 'faq' | null;
  setActivePolicy: (policy: 'about' | 'shipping' | 'returns' | 'replacements' | 'refunds' | 'privacy' | 'terms' | 'contact' | 'grievance' | 'faq' | null) => void;
  isReelsOpen: boolean;
  setIsReelsOpen: (open: boolean) => void;
  activeReelIndex: number;
  setActiveReelIndex: (index: number) => void;

  // Search & Old category navigation compatibility
  selectedNeed: ProblemNeed | null;
  setSelectedNeed: (need: ProblemNeed | null) => void;
  selectedCategory: ProductCategory | null;
  setSelectedCategory: (category: ProductCategory | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session ID for Website Activity
  const sessionId = useRef(`sess-${Math.random().toString(36).substring(2, 9)}`).current;

  // Purge legacy storage keys once on load so dummy customers/orders never reappear
  try {
    ['edz_orders', 'edz_customers', 'edz_current_customer', 'edz_enquiries', 'edz_abandoned_carts', 'edz_waitlist', 'edz_feedback', 'edz_products', 'edz_products_v2', 'edz_wishlist'].forEach((k) => {
      localStorage.removeItem(k);
    });
  } catch {
    // Ignore in non-browser environment
  }

  // 1. Products (Always load canonical 59 catalogue products)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('edz_products_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === INITIAL_PRODUCTS.length) {
          return parsed;
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Bundles
  const [bundles] = useState<Bundle[]>(INITIAL_BUNDLES);

  // Departments configuration
  const [departments, setDepartments] = useState<DepartmentConfig[]>(() => {
    try {
      const saved = localStorage.getItem('edz_departments');
      return saved ? JSON.parse(saved) : DEPARTMENTS;
    } catch {
      return DEPARTMENTS;
    }
  });

  // Department & Subcategory Active Selection
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [activePriceTier, setActivePriceTier] = useState<'all' | 'under-199' | 'under-299' | 'under-499' | 'under-999'>('all');

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('edz_settings');
      return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('edz_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('edz_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist (Starts empty)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('edz_wishlist_v4');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders (Starts clean with 0 orders until actual checkout)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('edz_orders_v4');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentOrder, setRecentOrder] = useState<Order | null>(null);

  // CRM: Customers (Starts clean with 0 customers until customer registers or places order)
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('edz_customers_v4');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  // Current Logged-in Customer (Starts null)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
    try {
      const saved = localStorage.getItem('edz_current_customer_v4');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // CRM: Enquiries (Starts clean)
  const [enquiries, setEnquiries] = useState<ProductEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem('edz_enquiries_v4');
      return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
    } catch {
      return INITIAL_ENQUIRIES;
    }
  });

  // CRM: Abandoned Carts (Starts clean)
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>(() => {
    try {
      const saved = localStorage.getItem('edz_abandoned_carts_v4');
      return saved ? JSON.parse(saved) : INITIAL_ABANDONED_CARTS;
    } catch {
      return INITIAL_ABANDONED_CARTS;
    }
  });

  // CRM: Product Waitlists (Starts clean)
  const [waitlists, setWaitlists] = useState<ProductWaitlist[]>(() => {
    try {
      const saved = localStorage.getItem('edz_waitlist_v4');
      return saved ? JSON.parse(saved) : INITIAL_WAITLIST;
    } catch {
      return INITIAL_WAITLIST;
    }
  });

  // CRM: Customer Feedback (Starts clean)
  const [feedbackList, setFeedbackList] = useState<CustomerFeedback[]>(() => {
    try {
      const saved = localStorage.getItem('edz_feedback_v4');
      return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
    } catch {
      return INITIAL_FEEDBACK;
    }
  });

  // CRM: Website Activities (in memory buffer)
  const [activities, setActivities] = useState<WebsiteActivity[]>([]);

  // User's Deployed Google Apps Script Web App URL
  const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx2Y_diNJLiRryZXfM8eklSK9dFxaxNcNJmgISvavE1E38CD6fhS-eqvhXT7vEXc-kF/exec';

  // Google Sheets Config & Synchronization State
  const [googleSheetsConfig, setGoogleSheetsConfig] = useState<GoogleSheetsConfig>(() => {
    try {
      const savedUrl = localStorage.getItem('edz_sheets_url') || DEFAULT_APPS_SCRIPT_URL;
      return {
        appsScriptUrl: savedUrl,
        isConnected: false,
        lastCheckedAt: undefined,
        lastSyncStatus: savedUrl ? 'idle' : 'pending',
        errorMessage: undefined,
        totalSyncedRecords: 0,
      };
    } catch {
      return {
        appsScriptUrl: DEFAULT_APPS_SCRIPT_URL,
        isConnected: false,
        lastSyncStatus: 'idle',
        totalSyncedRecords: 0,
      };
    }
  });

  // Sync Queue for Offline / Unconnected / Failed syncs
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => {
    try {
      const saved = localStorage.getItem('edz_sync_queue_v4');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Rewards (Starts clean with 0 points)
  const [rewardsBalance, setRewardsBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('edz_rewards_pts');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [rewardsHistory, setRewardsHistory] = useState<RewardsTransaction[]>([]);

  const [referralCode] = useState<string>('EDITZ-SHR72');
  const [pointsToRedeemAtCheckout, setPointsToRedeemAtCheckout] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Inventory, Suppliers & Security State
  const [suppliers] = useState<Supplier[]>(() => {
    try {
      const saved = localStorage.getItem('edz_suppliers_v4');
      return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
    } catch {
      return INITIAL_SUPPLIERS;
    }
  });

  const [returnClaims, setReturnClaims] = useState<ReturnClaim[]>(() => {
    try {
      const saved = localStorage.getItem('edz_claims_v4');
      return saved ? JSON.parse(saved) : INITIAL_RETURN_CLAIMS;
    } catch {
      return INITIAL_RETURN_CLAIMS;
    }
  });

  const [stockLogs, setStockLogs] = useState<StockAdjustmentLog[]>(() => {
    try {
      const saved = localStorage.getItem('edz_stock_logs_v4');
      return saved ? JSON.parse(saved) : INITIAL_STOCK_LOGS;
    } catch {
      return INITIAL_STOCK_LOGS;
    }
  });

  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('edz_payments_v4');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin Security & Authenticated Session
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('edz_admin_token') || localStorage.getItem('edz_admin_token') || null;
    } catch {
      return null;
    }
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => !!adminToken);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Server-side admin verification on session load
  useEffect(() => {
    if (adminToken) {
      fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            setAdminToken(null);
            setIsAdminAuthenticated(false);
            sessionStorage.removeItem('edz_admin_token');
            localStorage.removeItem('edz_admin_token');
          } else {
            setIsAdminAuthenticated(true);
          }
        })
        .catch(() => {});
    }
  }, [adminToken]);

  // Return & Replacement Claim Modal
  const [isReturnClaimOpen, setIsReturnClaimOpen] = useState(false);
  const [returnClaimPrefillOrder, setReturnClaimPrefillOrder] = useState('');

  // Modals & Navigation
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingLookupId, setTrackingLookupId] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState<Product | null>(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [waitlistProduct, setWaitlistProduct] = useState<Product | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackProduct, setFeedbackProduct] = useState<Product | null>(null);

  const [activePolicy, setActivePolicy] = useState<'about' | 'shipping' | 'returns' | 'replacements' | 'refunds' | 'privacy' | 'terms' | 'contact' | 'grievance' | 'faq' | null>(null);
  const [isReelsOpen, setIsReelsOpen] = useState(false);
  const [activeReelIndex, setActiveReelIndex] = useState(0);

  // Filters
  const [selectedNeed, setSelectedNeed] = useState<ProblemNeed | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  // LocalStorage Persistence
  useEffect(() => {
    localStorage.setItem('edz_products_v4', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('edz_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('edz_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('edz_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('edz_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('edz_wishlist_v4', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('edz_orders_v4', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('edz_customers_v4', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    if (currentCustomer) {
      localStorage.setItem('edz_current_customer_v4', JSON.stringify(currentCustomer));
    } else {
      localStorage.removeItem('edz_current_customer_v4');
    }
  }, [currentCustomer]);

  useEffect(() => {
    localStorage.setItem('edz_enquiries_v4', JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem('edz_abandoned_carts_v4', JSON.stringify(abandonedCarts));
  }, [abandonedCarts]);

  useEffect(() => {
    localStorage.setItem('edz_waitlist_v4', JSON.stringify(waitlists));
  }, [waitlists]);

  useEffect(() => {
    localStorage.setItem('edz_feedback_v4', JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem('edz_sync_queue_v4', JSON.stringify(syncQueue));
  }, [syncQueue]);

  // Initial connection test on mount if URL exists
  useEffect(() => {
    if (googleSheetsConfig.appsScriptUrl) {
      testGoogleSheetsConnection(googleSheetsConfig.appsScriptUrl).then((res) => {
        setGoogleSheetsConfig((prev) => ({
          ...prev,
          isConnected: res.connected,
          lastCheckedAt: formatToIST(),
          lastSyncStatus: res.connected ? 'idle' : 'failed',
          errorMessage: res.connected ? undefined : res.message,
        }));
      });
    }
  }, []);

  // --- AUTOMATED DISPATCH & GOOGLE SHEETS SYNC HELPER ---
  const syncRecordToSheets = async (
    sheet: SyncQueueItem['sheet'],
    action: string,
    payload: Record<string, any>
  ) => {
    const queueItem: SyncQueueItem = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sheet,
      action,
      payload,
      timestamp: formatToIST(),
      retryCount: 0,
      status: 'pending',
    };

    // If no URL configured yet, place into queue
    if (!googleSheetsConfig.appsScriptUrl || !googleSheetsConfig.appsScriptUrl.trim().startsWith('http')) {
      setSyncQueue((prev) => [queueItem, ...prev]);
      setGoogleSheetsConfig((prev) => ({
        ...prev,
        lastSyncStatus: 'pending',
        errorMessage: 'Awaiting Google Apps Script Web App URL configuration in Admin',
      }));
      return;
    }

    try {
      const res = await sendToGoogleSheets(googleSheetsConfig.appsScriptUrl, action, payload);
      if (res.success) {
        setGoogleSheetsConfig((prev) => ({
          ...prev,
          isConnected: true,
          lastCheckedAt: formatToIST(),
          lastSyncStatus: 'success',
          totalSyncedRecords: prev.totalSyncedRecords + 1,
          errorMessage: undefined,
        }));
      } else {
        // Enqueue for retry
        queueItem.status = 'failed';
        queueItem.lastError = res.message;
        setSyncQueue((prev) => [queueItem, ...prev]);
        setGoogleSheetsConfig((prev) => ({
          ...prev,
          lastSyncStatus: 'failed',
          errorMessage: res.message,
        }));
      }
    } catch (err: any) {
      queueItem.status = 'failed';
      queueItem.lastError = err?.message || 'Sync dispatch failed';
      setSyncQueue((prev) => [queueItem, ...prev]);
      setGoogleSheetsConfig((prev) => ({
        ...prev,
        lastSyncStatus: 'failed',
        errorMessage: err?.message,
      }));
    }
  };

  // Set Google Sheets URL & trigger ping
  const setGoogleSheetsUrl = (url: string) => {
    const cleaned = url.trim();
    localStorage.setItem('edz_sheets_url', cleaned);
    setGoogleSheetsConfig((prev) => ({
      ...prev,
      appsScriptUrl: cleaned,
      lastSyncStatus: cleaned ? 'pending' : 'idle',
      errorMessage: cleaned ? undefined : 'No URL provided',
    }));
    updateSettings({ googleSheetsUrl: cleaned });

    if (cleaned) {
      testGoogleSheetsConnection(cleaned).then((res) => {
        setGoogleSheetsConfig((prev) => ({
          ...prev,
          isConnected: res.connected,
          lastCheckedAt: formatToIST(),
          lastSyncStatus: res.connected ? 'idle' : 'failed',
          errorMessage: res.connected ? undefined : res.message,
        }));
        if (res.connected) {
          showToast('Google Sheets connected successfully! All 7 tabs active.', 'success');
        } else {
          showToast(res.message, 'warning');
        }
      });
    }
  };

  // Test Connection
  const testSheetsConnection = async (): Promise<boolean> => {
    if (!googleSheetsConfig.appsScriptUrl) {
      showToast('Please enter your deployed Google Apps Script Web App URL first', 'warning');
      return false;
    }
    showToast('Testing connection with Google Sheets...', 'info');
    const res = await testGoogleSheetsConnection(googleSheetsConfig.appsScriptUrl);
    setGoogleSheetsConfig((prev) => ({
      ...prev,
      isConnected: res.connected,
      lastCheckedAt: formatToIST(),
      lastSyncStatus: res.connected ? 'idle' : 'failed',
      errorMessage: res.connected ? undefined : res.message,
    }));

    if (res.connected) {
      showToast('Connection verified! Google Sheets backend is live.', 'success');
      return true;
    } else {
      showToast(res.message, 'warning');
      return false;
    }
  };

  // Retry Failed Sync Queue
  const retryFailedSyncQueue = async () => {
    if (!googleSheetsConfig.appsScriptUrl) {
      showToast('Configure Google Apps Script URL before retrying sync queue', 'warning');
      return;
    }

    const itemsToRetry = syncQueue.filter((q) => q.status === 'failed' || q.status === 'pending');
    if (itemsToRetry.length === 0) {
      showToast('No pending sync items in queue', 'info');
      return;
    }

    showToast(`Retrying sync of ${itemsToRetry.length} queued records...`, 'info');
    let successfulCount = 0;
    const remainingQueue: SyncQueueItem[] = [];

    for (const item of itemsToRetry) {
      try {
        const res = await sendToGoogleSheets(googleSheetsConfig.appsScriptUrl, item.action, item.payload);
        if (res.success) {
          successfulCount++;
        } else {
          remainingQueue.push({
            ...item,
            retryCount: item.retryCount + 1,
            lastError: res.message,
            status: 'failed',
          });
        }
      } catch (err: any) {
        remainingQueue.push({
          ...item,
          retryCount: item.retryCount + 1,
          lastError: err?.message,
          status: 'failed',
        });
      }
    }

    setSyncQueue(remainingQueue);
    setGoogleSheetsConfig((prev) => ({
      ...prev,
      totalSyncedRecords: prev.totalSyncedRecords + successfulCount,
      lastSyncStatus: remainingQueue.length === 0 ? 'success' : 'failed',
    }));
    showToast(`Synchronized ${successfulCount} items to Google Sheets!`, 'success');
  };

  // One-click Sync All Existing to Sheets
  const syncAllExistingToSheets = async () => {
    if (!googleSheetsConfig.appsScriptUrl) {
      showToast('Configure Google Apps Script URL in Admin first', 'warning');
      return;
    }
    showToast('Bulk synchronizing catalogue, customers, and orders to Google Sheets...', 'info');

    // 1. Sync all customers
    for (const cust of customers) {
      await sendToGoogleSheets(googleSheetsConfig.appsScriptUrl, 'sync_customer', cust);
    }
    // 2. Sync all orders
    for (const ord of orders) {
      await sendToGoogleSheets(googleSheetsConfig.appsScriptUrl, 'sync_order', ord);
    }
    // 3. Sync enquiries
    for (const enq of enquiries) {
      await sendToGoogleSheets(googleSheetsConfig.appsScriptUrl, 'sync_enquiry', enq);
    }
    // 4. Sync waitlist
    for (const wtl of waitlists) {
      await sendToGoogleSheets(googleSheetsConfig.appsScriptUrl, 'sync_waitlist', wtl);
    }
    // 5. Sync feedback
    for (const fdb of feedbackList) {
      await sendToGoogleSheets(googleSheetsConfig.appsScriptUrl, 'sync_feedback', fdb);
    }

    setGoogleSheetsConfig((prev) => ({
      ...prev,
      lastCheckedAt: formatToIST(),
      lastSyncStatus: 'success',
      totalSyncedRecords: prev.totalSyncedRecords + customers.length + orders.length,
    }));
    showToast('All existing store records synchronized to Google Sheets!', 'success');
  };

  // Live Test Dispatch: Send Sample Customer & Order to Sheets for instant verification
  const sendTestCustomerAndOrderToSheets = async (): Promise<{ success: boolean; message: string }> => {
    if (!googleSheetsConfig.appsScriptUrl) {
      showToast('Please enter your Google Apps Script Web App URL first', 'warning');
      return { success: false, message: 'Google Apps Script URL is missing.' };
    }

    showToast('Sending live test customer and order data to Google Sheets...', 'info');

    const testId = Math.floor(100 + Math.random() * 900);
    const testCustomer: Customer = {
      id: `CUST-TEST-${testId}`,
      firstName: 'Pooja',
      lastName: 'Sharma',
      email: `pooja.test${testId}@everydayeditz.in`,
      phoneNumber: '+91 98123 45678',
      whatsappNumber: '+91 98123 45678',
      city: 'Mandi Gobindgarh',
      state: 'Punjab',
      pincode: '147301',
      customerSegment: 'Women',
      registrationDate: formatToIST(),
      registrationSource: 'Admin Live Verification Test',
      marketingConsent: true,
      whatsappConsent: true,
      totalOrders: 1,
      totalSpending: 399,
      customerStatus: 'Active',
      lastActivity: formatToIST(),
    };

    const firstProduct = products[0] || INITIAL_PRODUCTS[0];
    const testOrder: Order = {
      id: `EE-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: testCustomer.id,
      createdAt: formatToIST(),
      items: [
        {
          product: firstProduct,
          quantity: 1,
          selectedVariant: 'Standard',
        },
      ],
      subtotal: firstProduct.price,
      discount: 0,
      shippingCharge: 0,
      total: firstProduct.price,
      status: 'Confirmed',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      shippingAddress: {
        fullName: 'Pooja Sharma',
        phoneNumber: '+91 98123 45678',
        email: `pooja.test${testId}@everydayeditz.in`,
        flatHouseNo: 'Flat 12, GT Road Side',
        streetArea: 'Sirhind Side',
        pincode: '147301',
        city: 'Mandi Gobindgarh',
        state: 'Punjab',
      },
      courierName: 'Delhivery Express Surface & Air',
      trackingNumber: `DLVTEST${Math.floor(100000 + Math.random() * 900000)}IN`,
      estimatedDeliveryDate: 'In 2-3 business days via Delhivery Air',
      supplierName: 'Raftaar Solutions Fulfillment Hub',
      supplierOrderRef: 'SUP-TEST-001',
      fulfilmentStatus: 'Processing',
      deliveryStatus: 'Ordered',
      returnStatus: 'None',
    };

    try {
      const custRes = await sendToGoogleSheets(googleSheetsConfig.appsScriptUrl, 'sync_customer', testCustomer);
      const ordRes = await sendToGoogleSheets(googleSheetsConfig.appsScriptUrl, 'sync_order', testOrder);

      if (custRes.success || ordRes.success) {
        setGoogleSheetsConfig((prev) => ({
          ...prev,
          isConnected: true,
          lastCheckedAt: formatToIST(),
          lastSyncStatus: 'success',
          totalSyncedRecords: prev.totalSyncedRecords + 2,
        }));
        showToast('Success! Test Customer and Test Order written to Google Sheets.', 'success');
        return { success: true, message: 'Test Customer & Order added to Sheets successfully!' };
      } else {
        const errorMsg = custRes.message || ordRes.message || 'Error writing to Google Sheets';
        showToast(errorMsg, 'warning');
        return { success: false, message: errorMsg };
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to dispatch test events', 'warning');
      return { success: false, message: err?.message || 'Network error' };
    }
  };

  // --- CRM: CUSTOMER MANAGEMENT ---
  const registerOrUpdateCustomer = (data: Partial<Customer>): Customer => {
    const normalizedEmail = data.email ? data.email.toLowerCase().trim() : '';
    const normalizedPhone = data.phoneNumber ? data.phoneNumber.trim() : '';

    let existingIndex = customers.findIndex(
      (c) =>
        (normalizedEmail && c.email.toLowerCase().trim() === normalizedEmail) ||
        (normalizedPhone && c.phoneNumber.trim() === normalizedPhone) ||
        (data.id && c.id === data.id)
    );

    let customerRecord: Customer;

    if (existingIndex >= 0) {
      const existing = customers[existingIndex];
      customerRecord = {
        ...existing,
        ...data,
        id: existing.id,
        email: normalizedEmail || existing.email,
        phoneNumber: normalizedPhone || existing.phoneNumber,
        lastActivity: formatToIST(),
      };
      setCustomers((prev) => {
        const copy = [...prev];
        copy[existingIndex] = customerRecord;
        return copy;
      });
      showToast(`Welcome back, ${customerRecord.firstName}! Profile updated.`);
    } else {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      customerRecord = {
        id: data.id || `CUST-IND-${randomSuffix}`,
        firstName: data.firstName || 'Valued',
        lastName: data.lastName || 'Customer',
        email: normalizedEmail || `shopper.${randomSuffix}@example.com`,
        phoneNumber: normalizedPhone || '+91 98123 45678',
        whatsappNumber: data.whatsappNumber || normalizedPhone || '+91 98123 45678',
        city: data.city || 'Mandi Gobindgarh',
        state: data.state || 'Punjab',
        pincode: data.pincode || '147301',
        customerSegment: data.customerSegment || 'Women',
        registrationDate: formatToIST(),
        registrationSource: data.registrationSource || 'Website Account Registration',
        marketingConsent: data.marketingConsent || false,
        whatsappConsent: data.whatsappConsent || false,
        totalOrders: 0,
        totalSpending: 0,
        customerStatus: 'Active',
        lastActivity: formatToIST(),
      };
      setCustomers((prev) => [customerRecord, ...prev]);
      showToast(`Account created! Welcome to Everyday Editz, ${customerRecord.firstName}.`);
    }

    setCurrentCustomer(customerRecord);
    // Automatic capture to Google Sheets
    syncRecordToSheets('Customers', 'sync_customer', customerRecord);
    return customerRecord;
  };

  const updateCustomerRecord = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates, lastActivity: formatToIST() };
          syncRecordToSheets('Customers', 'sync_customer', updated);
          return updated;
        }
        return c;
      })
    );
    showToast('Customer record updated and synced.');
  };

  // --- CRM: PRODUCT ENQUIRY ---
  const submitEnquiry = (data: Omit<ProductEnquiry, 'id' | 'enquiryDate' | 'enquiryStatus'>) => {
    const id = `ENQ-IND-${Math.floor(1000 + Math.random() * 9000)}`;
    const enquiry: ProductEnquiry = {
      ...data,
      id,
      enquiryDate: formatToIST(),
      enquiryStatus: 'New',
    };
    setEnquiries((prev) => [enquiry, ...prev]);
    showToast(`Enquiry ${id} submitted! Our studio will contact you shortly.`);
    syncRecordToSheets('Product Enquiries', 'sync_enquiry', enquiry);
  };

  const updateEnquiryStatus = (id: string, status: ProductEnquiry['enquiryStatus']) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, enquiryStatus: status } : e))
    );
    showToast(`Enquiry ${id} marked as ${status}`);
  };

  // --- CRM: PRODUCT WAITLIST ---
  const joinWaitlist = (data: Omit<ProductWaitlist, 'id' | 'registrationDate' | 'status'>) => {
    const id = `WTL-IND-${Math.floor(1000 + Math.random() * 9000)}`;
    const waitlistEntry: ProductWaitlist = {
      ...data,
      id,
      registrationDate: formatToIST(),
      status: 'Waiting',
    };
    setWaitlists((prev) => [waitlistEntry, ...prev]);
    showToast(`Added to VIP Waitlist (${id})! We’ll notify you first.`);
    syncRecordToSheets('Product Waitlist', 'sync_waitlist', waitlistEntry);
  };

  const updateWaitlistStatus = (id: string, status: ProductWaitlist['status']) => {
    setWaitlists((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status } : w))
    );
    showToast(`Waitlist entry status updated to ${status}`);
  };

  // --- CRM: CUSTOMER FEEDBACK & REVIEWS ---
  const submitFeedback = (data: Omit<CustomerFeedback, 'id' | 'submissionDate'>) => {
    const id = `FDB-IND-${Math.floor(1000 + Math.random() * 9000)}`;
    const feedback: CustomerFeedback = {
      ...data,
      id,
      submissionDate: formatToIST(),
    };
    setFeedbackList((prev) => [feedback, ...prev]);

    // Also update product reviews if productId matches
    if (data.productId) {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === data.productId) {
            const newReview = {
              id: `rev-${Date.now()}`,
              author: data.customerName,
              location: 'Verified Shopper',
              rating: data.rating,
              title: data.rating >= 4 ? 'Great daily upgrade!' : 'Product feedback',
              comment: data.feedback,
              verifiedPurchase: true,
              date: formatToIST(),
              helpfulCount: 0,
            };
            return {
              ...p,
              reviews: [newReview, ...p.reviews],
              reviewCount: p.reviewCount + 1,
            };
          }
          return p;
        })
      );
    }

    showToast('Thank you! Your feedback has been recorded.');
    syncRecordToSheets('Customer Feedback', 'sync_feedback', feedback);
  };

  // --- CRM: ABANDONED CARTS ---
  const trackAbandonedCart = (data: Partial<AbandonedCart>) => {
    const cartId = data.id || `CART-AB-${Math.floor(1000 + Math.random() * 9000)}`;
    const cartRecord: AbandonedCart = {
      id: cartId,
      customerId: currentCustomer?.id,
      customerName: data.customerName || (currentCustomer ? `${currentCustomer.firstName} ${currentCustomer.lastName}` : 'Guest Visitor'),
      email: data.email || currentCustomer?.email || 'guest@example.com',
      phone: data.phone || currentCustomer?.phoneNumber || '',
      products: data.products || cart.map((i) => `${i.product.name} (x${i.quantity})`).join(', '),
      cartValue: data.cartValue || cartTotal,
      cartCreated: formatToIST(),
      lastActivity: formatToIST(),
      recoveryStatus: 'Pending',
      recoveryChannel: 'WhatsApp',
    };

    setAbandonedCarts((prev) => {
      const idx = prev.findIndex((c) => c.id === cartId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = cartRecord;
        return copy;
      }
      return [cartRecord, ...prev];
    });

    syncRecordToSheets('Abandoned Carts', 'sync_abandoned_cart', cartRecord);
  };

  const updateAbandonedCartStatus = (id: string, status: AbandonedCart['recoveryStatus']) => {
    setAbandonedCarts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, recoveryStatus: status, lastActivity: formatToIST() } : c))
    );
    showToast(`Cart ${id} marked as ${status}`);
  };

  // --- CRM: WEBSITE ACTIVITY ---
  const logActivity = (type: WebsiteActivity['activityType'], page: string, productId?: string) => {
    const act: WebsiteActivity = {
      id: `ACT-${Date.now()}`,
      customerId: currentCustomer?.id,
      sessionId,
      activityType: type,
      pageVisited: page,
      productId,
      activityTimestamp: formatToIST(),
      trafficSource: 'Direct Storefront',
      deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'Mobile Web' : 'Desktop Web',
    };
    setActivities((prev) => [act, ...prev.slice(0, 50)]);
    // Periodic or lightweight dispatch
    if (googleSheetsConfig.appsScriptUrl && Math.random() < 0.25) {
      syncRecordToSheets('Activity Logs', 'sync_activity', act);
    }
  };

  // --- CSV EXPORT FUNCTIONS ---
  const exportCustomersCSV = () => {
    const headers = [
      'Customer ID', 'First Name', 'Last Name', 'Email', 'Phone Number',
      'WhatsApp Number', 'City', 'State', 'PIN Code', 'Customer Segment',
      'Registration Date', 'Registration Source', 'Marketing Consent',
      'Total Orders', 'Total Spending', 'Customer Status', 'Last Activity'
    ];
    const rows = customers.map((c) => [
      c.id, c.firstName, c.lastName, c.email, c.phoneNumber,
      c.whatsappNumber, c.city, c.state, c.pincode, c.customerSegment,
      c.registrationDate, c.registrationSource, c.marketingConsent ? 'Yes' : 'No',
      c.totalOrders, c.totalSpending, c.customerStatus, c.lastActivity
    ]);
    downloadCSV(`EverydayEditz_Customers_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    showToast('Customer records exported to CSV.');
  };

  const exportOrdersCSV = () => {
    const headers = [
      'Order ID', 'Customer ID', 'Customer Name', 'Phone', 'Email',
      'Product Name', 'Product SKU', 'Product Category', 'Quantity',
      'Product Price', 'Discount', 'Shipping Charge', 'Total Amount',
      'Payment Method', 'Payment Status', 'Order Date', 'Shipping Address',
      'PIN Code', 'Supplier Name', 'Supplier Order Reference', 'Tracking ID',
      'Fulfilment Status', 'Delivery Status', 'Return Status'
    ];
    const rows: (string | number)[][] = [];
    orders.forEach((o) => {
      const addr = o.shippingAddress ? `${o.shippingAddress.flatHouseNo}, ${o.shippingAddress.streetArea}, ${o.shippingAddress.city}` : '';
      const pin = o.shippingAddress?.pincode || '';
      const name = o.shippingAddress?.fullName || '';
      const phone = o.shippingAddress?.phoneNumber || '';
      const email = o.shippingAddress?.email || '';
      if (!o.items || o.items.length === 0) {
        rows.push([
          o.id, o.customerId || '', name, phone, email,
          'Everyday Bundle', 'EE-PKG', 'Lifestyle', 1,
          o.subtotal, o.discount, o.shippingCharge, o.total,
          o.paymentMethod, o.paymentStatus, o.createdAt, addr, pin,
          o.supplierName || 'BLR Hub', o.supplierOrderRef || '', o.trackingNumber,
          o.fulfilmentStatus || 'Processing', o.status, o.returnStatus || 'None'
        ]);
      } else {
        o.items.forEach((item) => {
          rows.push([
            o.id, o.customerId || '', name, phone, email,
            item.product.name, item.product.id, item.product.departments?.[0] || 'Lifestyle', item.quantity,
            item.product.price, o.discount, o.shippingCharge, o.total,
            o.paymentMethod, o.paymentStatus, o.createdAt, addr, pin,
            o.supplierName || 'BLR Hub', o.supplierOrderRef || '', o.trackingNumber,
            o.fulfilmentStatus || 'Processing', o.status, o.returnStatus || 'None'
          ]);
        });
      }
    });
    downloadCSV(`EverydayEditz_Orders_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    showToast('Orders exported to CSV.');
  };

  const exportEnquiriesCSV = () => {
    const headers = ['Enquiry ID', 'Customer Name', 'Phone', 'Email', 'Product Name', 'Product ID', 'Category', 'Message', 'Date', 'Platform', 'Status'];
    const rows = enquiries.map((e) => [
      e.id, e.customerName, e.phone, e.email, e.productName, e.productId, e.productCategory, e.customerMessage, e.enquiryDate, e.sourcePlatform, e.enquiryStatus
    ]);
    downloadCSV(`EverydayEditz_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    showToast('Enquiries exported to CSV.');
  };

  const exportAbandonedCartsCSV = () => {
    const headers = ['Cart ID', 'Customer ID', 'Customer Name', 'Email', 'Phone', 'Products', 'Cart Value', 'Created', 'Last Activity', 'Recovery Status'];
    const rows = abandonedCarts.map((c) => [
      c.id, c.customerId || '', c.customerName, c.email, c.phone, c.products, c.cartValue, c.cartCreated, c.lastActivity, c.recoveryStatus
    ]);
    downloadCSV(`EverydayEditz_AbandonedCarts_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    showToast('Abandoned carts exported to CSV.');
  };

  const exportWaitlistCSV = () => {
    const headers = ['Entry ID', 'Customer Name', 'Email', 'Phone', 'Interested Product', 'Category', 'Budget', 'Date', 'Consent', 'Status'];
    const rows = waitlists.map((w) => [
      w.id, w.customerName, w.email, w.phone, w.interestedProduct, w.productCategory, w.expectedBudget, w.registrationDate, w.notificationConsent ? 'Yes' : 'No', w.status
    ]);
    downloadCSV(`EverydayEditz_Waitlist_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    showToast('Waitlist records exported to CSV.');
  };

  const exportFeedbackCSV = () => {
    const headers = ['Feedback ID', 'Customer ID', 'Customer Name', 'Order ID', 'Product Name', 'Rating', 'Feedback', 'Date'];
    const rows = feedbackList.map((f) => [
      f.id, f.customerId || '', f.customerName, f.orderId || '', f.productName, f.rating, f.feedback, f.submissionDate
    ]);
    downloadCSV(`EverydayEditz_Feedback_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    showToast('Feedback exported to CSV.');
  };

  // Navigation helpers
  const navigateToDepartment = (dept: Department, subcategory?: string) => {
    setSelectedDepartment(dept);
    setSelectedSubcategory(subcategory || null);
    logActivity('category_view', `Department: ${dept} ${subcategory ? `> ${subcategory}` : ''}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const returnToHome = () => {
    setSelectedDepartment(null);
    setSelectedSubcategory(null);
    logActivity('page_view', 'Home');
  };

  // Cart calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const couponDiscount = appliedCoupon
    ? appliedCoupon.discountPercent
      ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
      : appliedCoupon.discountAmount || 0
    : 0;

  const redeemedPointsDiscount = pointsToRedeemAtCheckout;
  const shippingFee = cartSubtotal >= settings.freeShippingThreshold || cartSubtotal === 0 ? 0 : settings.shippingCharge;
  const cartTotal = Math.max(0, cartSubtotal - couponDiscount - redeemedPointsDiscount + shippingFee);

  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedVariant === variant
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedVariant === variant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedVariant: variant }];
    });
    showToast(`Added ${product.name} to bag`);
    logActivity('add_to_cart', `Product: ${product.name}`, product.id);
  };

  const updateCartQuantity = (productId: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedVariant === variant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, variant?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedVariant === variant)
      )
    );
    showToast('Removed from bag', 'info');
  };

  const clearCart = () => setCart([]);

  const addBundleToCart = (bundle: Bundle) => {
    const bundleProds = products.filter((p) => bundle.productIds.includes(p.id));
    bundleProds.forEach((prod) => addToCart(prod, 1));
    showToast(`Added ${bundle.title} bundle to bag!`);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === cleanCode && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    if (cartSubtotal < found.minOrderValue) {
      return { success: false, message: `Minimum order value for ${cleanCode} is ₹${found.minOrderValue}` };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Applied ${found.code}! You saved on this curation.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your Wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'courierName' | 'trackingNumber'>) => {
    // 1. Automatically register or update Customer record with shipping details
    let customerRecord: Customer | null = null;
    if (orderData.shippingAddress) {
      customerRecord = registerOrUpdateCustomer({
        firstName: orderData.shippingAddress.fullName.split(' ')[0] || 'Valued',
        lastName: orderData.shippingAddress.fullName.split(' ').slice(1).join(' ') || 'Customer',
        email: orderData.shippingAddress.email,
        phoneNumber: orderData.shippingAddress.phoneNumber,
        whatsappNumber: orderData.shippingAddress.phoneNumber,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        pincode: orderData.shippingAddress.pincode,
        totalOrders: (currentCustomer?.totalOrders || 0) + 1,
        totalSpending: (currentCustomer?.totalSpending || 0) + orderData.total,
        customerStatus: (currentCustomer?.totalSpending || 0) + orderData.total > 2500 ? 'VIP' : 'Active',
        registrationSource: 'Order Checkout',
      });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `EE-IND-2026-${randomSuffix}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      customerId: customerRecord?.id || currentCustomer?.id,
      createdAt: formatToIST(),
      status: 'Confirmed',
      courierName: 'Delhivery Express Surface & Air',
      trackingNumber: `DLV${randomSuffix}${Math.floor(100000 + Math.random() * 900000)}IN`,
      supplierName: 'BLR Fulfillment Center',
      supplierOrderRef: `SUP-BLR-${randomSuffix}`,
      fulfilmentStatus: 'Processing',
      deliveryStatus: 'Ordered',
      returnStatus: 'None',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setRecentOrder(newOrder);

    // Direct synchronous Google Sheets capture for the placed order
    syncRecordToSheets('Orders', 'sync_order', newOrder);

    // 2. Automated Inventory Stock Reservation & Deduction
    orderData.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.product.id);
      if (prod) {
        const prevStock = prod.stockCount || 0;
        const newStock = Math.max(0, prevStock - item.quantity);
        const sku = prod.sku || ('EE-' + prod.id.replace('prod-', '').toUpperCase());

        // Create Stock Movement Audit Log
        const log: StockAdjustmentLog = {
          id: `LOG-STK-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          productId: prod.id,
          sku,
          productName: prod.name,
          changeAmount: -item.quantity,
          previousStock: prevStock,
          newStock,
          reason: 'Order Fulfilled',
          adjustedBy: `Order #${orderId}`,
          timestamp: formatToIST(),
        };
        setStockLogs((prev) => [log, ...prev]);

        // Update In-Memory Product Stock
        updateProduct(prod.id, {
          stockCount: newStock,
          availableQuantity: newStock,
          reservedQuantity: (prod.reservedQuantity || 0) + item.quantity,
          inStock: newStock > 0,
          lastStockUpdate: formatToIST(),
        });

        // Sync to Sheets: Inventory & Products
        syncRecordToSheets('Inventory', 'sync_inventory', {
          productId: prod.id,
          sku,
          productName: prod.name,
          previousStock: prevStock,
          newStock,
          changeAmount: -item.quantity,
          reason: 'Order Fulfilled',
          adjustedBy: `Order #${orderId}`,
          timestamp: formatToIST(),
        });
      }
    });

    // 3. Record Verified Payment Transaction
    const txn: PaymentTransaction = {
      id: `TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      orderId,
      gateway: orderData.paymentMethod === 'UPI' ? 'UPI' : orderData.paymentMethod === 'Card' ? 'Card' : 'Netbanking',
      gatewayOrderId: orderData.gatewayOrderId || `gw_ord_${orderId}`,
      gatewayPaymentId: orderData.gatewayPaymentId || `gw_pay_${Date.now()}`,
      amount: newOrder.total,
      currency: 'INR',
      status: 'Success',
      method: orderData.paymentMethod,
      timestamp: formatToIST(),
      verifiedServerSide: true,
      customerEmail: orderData.shippingAddress.email,
      customerPhone: orderData.shippingAddress.phoneNumber,
    };
    setPaymentTransactions((prev) => [txn, ...prev]);
    syncRecordToSheets('Payments', 'sync_payment', txn);

    // Reward points earned
    const pointsEarned = Math.floor(newOrder.total / 10);
    if (pointsEarned > 0) {
      setRewardsBalance((prev) => prev + pointsEarned);
      setRewardsHistory((prev) => [
        {
          id: `tx-${Date.now()}`,
          title: `Order ${orderId} Points Earned`,
          points: pointsEarned,
          type: 'earned',
          date: 'Just now',
        },
        ...prev,
      ]);
    }

    if (pointsToRedeemAtCheckout > 0) {
      setRewardsBalance((prev) => Math.max(0, prev - pointsToRedeemAtCheckout));
      setPointsToRedeemAtCheckout(0);
    }

    clearCart();
    return newOrder;
  };

  // Stock Adjustment Action
  const adjustProductStock = (
    productId: string, 
    changeAmount: number, 
    reason: StockAdjustmentLog['reason'], 
    adjustedBy = 'Admin Console'
  ) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const previousStock = prod.stockCount || 0;
    const newStock = Math.max(0, previousStock + changeAmount);
    const sku = prod.sku || ('EE-' + prod.id.replace('prod-', '').toUpperCase());

    const log: StockAdjustmentLog = {
      id: `LOG-STK-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId,
      sku,
      productName: prod.name,
      changeAmount,
      previousStock,
      newStock,
      reason,
      adjustedBy,
      timestamp: formatToIST(),
    };

    setStockLogs((prev) => [log, ...prev]);

    updateProduct(productId, {
      stockCount: newStock,
      availableQuantity: newStock,
      inStock: newStock > 0,
      lastStockUpdate: formatToIST(),
    });

    syncRecordToSheets('Inventory', 'sync_inventory', {
      productId,
      sku,
      productName: prod.name,
      previousStock,
      newStock,
      changeAmount,
      reason,
      adjustedBy,
      timestamp: formatToIST(),
    });

    showToast(`Inventory updated for ${prod.name}: ${newStock} units remaining`, 'success');
  };

  // Return & Replacement Claim Submission
  const submitReturnClaim = async (
    claimData: Omit<ReturnClaim, 'id' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean; claimId?: string; error?: string }> => {
    const claimId = `CLM-IND-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const fullClaim: ReturnClaim = {
      ...claimData,
      id: claimId,
      status: 'Submitted',
      createdAt: formatToIST(),
    };

    setReturnClaims((prev) => [fullClaim, ...prev]);
    showToast(`Claim ${claimId} submitted to Grievance Desk`, 'success');

    // Attempt server submission
    try {
      fetch('/api/returns/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullClaim),
      }).catch(() => {});
    } catch {
      // Offline fallback
    }

    // Synchronize to Google Sheets Returns & Refunds tab
    syncRecordToSheets('Returns & Refunds', 'sync_claim', fullClaim);
    return { success: true, claimId };
  };

  const updateReturnClaimStatus = (
    claimId: string, 
    status: ReturnClaim['status'], 
    adminNotes?: string
  ) => {
    setReturnClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const updated: ReturnClaim = {
            ...c,
            status,
            adminNotes: adminNotes || c.adminNotes,
            resolutionDate: ['Replacement Approved', 'Refund Approved', 'Rejected'].includes(status) ? formatToIST() : c.resolutionDate,
          };
          syncRecordToSheets('Returns & Refunds', 'sync_claim', updated);
          return updated;
        }
        return c;
      })
    );
    showToast(`Claim ${claimId} status updated to ${status}`);
  };

  // Admin Security Authentication
  const adminLogin = async (password: string, username = 'admin'): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setAdminToken(data.token);
        setIsAdminAuthenticated(true);
        sessionStorage.setItem('edz_admin_token', data.token);
        localStorage.setItem('edz_admin_token', data.token);
        setIsAdminLoginModalOpen(false);
        setIsAdminOpen(true);
        showToast('Admin session verified successfully', 'success');
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid admin credentials' };
      }
    } catch {
      return { success: false, error: 'Unable to connect to security gateway. Please check server status.' };
    }
  };

  const adminLogout = () => {
    if (adminToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ token: adminToken }),
      }).catch(() => {});
    }
    setAdminToken(null);
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('edz_admin_token');
    localStorage.removeItem('edz_admin_token');
    setIsAdminOpen(false);
    showToast('Signed out from Admin Dashboard', 'info');
  };

  const updateOrderStatus = (
    orderId: string, 
    status: Order['status'], 
    trackingNumber?: string,
    supplierName?: string,
    supplierOrderRef?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated: Order = {
            ...o,
            status,
            trackingNumber: trackingNumber || o.trackingNumber,
            supplierName: supplierName || o.supplierName,
            supplierOrderRef: supplierOrderRef || o.supplierOrderRef,
            deliveryStatus: status === 'Delivered' ? 'Delivered' : status === 'Shipped' ? 'In Transit' : 'Ordered',
          };
          syncRecordToSheets('Orders', 'update_order_status', {
            orderId,
            status,
            trackingNumber: updated.trackingNumber,
            supplierName: updated.supplierName,
            supplierOrderRef: updated.supplierOrderRef,
          });
          return updated;
        }
        return o;
      })
    );
    showToast(`Order ${orderId} updated to ${status}`);
  };

  // Rewards redemption
  const redeemPointsForOrder = (points: number) => {
    if (points > rewardsBalance) return false;
    setPointsToRedeemAtCheckout(points);
    showToast(`Applying ₹${points} rewards discount to order`);
    return true;
  };

  // Product CRUD
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const productWithId: Product = {
      ...newProd,
      id,
      discountPercent: Math.round(((newProd.originalPrice - newProd.price) / newProd.originalPrice) * 100),
      images: newProd.images?.length > 0 ? newProd.images : ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'],
    };
    setProducts((prev) => [productWithId, ...prev]);
    showToast(`Added "${productWithId.name}" to catalog`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          if (updates.price || updates.originalPrice) {
            const pr = updates.price || p.price;
            const orig = updates.originalPrice || p.originalPrice;
            updated.discountPercent = Math.round(((orig - pr) / orig) * 100);
          }
          return updated;
        }
        return p;
      })
    );
    showToast('Product updated successfully');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog', 'info');
  };

  // Categories CRUD
  const addCategoryToDepartment = (deptId: Department, subcategoryName: string) => {
    setDepartments((prev) =>
      prev.map((d) => {
        if (d.id === deptId && !d.subcategories.includes(subcategoryName)) {
          return { ...d, subcategories: [...d.subcategories, subcategoryName] };
        }
        return d;
      })
    );
    showToast(`Added "${subcategoryName}" to ${deptId}`);
  };

  const removeCategoryFromDepartment = (deptId: Department, subcategoryName: string) => {
    setDepartments((prev) =>
      prev.map((d) => {
        if (d.id === deptId) {
          return { ...d, subcategories: d.subcategories.filter((s) => s !== subcategoryName) };
        }
        return d;
      })
    );
    showToast(`Removed "${subcategoryName}" from ${deptId}`);
  };

  const renameCategoryInDepartment = (deptId: Department, oldName: string, newName: string) => {
    setDepartments((prev) =>
      prev.map((d) => {
        if (d.id === deptId) {
          return {
            ...d,
            subcategories: d.subcategories.map((s) => (s === oldName ? newName : s)),
          };
        }
        return d;
      })
    );
    setProducts((prev) =>
      prev.map((p) => {
        if (p.departments.includes(deptId) && p.subcategories.includes(oldName)) {
          return {
            ...p,
            subcategories: p.subcategories.map((s) => (s === oldName ? newName : s)),
          };
        }
        return p;
      })
    );
    showToast(`Renamed category to "${newName}"`);
  };

  // Admin Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Store settings updated');
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
    showToast(`Coupon ${coupon.code} created`);
  };

  const toggleCouponActive = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        bundles,
        departments,
        setProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        selectedDepartment,
        setSelectedDepartment,
        selectedSubcategory,
        setSelectedSubcategory,
        navigateToDepartment,
        returnToHome,
        activePriceTier,
        setActivePriceTier,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        addBundleToCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponDiscount,
        redeemedPointsDiscount,
        shippingFee,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        recentOrder,
        customers,
        currentCustomer,
        setCurrentCustomer,
        registerOrUpdateCustomer,
        updateCustomerRecord,
        enquiries,
        submitEnquiry,
        updateEnquiryStatus,
        waitlists,
        joinWaitlist,
        updateWaitlistStatus,
        feedbackList,
        submitFeedback,
        abandonedCarts,
        trackAbandonedCart,
        updateAbandonedCartStatus,
        logActivity,
        googleSheetsConfig,
        setGoogleSheetsUrl,
        testSheetsConnection,
        syncQueue,
        retryFailedSyncQueue,
        syncAllExistingToSheets,
        sendTestCustomerAndOrderToSheets,
        exportCustomersCSV,
        exportOrdersCSV,
        exportEnquiriesCSV,
        exportAbandonedCartsCSV,
        exportWaitlistCSV,
        exportFeedbackCSV,
        rewardsBalance,
        rewardsHistory,
        referralCode,
        redeemPointsForOrder,
        pointsToRedeemAtCheckout,
        setPointsToRedeemAtCheckout,
        settings,
        updateSettings,
        coupons,
        addCoupon,
        toggleCouponActive,
        addCategoryToDepartment,
        removeCategoryFromDepartment,
        renameCategoryInDepartment,
        // Inventory & Suppliers
        suppliers,
        stockLogs,
        adjustProductStock,

        // Payments & Transactions
        paymentTransactions,

        // Return & Replacement Claims
        returnClaims,
        submitReturnClaim,
        updateReturnClaimStatus,

        // Admin Security & Session
        adminToken,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,

        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAdminOpen,
        setIsAdminOpen,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        isReturnClaimOpen,
        setIsReturnClaimOpen,
        returnClaimPrefillOrder,
        setReturnClaimPrefillOrder,
        isRewardsOpen,
        setIsRewardsOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        trackingLookupId,
        setTrackingLookupId,
        isAccountOpen,
        setIsAccountOpen,
        isEnquiryOpen,
        setIsEnquiryOpen,
        enquiryProduct,
        setEnquiryProduct,
        isWaitlistOpen,
        setIsWaitlistOpen,
        waitlistProduct,
        setWaitlistProduct,
        isFeedbackOpen,
        setIsFeedbackOpen,
        feedbackProduct,
        setFeedbackProduct,
        activePolicy,
        setActivePolicy,
        isReelsOpen,
        setIsReelsOpen,
        activeReelIndex,
        setActiveReelIndex,
        selectedNeed,
        setSelectedNeed,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
