import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { F1, D1 } from '../assets/Index';

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

const DistributorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'x-auth-token': localStorage.getItem('token')
  });

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, { 
        headers: getAuthHeaders() 
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNavigation = (route) => {
    navigate(route);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/distributor/login');
  };

  // Check if current route is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon"><img src={F1} alt="" /></span>
            <span className="logo-text">360 Organic Foodie</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li 
              className={isActive('/distributor/dashboard') ? 'active' : ''} 
              onClick={() => handleNavigation('/distributor/dashboard')}
            >
              <span className="nav-icon">🏠</span>
              <span>Dashboard</span>
            </li>
            <li 
              className={isActive('/distributor/orders') ? 'active' : ''} 
              onClick={() => handleNavigation('/distributor/orders')}
            >
              <span className="nav-icon">🛒</span>
              <span>Orders</span>
            </li>
            <li 
              className={isActive('/distributor/customers') ? 'active' : ''} 
              onClick={() => handleNavigation('/distributor/customers')}
            >
              <span className="nav-icon">👥</span>
              <span>Customers</span>
            </li>
            <li 
              className={isActive('/distributor/inventory') ? 'active' : ''} 
              onClick={() => handleNavigation('/distributor/inventory')}
            >
              <span className="nav-icon">📦</span>
              <span>Inventory</span>
            </li>
            <li 
              className={isActive('/distributor/notification') ? 'active' : ''} 
              onClick={() => handleNavigation('/distributor/notification')}
            >
              <span className="nav-icon">🔔</span>
              <span>Notifications</span>
              {notifications.length > 0 && (
                <span className="notification-count">{notifications.length}</span>
              )}
            </li>
            <li 
              className={isActive('/distributor/reviews') ? 'active' : ''} 
              onClick={() => handleNavigation('/distributor/reviews')}
            >
              <span className="nav-icon">⭐</span>
              <span>Reviews</span>
            </li>
            <li 
              className={isActive('/distributor/settings') ? 'active' : ''} 
              onClick={() => handleNavigation('/distributor/settings')}
            >
              <span className="nav-icon">⚙️</span>
              <span>Settings</span>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        ☰
      </button>

      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <input type="search" placeholder="Search here..." className="search-input" />
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
              🔔
              {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
            </button>
            <div className="user-profile-header">
              <img src={D1} alt="User" className="user-avatar-img" />
              <div className="user-info-header">
                <p className="user-name-header">{localStorage.getItem('userName') || 'User'}</p>
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>
          </div>
        </header>

        {/* Notification Popup */}
        {showNotifications && (
          <div className="popup notification-popup">
            <div className="popup-header">
              <h3>Notifications</h3>
              <button onClick={() => setShowNotifications(false)}>✕</button>
            </div>
            <div className="popup-content">
              {notifications.length === 0 ? (
                <p>No new notifications</p>
              ) : (
                notifications.slice(0, 5).map((notif, index) => (
                  <div key={index} className="notification-item">
                    <p><strong>{notif.title}</strong></p>
                    <p>{notif.message}</p>
                    <small>{new Date(notif.createdAt).toLocaleString()}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Page Content - This is where child routes will render */}
        <Outlet />
      </main>
    </div>
  );
};

export default DistributorLayout;