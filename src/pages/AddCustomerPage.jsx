import { useState } from 'react';
import { Home, ShoppingCart, Package, Grid, Users, FileText, Gift, Mail, Settings, LogOut, Bell, Search, ChevronDown, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function AddCustomerPage({ onBack }) {
  const [activeMenu, setActiveMenu] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    apartment: '',
    city: '',
    country: '',
    postalCode: '',
    addressPhone: '',
    notes: ''
  });

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add API call here
  };

  return (
    <div className="add-customer-container">
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
      <main className="add-customer-main">
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
            <h1 className="page-title">Add Customer</h1>
          </div>
          <div className="title-actions">
            <button className="cancel-btn" onClick={onBack}>Cancel</button>
            <button className="save-btn" onClick={handleSubmit}>Save</button>
          </div>
        </div>

        {/* Form Content */}
        <div className="form-container">
          {/* Customer Information Section */}
          <div className="form-section">
            <h3 className="section-title">Customer Information</h3>
            <p className="section-subtitle">Most important information about the customer</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Customer Address Section */}
          <div className="form-section">
            <h3 className="section-title">Customer Address</h3>
            <p className="section-subtitle">Shipping address information</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Apartment</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.apartment}
                  onChange={(e) => handleInputChange('apartment', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>

              <div className="form-group form-group-double">
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select
                    className="form-select"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                  >
                    <option value="">Choose</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.addressPhone}
                  onChange={(e) => handleInputChange('addressPhone', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Customer Notes Section */}
          <div className="form-section">
            <h3 className="section-title">Customer Notes</h3>
            <p className="section-subtitle">Add notes about customer</p>
            
            <div className="form-group full-width">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Add notes about customer"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="bottom-actions">
          <button className="cancel-btn" onClick={onBack}>Cancel</button>
          <button className="save-btn" onClick={handleSubmit}>Save</button>
        </div>
      </main>
    </div>
  );
}