export type Department = 'women' | 'men' | 'kids' | 'home-lifestyle';

export type ProductCategory = 
  | 'workspace' 
  | 'home-organise' 
  | 'travel' 
  | 'lifestyle' 
  | 'kitchen' 
  | 'gifting';

export type ProblemNeed = 
  | 'Organise My Space' 
  | 'Make Life Easier' 
  | 'Travel Smarter' 
  | 'Upgrade My Workspace' 
  | 'Everyday Essentials' 
  | 'Gifts Worth Giving';

export interface DepartmentConfig {
  id: Department;
  name: string;
  tagline: string;
  description: string;
  subcategories: string[];
  bannerAccent: string;
  marketingWeight: number; // e.g. 70 for women, 20 for men, 10 for kids
}

export interface ProductVariant {
  name: string;
  options: {
    label: string;
    value: string;
    colorHex?: string;
    inStock: boolean;
  }[];
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
  helpfulCount: number;
}

export interface EditorialDetails {
  everydayEdit: string;
  whyYouLoveIt: string[];
  problemItSolves: string;
  keyFeatures: string[];
  specifications: Record<string, string>;
  materialAndDimensions: {
    material: string;
    dimensions: string;
    weight: string;
  };
  packageContents: string[];
  howToUse: string[];
  limitations: string[];
  shippingAndReturns: string;
}

export interface Product {
  id: string;
  sku?: string; // Master inventory SKU (e.g. EE-W-TOIL-01)
  name: string;
  tagline: string;
  departments: Department[]; // Many-to-many department assignment
  subcategories: string[]; // Subcategories across departments
  tags: string[];
  category?: ProductCategory; // Backward compatibility
  needCategory?: ProblemNeed; // Backward compatibility
  price: number; // Customer selling price in INR
  originalPrice: number; // MRP in INR
  supplierId?: string; // e.g. SUP-BLR-01
  supplierName?: string; // Dropship fulfillment partner
  supplierProductRef?: string; // Supplier model code
  supplierCost?: number; // Private admin purchase cost
  shippingCost?: number; // Courier freight allocation
  discountPercent: number;
  gstRate?: number; // GST rate percentage (e.g. 18%)
  hsnCode?: string; // Indian HSN/SAC code
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number; // Total physical count
  availableQuantity?: number; // Available unreserved stock
  reservedQuantity?: number; // Reserved for pending/paid orders
  reorderLevel?: number; // Low-stock threshold
  lastStockUpdate?: string; // IST timestamp of last stock update
  lastSupplierVerification?: string; // Date supplier confirmed availability
  status?: 'Active' | 'Inactive' | 'Draft';
  isDailyEdit: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  isBestSeller?: boolean;
  isPublished?: boolean;
  ageSuitability?: string; // Especially for Kids & Family products
  safetyInformation?: string; // Safety certifications & notes
  priceTier?: 'under-199' | 'under-299' | 'under-499' | 'under-999' | 'above-999';
  images: string[];
  videoThumbnail?: string;
  videoCaption?: string;
  variants?: ProductVariant[];
  editorial: EditorialDetails;
  reviews: Review[];
  frequentlyBoughtWith?: string[];
  customBadge?: string;
}

