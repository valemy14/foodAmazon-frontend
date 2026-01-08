import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

const NotificationPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // API States
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getAllNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(notif => 
        notif._id === id ? { ...notif, isRead: true } : notif
      ));
      fetchUnreadCount();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(notif => notif._id !== id));
      fetchUnreadCount();
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Pagination
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = notifications.slice(startIndex, endIndex);

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return notifDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div>Loading notifications...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Title */}
      <div className="notification-page-title">
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            style={{
              marginLeft: '20px',
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications Section */}
      <div className="notification-section">
        <div className="notification-section-header">
          <h2>Notifications</h2>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
            Error loading notifications: {error.toString()}
          </div>
        )}

        {/* Notifications List */}
        <div className="notification-list">
          {currentNotifications.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              No notifications to display
            </div>
          ) : (
            currentNotifications.map((notification) => (
              <div 
                key={notification._id} 
                className="notification-item"
                style={{ 
                  backgroundColor: notification.isRead ? '#fff' : '#f0f9ff',
                  position: 'relative'
                }}
                onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
              >
                <div className="notification-item-left">
                  <div className="notification-avatar">
                    {notification.type === 'order' ? '🛒' : 
                     notification.type === 'review' ? '⭐' : 
                     notification.type === 'customer' ? '👤' : 
                     notification.type === 'product' ? '📦' : '🔔'}
                  </div>
                  <div className="notification-content">
                    <span className="notification-name">{notification.title}</span>
                    <span className="notification-message">{notification.message}</span>
                  </div>
                </div>
                <div className="notification-time">
                  {formatTime(notification.createdAt)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification._id);
                    }}
                    style={{
                      marginLeft: '10px',
                      padding: '4px 8px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {notifications.length > 0 && (
          <div className="notification-pagination">
            <div className="notification-pagination-info">
              Showing {startIndex + 1} to {Math.min(endIndex, notifications.length)} of {notifications.length} Items
            </div>
            <div className="notification-pagination-controls">
              <button 
                className="notification-page-btn" 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                ‹
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button 
                  key={index + 1}
                  className={`notification-page-btn ${currentPage === index + 1 ? 'active' : ''}`} 
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button 
                className="notification-page-btn" 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;