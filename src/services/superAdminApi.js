// src/services/superAdminApi.js
// Centralized API service for SuperAdmin operations

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'x-auth-token': token
    };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// ==================== DASHBOARD ====================
export const dashboardAPI = {
    // Get dashboard statistics
    getStats: async () => {
        const response = await fetch(`${API_BASE_URL}/superadmin-dashboard/stats`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Get recent orders
    getRecentOrders: async (limit = 10) => {
        const response = await fetch(
            `${API_BASE_URL}/superadmin-dashboard/recent-orders?limit=${limit}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    // Get top selling products
    getTopProducts: async (limit = 10) => {
        const response = await fetch(
            `${API_BASE_URL}/superadmin-dashboard/top-products?limit=${limit}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    // Get revenue chart data
    getRevenueChart: async () => {
        const response = await fetch(`${API_BASE_URL}/superadmin-dashboard/revenue-chart`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Get new customers
    getNewCustomers: async (limit = 10) => {
        const response = await fetch(
            `${API_BASE_URL}/superadmin-dashboard/new-customers?limit=${limit}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    // Get low stock alerts
    getLowStockAlerts: async (threshold = 10) => {
        const response = await fetch(
            `${API_BASE_URL}/superadmin-dashboard/low-stock-alerts?threshold=${threshold}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    }
};

// ==================== ORDERS ====================
export const ordersAPI = {
    // Get all orders with pagination
    getAll: async (page = 1, limit = 20, filters = {}) => {
        const queryParams = new URLSearchParams({
            page,
            limit,
            ...filters
        });
        const response = await fetch(`${API_BASE_URL}/orders?${queryParams}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Get single order
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Update order status
    updateStatus: async (id, status) => {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ orderStatus: status })
        });
        return handleResponse(response);
    },

    // Delete order
    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};

// ==================== PRODUCTS ====================
export const productsAPI = {
    // Get all products
    getAll: async (page = 1, limit = 20) => {
        const response = await fetch(`${API_BASE_URL}/products?page=${page}&limit=${limit}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Get single product
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Create product
    create: async (productData) => {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData)
        });
        return handleResponse(response);
    },

    // Update product
    update: async (id, productData) => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData)
        });
        return handleResponse(response);
    },

    // Delete product
    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};

// ==================== CATEGORIES ====================
export const categoriesAPI = {
    // Get all categories
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Get single category
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Create category
    create: async (categoryData) => {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(categoryData)
        });
        return handleResponse(response);
    },

    // Update category
    update: async (id, categoryData) => {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(categoryData)
        });
        return handleResponse(response);
    },

    // Delete category
    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};

// ==================== CUSTOMERS ====================
export const customersAPI = {
    // Get all customers
    getAll: async (page = 1, limit = 20) => {
        const response = await fetch(`${API_BASE_URL}/customers?page=${page}&limit=${limit}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Get single customer
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Update customer
    update: async (id, customerData) => {
        const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(customerData)
        });
        return handleResponse(response);
    },

    // Delete customer
    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};

// ==================== COUPONS ====================
export const couponsAPI = {
    // Get all coupons
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/coupons`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Create coupon
    create: async (couponData) => {
        const response = await fetch(`${API_BASE_URL}/coupons`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(couponData)
        });
        return handleResponse(response);
    },

    // Update coupon
    update: async (id, couponData) => {
        const response = await fetch(`${API_BASE_URL}/coupons/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(couponData)
        });
        return handleResponse(response);
    },

    // Delete coupon
    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/coupons/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};

// ==================== MESSAGES/INBOX ====================
export const messagesAPI = {
    // Get all messages
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/messages`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Get single message
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Mark as read
    markAsRead: async (id) => {
        const response = await fetch(`${API_BASE_URL}/messages/${id}/read`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Delete message
    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};

// ==================== REPORTS ====================
export const reportsAPI = {
    // Get sales report
    getSalesReport: async (startDate, endDate) => {
        const params = new URLSearchParams({ startDate, endDate });
        const response = await fetch(`${API_BASE_URL}/reports/sales?${params}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Get product performance report
    getProductReport: async () => {
        const response = await fetch(`${API_BASE_URL}/reports/products`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Get customer report
    getCustomerReport: async () => {
        const response = await fetch(`${API_BASE_URL}/reports/customers`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};

// Export all APIs
export default {
    dashboard: dashboardAPI,
    orders: ordersAPI,
    products: productsAPI,
    categories: categoriesAPI,
    customers: customersAPI,
    coupons: couponsAPI,
    messages: messagesAPI,
    reports: reportsAPI
};