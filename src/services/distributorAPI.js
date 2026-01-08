const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'x-auth-token': token
  };
};

export const distributorAPI = {
  // Dashboard Stats
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Inventory
  getInventoryStats: async () => {
    const response = await fetch(`${API_BASE_URL}/products/inventory-stats`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getAllProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products/get-all-products`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  createProduct: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/products/create-all-products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return response.json();
  },

  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/products/update-product/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return response.json();
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/delete-products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Orders
  getAllOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  updateOrderStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ deliveryStatus: status })
    });
    return response.json();
  },

  // Customers
  getAllCustomers: async () => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Notifications
  getNotifications: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  markNotificationRead: async (id) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  // Reviews
  getAllReviews: async () => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};