import { useState } from 'react';
import { Home, ShoppingCart, Package, Grid, Users, FileText, Gift, Mail, Settings, LogOut, Bell, Search, ChevronDown, ShoppingBag, ArrowLeft, Star, X } from 'lucide-react';

export default function CustomerInformationPage({ customer, onBack }) {
  const [activeMenu, setActiveMenu] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState(['VIP Customer', 'Lagos']);
  const [tagInput, setTagInput] = useState('');

  // Customer data (in real app, this would come from props or API)
  const customerData = customer || {
    name: 'Randhir Kumar',
    initial: 'R',
    location: 'Lagos',
    orderCount: 5,
    customerSince: '2 years',
    rating: 4.5,
    address: 'Maryland Mall, Ikeja, Lagos State, Nigeria',
    email: 'randhirpol@gmail.com',
    phone: '+234 8004789764',
    bgColor: '#a5b4fc'
  };

  // Order history
  const orders = [
    { id: '#23534D', date: 'May 25, 3:12 PM', status: 'Pending', price: '$29.74' },
    { id: '#12512B', date: 'May 10, 2:00 PM', status: 'Completed', price: '$23.06' },
    { id: '#23534D', date: 'April 18, 8:00 AM', status: 'Completed', price: '$29.74' },
    { id: '#76543E', date: 'April 12, 8:00 AM', status: 'Completed', price: '$23.06' },
    { id: '#51323C', date: 'April 10, 4:12 PM', status: 'Completed', price: '$23.06' }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'categories', label: 'Categories', icon: <Grid size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    { id: 'reports', label: 'Reports', icon: <FileText size={20} /> },
    { id: 'coupons', label: 'Coupons', icon: <Gift size={20} /> },
    { id: 'inbox', label: 'Inbox', icon: <Mail size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={18} fill="#fbbf24" color="#fbbf24" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" size={18} fill="#fbbf24" color="#fbbf24" style={{ opacity: 0.5 }} />);
    }
    while (stars.length < 5) {
      stars.push(<Star key={`empty-${stars.length}`} size={18} color="#d1d5db" />);
    }
    return stars;
  };

  return (
    <div className="customer-info-container">
      {/* Sidebar */}
      <aside className="customer-sidebar">
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
              className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="customer-info-main">
        {/* Top Header */}
        <header className="customer-header">
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
              <span className="user-name">Michael Owen</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Page Title */}
        <div className="page-title-section">
          <div className="title-with-back">
            <button className="back-btn" onClick={onBack}>
              <ArrowLeft size={20} />
              Back
            </button>
            <h1 className="page-title">Customer Information</h1>
          </div>
          <div className="title-actions">
            <button className="cancel-btn">Cancel</button>
            <button className="save-btn">Save</button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="customer-info-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* Customer Profile Card */}
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar-section">
                  <div 
                    className="profile-avatar-large" 
                    style={{ backgroundColor: customerData.bgColor }}
                  >
                    {customerData.initial}
                  </div>
                  <div className="profile-info">
                    <h2 className="profile-name">{customerData.name}</h2>
                    <p className="profile-location">{customerData.location}</p>
                    <p className="profile-orders">{customerData.orderCount} Orders</p>
                    <p className="profile-duration">Customer for {customerData.customerSince}</p>
                  </div>
                </div>
                <div className="profile-rating">
                  {renderStars(customerData.rating)}
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            <div className="notes-card">
              <h3 className="card-title">Customer Notes</h3>
              <label className="input-label">Notes</label>
              <textarea
                className="notes-textarea"
                placeholder="Add notes about customer"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            {/* Customer Orders */}
            <div className="orders-card">
              <h3 className="card-title">Customer Orders</h3>
              <div className="orders-table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Date</th>
                      <th>Order Status</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={index}>
                        <td className="order-id">{order.id}</td>
                        <td className="order-date">{order.date}</td>
                        <td>
                          <span className={`status-badge ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="order-price">{order.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Overview Card */}
            <div className="overview-card">
              <div className="card-header">
                <h3 className="card-title">Overview</h3>
                <button className="edit-btn">Edit</button>
              </div>

              <div className="overview-content">
                <div className="overview-section">
                  <label className="overview-label">Address</label>
                  <p className="overview-text">{customerData.address}</p>
                </div>

                <div className="overview-section">
                  <label className="overview-label">Email Address</label>
                  <p className="overview-text">{customerData.email}</p>
                </div>

                <div className="overview-section">
                  <label className="overview-label">Phone</label>
                  <p className="overview-text">{customerData.phone}</p>
                </div>

                <button className="delete-customer-btn">Delete Customer</button>
              </div>
            </div>

            {/* Tags Card */}
            <div className="tags-card">
              <h3 className="card-title">Tags</h3>
              <label className="input-label">Add Tags</label>
              <div className="tag-input-wrapper">
                <input
                  type="text"
                  className="tag-input"
                  placeholder="Enter tag name"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
              </div>
              <div className="tags-list">
                {tags.map((tag, index) => (
                  <span key={index} className="tag-badge">
                    {tag}
                    <button 
                      className="tag-remove"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="bottom-actions">
          <button className="cancel-btn">Cancel</button>
          <button className="save-btn">Save</button>
        </div>
      </main>
    </div>
  );
}