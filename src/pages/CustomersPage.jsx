import React, { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';

const CustomersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  
  // API State
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch all customers on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  // ==========================================
  // LOAD ALL CUSTOMERS
  // ==========================================
  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await customerService.getAllCustomers();
      
      if (result.success) {
        // Transform backend data to match your frontend structure
        const transformedCustomers = result.customers.map(customer => ({
          id: customer._id,
          name: `${customer.firstName} ${customer.lastName}`,
          username: `@${customer.firstName.toLowerCase()}${customer.lastName.toLowerCase()}`,
          email: customer.email,
          location: `${customer.city}, ${customer.state}`,
          phone: customer.phoneNumber,
          status: 'Active', // You can add online/offline logic later
          avatar: '👨',
          firstName: customer.firstName,
          lastName: customer.lastName,
          address: customer.address,
          country: customer.country,
          city: customer.city,
          state: customer.state,
          zipCode: customer.zipCode,
          orderNote: customer.orderNote || '',
          dateOfBirth: customer.dateOfBirth || 'N/A',
          gender: customer.gender || 'Male'
        }));
        
        setCustomers(transformedCustomers);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load customers. Please try again.');
      console.error('Load customers error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD CUSTOMER DETAILS WITH ORDER HISTORY
  // ==========================================
  const handleCustomerClick = async (customer) => {
    try {
      setLoading(true);
      
      // Fetch detailed customer info with orders
      const result = await customerService.getCustomerDetails(customer.id);
      
      if (result.success) {
        setSelectedCustomer({
          ...customer,
          orders: result.orders,
          statistics: result.statistics
        });
        setShowCustomerModal(true);
      } else {
        alert('Failed to load customer details: ' + result.error);
      }
    } catch (err) {
      alert('Error loading customer details');
      console.error('Customer details error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SAVE CUSTOMER (UPDATE)
  // ==========================================
  const handleSaveCustomer = async () => {
    if (!selectedCustomer) return;
    
    try {
      setSaving(true);
      
      // Prepare data for API
      const customerData = {
        firstName: selectedCustomer.firstName,
        lastName: selectedCustomer.lastName,
        email: selectedCustomer.email,
        address: selectedCustomer.address,
        country: selectedCustomer.country,
        city: selectedCustomer.city,
        state: selectedCustomer.state,
        zipCode: selectedCustomer.zipCode,
        phoneNumber: selectedCustomer.phone,
        orderNote: selectedCustomer.orderNote || ''
      };
      
      const result = await customerService.updateCustomer(
        selectedCustomer.id,
        customerData
      );
      
      if (result.success) {
        alert('Customer updated successfully!');
        setShowCustomerModal(false);
        // Reload customers list
        loadCustomers();
      } else {
        alert('Failed to update customer: ' + result.error);
      }
    } catch (err) {
      alert('Error updating customer');
      console.error('Update customer error:', err);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE CUSTOMER
  // ==========================================
  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const result = await customerService.deleteCustomer(customerId);
      
      if (result.success) {
        alert('Customer deleted successfully!');
        setShowCustomerModal(false);
        // Reload customers list
        loadCustomers();
      } else {
        alert('Failed to delete customer: ' + result.error);
      }
    } catch (err) {
      alert('Error deleting customer');
      console.error('Delete customer error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER CUSTOMERS BY TAB
  // ==========================================
  const getFilteredCustomers = () => {
    switch(activeTab) {
      case 'active':
        return customers.filter(customer => customer.status === 'Active');
      case 'offline':
        return customers.filter(customer => customer.status === 'Offline');
      default:
        return customers;
    }
  };

  const filteredCustomers = getFilteredCustomers();
  const onlineUsers = customers.filter(c => c.status === 'Active').slice(0, 5);

  // ==========================================
  // UPDATE FORM FIELD
  // ==========================================
  const updateCustomerField = (field, value) => {
    setSelectedCustomer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (loading && customers.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        fontSize: '18px'
      }}>
        Loading customers...
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================
  if (error && customers.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        gap: '16px'
      }}>
        <p style={{ color: '#dc2626', fontSize: '18px' }}>Error: {error}</p>
        <button 
          onClick={loadCustomers}
          style={{
            padding: '10px 20px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="customers-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Customers</h1>
        <button 
          onClick={loadCustomers}
          style={{
            padding: '8px 16px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="customers-tabs">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({customers.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active ({customers.filter(c => c.status === 'Active').length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'offline' ? 'active' : ''}`}
          onClick={() => setActiveTab('offline')}
        >
          Offline ({customers.filter(c => c.status === 'Offline').length})
        </button>
      </div>

      {/* Online Users Section */}
      <div className="online-users-section">
        <h3 className="section-title">Online Users</h3>
        <div className="online-users-carousel">
          <div className="online-users-list">
            {onlineUsers.map((user) => (
              <div key={user.id} className="online-user-card" onClick={() => handleCustomerClick(user)}>
                <div className="online-user-avatar">
                  <span>{user.avatar}</span>
                  <span className="online-indicator"></span>
                </div>
                <p className="online-user-name">{user.name}</p>
                <p className="online-user-role">Customer</p>
              </div>
            ))}
          </div>
          <div className="carousel-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <button className="carousel-arrow prev">‹</button>
          <button className="carousel-arrow next">›</button>
        </div>
      </div>

      {/* Users Section */}
      <div className="users-section">
        <div className="users-header">
          <h3 className="section-title">Users</h3>
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞
            </button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="customers-table-container">
          {filteredCustomers.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              No customers found
            </div>
          ) : (
            <table className="customers-table">
              <thead>
                <tr>
                  <th><span className="th-icon">👤</span> User</th>
                  <th><span className="th-icon">📊</span> Status</th>
                  <th><span className="th-icon">📧</span> Email</th>
                  <th><span className="th-icon">📍</span> Location</th>
                  <th><span className="th-icon">📱</span> Phone</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} onClick={() => handleCustomerClick(customer)}>
                    <td>
                      <div className="customer-info">
                        <div className="customer-avatar-small">
                          <span>{customer.avatar}</span>
                          {customer.status === 'Active' && <span className="status-dot-small"></span>}
                        </div>
                        <div className="customer-details">
                          <p className="customer-name-text">{customer.name}</p>
                          <p className="customer-username">{customer.username}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${customer.status === 'Active' ? 'status-active' : 'status-offline'}`}>
                        <span className="status-dot"></span>
                        {customer.status}
                      </span>
                    </td>
                    <td>{customer.email}</td>
                    <td>
                      <span className="location-text">
                        <span className="location-icon">📍</span>
                        {customer.location}
                      </span>
                    </td>
                    <td>{customer.phone}</td>
                    <td>
                      <button 
                        className="more-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomer(customer.id);
                        }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
        <>
          <div className="modal-overlay" onClick={() => setShowCustomerModal(false)}></div>
          <div className="customer-modal">
            <div className="modal-header">
              <h2>Customer Details</h2>
              <button className="modal-close-btn" onClick={() => setShowCustomerModal(false)}>
                ⊗
              </button>
            </div>
            <div className="modal-body">
              <div className="customer-avatar-section">
                <div className="customer-avatar-large">
                  <span>{selectedCustomer.avatar}</span>
                </div>
                <div className="avatar-actions">
                  <button className="upload-btn">Upload New</button>
                  <button className="delete-avatar-btn">Delete Avatar</button>
                </div>
                {selectedCustomer.statistics && (
                  <div style={{ marginTop: '16px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                    <p><strong>Total Orders:</strong> {selectedCustomer.statistics.totalOrders}</p>
                    <p><strong>Total Spent:</strong> ${selectedCustomer.statistics.totalSpent}</p>
                  </div>
                )}
                <button className="view-history-btn">View Order History</button>
              </div>

              <form className="customer-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input 
                      type="text" 
                      value={selectedCustomer.firstName}
                      onChange={(e) => updateCustomerField('firstName', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      value={selectedCustomer.lastName}
                      onChange={(e) => updateCustomerField('lastName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>E-mail</label>
                    <input 
                      type="email" 
                      value={selectedCustomer.email}
                      onChange={(e) => updateCustomerField('email', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input 
                      type="tel" 
                      value={selectedCustomer.phone}
                      onChange={(e) => updateCustomerField('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <input 
                    type="text" 
                    value={selectedCustomer.address}
                    onChange={(e) => updateCustomerField('address', e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input 
                      type="text" 
                      value={selectedCustomer.city}
                      onChange={(e) => updateCustomerField('city', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input 
                      type="text" 
                      value={selectedCustomer.state}
                      onChange={(e) => updateCustomerField('state', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Country</label>
                    <input 
                      type="text" 
                      value={selectedCustomer.country}
                      onChange={(e) => updateCustomerField('country', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Zip Code</label>
                    <input 
                      type="text" 
                      value={selectedCustomer.zipCode}
                      onChange={(e) => updateCustomerField('zipCode', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Order Note</label>
                  <textarea 
                    value={selectedCustomer.orderNote}
                    onChange={(e) => updateCustomerField('orderNote', e.target.value)}
                    rows="3"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={() => setShowCustomerModal(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="save-btn" 
                    onClick={handleSaveCustomer}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomersPage;