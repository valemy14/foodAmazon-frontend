import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Scroll from "./components/Scroll";
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import OurProducts from './pages/OurProduct';
import Product from './pages/Product';
import Quality from './pages/Quality';
import Bulk from './pages/Bulk';
import NewProduct from './pages/NewProduct';
import Sales from './pages/Sales';
import NewsLetter from './pages/NewsLetter';

import AboutProduct from './pages/AboutProduct';
import AboutThisPage from './pages/AboutThisPage';
import Testimonials from './pages/Testimonials';
import SimilarProducts from './pages/SimilarProducts';

import WishList from './pages/Wishlist';
import PeopleAlsoBuy from './pages/PeopleAlsoBuy';
import CartPopup from './components/CartPopUp';
import ShoppingCart from './pages/ShoppingCart';
import { CartProvider } from './context/CartContext'; 
import { AuthProvider } from './context/AuthContext'; 
import { WishlistProvider } from './context/wishlistContext';
import CheckOut from './pages/CheckOut';
import ReviewStatistics from './pages/ReviewStatistics';
import PaymentVerification from './pages/PaymentVerification';

// Customer Auth
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';

// Distributor Auth & Pages
import AuthPages from './components/AuthPages';
import DistributorLayout from './components/DistributorLayout';
import DistributorDashboard from "./pages/DistributorDashboard";
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import InventoryPage from './pages/InventoryPage';
import NotificationPage from './pages/NotificationPage';
import ReviewsPage from './pages/ReviewsPage';
import SettingsPage from './pages/SettingsPage';

// SuperAdmin auth & pages 
import { 
  SuperAdminSignUp, 
  SuperAdminLogin, 
  SuperAdminPasswordReset, 
  SuperAdminEmailConfirm, 
  SuperAdminAlmostThere 
} from './components/SuperAdminAuth';
import SuperAdminLayout from './components/SuperAdminLayout';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminOrders from './pages/SuperAdminOrders';
import SuperAdminProductPage from './pages/SuperAdminProductPage';
import SuperAdminCategoryPage from './pages/SuperAdminCategoryPage';
import CustomerManager from './pages/CustomerManager';
import SuperAdminReportsPage from './pages/SuperAdminReportsPage';
import CouponManager from './pages/CouponManager';
import SuperAdminInbox from './pages/SuperAdminInbox';
import SuperAdminProfileSettingsPage from './pages/SuperAdminProfileSettingsPage';

function AppWrapper() {
  const location = useLocation();

  // Paths where customer header/footer should be hidden
  const authPaths = [
    // Customer auth
    "/login",
    "/signup",
    
    // Distributor auth & pages
    "/distributor/login",
    "/distributor/signup",
    "/distributor/password-reset",
    "/distributor/confirm-email",
    "/distributor/dashboard",
    "/distributor/orders",
    "/distributor/customers",
    "/distributor/inventory",
    "/distributor/notification",
    "/distributor/reviews",
    "/distributor/settings",
    "/distributor",
    
    // SuperAdmin auth & pages
    "/superadmin-login",
    "/superadmin-signup",
    "/superadmin-reset",
    "/superadmin-confirm",
    "/superadmin-success",
    "/superadmin",
    "/superadmin/dashboard",
    "/superadmin/orders",
    "/superadmin/products",
    "/superadmin/categories",
    "/superadmin/customers",
    "/superadmin/reports",
    "/superadmin/coupons",
    "/superadmin/inbox",
    "/superadmin/settings",
  ];

  const hideLayout = authPaths.includes(location.pathname);

  return <App hideLayout={hideLayout} />;
}

function App({ hideLayout }) {
  const [cartOpen, setCartOpen] = useState(false);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  return (
    <>
      {!hideLayout && <Header openCart={openCart} />}
      {cartOpen && <CartPopup onClose={closeCart} />}

      <Routes>
        {/* ===================================
            CUSTOMER AUTH
            =================================== */}
        <Route path="/login" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* ===================================
            DISTRIBUTOR AUTH (Separate - No Layout)
            =================================== */}
        <Route path="/distributor/login" element={<AuthPages initialPage="login" />} />
        <Route path="/distributor/signup" element={<AuthPages initialPage="signup" />} />
        <Route path="/distributor/password-reset" element={<AuthPages initialPage="reset" />} />
        <Route path="/distributor/confirm-email" element={<AuthPages initialPage="confirm" />} />
        
        {/* ===================================
            DISTRIBUTOR PAGES (With Persistent Layout)
            =================================== */}
        <Route path="/distributor" element={<DistributorLayout />}>
          <Route path="dashboard" element={<DistributorDashboard />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* ===================================
            SUPER ADMIN AUTH
            =================================== */}
        <Route path="/superadmin-login" element={<SuperAdminLogin />} />
        <Route path="/superadmin-signup" element={<SuperAdminSignUp />} />
        <Route path="/superadmin-reset" element={<SuperAdminPasswordReset />} />
        <Route path="/superadmin-confirm" element={<SuperAdminEmailConfirm />} />
        <Route path="/superadmin-success" element={<SuperAdminAlmostThere />} />

        {/* ===================================
            SUPER ADMIN PAGES
            =================================== */}
       <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/superadmin/orders" element={<SuperAdminOrders />} />
        <Route path="/superadmin/products" element={<SuperAdminProductPage />} />
        <Route path="/superadmin/categories" element={<SuperAdminCategoryPage />} />
        <Route path="/superadmin/customers" element={<CustomerManager />} />
        <Route path="/superadmin/reports" element={<SuperAdminReportsPage />} />
        <Route path="/superadmin/coupons" element={<CouponManager />} />
        <Route path="/superadmin/inbox" element={<SuperAdminInbox />} />
        <Route path="/superadmin/settings" element={<SuperAdminProfileSettingsPage />} />
       </Route>

        {/* ===================================
            CUSTOMER ROUTES
            =================================== */}
        <Route path="/products" element={<OurProducts />} />
        <Route
          path="/"
          element={
            <>
              <Home />
              <Product />
              <Quality />
              <Bulk />
              <NewProduct />
              <Sales />
              <NewsLetter />
            </>
          }
        />

        <Route
          path="/product/:productid"
          element={
            <>
              <AboutProduct />
              <AboutThisPage />
              <ReviewStatistics />
              <Testimonials />
              <SimilarProducts />
            </>
          }
        />

        <Route path="/wishlist" element={<WishList />} />
        <Route
          path="/cart"
          element={
            <>
              <ShoppingCart />
              <PeopleAlsoBuy />
            </>
          }
        />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/verify" element={<PaymentVerification />} />
      </Routes>
    
      {!hideLayout && <Footer />}
    </>
  );
}

export default function RootApp() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider> 
          <WishlistProvider>
            <Scroll />
            <AppWrapper />
          </WishlistProvider> 
        </CartProvider> 
      </AuthProvider> 
    </Router>
  );
}