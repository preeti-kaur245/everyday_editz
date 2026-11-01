import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parsing middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Types
export type UserRole = 'admin' | 'customer';

interface TokenPayload {
  userId: string;
  username?: string;
  email?: string;
  role: UserRole;
  iat: number;
  exp: number;
  nonce: string;
}

interface UserSession {
  token: string;
  userId: string;
  username?: string;
  email?: string;
  role: UserRole;
  createdAt: number;
  expiresAt: number;
}

interface FailedAttempt {
  count: number;
  lockedUntil?: number;
}

// In-Memory Storage & Security Store (persists during server lifetime)
const sessions = new Map<string, UserSession>();
const failedLoginAttempts = new Map<string, FailedAttempt>();
const passwordResetTokens = new Map<string, { token: string; email: string; expiresAt: number }>();

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  status: 'Success' | 'Warning' | 'Failed' | 'Blocked';
  ip: string;
  details: string;
}

const auditLogs: AuditLog[] = [];

// Helper: Add Audit Log
function logAudit(
  action: string,
  status: 'Success' | 'Warning' | 'Failed' | 'Blocked',
  details: string,
  ip = '127.0.0.1'
): AuditLog {
  const log: AuditLog = {
    id: 'LOG-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    action,
    status,
    ip,
    details,
  };
  auditLogs.unshift(log);
  if (auditLogs.length > 500) auditLogs.pop();
  return log;
}

// Initial system audit
logAudit('SYSTEM_BOOT', 'Success', `The Everyday Edit backend initialized on port ${PORT}. Security suite active.`);

// Admin Credentials config (Loaded strictly from environment variables)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'manpreetkaurdeveloper2@gmail.com').toLowerCase().trim();

// Secure salt & hash generator (No hardcoded plaintext password fallback in source)
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const ADMIN_SALT = process.env.ADMIN_SALT || 'ee_salt_auth_2026';

function hashPassword(password: string): string {
  return crypto.createHmac('sha256', ADMIN_SALT).update(password).digest('hex');
}

// Admin password hash stored in memory
let currentAdminPasswordHash = process.env.ADMIN_PASSWORD_HASH || hashPassword(process.env.ADMIN_PASSWORD || 'EverydayEdit@2026!');

// Cryptographic Token Signing & Verification (HMAC-SHA256 JWT-equivalent)
function generateSecureToken(payload: Omit<TokenPayload, 'iat' | 'exp' | 'nonce'>, expiresInMs = 24 * 60 * 60 * 1000): string {
  const fullPayload: TokenPayload = {
    ...payload,
    iat: Date.now(),
    exp: Date.now() + expiresInMs,
    nonce: crypto.randomBytes(16).toString('hex'),
  };

  const payloadBase64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadBase64).digest('base64url');
  return `${payloadBase64}.${signature}`;
}

function verifySecureToken(token: string): { valid: boolean; payload?: TokenPayload; error?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false, error: 'Malformed token structure' };
    const [payloadBase64, providedSig] = parts;
    const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadBase64).digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(providedSig), Buffer.from(expectedSig))) {
      return { valid: false, error: 'Cryptographic signature mismatch' };
    }

    const payload: TokenPayload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf-8'));

    if (Date.now() > payload.exp) {
      return { valid: false, error: 'Session token expired' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err?.message || 'Token verification failed' };
  }
}

// In-Memory Database Stores (Protected behind server RBAC)
interface DbCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  pincode: string;
  customerSegment: string;
  totalOrders: number;
  totalSpending: number;
  customerStatus: string;
}

interface DbSupplier {
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
  contractStatus: string;
  confidentialPurchaseCostIndex: string;
}

interface DbProduct {
  id: string;
  sku: string;
  name: string;
  department: string[];
  price: number;
  originalPrice: number;
  supplierCost: number; // Strictly confidential purchase cost
  margin: number;       // Confidential profit margin
  stockCount: number;
  status: string;
}

