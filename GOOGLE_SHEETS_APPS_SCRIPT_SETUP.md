# The Everyday Edit — Automated Google Sheets CRM & Order Management System

This document outlines the complete setup, architecture, and deployment instructions for connecting **The Everyday Edit** (`everyday_editz.in`) directly with your Google Sheets database using Google Apps Script.

---

## 1. Overview of Automated Data Capture

The integration automatically synchronizes the following 7 spreadsheet tabs in real time:

| Sheet Tab | Trigger Event | Key Fields Recorded |
| :--- | :--- | :--- |
| **1. Customers** | Registration, Account creation, Checkout submission | Customer ID, Name, Email, Phone, WhatsApp, City, State, PIN, Segment, Marketing Consent, Total Orders, Total Spend, Status, Last Activity |
| **2. Orders** | Checkout completion, COD verification | Order ID, Customer ID, Contact, Items, Price, Discount, Shipping, Total, Payment Method, Payment Status, Delhivery Tracking ID, Supplier Name, Supplier Ref, Fulfilment Status, Delivery Status |
| **3. Product Enquiries** | Customer submits "Ask a Question / Enquiry" on product | Enquiry ID, Name, Phone, Email, Product Name, Product ID, Category, Message, Date (IST), Platform, Status |
| **4. Abandoned Carts** | Shopper enters details at checkout or closes cart | Cart ID, Customer Name, Email, Phone, Products Summary, Cart Value (₹), Timestamp, Recovery Status |
| **5. Product Waitlist** | Shopper joins waitlist for out-of-stock / next batch items | Entry ID, Name, Email, Phone, Interested Product, Expected Budget, Notification Consent, Date, Status |
| **6. Customer Feedback** | Verified reviews submitted by buyers | Feedback ID, Customer ID, Name, Order ID, Product, Rating (1–5 Stars), Feedback Message, Date |
| **7. Website Activity** | Consented browsing actions (page views, search) | Activity ID, Session ID, Action Type, Page Visited, Product ID, Timestamp, Device Type |

---

## 2. Setup in 5 Steps

### Step 1: Create a New Google Spreadsheet
1. Go to [sheets.new](https://sheets.new) in your Google account.
2. Name your spreadsheet: **The Everyday Edit — CRM & Orders**.

### Step 2: Open Google Apps Script Editor
1. In the Google Sheets menu, click **Extensions > Apps Script**.
2. Rename the project to: **EverydayEditz_CRM_Backend**.

### Step 3: Paste the Production Apps Script Code
1. Delete any existing code inside `Code.gs`.
2. Copy and paste the full script provided in Section 3 below.
3. Click the **Save** icon (diskette).

### Step 4: Deploy as a Secure Web App
1. Click the blue **Deploy** button in the top right > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set the configuration:
   - **Description**: `Everyday Editz Live CRM Webhook`
   - **Execute as**: `Me (<your-email>@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial: allows your storefront to submit orders and enquiries securely without asking shoppers for Google logins)*.
4. Click **Deploy**.
5. Grant the standard Google permissions for your script to edit your spreadsheet.
6. Copy the resulting **Web App URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`).

### Step 5: Connect in the Store Admin Dashboard
1. Open the Admin Panel on the website (sliders icon in header).
2. Go to the **Google Sheets Hub** tab.
3. Paste your Web App URL into the input field and click **Save & Verify**.
4. Click **Test Connection**. You will see `Connected: Sheets Live` and all 7 tabs will auto-create in your Google Sheet with styled header rows!
5. Click **Sync All Existing Records** to backfill your existing customers and orders.

---

## 3. Google Apps Script Production Code (`Code.gs`)

