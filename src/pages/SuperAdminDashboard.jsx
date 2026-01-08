import { useState, useEffect } from 'react';
import { superAdminDashboardService } from '../services/dashboardService';
import { ShoppingCart, Package,  Users,  Gift, Mail, Settings,TrendingUp, MoreVertical } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SuperAdminDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [newCustomers, setNewCustomers] = useState([]);

  useEffect(() => {
  loadDashboardData();
}, []);

const loadDashboardData = async () => {
  try {
    setLoading(true);
    
    // Fetch all data in parallel
    const [statsRes, ordersRes, productsRes, customersRes] = await Promise.all([
      superAdminDashboardService.getStats(),
      superAdminDashboardService.getRecentOrders(5),
      superAdminDashboardService.getTopProducts(5),
      superAdminDashboardService.getNewCustomers(5)
    ]);

    if (statsRes.success) {
      setDashboardStats(statsRes.stats);
    }
    
    if (ordersRes.success) {
      setRecentOrders(ordersRes.orders);
    }
    
    if (productsRes.success) {
      setTopSellingProducts(productsRes.products);
    }
    
    if (customersRes.success) {
      setNewCustomers(customersRes.customers);
    }
    
    setError(null);
  } catch (err) {
    setError(err.message);
    console.error('Error loading dashboard:', err);
  } finally {
    setLoading(false);
  }
};

  // Notification data
  const notifications = [
    {
      id: 1,
      user: 'Domenica',
      username: '@domenica',
      avatar: '👨',
      message: 'Comment on Smiles Product',
      time: '1h',
      bgColor: '#fef3c7'
    },
    {
      id: 2,
      user: 'Mahfuzul',
      username: '@mahfuzul',
      avatar: '👩',
      message: 'Replied to your comment on reforest..',
      time: '1d',
      bgColor: '#fed7aa'
    },
    {
      id: 3,
      user: 'Laurel',
      username: '@laurel',
      avatar: '👨',
      message: 'Purchased a Smiles Product',
      time: '2h',
      bgColor: '#dbeafe'
    },
    {
      id: 4,
      user: 'Rosina',
      username: '@rosina',
      avatar: '👨',
      message: 'Just made a purchase of 5 Coconut Crunches Bites.',
      time: '4h',
      bgColor: '#bfdbfe'
    },
    {
      id: 5,
      user: 'Domenica',
      username: '@domenica',
      avatar: '👨',
      message: 'Comment on Smiles Product',
      time: '1h',
      bgColor: '#fef3c7'
    }
  ];

  // Stats data
  const statsData = dashboardStats ? [
  {
    title: 'Total Revenue',
    value: `$${dashboardStats.revenue?.total?.toLocaleString() || 0}`,
    change: '22.45%',
    icon: <TrendingUp size={20} />,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    isIncrease: true
  },
  {
    title: 'Orders',
    value: dashboardStats.overview?.totalOrders?.toLocaleString() || '0',
    change: '15.34%',
    icon: <ShoppingCart size={20} />,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    isIncrease: true
  },
  {
    title: 'Total Products',
    value: dashboardStats.overview?.totalProducts?.toLocaleString() || '0',
    change: '10.24%',
    icon: <Package size={20} />,
    color: '#f59e0b',
    bgColor: '#fef3c7',
    isIncrease: true,
    hasChart: true,
    chartColor: '#f59e0b'
  },
  {
    title: 'Total Customers',
    value: dashboardStats.overview?.totalCustomers?.toLocaleString() || '0',
    change: '15.34%',
    icon: <Users size={20} />,
    color: '#10b981',
    bgColor: '#d1fae5',
    isIncrease: true,
    hasChart: true,
    chartColor: '#10b981'
  },
  {
    title: 'Products In Stock',
    value: dashboardStats.overview?.productsInStock?.toLocaleString() || '0',
    change: '22.45%',
    icon: <Package size={20} />,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    isIncrease: true,
    hasChart: true,
    chartColor: '#3b82f6'
  }
] : [];
  // Orders Over Time Chart Data
  const ordersOverTimeData = {
    labels: ['4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12am', '1pm', '2pm', '3pm'],
    datasets: [
      {
        label: 'May 21',
        data: [25, 10, 15, 20, 30, 28, 35, 15, 25, 40, 35, 45],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        label: 'May 22',
        data: [10, 8, 18, 15, 25, 20, 45, 35, 30, 25, 30, 40],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
      }
    ]
  };

  const ordersOverTimeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#10b981',
        padding: 12,
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#10b981',
        borderWidth: 0,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return '34 Orders';
          },
          label: function(context) {
            return 'May 22, 8:00AM';
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          color: '#f3f4f6',
          borderDash: [5, 5]
        },
        ticks: {
          color: '#9ca3af',
          stepSize: 10
        },
        min: 0,
        max: 50
      }
    }
  };

  // Last 7 Days Sales Chart Data
  const last7DaysSalesData = {
    labels: ['12', '13', '14', '15', '16', '17', '18'],
    datasets: [
      {
        label: 'Sales',
        data: [1800, 2100, 2400, 1900, 2525, 2300, 2600],
        backgroundColor: '#10b981',
        borderRadius: 8,
        barThickness: 40,
      }
    ]
  };

  const last7DaysSalesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 12,
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          label: function(context) {
            return '$' + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        display: false
      }
    }
  };

  // Recent Transactions Data
  const recentTransactions = recentOrders.map(order => ({
  name: order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'N/A',
  date: new Date(order.orderDate).toLocaleDateString('en-US', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }),
  amount: `$${order.totalAmount?.toFixed(2) || '0.00'}`,
  status: order.orderStatus === 'Delivered' ? 'Paid' : 'Pending'
}));

  // Top Products Data
  const topProducts = topSellingProducts.map(product => ({
  name: product.name,
  price: `$${product.revenue?.toFixed(2) || '0.00'}`,
  units: product.totalSold || 0,
  image: product.image || '📦'
}));

 

  if (loading) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ 
        width: '50px', 
        height: '50px', 
        border: '4px solid #f3f4f6',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p>Loading dashboard...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

