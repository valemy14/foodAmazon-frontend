import { useState, useEffect } from 'react';
import { couponService } from '../services/couponService';
import {    Search,  Edit2, Trash2, Tag, Truck } from 'lucide-react';

export default function SuperAdminCouponsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCoupons, setSelectedCoupons] = useState([]);


  const tabs = [
    { id: 'all', label: 'All Coupons' },
    { id: 'active', label: 'Active Coupons' },
    { id: 'expired', label: 'Expired Coupons' }
  ];

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
  loadCoupons();
}, []);

const loadCoupons = async () => {
  try {
    setLoading(true);
    const response = await couponService.getAllCoupons();
    
    if (response.success) {
      setCoupons(response.coupons);
      setError(null);
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError(err.message);
    console.error('Error loading coupons:', err);
  } finally {
    setLoading(false);
  }
};

const filteredCoupons = coupons.filter(coupon => {
  if (!coupon) return false;
  
  const matchesSearch = coupon.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       coupon.description?.toLowerCase().includes(searchTerm.toLowerCase());
  
  const matchesTab = activeTab === 'all' || 
                    (activeTab === 'active' && coupon.status === 'active') ||
                    (activeTab === 'expired' && coupon.status === 'expired');
  
  return matchesSearch && matchesTab;
});

const handleDeleteSelected = async () => {
  if (selectedCoupons.length === 0) {
    alert('Please select coupons to delete');
    return;
  }

  if (!window.confirm(`Delete ${selectedCoupons.length} coupon(s)?`)) {
    return;
  }

  try {
    setDeleteLoading(true);
    
    const results = await Promise.all(
      selectedCoupons.map(id => couponService.deleteCoupon(id))
    );
    
    const allSuccess = results.every(r => r.success);
    
    if (allSuccess) {
      setSelectedCoupons([]);
      loadCoupons(); // Refresh list
      alert('Coupons deleted successfully!');
    } else {
      alert('Some coupons could not be deleted');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    setDeleteLoading(false);
  }
};

const handleToggleStatus = async (couponId) => {
  try {
    const response = await couponService.toggleCouponStatus(couponId);
    
    if (response.success) {
      loadCoupons(); // Refresh list
      alert(response.message);
    } else {
      alert('Error: ' + response.error);
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
};


  const toggleCouponSelection = (couponId, e) => {
  e.stopPropagation();
  setSelectedCoupons(prev => 
    prev.includes(couponId) 
      ? prev.filter(id => id !== couponId)
      : [...prev, couponId]
  );
};

  const toggleSelectAll = () => {
  setSelectedCoupons(
    selectedCoupons.length === coupons.length 
      ? [] 
      : coupons.map(c => c._id) // Changed from c.id to c._id
  );
};

if (loading) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div>Loading coupons...</div>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', color: 'red' }}>
        Error: {error}
        <button onClick={loadCoupons} style={{ marginLeft: '10px', padding: '8px 16px' }}>
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
          <h1 className="page-title">Coupons</h1>
          <button className="create-coupon-btn">
            + Create
          </button>
        </div>

        {/* Tabs */}
        <div className="coupons-tabs">
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
              <option>Active</option>
              <option>Expired</option>
              <option>By Usage</option>
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
              <Edit2 size={18} />
            </button>
           <button className="action-icon-btn delete" onClick={handleDeleteSelected} disabled={deleteLoading}>
                <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="coupons-table-card">
          <div className="table-wrapper">
            <table className="coupons-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedCoupons.length === coupons.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Coupon Name</th>
                  <th>Usage</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                    {filteredCoupons.length === 0 ? (
                    <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                        No coupons found
                    </td>
                    </tr>
                         ) : (
                    filteredCoupons.map((coupon) => (
                    <tr key={coupon._id} className="coupon-row">
                        <td onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            checked={selectedCoupons.includes(coupon._id)}
                            onChange={(e) => toggleCouponSelection(coupon._id, e)}
                        />
                        </td>
                        <td className="coupon-name-cell">
                        <div className="coupon-info">
                            <div 
                            className="coupon-icon" 
                            style={{ backgroundColor: coupon.discountType === 'percentage' ? '#10b981' : '#6366f1' }}
                            >
                            {coupon.discountType === 'percentage' ? <Tag size={20} /> : <Truck size={20} />}
                            </div>
                            <div className="coupon-details">
                            <span className="coupon-name">{coupon.description || 'No description'}</span>
                            <span className="coupon-code">{coupon.code}</span>
                            </div>
                        </div>
                        </td>
                        <td className="usage-cell">{coupon.usedCount || 0} times</td>
                        <td>
                        <span 
                            className={`status-badge ${coupon.status.toLowerCase()}`}
                            onClick={() => handleToggleStatus(coupon._id)}
                            style={{ cursor: 'pointer' }}
                        >
                            {coupon.status}
                        </span>
                        </td>
                        <td className="date-cell">
                        {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}
                        </td>
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
              <span className="results-count">{filteredCoupons.length} Results</span>
            </div>
          </div>
        </div>
     
    </>
  );
}