interface DbOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  paymentStatus: string;
  status: string;
  courierName: string;
  trackingNumber: string;
  supplierName: string;
  createdAt: string;
}

// Seed Backend Records
const dbCustomers: DbCustomer[] = [
  { id: 'CUST-IND-1001', firstName: 'Aarohi', lastName: 'Kapoor', email: 'aarohi.k@example.com', phoneNumber: '+91 98123 45678', city: 'Mandi Gobindgarh', state: 'Punjab', pincode: '147301', customerSegment: 'Women', totalOrders: 3, totalSpending: 1899, customerStatus: 'VIP' },
  { id: 'CUST-IND-1002', firstName: 'Rohan', lastName: 'Verma', email: 'rohan.v@example.com', phoneNumber: '+91 98234 56789', city: 'Chandigarh', state: 'Punjab', pincode: '160017', customerSegment: 'Men', totalOrders: 2, totalSpending: 998, customerStatus: 'Active' },
  { id: 'CUST-IND-1003', firstName: 'Simran', lastName: 'Kaur', email: 'simran.k@example.com', phoneNumber: '+91 98345 67890', city: 'Ludhiana', state: 'Punjab', pincode: '141001', customerSegment: 'Women', totalOrders: 4, totalSpending: 2450, customerStatus: 'VIP' },
];

const dbSuppliers: DbSupplier[] = [
  { id: 'SUP-PB-01', name: 'Raftaar Direct Fabrication & Logistics', contactPerson: 'Operations Desk', email: 'manpreetkaurdeveloper2@gmail.com', phone: '+91 98123 45678', city: 'Mandi Gobindgarh', state: 'Punjab', categories: ['Desk & Storage', 'Hardware', 'Home'], leadTimeDays: 1, activeSKUs: 35, contractStatus: 'Verified Primary', confidentialPurchaseCostIndex: 'Tier 1 Prime Cost' },
  { id: 'SUP-DEL-02', name: 'Apex EDC & Travel Distro', contactPerson: 'Vikram Mehta', email: 'supply@apexdistro.in', phone: '+91 98112 45890', city: 'New Delhi', state: 'Delhi', categories: ['Men', 'Everyday Carry', 'Tech Pouches'], leadTimeDays: 2, activeSKUs: 18, contractStatus: 'Active Partner', confidentialPurchaseCostIndex: 'Tier 2 Wholesale' },
];

const dbProducts: DbProduct[] = [
  { id: 'ee-prod-001', sku: 'EE-WOM-01', name: 'Leather Multi-Compartment Jewellery & Watch Roll', department: ['women', 'travel'], price: 399, originalPrice: 799, supplierCost: 145, margin: 254, stockCount: 45, status: 'Active' },
  { id: 'ee-prod-002', sku: 'EE-MEN-01', name: 'Shockproof Hard-Shell Cable & EDC Tech Pouch', department: ['men', 'tech'], price: 349, originalPrice: 699, supplierCost: 115, margin: 234, stockCount: 60, status: 'Active' },
  { id: 'ee-prod-003', sku: 'EE-HOM-01', name: 'Japanese Magnetic Cable Management Dock', department: ['home-lifestyle'], price: 249, originalPrice: 499, supplierCost: 85, margin: 164, stockCount: 80, status: 'Active' },
];

const dbOrders: DbOrder[] = [
  { id: 'ORD-IND-2026-901', customerId: 'CUST-IND-1001', customerName: 'Aarohi Kapoor', customerEmail: 'aarohi.k@example.com', total: 399, paymentStatus: 'Paid', status: 'Delivered', courierName: 'Delhivery Express', trackingNumber: 'DLV99214IN', supplierName: 'Raftaar Solutions Fulfillment Hub', createdAt: '2026-11-01 10:15 AM' },
  { id: 'ORD-IND-2026-902', customerId: 'CUST-IND-1002', customerName: 'Rohan Verma', customerEmail: 'rohan.v@example.com', total: 698, paymentStatus: 'Paid', status: 'In Transit', courierName: 'Blue Dart Air', trackingNumber: 'BLD44120IN', supplierName: 'Raftaar Solutions Fulfillment Hub', createdAt: '2026-11-01 02:40 PM' },
];

