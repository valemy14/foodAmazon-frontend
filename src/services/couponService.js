// Coupon API Service

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

// Get auth token from storage
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Handle API errors
const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      const role = localStorage.getItem('role');
      window.location.href = role === 'superadmin' ? '/superadmin-login' : '/distributor/login';
      throw new Error('Unauthorized. Please login again.');
    }
    
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'x-auth-token': token }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Coupon API Service
export const couponService = {
  // ==========================================
  // GET ALL COUPONS
  // ==========================================
  getAllCoupons: async () => {
    try {
      const data = await apiRequest('/coupons/get-all-coupons', {
        method: 'GET',
      });
      
      return {
        success: true,
        coupons: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // GET SINGLE COUPON BY ID
  // ==========================================
  getCouponById: async (couponId) => {
    try {
      const data = await apiRequest(`/coupons/get-coupon/${couponId}`, {
        method: 'GET',
      });
      
      return {
        success: true,
        coupon: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // CREATE COUPON
  // ==========================================
  createCoupon: async (couponData) => {
    try {
      const data = await apiRequest('/coupons/create-coupon', {
        method: 'POST',
        body: JSON.stringify(couponData),
      });
      
      if (data.status === 'success' || data.message) {
        return {
          success: true,
          message: data.message || 'Coupon created successfully',
        };
      } else {
        return {
          success: false,
          error: data.message || 'Failed to create coupon',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // UPDATE COUPON
  // ==========================================
  updateCoupon: async (couponId, couponData) => {
    try {
      const data = await apiRequest(`/coupons/update-coupon/${couponId}`, {
        method: 'PUT',
        body: JSON.stringify(couponData),
      });
      
      if (data.status === 'success' || data.message) {
        return {
          success: true,
          message: data.message || 'Coupon updated successfully',
        };
      } else {
        return {
          success: false,
          error: data.message || 'Failed to update coupon',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // DELETE COUPON
  // ==========================================
  deleteCoupon: async (couponId) => {
    try {
      const data = await apiRequest(`/coupons/delete-coupon/${couponId}`, {
        method: 'DELETE',
      });
      
      if (data.status === 'success' || data.message) {
        return {
          success: true,
          message: data.message || 'Coupon deleted successfully',
        };
      } else {
        return {
          success: false,
          error: data.message || 'Failed to delete coupon',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default couponService;