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

export const reviewService = {
    // Get all reviews
    getAllReviews: async (filters = {}) => {
        try {
            const params = new URLSearchParams(filters);
            const response = await axios.get(`${API_BASE_URL}/reviews?${params}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get reviews by status (for tabs)
    getReviewsByStatus: async (status) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reviews?status=${status}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get reviews for specific product
    getProductReviews: async (productId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reviews/product/${productId}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get review statistics
    getStats: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reviews/stats`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update review status (approve/reject/pending)
    updateStatus: async (id, status) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/reviews/update-status/${id}`, 
                { status },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete review
    deleteReview: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/reviews/delete-review/${id}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create review (customer facing)
    createReview: async (reviewData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/reviews/create-review`, reviewData, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get top rated review
    getTopRated: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reviews/top-rated`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get worst rated review
    getWorstRated: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reviews/worst-rated`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};