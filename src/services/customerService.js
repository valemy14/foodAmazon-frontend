
// Customer API Service


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
      ...(token && { 'x-auth-token': token }), // Changed from Authorization to x-auth-token
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

// Customer API Service
export const customerService = {
  // ==========================================
  // GET ALL CUSTOMERS
  // ==========================================
  getAllCustomers: async () => {
    try {
      const data = await apiRequest('/customers/get-all-customers', {
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

  // ==========================================
  // GET CUSTOMER DETAILS (with order history)
  // ==========================================
  getCustomerDetails: async (customerId) => {
    try {
      const data = await apiRequest(`/customers/get-customer-details/${customerId}`, {
        method: 'GET',
      });
      
      return {
        success: true,
        customer: data.customer,
        orders: data.orders,
        statistics: data.statistics,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // GET SINGLE CUSTOMER
  // ==========================================
  getSingleCustomer: async (customerId) => {
    try {
      const data = await apiRequest(`/customers/get-single-customer/${customerId}`, {
        method: 'GET',
      });
      
      return {
        success: true,
        customer: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // CREATE CUSTOMER
  // ==========================================
  createCustomer: async (customerData) => {
    try {
      const data = await apiRequest('/customers/create-all-customers', {
        method: 'POST',
        body: JSON.stringify(customerData),
      });
      
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // UPDATE CUSTOMER
  // ==========================================
  updateCustomer: async (customerId, customerData) => {
    try {
      const data = await apiRequest(`/customers/update-customers/${customerId}`, {
        method: 'PUT',
        body: JSON.stringify(customerData),
      });
      
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // DELETE CUSTOMER
  // ==========================================
  deleteCustomer: async (customerId) => {
    try {
      const data = await apiRequest(`/customers/delete-customer/${customerId}`, {
        method: 'DELETE',
      });
      
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default customerService;