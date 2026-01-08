import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

// Get auth token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found in localStorage');
        return {};
    }
    return { 'x-auth-token': token };
};

export const inventoryService = {
    // Get inventory statistics
    getStats: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/inventory/stats`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get all inventory items with pagination
    getInventory: async (page = 1, limit = 14, filters = {}) => {
        try {
            const params = new URLSearchParams({
                page,
                limit,
                ...filters
            });

            const response = await axios.get(`${API_BASE_URL}/inventory?${params}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get single inventory item
    getInventoryById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/inventory/${id}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create new inventory item
    createInventory: async (inventoryData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/inventory`, inventoryData, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update inventory item
    updateInventory: async (id, inventoryData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/inventory/${id}`, inventoryData, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete inventory item
    deleteInventory: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/inventory/${id}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get low stock alerts
    getLowStock: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/inventory/alerts/low-stock`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get expiring products
    getExpiring: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/inventory/alerts/expiring`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};