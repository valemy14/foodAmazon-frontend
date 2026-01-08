import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // API State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Fetch orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  // ==========================================
  // LOAD ALL ORDERS
  // ==========================================
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await orderService.getAllOrders();
      
      if (result.success) {
        setOrders(result.orders);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error('Load orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const result = await orderService.updateOrderStatus(orderId, newStatus);
      
      if (result.success) {
        alert('Order status updated successfully!');
        loadOrders(); // Reload orders
      } else {
        alert('Failed to update order: ' + result.error);
      }
    } catch (err) {
      alert('Error updating order');
      console.error('Update order error:', err);
    }
  };

  // ==========================================
  // VIEW ORDER DETAILS
  // ==========================================
  const handleViewOrder = async (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // ==========================================
  // FILTER ORDERS BY TAB
  // ==========================================
  const getFilteredOrders = () => {
    switch(activeTab) {
      case 'pending':
        return orders.filter(order => 
          order.deliveryStatus === 'pending' || order.deliveryStatus === 'processing'
        );
      case 'delivered':
        return orders.filter(order => order.deliveryStatus === 'delivered');
      case 'cancelled':
        return orders.filter(order => order.deliveryStatus === 'cancelled');
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();

  // ==========================================
  // STATUS STYLING
  // ==========================================
  const getStatusClass = (status) => {
    switch(status) {
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      case 'pending':
      case 'processing':
        return 'status-pending';
      case 'shipped':
        return 'status-shipped';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered':
        return '✓';
      case 'cancelled':
        return '✕';
      case 'pending':
      case 'processing':
        return '◷';
      case 'shipped':
        return '📦';
      default:
        return '';
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (loading && orders.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        fontSize: '18px'
      }}>
        Loading orders...
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================
  if (error && orders.length === 0) {
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
          onClick={loadOrders}
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
    <div className="orders-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Orders</h1>
        <button 
          onClick={loadOrders}
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
      <div className="orders-tabs">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Orders ({orders.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Orders ({orders.filter(o => o.deliveryStatus === 'pending' || o.deliveryStatus === 'processing').length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'delivered' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered Orders ({orders.filter(o => o.deliveryStatus === 'delivered').length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled Orders ({orders.filter(o => o.deliveryStatus === 'cancelled').length})
        </button>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        {filteredOrders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            No orders found
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th><span className="th-icon">☰</span> Order ID</th>
                <th><span className="th-icon">📅</span> Ordered Date</th>
                <th><span className="th-icon">👤</span> Customer</th>
                <th><span className="th-icon">💰</span> Total Amount</th>
                <th><span className="th-icon">📍</span> Location</th>
                <th><span className="th-icon">📊</span> Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} onClick={() => handleViewOrder(order)} style={{ cursor: 'pointer' }}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.customerSnapshot.firstName} {order.customerSnapshot.lastName}</td>
                  <td>{formatCurrency(order.totalAmount)}</td>
                  <td>{order.customerSnapshot.city}, {order.customerSnapshot.state}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.deliveryStatus)}`}>
                      <span className="status-icon">{getStatusIcon(order.deliveryStatus)}</span>
                      {order.deliveryStatus}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select 
                      value={order.deliveryStatus}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        fontSize: '13px'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <div className="pagination-info">
          Showing 1 to {Math.min(10, filteredOrders.length)} of {filteredOrders.length} Items
        </div>
        <div className="pagination">
          <button className="pagination-btn" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>
            ‹
          </button>
          {[1, 2, 3, 4, 5].map(num => (
            <button 
              key={num}
              className={`pagination-btn ${currentPage === num ? 'active' : ''}`}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}
          <button className="pagination-btn" onClick={() => setCurrentPage(prev => Math.min(5, prev + 1))}>
            ›
          </button>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <>
          <div className="modal-overlay" onClick={() => setShowOrderDetails(false)}></div>
          <div className="order-details-modal" style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            zIndex: 1000,
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Order Details</h2>
              <button onClick={() => setShowOrderDetails(false)} style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer'
              }}>×</button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Order ID:</strong> #{selectedOrder._id.slice(-6)}</p>
              <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
              <p><strong>Customer:</strong> {selectedOrder.customerSnapshot.firstName} {selectedOrder.customerSnapshot.lastName}</p>
              <p><strong>Email:</strong> {selectedOrder.customerSnapshot.email}</p>
              <p><strong>Phone:</strong> {selectedOrder.customerSnapshot.phoneNumber}</p>
              <p><strong>Address:</strong> {selectedOrder.customerSnapshot.address}, {selectedOrder.customerSnapshot.city}, {selectedOrder.customerSnapshot.state}</p>
              <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
              <p><strong>Delivery Status:</strong> {selectedOrder.deliveryStatus}</p>
            </div>

            <h3 style={{ marginBottom: '10px' }}>Order Items:</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Product</th>
                  <th style={{ textAlign: 'center', padding: '8px' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '8px' }}>Price</th>
                  <th style={{ textAlign: 'right', padding: '8px' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '8px' }}>{item.name}</td>
                    <td style={{ textAlign: 'center', padding: '8px' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', padding: '8px' }}>{formatCurrency(item.price)}</td>
                    <td style={{ textAlign: 'right', padding: '8px' }}>{formatCurrency(item.subTotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid #e5e7eb' }}>
                  <td colSpan="3" style={{ textAlign: 'right', padding: '12px', fontWeight: 'bold' }}>Total:</td>
                  <td style={{ textAlign: 'right', padding: '12px', fontWeight: 'bold' }}>{formatCurrency(selectedOrder.totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;