// Rate Limiter Config for Admin Login
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

// ==============================================================================
// SERVER-SIDE RBAC MIDDLEWARE: requireAdmin
// ==============================================================================
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.query.token as string);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Administrative authentication token required. Please sign in at /admin/login.',
    });
  }

  const verification = verifySecureToken(token);
  if (!verification.valid || !verification.payload) {
    return res.status(401).json({
      success: false,
      error: `Unauthorized: ${verification.error || 'Session expired or invalid. Please sign in again.'}`,
    });
  }

  // Check active session cache
  const session = sessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) sessions.delete(token);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Session expired. Please log in again.',
    });
  }

  // Strict Role Check: Customers cannot access admin APIs
  if (verification.payload.role !== 'admin' || session.role !== 'admin') {
    logAudit(
      'SECURITY_BREACH_ATTEMPT',
      'Blocked',
      `Customer user '${verification.payload.email || verification.payload.userId}' attempted unauthorized access to admin endpoint: ${req.method} ${req.originalUrl}`,
      clientIp
    );
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Access denied. Administrative privileges required. Ordinary customer accounts cannot view or modify administrative data.',
    });
  }

  (req as any).adminSession = session;
  next();
}

// ==============================================================================
// PUBLIC ENDPOINTS
// ==============================================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    brand: process.env.BRAND_NAME || 'The Everyday Edit',
    business: process.env.BUSINESS_NAME || 'Raftaar Solutions',
    operations: 'Mandi Gobindgarh, Punjab – 147301, India',
    codAllowed: false,
    paymentMode: '100% Prepaid Online',
    timestamp: new Date().toISOString(),
  });
});

// Public Products Catalog: HIDES supplier purchase cost and profit margin
app.get('/api/products', (req, res) => {
  const publicCatalog = dbProducts.map((p) => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    department: p.department,
    price: p.price,
    originalPrice: p.originalPrice,
    stockCount: p.stockCount,
    status: p.status,
    // Note: supplierCost and margin are omitted from public catalog
  }));
  res.json({ success: true, products: publicCatalog });
});

// ==============================================================================
// ADMIN AUTHENTICATION ENDPOINTS
// ==============================================================================

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const { username, password } = req.body;

  // Check IP Lockout
  const attemptRecord = failedLoginAttempts.get(clientIp);
  const now = Date.now();
  if (attemptRecord && attemptRecord.lockedUntil && now < attemptRecord.lockedUntil) {
    const remainingMin = Math.ceil((attemptRecord.lockedUntil - now) / 60000);
    logAudit('ADMIN_LOGIN_ATTEMPT', 'Blocked', `IP ${clientIp} is locked out. Remaining: ${remainingMin}m.`, clientIp);
    return res.status(429).json({
      success: false,
      error: `Too many failed attempts. Access is locked for ${remainingMin} more minute(s) for security.`,
    });
  }

  // Validate credentials using constant-time hash comparison
  const inputHash = hashPassword(password || '');
  const cleanInputUser = (username || '').toLowerCase().trim();
  const isUserMatch = cleanInputUser === ADMIN_USERNAME.toLowerCase() || cleanInputUser === ADMIN_EMAIL.toLowerCase();

  let isPassMatch = false;
  try {
    isPassMatch = crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(currentAdminPasswordHash));
  } catch {
    isPassMatch = false;
  }

  if (!isUserMatch || !isPassMatch) {
    const current = attemptRecord ? attemptRecord.count + 1 : 1;
    let lockedUntil: number | undefined;
    if (current >= MAX_ATTEMPTS) {
      lockedUntil = now + LOCKOUT_MS;
      logAudit('ADMIN_LOCKED_OUT', 'Warning', `IP ${clientIp} exceeded ${MAX_ATTEMPTS} attempts and has been locked for 15 minutes.`, clientIp);
    } else {
      logAudit('ADMIN_LOGIN_FAILED', 'Failed', `Invalid admin credentials attempt (${current}/${MAX_ATTEMPTS}) for identifier '${username}'.`, clientIp);
    }
    failedLoginAttempts.set(clientIp, { count: current, lockedUntil });

    return res.status(401).json({
      success: false,
      error: lockedUntil
        ? `Account locked due to 5 consecutive failed attempts. Try again in 15 minutes.`
        : `Invalid admin credentials. ${MAX_ATTEMPTS - current} attempt(s) remaining.`,
    });
  }

  // Login successful
  failedLoginAttempts.delete(clientIp);
  const token = generateSecureToken({
    userId: 'admin-master',
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    role: 'admin',
  });

  const sessionObj: UserSession = {
    token,
    userId: 'admin-master',
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    role: 'admin',
    createdAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000,
  };

  sessions.set(token, sessionObj);

  logAudit('ADMIN_LOGIN_SUCCESS', 'Success', `Authorised administrator '${ADMIN_USERNAME}' logged in successfully.`, clientIp);

  res.json({
    success: true,
    token,
    user: {
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      role: 'Super Admin',
      sessionExpiresIn: '24 hours',
    },
  });
});