export interface Bundle {
  id: string;
  title: string;
  description: string;
  badge: string;
  productIds: string[];
  bundlePrice: number;
  originalPrice: number;
  savings: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Address {
  fullName: string;
  phoneNumber: string;
  email: string;
  flatHouseNo: string;
  streetArea: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
}

export interface Order {
  id: string;
  customerId?: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCharge: number;
  total: number;
  status: 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod: 'UPI' | 'Card' | 'Netbanking'; // Strictly PREPAID ONLY - COD disabled
  paymentStatus: 'Paid' | 'Failed' | 'Refunded';
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  shippingAddress: Address;
  courierName: string;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  supplierName?: string;
  supplierOrderRef?: string;
  fulfilmentStatus?: 'Unfulfilled' | 'Processing' | 'Fulfilled' | 'Cancelled';
  deliveryStatus?: 'Ordered' | 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Returned';
  returnStatus?: 'None' | 'Requested' | 'Approved' | 'Rejected' | 'Refunded';
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  gateway: 'Razorpay' | 'UPI' | 'PhonePe' | 'Card' | 'Netbanking';
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  amount: number;
  currency: 'INR';
  status: 'Success' | 'Failed' | 'Pending' | 'Refunded';
  method: 'UPI' | 'Card' | 'Netbanking';
  timestamp: string;
  verifiedServerSide: boolean;
  customerEmail?: string;
  customerPhone?: string;
  failureReason?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
  city: string;
  state: string;
  pincode: string;
  customerSegment: 'Women' | 'Men' | 'Kids' | 'Household';
  registrationDate: string;
  registrationSource: string;
  marketingConsent: boolean; // Explicit separate marketing consent
  whatsappConsent: boolean;
  totalOrders: number;
  totalSpending: number;
  customerStatus: 'Active' | 'VIP' | 'Inactive';
  lastActivity: string;
}

export interface ReturnClaim {
  id: string;
  orderId: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productId: string;
  productName: string;
  issueType: 'Damaged in Transit' | 'Defective Item' | 'Incorrect Product' | 'Incomplete Package' | 'Misdescribed';
  description: string;
  evidenceImages: string[];
  status: 'Submitted' | 'Under Review' | 'Replacement Approved' | 'Refund Approved' | 'Rejected' | 'Info Required';
  adminNotes?: string;
  resolutionDate?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  categories: string[];
  leadTimeDays: number;
  activeSKUs: number;
  lastStockVerification: string;
}

export interface StockAdjustmentLog {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  changeAmount: number;
  previousStock: number;
  newStock: number;
  reason: 'Restock' | 'Order Fulfilled' | 'Order Cancelled' | 'Damaged/Defective' | 'Physical Audit' | 'Manual Correction';
  adjustedBy: string;
  timestamp: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  action: string;
  status: 'Success' | 'Warning' | 'Failed' | 'Blocked';
  ip?: string;
  details: string;
}

export interface ProductEnquiry {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  productName: string;
  productId: string;
  productCategory: string;
  customerMessage: string;
  enquiryDate: string;
  sourcePlatform: string;
  enquiryStatus: 'New' | 'In Progress' | 'Responded' | 'Closed';
}

export interface AbandonedCart {
  id: string;
  customerId?: string;
  customerName: string;
  email: string;
  phone: string;
  products: string;
  cartValue: number;
  cartCreated: string;
  lastActivity: string;
  recoveryStatus: 'Pending' | 'Contacted' | 'Recovered' | 'Expired';
  recoveryChannel?: 'WhatsApp' | 'Email' | 'None';
}

export interface ProductWaitlist {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  interestedProduct: string;
  productId?: string;
  productCategory: string;
  expectedBudget: string;
  registrationDate: string;
  notificationConsent: boolean;
  status: 'Waiting' | 'Notified' | 'Purchased';
}

export interface CustomerFeedback {
  id: string;
  customerId?: string;
  customerName: string;
  orderId?: string;
  productName: string;
  productId?: string;
  rating: number;
  feedback: string;
  submissionDate: string;
}

export interface WebsiteActivity {
  id: string;
  customerId?: string;
  sessionId: string;
  activityType: 'page_view' | 'product_view' | 'search' | 'add_to_cart' | 'checkout_started' | 'category_view';
  pageVisited: string;
  productId?: string;
  activityTimestamp: string;
  trafficSource: string;
  deviceType: string;
}

export interface GoogleSheetsConfig {
  appsScriptUrl: string;
  spreadsheetId?: string;
  isConnected: boolean;
  lastCheckedAt?: string;
  lastSyncStatus: 'idle' | 'success' | 'failed' | 'pending';
  errorMessage?: string;
  totalSyncedRecords: number;
}

export interface SyncQueueItem {
  id: string;
  sheet: 'Customers' | 'Orders' | 'Products' | 'Inventory' | 'Suppliers' | 'Payments' | 'Returns & Refunds' | 'Product Enquiries' | 'Abandoned Carts' | 'Product Waitlist' | 'Customer Feedback' | 'Activity Logs';
  action: string;
  payload: Record<string, any>;
  timestamp: string;
  retryCount: number;
  lastError?: string;
  status: 'pending' | 'success' | 'failed';
}

export interface RewardsTransaction {
  id: string;
  title: string;
  points: number;
  type: 'earned' | 'redeemed';
  date: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue: number;
  active: boolean;
}

export interface StoreSettings {
  brandName?: string;
  businessName?: string;
  contactEmail?: string;
  operationsAddress?: string;
  instagramUrl?: string;
  announcementText: string;
  announcementSubtext: string;
  heroHeadline: string;
  heroSubtitle: string;
  dailyEditTitle: string;
  dailyEditSubtitle: string;
  freeShippingThreshold: number;
  shippingCharge: number;
  rewardPointsPer100Rupees: number;
  referralRewardPoints: number;
  prepaidNotice?: string;
  googleSheetsUrl?: string;
}

export type UserRole = 'admin' | 'customer';

export interface AuthSession {
  token: string;
  role: UserRole;
  username?: string;
  email?: string;
  expiresAt: number;
}
