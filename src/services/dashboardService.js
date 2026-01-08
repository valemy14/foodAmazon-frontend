// src/services/dashboardService.js
const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      const role = localStorage.getItem('role');
      window.location.href = role === 'superadmin' ? '/superadmin-login' : '/distributor-login';
      throw new Error('Unauthorized. Please login again.');
    }
    
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

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

// ==========================================
// SUPERADMIN DASHBOARD
// ==========================================
export const superAdminDashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const data = await apiRequest('/superadmin-dashboard/stats', {
        method: 'GET',
      });
      
      return {
        success: true,
        stats: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get recent orders
  getRecentOrders: async (limit = 10) => {
    try {
      const data = await apiRequest(`/superadmin-dashboard/recent-orders?limit=${limit}`, {
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

  // Get top selling products
  getTopProducts: async (limit = 10) => {
    try {
      const data = await apiRequest(`/superadmin-dashboard/top-products?limit=${limit}`, {
        method: 'GET',
      });
      
      return {
        success: true,
        products: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get revenue chart data
  getRevenueChart: async () => {
    try {
      const data = await apiRequest('/superadmin-dashboard/revenue-chart', {
        method: 'GET',
      });
      
      return {
        success: true,
        chartData: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get new customers
  getNewCustomers: async (limit = 10) => {
    try {
      const data = await apiRequest(`/superadmin-dashboard/new-customers?limit=${limit}`, {
        method: 'GET',
      });
      
      return {
        success: true,
        customers: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get low stock alerts
  getLowStockAlerts: async (threshold = 10) => {
    try {
      const data = await apiRequest(`/superadmin-dashboard/low-stock-alerts?threshold=${threshold}`, {
        method: 'GET',
      });
      
      return {
        success: true,
        products: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

// ==========================================
// DISTRIBUTOR DASHBOARD  
// ==========================================
export const distributorDashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const data = await apiRequest('/distributor-dashboard/stats', {
        method: 'GET',
      });
      
      return {
        success: true,
        stats: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get best-selling products
  getBestSellingProducts: async () => {
    try {
      const data = await apiRequest('/distributor-dashboard/best-selling-products', {
        method: 'GET',
      });
      
      return {
        success: true,
        products: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get distribution trends
  getDistributionTrends: async () => {
    try {
      const data = await apiRequest('/distributor-dashboard/distribution-trends', {
        method: 'GET',
      });
      
      return {
        success: true,
        trends: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get new customers
  getNewCustomers: async () => {
    try {
      const data = await apiRequest('/distributor-dashboard/new-customers', {
        method: 'GET',
      });
      
      return {
        success: true,
        customers: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get recent orders
  getRecentOrders: async () => {
    try {
      const data = await apiRequest('/distributor-dashboard/recent-orders', {
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

  // Get total products
  getTotalProducts: async () => {
    try {
      const data = await apiRequest('/distributor-dashboard/total-products', {
        method: 'GET',
      });
      
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default {
  superAdmin: superAdminDashboardService,
  distributor: distributorDashboardService
};