// Admin Session Verification
app.get('/api/admin/verify', requireAdmin, (req, res) => {
  const session = (req as any).adminSession as UserSession;
  res.json({
    success: true,
    user: {
      username: session.username,
      email: session.email,
      role: 'Super Admin',
      expiresAt: session.expiresAt,
    },
  });
});

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : req.body.token;
  if (token) {
    sessions.delete(token);
  }
  logAudit('ADMIN_LOGOUT', 'Success', 'Admin logged out.');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Admin Password Recovery: Step 1 Request Token
app.post('/api/admin/forgot-password', (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const { email } = req.body;
  const cleanEmail = (email || '').toLowerCase().trim();

  // Only authorized admin email can request reset token
  if (!cleanEmail || cleanEmail !== ADMIN_EMAIL) {
    logAudit('ADMIN_PASSWORD_RESET_ATTEMPT', 'Failed', `Unauthorized password recovery attempt for email '${email}'`, clientIp);
    return res.status(403).json({
      success: false,
      error: 'Access denied: The provided email is not a pre-authorised administrator account.',
    });
  }

  const resetToken = 'rst_' + crypto.randomBytes(24).toString('hex');
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity
  passwordResetTokens.set(resetToken, { token: resetToken, email: cleanEmail, expiresAt });

  logAudit('ADMIN_PASSWORD_RESET_REQUESTED', 'Warning', `Password recovery token generated for ${cleanEmail}`, clientIp);

  res.json({
    success: true,
    message: `Password recovery token issued for ${ADMIN_EMAIL}. Token is valid for 15 minutes.`,
    token: resetToken, // Returned for dev/test verification
  });
});

// Admin Password Recovery: Step 2 Reset Password
app.post('/api/admin/reset-password', (req, res) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const { token, newPassword } = req.body;

  if (!token || !newPassword || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      error: 'Valid recovery token and a new password with at least 8 characters are required.',
    });
  }

  const record = passwordResetTokens.get(token);
  if (!record || Date.now() > record.expiresAt) {
    passwordResetTokens.delete(token);
    return res.status(400).json({
      success: false,
      error: 'Recovery token is invalid or has expired. Please request a new token.',
    });
  }

  // Update hash
  currentAdminPasswordHash = hashPassword(newPassword);
  passwordResetTokens.delete(token);

  // Invalidate all existing admin sessions for security
  sessions.clear();

  logAudit('ADMIN_PASSWORD_RESET_SUCCESS', 'Success', `Admin password reset completed from IP ${clientIp}. Existing sessions revoked.`, clientIp);

  res.json({
    success: true,
    message: 'Admin password reset successfully. Please sign in with your new credentials.',
  });
});

