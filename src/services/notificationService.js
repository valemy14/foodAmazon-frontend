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

export const notificationService = {
    // Get all notifications
    getAllNotifications: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/notifications`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get unread count
    getUnreadCount: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/notifications/unread-count`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Mark notification as read
    markAsRead: async (id) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/notifications/mark-read/${id}`, {}, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Mark all as read
    markAllAsRead: async () => {
        try {
            const response = await axios.put(`${API_BASE_URL}/notifications/mark-all-read`, {}, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create notification
    createNotification: async (notificationData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/notifications/create`, notificationData, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete notification
    deleteNotification: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/notifications/delete/${id}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};