import { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Tag, Truck } from 'lucide-react';
import { couponService } from '../services/couponService';

export default function CouponListPage({ onCreateCoupon }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  
  // API States
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'all', label: 'All Coupons' },
    { id: 'active', label: 'Active Coupons' },
    { id: 'expired', label: 'Expired Coupons' }
  ];

  // Load coupons on mount
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

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      const response = await couponService.deleteCoupon(couponId);
      
      if (response.success) {
        loadCoupons();
        alert('Coupon deleted successfully!');
      } else {
        alert('Error: ' + response.error);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedCoupons.length === 0) {
      alert('Please select coupons to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedCoupons.length} coupon(s)?`)) {
      return;
    }

    try {
      // Delete all selected coupons
      await Promise.all(
        selectedCoupons.map(id => couponService.deleteCoupon(id))
      );
      
      setSelectedCoupons([]);
      loadCoupons();
      alert('Coupons deleted successfully!');
    } catch (err) {
      alert('Error deleting coupons: ' + err.message);
    }
  };

  // Filter coupons based on active tab
  const getFilteredCoupons = () => {
    if (activeTab === 'active') {
      return coupons.filter(c => c.status === 'Active' || c.status === 'active');
    } else if (activeTab === 'expired') {
      return coupons.filter(c => c.status === 'Expired' || c.status === 'expired');
    }
    return coupons;
  };

  const filteredCoupons = getFilteredCoupons();

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
      selectedCoupons.length === filteredCoupons.length 
        ? [] 
        : filteredCoupons.map(c => c._id)
    );
  };

  // Helper to get icon color based on coupon type
  const getIconColor = (coupon) => {
    if (coupon.discountType === 'free-shipping') {
      return '#6366f1';
    }
    return '#10b981';
  };

  // Helper to get icon based on coupon type
  const getCouponIcon = (coupon) => {
    if (coupon.discountType === 'free-shipping') {
      return <Truck size={20} />;
    }
    return <Tag size={20} />;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div>Loading coupons...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
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
    <div style={{ padding: '24px' }}>
      {/* Page Title */}
      <div className="page-title-section">
        <h1 className="page-title">Coupons</h1>
        <button className="create-coupon-btn" onClick={onCreateCoupon}>
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
          <button 
            className="action-icon-btn delete"
            onClick={handleDeleteSelected}
            disabled={selectedCoupons.length === 0}
          >
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
                    checked={selectedCoupons.length === filteredCoupons.length && filteredCoupons.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Coupon Name</th>
                <th>Usage</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    No coupons found. Create your first coupon!
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
                          style={{ backgroundColor: getIconColor(coupon) }}
                        >
                          {getCouponIcon(coupon)}
                        </div>
                        <div className="coupon-details">
                          <span className="coupon-name">{coupon.description}</span>
                          <span className="coupon-code">{coupon.code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="usage-cell">{coupon.usedCount || 0} times</td>
                    <td>
                      <span className={`status-badge ${(coupon.status || '').toLowerCase()}`}>
                        {coupon.status || 'Active'}
                      </span>
                    </td>
                    <td className="date-cell">
                      {coupon.startDate && coupon.endDate 
                        ? `${new Date(coupon.startDate).toLocaleDateString()} - ${new Date(coupon.endDate).toLocaleDateString()}`
                        : 'No expiration'
                      }
                    </td>
                    <td>
                      <button 
                        className="action-icon-btn delete"
                        onClick={() => handleDeleteCoupon(coupon._id)}
                      >
                        <Trash2 size={16} />
                      </button>
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
            <button className="pagination-number active">1</button>
            <button className="pagination-arrow">→</button>
          </div>
          <div className="pagination-right">
            <span className="results-count">{filteredCoupons.length} Results</span>
          </div>
        </div>
      </div>

      <style>{`
        .page-title-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 600;
          margin: 0;
        }

        .create-coupon-btn {
          padding: 10px 20px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .create-coupon-btn:hover {
          background: #1d4ed8;
        }

        .coupons-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .tab-btn {
          padding: 12px 24px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: #2563eb;
        }

        .tab-btn.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
        }

        .filter-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .filter-left {
          display: flex;
          gap: 12px;
        }

        .filter-dropdown {
          padding: 8px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
        }

        .table-search-bar {
          position: relative;
        }

        .table-search-bar .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .table-search-bar input {
          padding: 8px 8px 8px 36px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          width: 250px;
        }

        .filter-right {
          display: flex;
          gap: 8px;
        }

        .action-icon-btn {
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-icon-btn:hover:not(:disabled) {
          background: #f3f4f6;
        }

        .action-icon-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .action-icon-btn.delete {
          color: #dc2626;
        }

        .coupons-table-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .coupons-table {
          width: 100%;
          border-collapse: collapse;
        }

        .coupons-table thead {
          background: #f9fafb;
        }

        .coupons-table th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          color: #6b7280;
        }

        .coupons-table td {
          padding: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .coupon-row {
          cursor: pointer;
          transition: background 0.2s;
        }

        .coupon-row:hover {
          background: #f9fafb;
        }

        .coupon-name-cell {
          min-width: 300px;
        }

        .coupon-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .coupon-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .coupon-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .coupon-name {
          font-weight: 500;
          color: #1a1a1a;
        }

        .coupon-code {
          font-size: 13px;
          color: #6b7280;
        }

        .usage-cell {
          color: #6b7280;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #16a34a;
        }

        .status-badge.expired {
          background: #fee2e2;
          color: #dc2626;
        }

        .date-cell {
          color: #6b7280;
          font-size: 14px;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
        }

        .pagination-left {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .pagination-arrow,
        .pagination-number {
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .pagination-arrow:hover,
        .pagination-number:hover {
          background: #f3f4f6;
        }

        .pagination-number.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .pagination-dots {
          color: #9ca3af;
        }

        .results-count {
          font-size: 14px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}