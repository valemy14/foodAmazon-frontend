import React, { createContext, useState, useContext, useEffect } from 'react';

const WishlistContext = createContext(null);

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Get userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchWishlist(storedUserId);
    }
  }, []);

  // Fetch wishlist from backend
  const fetchWishlist = async (uId) => {
    if (!uId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/wishlists/get-wishlist/${uId}`);
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (productId, productName, productPrice, productImage) => {
    if (!userId) {
      alert('Please login to add items to wishlist');
      return { success: false, error: 'Not logged in' };
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/wishlists/add-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
          productName,
          productPrice,
          productImage
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setWishlist(data.wishlist);
      return { success: true, message: 'Item added to wishlist' };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/wishlists/remove-item/${userId}/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setWishlist(data.wishlist);
      return { success: true, message: 'Item removed from wishlist' };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/wishlists/clear-wishlist/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setWishlist(data.wishlist);
      return { success: true, message: 'Wishlist cleared' };
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Get wishlist item count
  const getWishlistCount = () => {
    return wishlist?.items?.length || 0;
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist?.items?.some(item => 
      item.product === productId || item.product?._id === productId
    ) || false;
  };

  const value = {
    wishlist,
    loading,
    userId,
    setUserId,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    getWishlistCount,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

// Custom hook to use wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;