if (error) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '16px',
      color: '#dc2626'
    }}>
      <p>Error loading dashboard: {error}</p>
      <button 
        onClick={loadDashboardData}
        style={{ 
          padding: '8px 16px',
          background: '#3b82f6',
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
    <>
        {/* Page Title */}
        <div className="page-title-section">
          <h1 className="page-title">Dashboard</h1>
          <button className="manage-btn">
            <Settings size={18} />
            Manage
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-header">
                <div className="stat-info">
                  <p className="stat-title">{stat.title}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                  <div className="stat-change">
                    <span className={stat.isIncrease ? 'increase' : 'decrease'}>
                      {stat.change} {stat.isIncrease ? '↑' : '↓'}
                    </span>
                  </div>
                </div>
                {stat.hasChart && (
                  <div className="stat-mini-chart">
                    <div className="mini-bars">
                      <div className="mini-bar" style={{ height: '40%', backgroundColor: stat.chartColor }}></div>
                      <div className="mini-bar" style={{ height: '60%', backgroundColor: stat.chartColor }}></div>
                      <div className="mini-bar" style={{ height: '80%', backgroundColor: stat.chartColor }}></div>
                      <div className="mini-bar" style={{ height: '100%', backgroundColor: stat.chartColor }}></div>
                      <div className="mini-bar" style={{ height: '70%', backgroundColor: stat.chartColor }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="charts-row">
          {/* Orders Over Time */}
          <div className="chart-card large-chart">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Orders Over Time</h3>
                <div className="chart-stats">
                  <div className="chart-stat-item">
                    <span className="stat-number">645</span>
                    <span className="stat-label">Orders on May 22</span>
                  </div>
                  <div className="chart-stat-item">
                    <span className="stat-number">472</span>
                    <span className="stat-label">Orders on May 21</span>
                  </div>
                </div>
              </div>
              <select className="time-filter">
                <option>Last 12 Hours</option>
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
              </select>
            </div>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#f97316' }}></span>
                May 21
              </span>
              <span className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#10b981' }}></span>
                May 22
              </span>
            </div>
            <div className="chart-wrapper">
              <Line data={ordersOverTimeData} options={ordersOverTimeOptions} />
            </div>
          </div>

          {/* Last 7 Days Sales */}
          <div className="chart-card small-chart">
            <h3 className="chart-title">Last 7 Days Sales</h3>
            <div className="sales-stats">
              <div className="sales-stat">
                <span className="sales-number">1,259</span>
                <span className="sales-label">Items Sold</span>
              </div>
              <div className="sales-stat">
                <span className="sales-number">$12,546</span>
                <span className="sales-label">Revenue</span>
              </div>
            </div>
            <div className="chart-wrapper small">
              <Bar data={last7DaysSalesData} options={last7DaysSalesOptions} />
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="tables-row">
          {/* Recent Transactions */}
          <div className="table-card">
            <h3 className="table-title">Recent Transactions</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                    {recentTransactions.length === 0 ? (
                        <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                            No transactions yet
                        </td>
                        </tr>
                         ) : (
                    recentTransactions.map((transaction, index) => (
                    <tr key={index}>
                        <td className="name-cell">{transaction.name}</td>
                        <td className="date-cell">{transaction.date}</td>
                        <td className="amount-cell">{transaction.amount}</td>
                        <td>
                        <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                            {transaction.status}
                        </span>
                        </td>
                    </tr>
                            ))
                        )}
                        </tbody>

              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="table-card">
            <h3 className="table-title">Top Products by Units Sold</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Units Sold</th>
                  </tr>
                </thead>
               <tbody>
                 {topProducts.length === 0 ? (
                        <tr>
                        <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                            No products data yet
                        </td>
                        </tr>
                         ) : (
                    topProducts.map((product, index) => (
                    <tr key={index}>
                        <td className="product-cell">
                        <span className="product-image">{product.image}</span>
                        <span className="product-name">{product.name}</span>
                        </td>
                        <td className="price-cell">{product.price}</td>
                        <td className="units-cell">{product.units}</td>
                    </tr>
                    ))
                )}
                </tbody>

              </table>
            </div>
          </div>
        </div>
    

      {/* Notification Popup */}
      {showNotifications && (
        <>
          <div className="notification-overlay" onClick={() => setShowNotifications(false)}></div>
          <div className="notification-popup">
            <div className="notification-header">
              <h3>Notifications</h3>
              <button className="notification-menu-btn">
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="notification-list">
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  <div 
                    className="notification-avatar" 
                    style={{ backgroundColor: notification.bgColor }}
                  >
                    {notification.avatar}
                  </div>
                  <div className="notification-content">
                    <div className="notification-user">
                      <span className="notification-name">{notification.user}</span>
                      <span className="notification-username">{notification.username}</span>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                  </div>
                  <span className="notification-time">{notification.time}</span>
                </div>
              ))}
            </div>

            <button className="notification-see-all">
              See all notifications
            </button>
          </div>
        </>
      )}
    </>
  );
}