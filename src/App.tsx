/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ShopByDepartmentSection } from './components/ShopByDepartmentSection';
import { DailyEdit } from './components/DailyEdit';
import { DepartmentCollectionRow } from './components/DepartmentCollectionRow';
import { TrendingSection } from './components/TrendingSection';
import { PricePicksSection } from './components/PricePicksSection';
import { SmartCombos } from './components/SmartCombos';
import { NewArrivalsSection } from './components/NewArrivalsSection';
import { WishlistSection } from './components/WishlistSection';
import { WhyEverydayEditz } from './components/WhyEverydayEditz';
import { DepartmentLandingPage } from './components/DepartmentLandingPage';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SeeItInActionReels } from './components/SeeItInActionReels';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { RewardsModal } from './components/RewardsModal';
import { SearchModal } from './components/SearchModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { ProductEnquiryModal } from './components/ProductEnquiryModal';
import { ProductWaitlistModal } from './components/ProductWaitlistModal';
import { CustomerFeedbackModal } from './components/CustomerFeedbackModal';
import { PolicyModal } from './components/PolicyModal';
import { ReturnClaimModal } from './components/ReturnClaimModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminAccessDeniedPage } from './components/AdminAccessDeniedPage';
import { ToastContainer } from './components/ToastContainer';

const BASE_URL = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

function normalizePath(rawPath: string): string {
  if (BASE_URL && rawPath.startsWith(BASE_URL)) {
    rawPath = rawPath.slice(BASE_URL.length);
  }
  return rawPath || '/';
}

function getInitialPath(): string {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#/')) {
      return hash.slice(1);
    }
    if (hash === '#admin') {
      return '/admin/dashboard';
    }
    return normalizePath(window.location.pathname || '/');
  }
  return '/';
}

function mapRouteToTab(pathname: string): any {
  if (pathname === '/admin/dashboard' || pathname === '/admin') return 'analytics';
  if (pathname === '/admin/customers') return 'customers';
  if (pathname === '/admin/orders') return 'orders';
  if (pathname === '/admin/products') return 'products';
  if (pathname === '/admin/inventory') return 'inventory';
  if (pathname === '/admin/suppliers') return 'suppliers';
  if (pathname === '/admin/payments') return 'payments';
  if (pathname === '/admin/settings') return 'sheets';
  if (pathname === '/admin/claims') return 'claims';
  if (pathname === '/admin/enquiries') return 'enquiries';
  if (pathname === '/admin/security') return 'security';
  return 'analytics';
}

function mapTabToRoute(tab: string): string {
  if (tab === 'analytics') return '/admin/dashboard';
  if (tab === 'sheets') return '/admin/settings';
  return `/admin/${tab}`;
}

