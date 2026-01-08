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

export const userService = {
    // Get current user profile
    getProfile: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/profile`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/users/profile`, profileData, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Change password
    changePassword: async (passwordData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/users/change-password`, passwordData, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update notification preferences
    updateNotificationPreferences: async (preferences) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/users/notification-preferences`, preferences, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get notification preferences
    getNotificationPreferences: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/notification-preferences`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Upload avatar
    uploadAvatar: async (formData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users/upload-avatar`, formData, {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete avatar
    deleteAvatar: async () => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/users/delete-avatar`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};