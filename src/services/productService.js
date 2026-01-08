// src/services/productService.js
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
    throw new Error(error.message || error.error || `HTTP error! status: ${response.status}`);
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

export const productService = {
  getAllProducts: async () => {
    try {
      const data = await apiRequest('/products/get-all-products', {
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

  getProductById: async (productId) => {
    try {
      const data = await apiRequest(`/products/get-single-product/${productId}`, {
        method: 'GET',
      });
      
      return {
        success: true,
        product: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  getPopularProducts: async () => {
    try {
      const data = await apiRequest('/products/popular-products', {
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

  getNewProducts: async () => {
    try {
      const data = await apiRequest('/products/new-products', {
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

  getSaleProducts: async () => {
    try {
      const data = await apiRequest('/products/sale-products', {
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

  getInventoryStats: async () => {
    try {
      const data = await apiRequest('/products/inventory-stats', {
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

  createProduct: async (productData) => {
    try {
      const data = await apiRequest('/products/create-all-products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      
      return {
        success: true,
        message: data.message || 'Product created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const data = await apiRequest(`/products/update-product/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
      
      return {
        success: true,
        message: data.message || 'Product updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  deleteProduct: async (productId) => {
    try {
      const data = await apiRequest(`/products/delete-products/${productId}`, {
        method: 'DELETE',
      });
      
      return {
        success: true,
        message: data.message || 'Product deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default productService;