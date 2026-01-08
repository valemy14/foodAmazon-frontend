// Category API Service

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

// Set to true to see debug logs in console
const DEBUG_MODE = false;

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

  const fullUrl = `${API_BASE_URL}${endpoint}`;
  
  // Debug logging
  if (DEBUG_MODE) {
    console.log('🔍 API Request Details:');
    console.log('Full URL:', fullUrl);
    console.log('Method:', config.method || 'GET');
    console.log('Has Token:', !!token);
  }

  try {
    const response = await fetch(fullUrl, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Request Error:', error);
    console.error('Failed URL:', fullUrl);
    throw error;
  }
};

// Category API Service
export const categoryService = {
  // ==========================================
  // GET ALL CATEGORIES
  // ==========================================
  getAllCategories: async () => {
    try {
      const data = await apiRequest('/categories/get-all-foods', {
        method: 'GET',
      });
      
      return {
        success: true,
        categories: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // GET SINGLE CATEGORY BY ID
  // ==========================================
  getCategoryById: async (categoryId) => {
    try {
      const data = await apiRequest(`/categories/get-single-food/${categoryId}`, {
        method: 'GET',
      });
      
      return {
        success: true,
        category: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // ==========================================
  // CREATE CATEGORY
  // ==========================================
  createCategory: async (categoryData) => {
    try {
      const data = await apiRequest('/categories/create-all-foods', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
      
      if (data.status === 'success' || data.message) {
        return {
          success: true,
          message: data.message || 'Category created successfully',
        };
      } else {
        return {
          success: false,
          error: data.message || 'Failed to create category',
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
  // UPDATE CATEGORY
  // ==========================================
  updateCategory: async (categoryId, categoryData) => {
    try {
      const data = await apiRequest(`/categories/update-foods/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
      
      if (data.status === 'success' || data.message) {
        return {
          success: true,
          message: data.message || 'Category updated successfully',
        };
      } else {
        return {
          success: false,
          error: data.message || 'Failed to update category',
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
  // DELETE CATEGORY
  // ==========================================
  deleteCategory: async (categoryId) => {
    try {
      const data = await apiRequest(`/categories/delete-food/${categoryId}`, {
        method: 'DELETE',
      });
      
      if (data.status === 'success' || data.message) {
        return {
          success: true,
          message: data.message || 'Category deleted successfully',
        };
      } else {
        return {
          success: false,
          error: data.message || 'Failed to delete category',
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

export default categoryService;