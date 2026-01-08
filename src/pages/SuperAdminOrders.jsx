import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { Search, ChevronDown, Edit, Trash2 } from 'lucide-react';


export default function SuperAdminOrders() {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
  fetchOrders();
}, []);

const fetchOrders = async () => {
  try {
    setLoading(true);
    const response = await orderService.getAllOrders();
    
    if (response.success) {
      setOrders(response.orders);
      setError(null);
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError(err.message);
    console.error('Error:', err);
  } finally {
    setLoading(false);
  }
};

  const totalResults = 274;
  const totalPages = 24;

  const handleSelectAll = (e) => {
  if (e.target.checked) {
    setSelectedOrders(orders.map(order => order._id)); // Use _id not id
  } else {
    setSelectedOrders([]);
  }
};

  const handleSelectOrder = (orderId) => {
  if (selectedOrders.includes(orderId)) {
    setSelectedOrders(selectedOrders.filter(id => id !== orderId));
  } else {
    setSelectedOrders([...selectedOrders, orderId]);
  }
};

    const handleUpdateStatus = async (orderId, newStatus) => {
  try {
    const response = await orderService.updateOrderStatus(orderId, newStatus);
    
    if (response.success) {
      fetchOrders(); // Refresh the list
      alert('Status updated successfully!');
    } else {
      alert('Error: ' + response.error);
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
};

    const handleDeleteSelected = async () => {
  if (selectedOrders.length === 0) {
    return alert('Please select orders to delete');
  }
  
  if (!window.confirm(`Delete ${selectedOrders.length} order(s)?`)) {
    return;
  }

  try {
    const results = await Promise.all(
      selectedOrders.map(id => orderService.deleteOrder(id))
    );
    
    const allSuccess = results.every(r => r.success);
    
    if (allSuccess) {
      fetchOrders(); // Refresh the list
      setSelectedOrders([]);
      alert('Orders deleted successfully!');
    } else {
      alert('Some orders could not be deleted');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
};

  const getPaymentStatusClass = (status) => {
    return status.toLowerCase() === 'paid' ? 'status-paid' : 'status-pending';
  };

  const getOrderStatusClass = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'ready') return 'order-status-ready';
    if (statusLower === 'shipped') return 'order-status-shipped';
    if (statusLower === 'received') return 'order-status-received';
    return 'order-status-ready';
  };

 const filteredOrders = orders.filter(order => {
  const customerName = `${order.customerSnapshot?.firstName || ''} ${order.customerSnapshot?.lastName || ''}`.toLowerCase();
  const orderId = order._id?.toLowerCase() || '';
  return customerName.includes(searchTerm.toLowerCase()) || orderId.includes(searchTerm.toLowerCase());
});

// At the very start of return statement:
if (loading) {
  return (
    <div className="orders-page">
      <div style={{ padding: '40px', textAlign: 'center' }}>
        Loading orders...
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="orders-page">
      <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
        Error: {error}
        <button onClick={fetchOrders} style={{ marginLeft: '10px', padding: '8px 16px' }}>
          Retry
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="orders-title">Orders</h1>
        <div className="orders-actions">
          <button className="export-btn">Export</button>
          <button className="add-order-btn">+ Add Order</button>
        </div>
      </div>

      <div className="orders-filters">
        <div className="filter-dropdown">
          <button className="filter-btn">
            Filter
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="bulk-actions">
            <button className="action-icon-btn edit-btn">
                <Edit size={18} />
            </button>

            <button
                className="action-icon-btn delete-btn"
                onClick={handleDeleteSelected}
                title="Delete selected orders"
            >
                <Trash2 size={18} />
            </button>
        </div>

      </div>

    {filteredOrders.map((order) => (
    <tr key={order._id}>
        <td className="checkbox-col">
        <input
            type="checkbox"
            checked={selectedOrders.includes(order._id)}
            onChange={() => handleSelectOrder(order._id)}
        />
        </td>
        <td className="order-id">#{order._id.slice(-8).toUpperCase()}</td>
        <td className="order-date">
        {new Date(order.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        })}
        </td>
        <td className="order-customer">
        {order.customerSnapshot?.firstName} {order.customerSnapshot?.lastName}
        </td>
        <td>
        <span className={`payment-status ${getPaymentStatusClass(order.paymentStatus)}`}>
            {order.paymentStatus}
        </span>
        </td>
        <td>
        <select 
            value={order.deliveryStatus}
            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
            className={`order-status ${getOrderStatusClass(order.deliveryStatus)}`}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
        </select>
        </td>
        <td className="order-total">${order.totalAmount.toFixed(2)}</td>
    </tr>
    ))}
      <div className="pagination">
        <button 
          className="pagination-btn"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          ←
        </button>
        
        <button className={`pagination-number ${currentPage === 1 ? 'active' : ''}`} onClick={() => setCurrentPage(1)}>
          1
        </button>
        <button className={`pagination-number ${currentPage === 2 ? 'active' : ''}`} onClick={() => setCurrentPage(2)}>
          2
        </button>
        <button className={`pagination-number ${currentPage === 3 ? 'active' : ''}`} onClick={() => setCurrentPage(3)}>
          3
        </button>
        <button className={`pagination-number ${currentPage === 4 ? 'active' : ''}`} onClick={() => setCurrentPage(4)}>
          4
        </button>
        <button className={`pagination-number ${currentPage === 5 ? 'active' : ''}`} onClick={() => setCurrentPage(5)}>
          5
        </button>
        <button className={`pagination-number ${currentPage === 6 ? 'active' : ''}`} onClick={() => setCurrentPage(6)}>
          6
        </button>
        
        <span className="pagination-dots">...</span>
        
        <button className="pagination-number" onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </button>
        
        <button 
          className="pagination-btn"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          →
        </button>

        <span className="pagination-results">{totalResults} Results</span>
      </div>
    </div>
  );
}
