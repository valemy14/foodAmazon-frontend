import { useState,useEffect } from 'react';
import { customerService } from '../services/customerService';
import { Home, ShoppingCart, Package, Grid, Users, FileText, Gift, Mail, Settings, LogOut, Bell, Search, ChevronDown, ShoppingBag, Download, Edit, Trash2 } from 'lucide-react';

// ✨ UPDATED VERSION with navigation props
export default function SuperAdminCustomerPage({ onViewCustomer, onAddCustomer }) {
  const [activeMenu, setActiveMenu] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Customer data
  const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadCustomers();
      }, []);

      const loadCustomers = async () => {
  try {
    setLoading(true);
    const response = await customerService.getAllCustomers();
    
    if (response.success) {
      // Transform API data to match your table format
      const formattedCustomers = response.customers.map(customer => ({
        id: customer._id,
        name: `${customer.firstName} ${customer.lastName}`,
        initial: customer.firstName ? customer.firstName.charAt(0).toUpperCase() : '?',
        location: `${customer.city || ''}, ${customer.state || ''}`.trim() || 'N/A',
        orders: customer.totalOrders || 0,
        spent: `$${customer.totalSpent?.toFixed(2) || '0.00'}`,
        bgColor: getRandomColor(), // Add this helper function below
        email: customer.email,
        phoneNumber: customer.phoneNumber
      }));
      
      setCustomers(formattedCustomers);
      setError(null);
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError(err.message);
    console.error('Error loading customers:', err);
  } finally {
    setLoading(false);
  }
};

const getRandomColor = () => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const handleDeleteSelected = async () => {
  if (selectedCustomers.length === 0) {
    alert('Please select customers to delete');
    return;
  }

  if (!window.confirm(`Delete ${selectedCustomers.length} customer(s)?`)) {
    return;
  }

  try {
    setSaving(true);
    
    const results = await Promise.all(
      selectedCustomers.map(id => customerService.deleteCustomer(id))
    );
    
    const allSuccess = results.every(r => r.success);
    
    if (allSuccess) {
      setSelectedCustomers([]);
      loadCustomers(); // Refresh list
      alert('Customers deleted successfully!');
    } else {
      alert('Some customers could not be deleted');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    setSaving(false);
  }
};


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

  const tabs = [
    { id: 'all', label: 'All Customers' },
    { id: 'new', label: 'New Customers' },
    { id: 'vicinity', label: 'From Vicinity' },
    { id: 'returning', label: 'Returning Customers' }
  ];

  const toggleCustomerSelection = (customerId, e) => {
    e.stopPropagation(); // Prevent row click when clicking checkbox
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

 const toggleSelectAll = () => {
  setSelectedCustomers(
    selectedCustomers.length === customers.length 
      ? [] 
      : customers.map(c => c.id) // Changed from c.id to ensure it uses the correct id
  );
};
  // ✨ NEW: Handle row click to view customer details
  const handleRowClick = (customer) => {
    if (onViewCustomer) {
      onViewCustomer(customer);
    }
  };

  // ✨ NEW: Handle add customer button click
  const handleAddCustomerClick = () => {
    if (onAddCustomer) {
      onAddCustomer();
    }
  };

  if (loading) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div>Loading customers...</div>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', color: 'red' }}>
        Error: {error}
        <button onClick={loadCustomers} style={{ marginLeft: '10px', padding: '8px 16px' }}>
          Retry
        </button>
      </div>
    </div>
  );
}

 return (
  <>
    {/* Page Title */}
    <div className="page-title-section">
      <h1 className="page-title">Customers</h1>
      <div className="title-actions">
        <button className="export-btn">
          <Download size={18} />
          Export
        </button>
        <button 
          className="add-customer-btn"
          onClick={handleAddCustomerClick}
        >
          + Add Customer
        </button>
      </div>
    </div>

    {/* Tabs */}
    <div className="customer-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>

    {/* Filter and Search Row */}
    <div className="filter-row">
      <div className="filter-left">
        <select className="filter-dropdown">
          <option>Filter</option>
          <option>Location</option>
          <option>Orders</option>
          <option>Spent</option>
        </select>
        <div className="table-search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="filter-right">
        <button className="action-icon-btn">
          <Edit size={18} />
        </button>
        <button className="action-icon-btn delete" onClick={handleDeleteSelected} disabled={saving}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>

    {/* Customer Table */}
    <div className="customer-table-card">
      <div className="table-wrapper">
        <table className="customer-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedCustomers.length === customers.length && customers.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Location</th>
              <th>Orders</th>
              <th>Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  onClick={() => handleRowClick(customer)}
                  style={{ cursor: 'pointer' }}
                  className="customer-row"
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={(e) => toggleCustomerSelection(customer.id, e)}
                    />
                  </td>
                  <td className="name-cell">
                    <div className="customer-name-wrapper">
                      <div
                        className="customer-avatar"
                        style={{ backgroundColor: customer.bgColor }}
                      >
                        {customer.initial}
                      </div>
                      <span className="customer-name">{customer.name}</span>
                    </div>
                  </td>
                  <td className="location-cell">{customer.location}</td>
                  <td className="orders-cell">{customer.orders}</td>
                  <td className="spent-cell">{customer.spent}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-left">
          <button className="pagination-arrow">←</button>
          <button className="pagination-number">1</button>
          <button className="pagination-number active">2</button>
          <button className="pagination-number">3</button>
          <button className="pagination-number">4</button>
          <button className="pagination-number">5</button>
          <button className="pagination-number">6</button>
          <span className="pagination-dots">...</span>
          <button className="pagination-number">24</button>
          <button className="pagination-arrow">→</button>
        </div>
        <div className="pagination-right">
          <span className="results-count">{customers.length} Results</span>
        </div>
      </div>
    </div>
  </>
);
}