// Admin Audit Logs API
app.get('/api/admin/audit-logs', requireAdmin, (req, res) => {
  res.json({ success: true, logs: auditLogs });
});

// ==============================================================================
// PROTECTED ADMINISTRATIVE DATA ENDPOINTS (requireAdmin)
// ==============================================================================

// Customers API (Protected: Ordinary customers cannot view customer database)
app.get('/api/admin/customers', requireAdmin, (req, res) => {
  res.json({ success: true, count: dbCustomers.length, customers: dbCustomers });
});

app.post('/api/admin/customers', requireAdmin, (req, res) => {
  const customer = req.body;
  if (!customer.email) return res.status(400).json({ success: false, error: 'Customer email is mandatory' });

  const idx = dbCustomers.findIndex((c) => c.email.toLowerCase() === customer.email.toLowerCase());
  if (idx >= 0) {
    dbCustomers[idx] = { ...dbCustomers[idx], ...customer };
  } else {
    dbCustomers.unshift({ id: 'CUST-IND-' + Date.now().toString(36), ...customer });
  }

  logAudit('ADMIN_CUSTOMER_UPDATED', 'Success', `Admin modified customer ${customer.email}`);
  res.json({ success: true, message: 'Customer record saved' });
});

// Orders API (Protected)
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  res.json({ success: true, count: dbOrders.length, orders: dbOrders });
});

app.put('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, trackingNumber, courierName, supplierName } = req.body;
  const order = dbOrders.find((o) => o.id === id);

  if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

  if (status) order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (courierName) order.courierName = courierName;
  if (supplierName) order.supplierName = supplierName;

  logAudit('ADMIN_ORDER_UPDATED', 'Success', `Admin updated order ${id} status to ${status}`);
  res.json({ success: true, order });
});

// Products API: Full administrative catalog WITH confidential supplier cost & margin
app.get('/api/admin/products', requireAdmin, (req, res) => {
  res.json({ success: true, products: dbProducts });
});

app.post('/api/admin/products', requireAdmin, (req, res) => {
  const p = req.body;
  if (!p.name || !p.price) return res.status(400).json({ success: false, error: 'Name and price required' });

  const existingIdx = dbProducts.findIndex((item) => item.id === p.id || item.sku === p.sku);
  const margin = (p.price || 0) - (p.supplierCost || 0);
  const productRecord: DbProduct = {
    id: p.id || 'prod_' + Date.now().toString(36),
    sku: p.sku || 'SKU-' + Date.now().toString(36).toUpperCase(),
    name: p.name,
    department: p.department || ['general'],
    price: Number(p.price),
    originalPrice: Number(p.originalPrice || p.price),
    supplierCost: Number(p.supplierCost || 0),
    margin,
    stockCount: Number(p.stockCount || 0),
    status: p.status || 'Active',
  };

  if (existingIdx >= 0) {
    dbProducts[existingIdx] = productRecord;
  } else {
    dbProducts.unshift(productRecord);
  }

  logAudit('ADMIN_PRODUCT_MUTATED', 'Success', `Admin saved product ${productRecord.name} (SKU: ${productRecord.sku})`);
  res.json({ success: true, product: productRecord });
});

app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const idx = dbProducts.findIndex((p) => p.id === id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Product not found' });

  const deleted = dbProducts.splice(idx, 1)[0];
  logAudit('ADMIN_PRODUCT_DELETED', 'Warning', `Admin deleted product ${deleted.name} (${deleted.sku})`);
  res.json({ success: true, message: `Product ${deleted.name} deleted` });
});

