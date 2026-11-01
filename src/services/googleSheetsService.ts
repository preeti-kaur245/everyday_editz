/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Google Sheets & Apps Script Automation Service for The Everyday Edit
 * Connects everyday_editz.in with "The Everyday Edit – Business Management" Google Spreadsheet.
 * Automatically provisions and syncs all 9 worksheets:
 * 1. Customers
 * 2. Orders
 * 3. Products
 * 4. Inventory
 * 5. Suppliers
 * 6. Payments
 * 7. Returns & Refunds
 * 8. Enquiries
 * 9. Activity Logs
 */

export const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Returns formatted Indian Standard Time string
 */
export function formatToIST(dateInput: Date | string | number = new Date()): string {
  try {
    const d = new Date(dateInput);
    return d.toLocaleString('en-IN', {
      timeZone: IST_TIMEZONE,
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Complete, production-ready Google Apps Script backend code for all 9 worksheets.
 * Administrators copy and deploy this script in their Google Spreadsheet.
 */
export const APPS_SCRIPT_SOURCE_CODE = `/**
 * ==============================================================================
 * THE EVERYDAY EDIT — BUSINESS MANAGEMENT AUTOMATION ENGINE
 * Google Apps Script Web App Backend
 * Target Spreadsheet: "The Everyday Edit – Business Management"
 * ==============================================================================
 * Automatically provisions 9 worksheets with branded headers, freezes top rows,
 * and handles live webhooks from everyday_editz.in with zero manual copying.
 */

const CONFIG = {
  TIMEZONE: 'Asia/Kolkata',
  SPREADSHEET_TITLE: 'The Everyday Edit – Business Management',
  TABS: {
    CUSTOMERS: 'Customers',
    ORDERS: 'Orders',
    PRODUCTS: 'Products',
    INVENTORY: 'Inventory',
    SUPPLIERS: 'Suppliers',
    PAYMENTS: 'Payments',
    RETURNS_REFUNDS: 'Returns & Refunds',
    ENQUIRIES: 'Enquiries',
    ACTIVITY_LOGS: 'Activity Logs'
  }
};

const SCHEMAS = {
  [CONFIG.TABS.CUSTOMERS]: [
    'Customer ID', 'Full Name', 'First Name', 'Last Name', 'Email', 'Phone Number',
    'WhatsApp Number', 'City', 'State', 'PIN Code', 'Customer Segment',
    'Registration Date (IST)', 'Customer Source', 'Marketing Consent',
    'Total Orders', 'Total Spending (₹)', 'Customer Status', 'Last Activity (IST)'
  ],
  [CONFIG.TABS.ORDERS]: [
    'Order ID', 'Customer ID', 'Customer Name', 'Phone', 'Email',
    'Product Name', 'Product SKU', 'Department', 'Quantity',
    'Selling Price (₹)', 'Discount (₹)', 'Shipping Charge (₹)', 'Total Amount (₹)',
    'Payment Method (Prepaid Only)', 'Payment Status', 'Order Date (IST)',
    'Shipping Address', 'PIN Code', 'Supplier Name', 'Supplier Order Ref',
    'Courier Name', 'Tracking ID', 'Fulfilment Status', 'Delivery Status', 'Return Status'
  ],
  [CONFIG.TABS.PRODUCTS]: [
    'Product ID', 'SKU', 'Product Name', 'Department', 'Subcategory',
    'Selling Price (₹)', 'MRP (₹)', 'Discount (%)', 'Supplier Cost (₹)', 'Margin (₹)',
    'GST Rate (%)', 'HSN Code', 'Status', 'Rating', 'Review Count', 'Stock Available', 'Last Updated (IST)'
  ],
  [CONFIG.TABS.INVENTORY]: [
    'SKU', 'Product Name', 'Department', 'Available Quantity', 'Reserved Quantity',
    'Total Physical Stock', 'Reorder Level', 'Stock Health Status', 'Supplier Cost (₹)',
    'Total Inventory Value (₹)', 'Supplier Name', 'Last Stock Audit (IST)', 'Last Supplier Verification'
  ],
  [CONFIG.TABS.SUPPLIERS]: [
    'Supplier ID', 'Supplier Name', 'Contact Person', 'Email', 'Phone',
    'City', 'State', 'Product Categories', 'Average Lead Time (Days)', 'Active SKUs', 'Last Stock Verification'
  ],
  [CONFIG.TABS.PAYMENTS]: [
    'Transaction ID', 'Order ID', 'Customer Email', 'Customer Phone',
    'Amount (₹)', 'Currency', 'Payment Method', 'Gateway', 'Gateway Order ID',
    'Gateway Payment ID', 'Verification Status', 'Timestamp (IST)'
  ],
  [CONFIG.TABS.RETURNS_REFUNDS]: [
    'Claim ID', 'Order ID', 'Customer ID', 'Customer Name', 'Email', 'Phone',
    'Product ID', 'Product Name', 'Issue Type', 'Customer Description',
    'Evidence Images Attached', 'Claim Status', 'Admin Notes', 'Resolution Date (IST)', 'Submission Date (IST)'
  ],
  [CONFIG.TABS.ENQUIRIES]: [
    'Enquiry ID', 'Customer Name', 'Phone', 'Email', 'Product Name',
    'Product ID', 'Product Category', 'Customer Message', 'Source Platform', 'Enquiry Status', 'Received Date (IST)'
  ],
  [CONFIG.TABS.ACTIVITY_LOGS]: [
    'Log ID', 'Timestamp (IST)', 'Event Category', 'Action / Description',
    'User / Actor', 'Status', 'IP / Device Info', 'Payload Details'
  ]
};

function doGet(e) {
  setupSpreadsheetTabs();
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    connected: true,
    message: 'The Everyday Edit Business Management Google Sheets API is live and operational.',
    spreadsheetTitle: SpreadsheetApp.getActiveSpreadsheet().getName(),
    tabsCount: Object.keys(CONFIG.TABS).length,
    timestamp: Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'dd MMM yyyy, hh:mm:ss a') + ' IST'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    setupSpreadsheetTabs();
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ status: 'error', message: 'No payload received' });
    }
    
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var payload = data.payload || {};
    
    switch (action) {
      case 'ping':
        return createJsonResponse({ status: 'success', message: 'The Everyday Edit Google Sheets webhook verified successfully!' });
      case 'sync_customer':
        return createJsonResponse(recordCustomer(payload));
      case 'sync_order':
        return createJsonResponse(recordOrder(payload));
      case 'sync_product':
        return createJsonResponse(recordProduct(payload));
      case 'sync_inventory':
        return createJsonResponse(recordInventory(payload));
      case 'sync_supplier':
        return createJsonResponse(recordSupplier(payload));
      case 'sync_payment':
        return createJsonResponse(recordPayment(payload));
      case 'sync_return_refund':
        return createJsonResponse(recordReturnRefund(payload));
      case 'sync_enquiry':
        return createJsonResponse(recordEnquiry(payload));
      case 'sync_activity':
        return createJsonResponse(recordActivity(payload));
      default:
        return createJsonResponse({ status: 'error', message: 'Unknown action: ' + action });
    }
  } catch (err) {
    return createJsonResponse({ status: 'error', message: err.toString() });
  }
}

function recordCustomer(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.TABS.CUSTOMERS);
  var values = sheet.getDataRange().getValues();
  var email = (data.email || '').toString().toLowerCase().trim();
  var phone = (data.phoneNumber || '').toString().trim();
  var rowIdx = -1;

  for (var i = 1; i < values.length; i++) {
    var rowEmail = (values[i][4] || '').toString().toLowerCase().trim();
    var rowPhone = (values[i][5] || '').toString().trim();
    var rowId = (values[i][0] || '').toString();
    if ((email && rowEmail === email) || (phone && rowPhone === phone) || (data.id && rowId === data.id)) {
      rowIdx = i + 1;
      break;
    }
  }

  var row = [
    data.id || ('CUST-IND-' + Math.floor(1000 + Math.random() * 9000)),
    (data.firstName || '') + ' ' + (data.lastName || ''),
    data.firstName || '',
    data.lastName || '',
    data.email || '',
    data.phoneNumber || '',
    data.whatsappNumber || data.phoneNumber || '',
    data.city || '',
    data.state || '',
    data.pincode || '',
    data.customerSegment || 'Women',
    data.registrationDate || formatTimestamp(),
    data.registrationSource || 'Website Registration',
    data.marketingConsent ? 'Yes' : 'No',
    data.totalOrders || 0,
    data.totalSpending || 0,
    data.customerStatus || 'Active',
    formatTimestamp()
  ];

  if (rowIdx > 0) {
    sheet.getRange(rowIdx, 1, 1, row.length).setValues([row]);
    return { status: 'updated', customerId: row[0] };
  } else {
    sheet.appendRow(row);
    return { status: 'created', customerId: row[0] };
  }
}

function recordOrder(order) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.TABS.ORDERS);
  var addr = order.shippingAddress ? (order.shippingAddress.flatHouseNo + ', ' + order.shippingAddress.streetArea + ', ' + order.shippingAddress.city + ', ' + order.shippingAddress.state) : '';
  var pin = order.shippingAddress ? order.shippingAddress.pincode : '';
  var custName = order.shippingAddress ? order.shippingAddress.fullName : '';
  var phone = order.shippingAddress ? order.shippingAddress.phoneNumber : '';
  var email = order.shippingAddress ? order.shippingAddress.email : '';

  if (order.items && order.items.length > 0) {
    order.items.forEach(function(item) {
      sheet.appendRow([
        order.id,
        order.customerId || '',
        custName,
        phone,
        email,
        item.product ? item.product.name : 'Curated Item',
        item.product ? (item.product.sku || item.product.id) : '',
        item.product && item.product.departments ? item.product.departments.join(', ') : 'Women',
        item.quantity || 1,
        item.product ? item.product.price : 0,
        order.discount || 0,
        order.shippingCharge || 0,
        order.total || 0,
        order.paymentMethod || 'UPI',
        order.paymentStatus || 'Paid',
        order.createdAt || formatTimestamp(),
        addr,
        pin,
        order.supplierName || 'Raftaar Solutions Fulfillment Hub',
        order.supplierOrderRef || '',
        order.courierName || 'Delhivery Express',
        order.trackingNumber || '',
        order.fulfilmentStatus || 'Processing',
        order.deliveryStatus || 'Ordered',
        order.returnStatus || 'None'
      ]);
    });
  }
  return { status: 'success', orderId: order.id };
}

function recordPayment(p) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.TABS.PAYMENTS);
  sheet.appendRow([
    p.id || ('TXN-IND-' + Date.now()),
    p.orderId || '',
    p.customerEmail || '',
    p.customerPhone || '',
    p.amount || 0,
    p.currency || 'INR',
    p.method || 'UPI',
    p.gateway || 'Razorpay',
    p.gatewayOrderId || '',
    p.gatewayPaymentId || '',
    p.status || 'Success',
    p.timestamp || formatTimestamp()
  ]);
  return { status: 'success', paymentId: p.id };
}

function recordReturnRefund(r) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.TABS.RETURNS_REFUNDS);
  sheet.appendRow([
    r.id || ('CLM-IND-' + Math.floor(1000 + Math.random() * 9000)),
    r.orderId || '',
    r.customerId || '',
    r.customerName || '',
    r.customerEmail || '',
    r.customerPhone || '',
    r.productId || '',
    r.productName || '',
    r.issueType || '',
    r.description || '',
    r.evidenceImages ? (r.evidenceImages.length + ' Photo(s) Attached') : 'None',
    r.status || 'Submitted',
    r.adminNotes || '',
    r.resolutionDate || '',
    r.createdAt || formatTimestamp()
  ]);
  return { status: 'success', claimId: r.id };
}

function recordProduct(p) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.TABS.PRODUCTS);
  var values = sheet.getDataRange().getValues();
  var rowIdx = -1;
  for (var i = 1; i < values.length; i++) {
    if (values[i][0] === p.id || values[i][1] === p.sku) {
      rowIdx = i + 1;
      break;
    }
  }

  var margin = (p.price || 0) - (p.supplierCost || 0);
  var row = [
    p.id,
    p.sku || p.id,
    p.name,
    p.departments ? p.departments.join(', ') : '',
    p.subcategories ? p.subcategories.join(', ') : '',
    p.price,
    p.originalPrice,
    p.discountPercent || 0,
    p.supplierCost || 0,
    margin,
    p.gstRate || 18,
    p.hsnCode || '3924',
    p.status || 'Active',
    p.rating || 4.9,
    p.reviewCount || 0,
    p.stockCount || 0,
    formatTimestamp()
  ];

  if (rowIdx > 0) {
    sheet.getRange(rowIdx, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
  return { status: 'success', productId: p.id };
}

function recordInventory(inv) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.TABS.INVENTORY);
  var values = sheet.getDataRange().getValues();
  var rowIdx = -1;
  for (var i = 1; i < values.length; i++) {
    if (values[i][0] === inv.sku) {
      rowIdx = i + 1;
      break;
    }
  }

  var available = inv.availableQuantity || 0;
  var reorder = inv.reorderLevel || 10;
  var status = available <= 0 ? 'OUT OF STOCK' : (available <= reorder ? 'LOW STOCK ALERT' : 'HEALTHY');
  var totalValue = available * (inv.supplierCost || 0);

  var row = [
    inv.sku,
    inv.productName,
    inv.departments ? inv.departments.join(', ') : '',
    available,
    inv.reservedQuantity || 0,
    (available + (inv.reservedQuantity || 0)),
    reorder,
    status,
    inv.supplierCost || 0,
    totalValue,
    inv.supplierName || 'BLR Hub',
    formatTimestamp(),
    inv.lastSupplierVerification || 'Today'
  ];

  if (rowIdx > 0) {
    sheet.getRange(rowIdx, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
  return { status: 'success', sku: inv.sku };
}

function recordSupplier(s) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.TABS.SUPPLIERS);
  var row = [
    s.id,
    s.name,
    s.contactPerson,
    s.email,
    s.phone,
    s.city,
    s.state,
    s.categories ? s.categories.join(', ') : '',
    s.leadTimeDays || 2,
    s.activeSKUs || 0,
    s.lastStockVerification || formatTimestamp()
  ];
  sheet.appendRow(row);
  return { status: 'success', supplierId: s.id };
}

function recordEnquiry(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.TABS.ENQUIRIES);
  sheet.appendRow([
    e.id || ('ENQ-IND-' + Math.floor(1000 + Math.random() * 9000)),
    e.customerName || '',
    e.phone || '',
    e.email || '',
    e.productName || '',
    e.productId || '',
    e.productCategory || '',
    e.customerMessage || '',
    e.sourcePlatform || 'Website Modal',
    e.enquiryStatus || 'New',
    e.enquiryDate || formatTimestamp()
  ]);
  return { status: 'success', enquiryId: e.id };
}

function recordActivity(a) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.TABS.ACTIVITY_LOGS);
  sheet.appendRow([
    a.id || ('ACT-' + Date.now()),
    a.timestamp || formatTimestamp(),
    a.eventCategory || 'User Action',
    a.action || a.activityType || 'page_view',
    a.user || a.customerName || 'Visitor',
    a.status || 'Success',
    a.deviceType || 'Web',
    JSON.stringify(a.payload || {})
  ]);
  return { status: 'success' };
}

function setupSpreadsheetTabs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SCHEMAS).forEach(function(tabName) {
    var sheet = ss.getSheetByName(tabName);
    if (!sheet) {
      sheet = ss.insertSheet(tabName);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(SCHEMAS[tabName]);
      var headerRange = sheet.getRange(1, 1, 1, SCHEMAS[tabName].length);
      headerRange.setBackground('#242424');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  });
}

function formatTimestamp() {
  return Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'dd MMM yyyy, hh:mm:ss a') + ' IST';
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
`;

/**
 * Dispatches an automated sync payload to the Google Apps Script Web App.
 */
export async function sendToGoogleSheets(
  appsScriptUrl: string,
  action: string,
  payload: Record<string, any>
): Promise<{ success: boolean; message: string; data?: any }> {
  if (!appsScriptUrl || !appsScriptUrl.trim().startsWith('http')) {
    return {
      success: false,
      message: 'Google Apps Script Web App URL is not configured.',
    };
  }

  try {
    const response = await fetch(appsScriptUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (response.ok) {
      const resText = await response.text();
      if (resText.includes('Script function not found')) {
        return {
          success: false,
          message: 'Web App URL is active, but Code.gs is not yet pasted in your Apps Script editor. Open Extensions > Apps Script, paste Code.gs, save, and deploy a New Version.',
        };
      }
      try {
        const parsed = JSON.parse(resText);
        return { success: true, message: 'Synchronized with Google Sheets successfully', data: parsed };
      } catch {
        return { success: true, message: 'Google Sheets acknowledged the request', data: resText };
      }
    } else {
      return {
        success: false,
        message: `HTTP ${response.status}: Failed to reach Google Apps Script`,
      };
    }
  } catch (err: any) {
    // Attempt fallback via backend proxy if available
    try {
      const proxyRes = await fetch('/api/sheets/proxy-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: appsScriptUrl.trim(), action, payload }),
      });
      if (proxyRes.ok) {
        const proxyData = await proxyRes.json();
        if (proxyData.success) {
          return { success: true, message: 'Synchronized with Google Sheets via secure server proxy', data: proxyData.googleResponse };
        }
      }
    } catch {}

    return {
      success: false,
      message: err?.message || 'Network error connecting to Google Apps Script Web App',
    };
  }
}

/**
 * Ping test to verify Google Sheets Web App connection and sheet provisioning.
 */
export async function testGoogleSheetsConnection(appsScriptUrl: string): Promise<{
  connected: boolean;
  message: string;
  data?: any;
}> {
  if (!appsScriptUrl || !appsScriptUrl.trim().startsWith('http')) {
    return {
      connected: false,
      message: 'Please provide a valid Google Apps Script Web App URL (starts with https://script.google.com/macros/s/...)',
    };
  }

  try {
    const url = new URL(appsScriptUrl.trim());
    url.searchParams.set('action', 'ping');

    const res = await fetch(url.toString(), {
      method: 'GET',
    });

    if (res.ok) {
      const text = await res.text();
      if (text.includes('Script function not found')) {
        return {
          connected: false,
          message: 'Web App URL reached! Next step: In your Google Spreadsheet, click Extensions > Apps Script, paste the provided Code.gs code, click Save, then Deploy > Manage deployments > Edit > New version.',
        };
      }
      try {
        const json = JSON.parse(text);
        if (json.status === 'success' || json.connected) {
          return {
            connected: true,
            message: json.message || 'Connected successfully! All 9 worksheets are ready in "The Everyday Edit – Business Management".',
            data: json,
          };
        }
      } catch {
        return {
          connected: true,
          message: 'Received response from Google Apps Script Web App.',
        };
      }
    }

    return {
      connected: false,
      message: `Response status: ${res.status}. Ensure Web App is deployed with 'Who has access: Anyone'.`,
    };
  } catch (err: any) {
    try {
      const proxyRes = await fetch('/api/sheets/proxy-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: appsScriptUrl.trim(), action: 'ping' }),
      });
      if (proxyRes.ok) {
        const proxyData = await proxyRes.json();
        return {
          connected: true,
          message: 'Connected to Google Sheets through secure server proxy.',
          data: proxyData.googleResponse,
        };
      }
    } catch {}

    return {
      connected: false,
      message: `Connection failed: ${err.message || 'Check URL and Apps Script deployment settings.'}`,
    };
  }
}

/**
 * Helper to download CSV in browser
 */
export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const escapeCell = (cell: string | number) => {
    const str = String(cell ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