```javascript
/**
 * ==============================================================================
 * EVERYDAY_EDITZ — AUTOMATED CUSTOMER & ORDER MANAGEMENT SYSTEM
 * Google Apps Script Web App Backend
 * ==============================================================================
 * Connects everyday_editz.in with Google Sheets automatically.
 * Automatically provisions 7 CRM sheets with headers, formats, and auto-indexing.
 */

const SHEET_NAMES = {
  CUSTOMERS: 'Customers',
  ORDERS: 'Orders',
  ENQUIRIES: 'Product Enquiries',
  ABANDONED_CARTS: 'Abandoned Carts',
  WAITLIST: 'Product Waitlist',
  FEEDBACK: 'Customer Feedback',
  ACTIVITY: 'Website Activity'
};

const SHEET_HEADERS = {
  [SHEET_NAMES.CUSTOMERS]: [
    'Customer ID', 'First Name', 'Last Name', 'Email', 'Phone Number',
    'WhatsApp Number', 'City', 'State', 'PIN Code', 'Customer Segment',
    'Registration Date', 'Registration Source', 'Marketing Consent',
    'Total Orders', 'Total Spending', 'Customer Status', 'Last Activity'
  ],
  [SHEET_NAMES.ORDERS]: [
    'Order ID', 'Customer ID', 'Customer Name', 'Phone', 'Email',
    'Product Name', 'Product SKU', 'Product Category', 'Quantity',
    'Product Price', 'Discount', 'Shipping Charge', 'Total Amount',
    'Payment Method', 'Payment Status', 'Order Date', 'Shipping Address',
    'PIN Code', 'Supplier Name', 'Supplier Order Reference', 'Tracking ID',
    'Fulfilment Status', 'Delivery Status', 'Return Status'
  ],
  [SHEET_NAMES.ENQUIRIES]: [
    'Enquiry ID', 'Customer Name', 'Phone', 'Email', 'Product Name',
    'Product ID', 'Product Category', 'Customer Message', 'Enquiry Date',
    'Source Platform', 'Enquiry Status'
  ],
  [SHEET_NAMES.ABANDONED_CARTS]: [
    'Cart ID', 'Customer ID', 'Customer Name', 'Email', 'Phone',
    'Products', 'Cart Value', 'Cart Created', 'Last Activity', 'Recovery Status'
  ],
  [SHEET_NAMES.WAITLIST]: [
    'Entry ID', 'Customer Name', 'Email', 'Phone', 'Interested Product',
    'Product Category', 'Expected Budget', 'Registration Date', 'Notification Consent', 'Status'
  ],
  [SHEET_NAMES.FEEDBACK]: [
    'Feedback ID', 'Customer ID', 'Customer Name', 'Order ID', 'Product Name',
    'Rating', 'Feedback', 'Submission Date'
  ],
  [SHEET_NAMES.ACTIVITY]: [
    'Activity ID', 'Customer ID', 'Session ID', 'Activity Type', 'Page Visited',
    'Product ID', 'Activity Timestamp', 'Traffic Source', 'Device Type'
  ]
};

// Entry point for Web App POST requests
function doPost(e) {
  try {
    const contents = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : null;
    if (!contents) {
      return createResponse({ status: 'error', message: 'No JSON payload received' }, 400);
    }
    return handleAction(contents.action, contents.payload);
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() }, 500);
  }
}

// Entry point for Web App GET requests (Connection ping / healthcheck)
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'ping';
    if (action === 'ping' || action === 'test_connection') {
      ensureAllSheetsExist();
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheetsList = ss.getSheets().map(s => s.getName());
      return createResponse({
        status: 'success',
        connected: true,
        message: 'Google Sheets connected successfully to EVERYDAY_EDITZ',
        spreadsheetName: ss.getName(),
        spreadsheetId: ss.getId(),
        configuredSheets: sheetsList,
        timestampIST: Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss')
      });
    }
    return createResponse({ status: 'error', message: 'Unknown action' }, 400);
  } catch (err) {
    return createResponse({ status: 'error', message: err.toString() }, 500);
  }
}

function handleAction(action, data) {
  ensureAllSheetsExist();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  switch (action) {
    case 'test_connection':
    case 'ping':
      return createResponse({ status: 'success', connected: true });

    case 'sync_customer':
      return syncCustomer(ss, data);

    case 'sync_order':
      return syncOrder(ss, data);

    case 'sync_enquiry':
      return appendRowToSheet(ss, SHEET_NAMES.ENQUIRIES, [
        data.id, data.customerName, data.phone, data.email, data.productName,
        data.productId, data.productCategory, data.customerMessage,
        data.enquiryDate, data.sourcePlatform || 'Website Modal', data.enquiryStatus || 'New'
      ]);

    case 'sync_abandoned_cart':
      return syncAbandonedCart(ss, data);

    case 'sync_waitlist':
      return appendRowToSheet(ss, SHEET_NAMES.WAITLIST, [
        data.id, data.customerName, data.email, data.phone, data.interestedProduct,
        data.productCategory, data.expectedBudget, data.registrationDate,
        data.notificationConsent ? 'Yes' : 'No', data.status || 'Waiting'
      ]);

    case 'sync_feedback':
      return appendRowToSheet(ss, SHEET_NAMES.FEEDBACK, [
        data.id, data.customerId || '', data.customerName, data.orderId || '',
        data.productName, data.rating, data.feedback, data.submissionDate
      ]);

    case 'sync_activity':
      return appendRowToSheet(ss, SHEET_NAMES.ACTIVITY, [
        data.id, data.customerId || '', data.sessionId, data.activityType,
        data.pageVisited, data.productId || '', data.activityTimestamp,
        data.trafficSource || 'Direct', data.deviceType || 'Web'
      ]);

    case 'update_order_status':
      return updateOrderStatusInSheet(ss, data);

    default:
      return createResponse({ status: 'error', message: 'Unrecognized action: ' + action }, 400);
  }
}

// 1. Sync Customer (Inserts or updates existing to avoid duplicates)
function syncCustomer(ss, customer) {
  const sheet = ss.getSheetByName(SHEET_NAMES.CUSTOMERS);
  const data = sheet.getDataRange().getValues();
  let existingRow = -1;

  for (let i = 1; i < data.length; i++) {
    const id = String(data[i][0]).trim();
    const email = String(data[i][3]).toLowerCase().trim();
    const phone = String(data[i][4]).trim();
    if ((customer.id && id === customer.id) || 
        (customer.email && email === customer.email.toLowerCase().trim()) ||
        (customer.phoneNumber && phone === customer.phoneNumber.trim())) {
      existingRow = i + 1;
      break;
    }
  }

  const rowValues = [
    customer.id, customer.firstName, customer.lastName, customer.email, customer.phoneNumber,
    customer.whatsappNumber || customer.phoneNumber, customer.city, customer.state, customer.pincode,
    customer.customerSegment || 'Household', customer.registrationDate, customer.registrationSource || 'Website Registration',
    customer.marketingConsent ? 'Yes' : 'No', Number(customer.totalOrders) || 0,
    Number(customer.totalSpending) || 0, customer.customerStatus || 'Active', customer.lastActivity
  ];

  if (existingRow > 0) {
    sheet.getRange(existingRow, 1, 1, rowValues.length).setValues([rowValues]);
    return createResponse({ status: 'success', action: 'updated', customerId: customer.id });
  } else {
    sheet.appendRow(rowValues);
    return createResponse({ status: 'success', action: 'created', customerId: customer.id });
  }
}

// 2. Sync Order (Records order & updates customer total spend)
function syncOrder(ss, order) {
  const orderSheet = ss.getSheetByName(SHEET_NAMES.ORDERS);
  const items = order.items || [];
  
  const addr = order.shippingAddress ? 
    (order.shippingAddress.flatHouseNo + ', ' + order.shippingAddress.streetArea + ', ' + order.shippingAddress.city + ', ' + order.shippingAddress.state) : '';
  const pin = order.shippingAddress ? order.shippingAddress.pincode : '';
  const custName = order.shippingAddress ? order.shippingAddress.fullName : '';
  const phone = order.shippingAddress ? order.shippingAddress.phoneNumber : '';
  const email = order.shippingAddress ? order.shippingAddress.email : '';

  if (items.length === 0) {
    orderSheet.appendRow([
      order.id, order.customerId || '', custName, phone, email,
      'Everyday Edit Bundle/Order', 'EE-PKG', 'Lifestyle', 1,
      order.subtotal, order.discount, order.shippingCharge, order.total,
      order.paymentMethod, order.paymentStatus, order.createdAt, addr, pin,
      order.supplierName || 'BLR Hub Supplier', order.supplierOrderRef || 'REF-' + order.id,
      order.trackingNumber || '', order.fulfilmentStatus || 'Processing',
      order.deliveryStatus || 'Ordered', order.returnStatus || 'None'
    ]);
  } else {
    items.forEach(function(item) {
      const prod = item.product || {};
      orderSheet.appendRow([
        order.id, order.customerId || '', custName, phone, email,
        prod.name || 'Everyday Item', prod.id || '', (prod.departments && prod.departments[0]) || 'Lifestyle',
        item.quantity, prod.price || 0, order.discount, order.shippingCharge, order.total,
        order.paymentMethod, order.paymentStatus, order.createdAt, addr, pin,
        order.supplierName || 'BLR Hub Supplier', order.supplierOrderRef || 'REF-' + order.id,
        order.trackingNumber || '', order.fulfilmentStatus || 'Processing',
        order.deliveryStatus || 'Ordered', order.returnStatus || 'None'
      ]);
    });
  }

  // Update customer total spend & orders in Customers sheet if customer exists
  updateCustomerAggregates(ss, email, phone, order.total);

  return createResponse({ status: 'success', orderId: order.id });
}

function updateCustomerAggregates(ss, email, phone, orderAmount) {
  const custSheet = ss.getSheetByName(SHEET_NAMES.CUSTOMERS);
  if (!custSheet) return;
  const data = custSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const rowEmail = String(data[i][3]).toLowerCase().trim();
    const rowPhone = String(data[i][4]).trim();
    if ((email && rowEmail === email.toLowerCase().trim()) || (phone && rowPhone === phone.trim())) {
      const currentOrders = Number(data[i][13]) || 0;
      const currentSpend = Number(data[i][14]) || 0;
      custSheet.getRange(i + 1, 14).setValue(currentOrders + 1);
      custSheet.getRange(i + 1, 15).setValue(currentSpend + Number(orderAmount));
      custSheet.getRange(i + 1, 17).setValue(Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss'));
      break;
    }
  }
}

// 3. Sync Abandoned Cart
function syncAbandonedCart(ss, cart) {
  const sheet = ss.getSheetByName(SHEET_NAMES.ABANDONED_CARTS);
  const data = sheet.getDataRange().getValues();
  let existingRow = -1;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === cart.id) {
      existingRow = i + 1;
      break;
    }
  }

  const rowValues = [
    cart.id, cart.customerId || '', cart.customerName, cart.email, cart.phone,
    cart.products, cart.cartValue, cart.cartCreated, cart.lastActivity, cart.recoveryStatus || 'Pending'
  ];

  if (existingRow > 0) {
    sheet.getRange(existingRow, 1, 1, rowValues.length).setValues([rowValues]);
    return createResponse({ status: 'success', action: 'updated', cartId: cart.id });
  } else {
    sheet.appendRow(rowValues);
    return createResponse({ status: 'success', action: 'created', cartId: cart.id });
  }
}

// 4. Update order status & tracking
function updateOrderStatusInSheet(ss, data) {
  const sheet = ss.getSheetByName(SHEET_NAMES.ORDERS);
  const rows = sheet.getDataRange().getValues();
  let updated = false;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === data.orderId) {
      if (data.status) sheet.getRange(i + 1, 23).setValue(data.status);
      if (data.trackingNumber) sheet.getRange(i + 1, 21).setValue(data.trackingNumber);
      if (data.supplierName) sheet.getRange(i + 1, 19).setValue(data.supplierName);
      if (data.supplierOrderRef) sheet.getRange(i + 1, 20).setValue(data.supplierOrderRef);
      if (data.fulfilmentStatus) sheet.getRange(i + 1, 22).setValue(data.fulfilmentStatus);
      updated = true;
    }
  }
  return createResponse({ status: 'success', updated: updated, orderId: data.orderId });
}

function appendRowToSheet(ss, sheetName, rowValues) {
  const sheet = ss.getSheetByName(sheetName);
  sheet.appendRow(rowValues);
  return createResponse({ status: 'success', sheet: sheetName });
}

// Automatically create missing sheets and set styled headers
function ensureAllSheetsExist() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  for (const sheetName in SHEET_HEADERS) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      const headers = SHEET_HEADERS[sheetName];
      sheet.appendRow(headers);
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#242424');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      headerRange.setFontFamily('Arial');
      sheet.setFrozenRows(1);
    }
  }
}

function createResponse(data, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```