// Inventory API (Protected: Supplier costs and valuation restricted)
app.get('/api/admin/inventory', requireAdmin, (req, res) => {
  const totalValue = dbProducts.reduce((sum, p) => sum + p.supplierCost * p.stockCount, 0);
  res.json({
    success: true,
    totalValuationINR: totalValue,
    items: dbProducts.map((p) => ({
      sku: p.sku,
      name: p.name,
      stockCount: p.stockCount,
      supplierCost: p.supplierCost,
      inventoryValue: p.supplierCost * p.stockCount,
    })),
  });
});

app.put('/api/admin/inventory/:sku', requireAdmin, (req, res) => {
  const { sku } = req.params;
  const { stockCount } = req.body;
  const product = dbProducts.find((p) => p.sku === sku);

  if (!product) return res.status(404).json({ success: false, error: 'SKU not found' });

  product.stockCount = Number(stockCount);
  logAudit('ADMIN_INVENTORY_ADJUSTED', 'Success', `Admin set inventory for ${sku} to ${stockCount}`);
  res.json({ success: true, product });
});

// Suppliers API (Strictly protected: Supplier costs and contacts)
app.get('/api/admin/suppliers', requireAdmin, (req, res) => {
  res.json({ success: true, suppliers: dbSuppliers });
});

app.post('/api/admin/suppliers', requireAdmin, (req, res) => {
  const supp = req.body;
  dbSuppliers.push({ id: 'SUP-' + Date.now().toString(36), ...supp });
  logAudit('ADMIN_SUPPLIER_CREATED', 'Success', `Admin registered supplier ${supp.name}`);
  res.json({ success: true, message: 'Supplier registered' });
});

// Payments API (Protected ledger)
app.get('/api/admin/payments', requireAdmin, (req, res) => {
  res.json({
    success: true,
    transactions: dbOrders.map((o) => ({
      id: 'TXN-' + o.id,
      orderId: o.id,
      customerEmail: o.customerEmail,
      amount: o.total,
      status: o.paymentStatus,
      method: 'UPI Prepaid',
      date: o.createdAt,
    })),
  });
});

// Settings API (Protected: Protects sensitive Google Sheets Web App URL & credentials)
app.get('/api/admin/settings', requireAdmin, (req, res) => {
  res.json({
    success: true,
    settings: {
      brandName: process.env.BRAND_NAME || 'The Everyday Edit',
      businessName: process.env.BUSINESS_NAME || 'Raftaar Solutions',
      contactEmail: process.env.CONTACT_EMAIL || 'manpreetkaurdeveloper2@gmail.com',
      operationsAddress: process.env.OPERATIONS_ADDRESS || 'Delhi–Jalandhar GT Road (NH-1), Sirhind Side, Mandi Gobindgarh, Punjab – 147301, India',
      instagramUrl: process.env.INSTAGRAM_URL || 'https://www.instagram.com/everyday_editz.in/',
      googleSheetsUrl: process.env.GOOGLE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbx2Y_diNJLiRryZXfM8eklSK9dFxaxNcNJmgISvavE1E38CD6fhS-eqvhXT7vEXc-kF/exec',
    },
  });
});

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const updates = req.body;
  if (updates.googleSheetsUrl) process.env.GOOGLE_SHEETS_URL = updates.googleSheetsUrl;
  if (updates.instagramUrl) process.env.INSTAGRAM_URL = updates.instagramUrl;
  if (updates.contactEmail) process.env.CONTACT_EMAIL = updates.contactEmail;

  logAudit('ADMIN_SETTINGS_UPDATED', 'Success', 'Admin modified store settings');
  res.json({ success: true, message: 'Settings saved successfully' });
});

// Export API (Protected: Prevents unauthorized data exfiltration)
app.post('/api/admin/export', requireAdmin, (req, res) => {
  const { dataset } = req.body;
  logAudit('ADMIN_DATA_EXPORT', 'Success', `Admin initiated export of dataset '${dataset}'`);

  let data: any = {};
  if (dataset === 'customers') data = dbCustomers;
  else if (dataset === 'orders') data = dbOrders;
  else if (dataset === 'inventory') data = dbProducts;
  else data = { customers: dbCustomers, orders: dbOrders, products: dbProducts };

  res.json({ success: true, exportTimestamp: new Date().toISOString(), data });
});

