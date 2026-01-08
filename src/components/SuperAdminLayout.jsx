// src/layouts/SuperAdminLayout.jsx
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Grid, 
  Users, 
  FileText, 
  Gift, 
  Mail, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  ChevronDown, 
  ShoppingBag 
} from 'lucide-react';

const SuperAdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Check if current route is active
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, route: '/superadmin/dashboard' },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} />, route: '/superadmin/orders' },
    { id: 'products', label: 'Products', icon: <Package size={20} />, route: '/superadmin/products' },
    { id: 'categories', label: 'Categories', icon: <Grid size={20} />, route: '/superadmin/categories' },
    { id: 'customers', label: 'Customers', icon: <Users size={20} />, route: '/superadmin/customers' },
    { id: 'reports', label: 'Reports', icon: <FileText size={20} />, route: '/superadmin/reports' },
    { id: 'coupons', label: 'Coupons', icon: <Gift size={20} />, route: '/superadmin/coupons' },
    { id: 'inbox', label: 'Inbox', icon: <Mail size={20} />, route: '/superadmin/inbox' },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, route: '/superadmin/settings' }
  ];

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/superadmin-login');
  };

  return (
    <div className="superadmin-layout-wrapper">
      {/* Sidebar */}
      <aside className="superadmin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">🥗</div>
            <span className="logo-text">360 Organic Foodie</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${isActive(item.route) ? 'active' : ''}`}
              onClick={() => handleNavigation(item.route)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="superadmin-main-content">
        {/* Top Header */}
        <header className="superadmin-header">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <button className="icon-btn">
              <ShoppingBag size={20} />
            </button>
            <button 
              className="icon-btn notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
            <div className="user-profile">
              <div className="user-avatar">👤</div>
              <span className="user-name">{localStorage.getItem('userName') || 'Admin'}</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Page Content - Child routes render here */}
        <div className="superadmin-content-area">
          <Outlet />
        </div>
      </main>

      <style>{`
        .superadmin-layout-wrapper {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
        }

        .superadmin-sidebar {
          width: 260px;
          background: white;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 32px;
        }

        .logo-text {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .sidebar-menu {
          flex: 1;
          padding: 16px 0;
          overflow-y: auto;
        }

        .menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          color: #6b7280;
        }

        .menu-item:hover {
          background: #f3f4f6;
        }

        .menu-item.active {
          background: #eff6ff;
          color: #2563eb;
          border-right: 3px solid #2563eb;
        }

        .menu-label {
          font-size: 14px;
          font-weight: 500;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          color: #dc2626;
          font-weight: 500;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #fee2e2;
        }

        .superadmin-main-content {
          flex: 1;
          margin-left: 260px;
          display: flex;
          flex-direction: column;
        }

        .superadmin-header {
          background: white;
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .search-bar {
          position: relative;
          flex: 1;
          max-width: 500px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .search-bar input {
          width: 100%;
          padding: 10px 10px 10px 40px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-btn {
          padding: 8px;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }

        .icon-btn:hover {
          background: #e5e7eb;
        }

        .notification-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .user-name {
          font-size: 14px;
          font-weight: 500;
        }

        .superadmin-content-area {
          flex: 1;
          padding:0 ;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default SuperAdminLayout;