function MainAppRouter() {
  const { 
    selectedDepartment, 
    returnToHome, 
    isAdminAuthenticated, 
    currentCustomer 
  } = useStore();

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);

  // Listen to browser popstate and hashchange
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#/')) {
        setCurrentPath(hash.slice(1));
      } else if (hash === '#admin') {
        setCurrentPath('/admin/dashboard');
      } else {
        setCurrentPath(normalizePath(window.location.pathname || '/'));
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      const fullUrl = (BASE_URL || '') + path;
      window.history.pushState(null, '', fullUrl);
      setCurrentPath(path);
    }
  };

  const handleScrollToDailyEdit = () => {
    returnToHome();
    setTimeout(() => {
      const el = document.getElementById('daily-edit');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Route 1: Dedicated /admin/login
  if (currentPath === '/admin/login') {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard');
      return null;
    }
    // Get redirect param if any
    let redirectParam: string | undefined;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      redirectParam = params.get('redirect') || undefined;
    }

    return (
      <>
        <AdminLoginPage
          onLoginSuccess={(target) => navigate(target || '/admin/dashboard')}
          onNavigateHome={() => navigate('/')}
          redirectTarget={redirectParam}
        />
        <ToastContainer />
      </>
    );
  }

  // Route 2: Protected Admin Routes
  // (/admin, /admin/dashboard, /admin/customers, /admin/orders, /admin/products, /admin/inventory, /admin/suppliers, /admin/payments, /admin/settings)
  if (currentPath.startsWith('/admin')) {
    // Case 2A: Unauthenticated user
    if (!isAdminAuthenticated) {
      // Check if logged in as a normal customer account (or customer token present)
      const hasCustomerSession = Boolean(
        currentCustomer ||
        (typeof window !== 'undefined' && (sessionStorage.getItem('edz_customer_token') || localStorage.getItem('edz_customer_token')))
      );

      if (hasCustomerSession) {
        // Authenticated customer trying to access admin route -> 403 Access Denied
        return (
          <>
            <AdminAccessDeniedPage
              onNavigateHome={() => navigate('/')}
              onNavigateToLogin={() => navigate('/admin/login')}
            />
            <ToastContainer />
          </>
        );
      }

      // Logged-out visitor -> Redirect to /admin/login
      if (typeof window !== 'undefined') {
        const redirectUrl = `/admin/login?redirect=${encodeURIComponent(currentPath)}`;
        window.history.replaceState(null, '', redirectUrl);
      }
      return (
        <>
          <AdminLoginPage
            onLoginSuccess={(target) => navigate(target || '/admin/dashboard')}
            onNavigateHome={() => navigate('/')}
            redirectTarget={currentPath}
          />
          <ToastContainer />
        </>
      );
    }

    // Case 2B: Authorized Super Admin
    if (currentPath === '/admin') {
      navigate('/admin/dashboard');
      return null;
    }

    const currentTab = mapRouteToTab(currentPath);

    return (
      <div className="min-h-screen bg-[#1F2022] flex flex-col">
        <AdminDashboardModal
          isStandaloneRoute={true}
          initialTab={currentTab}
          onTabChange={(tab) => navigate(mapTabToRoute(tab))}
          onNavigateHome={() => navigate('/')}
        />
        <ToastContainer />
      </div>
    );
  }

  // Route 3: Storefront
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#242424] flex flex-col selection:bg-[#D9A6A0]/30 selection:text-[#242424] pb-16 lg:pb-0">
      
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Brand Navigation with Department Mega-Menus */}
      <Header onNavigateHome={returnToHome} />

      {/* Main View: Either Department Landing Page OR Complete Restructured Homepage */}
      <main className="flex-1">
        {selectedDepartment ? (
          <DepartmentLandingPage departmentId={selectedDepartment} />
        ) : (
          <>
            {/* 3. Editorial Hero Banner */}
            <Hero onExploreClick={handleScrollToDailyEdit} />

            {/* 4. Shop by Department (Women, Men, Kids, Home & Lifestyle) */}
            <ShopByDepartmentSection />

            {/* 5. The Daily Edit (3-5 handpicked finds) */}
            <DailyEdit />

            {/* 6. Women's Featured Collection (70% Marketing Priority) */}
            <DepartmentCollectionRow 
              departmentId="women" 
              title="Women’s Featured Collection" 
              subtitle="Travel organizers, silk sleep masks, and curated self-care tools."
              badge="70% Allocation · Spotlight"
            />

            {/* 7. Men's Featured Collection (20% Marketing Priority) */}
            <DepartmentCollectionRow 
              departmentId="men" 
              title="Men’s Featured Collection" 
              subtitle="Beard styling sets, shockproof EDC pouches, and travel essentials."
              badge="20% Allocation · Daily Gear"
            />

            {/* 8. Kids' Featured Collection (10% Marketing Priority) */}
            <DepartmentCollectionRow 
              departmentId="kids" 
              title="Kids’ Featured Collection" 
              subtitle="Reusable wipe-clean books, safe magnetic blocks, and school organizers."
              badge="10% Allocation · Child-Safe"
            />

            {/* 9. Home & Lifestyle Collection */}
            <DepartmentCollectionRow 
              departmentId="home-lifestyle" 
              title="Home & Lifestyle Collection" 
              subtitle="Cross-category tools to declutter kitchens, wardrobes, and luggage."
              badge="Whole Home Organisation"
            />

            {/* 10. Trending Products */}
            <TrendingSection />

            {/* 11. Best Finds Under ₹199 / ₹299 / ₹499 / ₹999 */}
            <PricePicksSection />

            {/* 12. Smart Combos */}
            <SmartCombos />

            {/* 13. Recently Added (New Arrivals) */}
            <NewArrivalsSection />

            {/* Wishlist Section */}
            <WishlistSection />

            {/* 14. Brand Trust Section (Trust & Transparency & Studio Support & Contact) & 15. Footer */}
            <WhyEverydayEditz />
          </>
        )}
      </main>

      {/* Mobile Sticky Thumb Navigation */}
      <MobileBottomNav />

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <SeeItInActionReels />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <RewardsModal />
      <SearchModal />
      <AdminDashboardModal />
      <CustomerAccountModal />
      <ProductEnquiryModal />
      <ProductWaitlistModal />
      <CustomerFeedbackModal />
      <PolicyModal />
      <ReturnClaimModal />
      <AdminLoginModal />
      <ToastContainer />

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainAppRouter />
    </StoreProvider>
  );
}