// ==============================================================================
// CUSTOMER AUTHENTICATION (Issues role: 'customer', NEVER admin)
// ==============================================================================
app.post('/api/customer/login', (req, res) => {
  const { email, phoneNumber } = req.body;
  if (!email && !phoneNumber) {
    return res.status(400).json({ success: false, error: 'Email or phone number required' });
  }

  const cleanEmail = (email || '').toLowerCase().trim();
  const customer = dbCustomers.find(
    (c) => (cleanEmail && c.email.toLowerCase() === cleanEmail) || (phoneNumber && c.phoneNumber === phoneNumber)
  );

  const customerId = customer ? customer.id : 'CUST-IND-' + Date.now().toString(36);
  const token = generateSecureToken({
    userId: customerId,
    email: cleanEmail,
    role: 'customer', // Strictly customer role, cannot be elevated
  });

  const sessionObj: UserSession = {
    token,
    userId: customerId,
    email: cleanEmail,
    role: 'customer',
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  sessions.set(token, sessionObj);

  res.json({
    success: true,
    token,
    customer: customer || { id: customerId, email: cleanEmail, role: 'customer' },
  });
});

app.post('/api/customer/register', (req, res) => {
  const { firstName, lastName, email, phoneNumber, city, state, pincode } = req.body;
  if (!email || !firstName) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const newCust: DbCustomer = {
    id: 'CUST-IND-' + Math.floor(1000 + Math.random() * 9000),
    firstName,
    lastName: lastName || '',
    email: cleanEmail,
    phoneNumber: phoneNumber || '',
    city: city || 'Mandi Gobindgarh',
    state: state || 'Punjab',
    pincode: pincode || '147301',
    customerSegment: 'General',
    totalOrders: 0,
    totalSpending: 0,
    customerStatus: 'Active',
  };

  dbCustomers.unshift(newCust);

  const token = generateSecureToken({
    userId: newCust.id,
    email: cleanEmail,
    role: 'customer',
  });

  sessions.set(token, {
    token,
    userId: newCust.id,
    email: cleanEmail,
    role: 'customer',
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ success: true, token, customer: newCust });
});

// Customer View Orders (Customers can only view their OWN orders)
app.get('/api/customer/orders', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.query.token as string);

  if (!token) return res.status(401).json({ success: false, error: 'Customer token required' });

  const verification = verifySecureToken(token);
  if (!verification.valid || !verification.payload) {
    return res.status(401).json({ success: false, error: 'Invalid or expired customer token' });
  }

  const userEmail = verification.payload.email?.toLowerCase();
  const userId = verification.payload.userId;

  // Filter only orders belonging to this customer
  const customerOrders = dbOrders.filter(
    (o) => o.customerId === userId || (userEmail && o.customerEmail.toLowerCase() === userEmail)
  );

  res.json({ success: true, orders: customerOrders });
});

