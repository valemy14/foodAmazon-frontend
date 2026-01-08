
// Hardcoded API URL - Change this to your production URL when deploying
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

        window.location.href =
        role === 'superadmin'
            ? '/superAdmin/login'
            : '/distributor/login';

      throw new Error('Unauthorized. Please login again.');
    }
    
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || `HTTP error! status: ${response.status}`);
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

// Order API Service
export const orderService = {
  // ==========================================
  // GET ALL ORDERS (for distributor/admin)
  // ==========================================
  getAllOrders: async () => {
    try {
      const data = await apiRequest('/orders/get-all-orders', {
        method: 'GET',
      });
      
      return {
        success: true,
        orders: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // GET SINGLE ORDER BY ID
  // ==========================================
  getOrderById: async (orderId) => {
    try {
      const data = await apiRequest(`/orders/get-order/${orderId}`, {
        method: 'GET',
      });
      
      return {
        success: true,
        order: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // GET ORDERS BY CUSTOMER ID
  // ==========================================
  getOrdersByCustomer: async (customerId) => {
    try {
      const data = await apiRequest(`/orders/customer/${customerId}`, {
        method: 'GET',
      });
      
      return {
        success: true,
        orders: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // CREATE ORDER
  // ==========================================
  createOrder: async (orderData) => {
    try {
      const data = await apiRequest('/orders/create', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      
      return {
        success: true,
        orderId: data.orderId,
        authorizationUrl: data.authorizationUrl,
        reference: data.reference,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // CONFIRM PAYMENT
  // ==========================================
  confirmPayment: async (reference) => {
    try {
      const data = await apiRequest('/orders/confirm', {
        method: 'POST',
        body: JSON.stringify({ reference }),
      });
      
      return {
        success: data.success,
        order: data.order,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // UPDATE ORDER STATUS (Delivery Status)
  // ==========================================
  updateOrderStatus: async (orderId, deliveryStatus) => {
    try {
      const data = await apiRequest(`/orders/update-status/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ deliveryStatus }),
      });
      
      return {
        success: true,
        message: data.message || 'Order status updated successfully',
        order: data.order,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // DELETE ORDER
  // ==========================================
  deleteOrder: async (orderId) => {
    try {
      const data = await apiRequest(`/orders/delete/${orderId}`, {
        method: 'DELETE',
      });
      
      return {
        success: true,
        message: data.message || 'Order deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // GET ORDER STATISTICS
  // ==========================================
  getOrderStatistics: async () => {
    try {
      const data = await apiRequest('/orders/statistics', {
        method: 'GET',
      });
      
      return {
        success: true,
        statistics: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default orderService;