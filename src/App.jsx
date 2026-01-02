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
import { WishlistProvider } from './context/wishlistContext';
import CheckOut from './pages/CheckOut';

import ReviewStatistics from './pages/ReviewStatistics';
import DistributorDashboard from "./pages/DistributorDashboard";

import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';


function AppWrapper() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/DistributorDashboard";

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

        <Route path="/login" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/distributorDashboard" element={<DistributorDashboard />}/>
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}


export default function RootApp() {
  return (
    <Router>
      <CartProvider> 
        <WishlistProvider>
          <Scroll />
            <AppWrapper />
        </WishlistProvider> 
      </CartProvider>  
    </Router>
  );
}