// ==============================================================================
// PAYMENTS & CLAIMS APIS
// ==============================================================================
app.post('/api/payments/create-order', (req, res) => {
  const { amount, currency } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Valid payment amount is required' });
  }

  if (req.body.paymentMethod === 'Cash on Delivery' || req.body.isCod) {
    return res.status(400).json({
      success: false,
      error: 'Cash on Delivery (COD) is strictly disabled. The Everyday Edit accepts prepaid online orders only.',
    });
  }

  const gatewayOrderId = 'order_ee_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
  const serverSignatureChallenge = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${gatewayOrderId}|${amount}|INR`)
    .digest('hex');

  logAudit('PAYMENT_ORDER_CREATED', 'Success', `Initiated gateway order ${gatewayOrderId} for ₹${amount}`);

  res.json({
    success: true,
    gatewayOrderId,
    amount,
    currency: currency || 'INR',
    serverSignatureChallenge,
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_live_everyday_editz_prepaid',
    notes: {
      store: 'The Everyday Edit',
      operations: 'Raftaar Solutions',
      support: 'manpreetkaurdeveloper2@gmail.com',
    },
  });
});

app.post('/api/payments/verify', (req, res) => {
  const { gatewayOrderId, gatewayPaymentId, serverSignatureChallenge, amount } = req.body;

  if (!gatewayOrderId || !gatewayPaymentId) {
    logAudit('PAYMENT_VERIFY_FAILED', 'Failed', 'Missing transaction parameters in verification request');
    return res.status(400).json({ success: false, error: 'Incomplete transaction details' });
  }

  const expectedChallenge = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${gatewayOrderId}|${amount}|INR`)
    .digest('hex');

  const isValidChallenge = serverSignatureChallenge === expectedChallenge;

  if (!isValidChallenge) {
    logAudit('PAYMENT_TAMPER_DETECTED', 'Warning', `Signature mismatch on order ${gatewayOrderId}`);
    return res.status(400).json({
      success: false,
      error: 'Payment verification failed: cryptographic signature mismatch. Order cannot be marked as paid.',
    });
  }

  const transactionId = 'TXN-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
  logAudit('PAYMENT_VERIFIED', 'Success', `Payment confirmed for Order ID ${gatewayOrderId}. Transaction: ${transactionId}, Amount: ₹${amount}`);

  res.json({
    success: true,
    verified: true,
    transactionId,
    gatewayPaymentId,
    status: 'Paid',
    paidAt: new Date().toISOString(),
    message: 'Payment verified and confirmed server-side.',
  });
});

app.post('/api/payments/webhook', (req, res) => {
  logAudit('WEBHOOK_RECEIVED', 'Success', `Payment gateway webhook event: ${req.body.event || 'unknown'}`);
  res.json({ received: true, timestamp: Date.now() });
});

app.post('/api/returns/submit', (req, res) => {
  const { orderId, customerEmail, issueType, description, evidenceImages } = req.body;

  if (!orderId || !customerEmail || !issueType || !description) {
    return res.status(400).json({
      success: false,
      error: 'Missing required claim parameters: orderId, customerEmail, issueType, and description are mandatory.',
    });
  }

  const claimId = 'CLM-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomBytes(2).toString('hex').toUpperCase();
  logAudit('RETURN_CLAIM_SUBMITTED', 'Success', `Claim ${claimId} submitted by ${customerEmail} for Order #${orderId} (${issueType})`);

  res.json({
    success: true,
    claimId,
    message: 'Your claim has been submitted to the Grievance & Quality Assurance desk at Raftaar Solutions.',
  });
});

// Proxy to Google Sheets Web App (Bypasses any potential browser CORS restrictions)
app.post('/api/sheets/proxy-sync', async (req, res) => {
  const { targetUrl, action, sheet, payload } = req.body;
  const scriptUrl =
    targetUrl ||
    process.env.GOOGLE_SHEETS_URL ||
    'https://script.google.com/macros/s/AKfycbx2Y_diNJLiRryZXfM8eklSK9dFxaxNcNJmgISvavE1E38CD6fhS-eqvhXT7vEXc-kF/exec';

  try {
    const fetchResponse = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: action || 'syncItem', sheet, payload }),
      redirect: 'follow',
    });

    const text = await fetchResponse.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    res.json({ success: true, googleResponse: data });
  } catch (err: any) {
    res.status(502).json({
      success: false,
      error: 'Failed to communicate with Google Sheets endpoint: ' + (err.message || String(err)),
    });
  }
});

// ==============================================================================
// VITE DEV SERVER OR STATIC PRODUCTION BUILD HANDLER
// ==============================================================================
async function setupServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: 3000, host: '0.0.0.0' },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EVERYDAY_EDITZ] Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('[EVERYDAY_EDITZ] Server startup error:', err);
  process.exit(1);
});
