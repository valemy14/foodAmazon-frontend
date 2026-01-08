
// MESSAGE SERVICE (for Inbox)
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

export const messageService = {
  // Get all conversations
  getConversations: async () => {
    try {
      const data = await apiRequest('/messages/conversations', {
        method: 'GET',
      });
      
      return {
        success: true,
        conversations: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get messages with specific user
  getConversationWithUser: async (userId) => {
    try {
      const data = await apiRequest(`/messages/conversation/${userId}`, {
        method: 'GET',
      });
      
      return {
        success: true,
        messages: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Send message
  sendMessage: async (recipientId, content, attachments = []) => {
    try {
      const data = await apiRequest('/messages/send', {
        method: 'POST',
        body: JSON.stringify({
          recipientId,
          content,
          attachments
        }),
      });
      
      return {
        success: true,
        message: data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Mark message as read
  markAsRead: async (messageId) => {
    try {
      const data = await apiRequest(`/messages/mark-read/${messageId}`, {
        method: 'PUT',
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

  // Get unread count
  getUnreadCount: async () => {
    try {
      const data = await apiRequest('/messages/unread-count', {
        method: 'GET',
      });
      
      return {
        success: true,
        count: data.count,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Delete message
  deleteMessage: async (messageId) => {
    try {
      const data = await apiRequest(`/messages/delete/${messageId}`, {
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
