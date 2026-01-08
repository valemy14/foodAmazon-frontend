import { useState } from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Eye, Edit, Trash2, Search, Download, Plus } from 'lucide-react';


export default function SuperAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample data
  const stats = [
    { icon: <Users size={24} />, label: 'Total Users', value: '2,547', change: '+12%', color: '#3b82f6' },
    { icon: <Package size={24} />, label: 'Products', value: '1,834', change: '+8%', color: '#10b981' },
    { icon: <ShoppingCart size={24} />, label: 'Orders', value: '4,921', change: '+23%', color: '#f59e0b' },
    { icon: <DollarSign size={24} />, label: 'Revenue', value: '$124,580', change: '+18%', color: '#8b5cf6' }
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', product: 'Wireless Headphones', amount: '$199', status: 'completed', date: '2026-01-04' },
    { id: '#ORD-002', customer: 'Jane Smith', product: 'Smart Watch', amount: '$349', status: 'pending', date: '2026-01-04' },
    { id: '#ORD-003', customer: 'Mike Johnson', product: 'Laptop Stand', amount: '$79', status: 'completed', date: '2026-01-03' },
    { id: '#ORD-004', customer: 'Sarah Williams', product: 'USB-C Hub', amount: '$45', status: 'cancelled', date: '2026-01-03' },
    { id: '#ORD-005', customer: 'Tom Brown', product: 'Mechanical Keyboard', amount: '$159', status: 'pending', date: '2026-01-02' }
  ];

  const products = [
    { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: '$199', stock: 45, status: 'active' },
    { id: 2, name: 'Smart Watch', category: 'Wearables', price: '$349', stock: 23, status: 'active' },
    { id: 3, name: 'Laptop Stand', category: 'Accessories', price: '$79', stock: 67, status: 'active' },
    { id: 4, name: 'USB-C Hub', category: 'Accessories', price: '$45', stock: 0, status: 'inactive' },
    { id: 5, name: 'Mechanical Keyboard', category: 'Electronics', price: '$159', stock: 34, status: 'active' }
  ];

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'active', joined: '2025-11-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Distributor', status: 'active', joined: '2025-10-22' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Customer', status: 'active', joined: '2025-12-05' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Admin', status: 'active', joined: '2025-09-18' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'Customer', status: 'inactive', joined: '2025-08-30' }
  ];

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'status-badge status-completed',
      pending: 'status-badge status-pending',
      cancelled: 'status-badge status-cancelled',
      active: 'status-badge status-active',
      inactive: 'status-badge status-inactive'
    };
    return statusClasses[status] || 'status-badge';
  };

  return (
    <div className="super-admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Super Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <TrendingUp size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={20} />
            <span>Orders</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={20} />
            <span>Products</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} />
            <span>Users</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="content-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="header-actions">
            <button className="btn-secondary">
              <Download size={18} />
              Export
            </button>
            <button className="btn-primary">
              <Plus size={18} />
              Add New
            </button>
          </div>
        </header>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-details">
                    <p className="stat-label">{stat.label}</p>
                    <h3 className="stat-value">{stat.value}</h3>
                    <span className="stat-change">{stat.change} from last month</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="section-card">
              <div className="section-header">
                <h2>Recent Orders</h2>
                <button className="btn-link">View All</button>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="font-medium">{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.product}</td>
                        <td className="font-medium">{order.amount}</td>
                        <td>
                          <span className={getStatusBadge(order.status)}>
                            {order.status}
                          </span>
                        </td>
                        <td>{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-content">
            <div className="filters-bar">
              <div className="search-box">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="section-card">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="font-medium">{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.product}</td>
                        <td className="font-medium">{order.amount}</td>
                        <td>
                          <span className={getStatusBadge(order.status)}>
                            {order.status}
                          </span>
                        </td>
                        <td>{order.date}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-icon" title="View">
                              <Eye size={16} />
                            </button>
                            <button className="btn-icon" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button className="btn-icon btn-icon-danger" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="products-content">
            <div className="filters-bar">
              <div className="search-box">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select className="filter-select">
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="wearables">Wearables</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div className="section-card">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="font-medium">{product.name}</td>
                        <td>{product.category}</td>
                        <td className="font-medium">{product.price}</td>
                        <td>{product.stock > 0 ? product.stock : <span style={{color: '#ef4444'}}>Out of stock</span>}</td>
                        <td>
                          <span className={getStatusBadge(product.status)}>
                            {product.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-icon" title="View">
                              <Eye size={16} />
                            </button>
                            <button className="btn-icon" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button className="btn-icon btn-icon-danger" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="users-content">
            <div className="filters-bar">
              <div className="search-box">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select className="filter-select">
                <option value="all">All Roles</option>
                <option value="customer">Customer</option>
                <option value="distributor">Distributor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="section-card">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="font-medium">{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <span className={getStatusBadge(user.status)}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.joined}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-icon" title="View">
                              <Eye size={16} />
                            </button>
                            <button className="btn-icon" title="Edit">
                              <Edit size={16} />
                            </button>
                            <button className="btn-icon btn-icon-danger" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}