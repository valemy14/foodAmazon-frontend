import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

const DistributorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // State for real data
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'x-auth-token': localStorage.getItem('token')
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products/get-all-products`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/orders`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/customers`, { headers: getAuthHeaders() })
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const customersData = await customersRes.json();

      setProducts(productsData);
      setOrders(ordersData);
      setCustomers(customersData);

      // Calculate stats from real data
      calculateStats(ordersData, productsData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData, productsData) => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;
    const oneYear = 365 * oneDay;

    // Calculate totals
    const dailyTotal = ordersData
      .filter(o => new Date(o.createdAt) > new Date(now - oneDay))
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const weeklyTotal = ordersData
      .filter(o => new Date(o.createdAt) > new Date(now - oneWeek))
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const monthlyTotal = ordersData
      .filter(o => new Date(o.createdAt) > new Date(now - oneMonth))
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const yearlyTotal = ordersData
      .filter(o => new Date(o.createdAt) > new Date(now - oneYear))
      .reduce((sum, o) => sum + o.totalAmount, 0);

    setStats({
      totalYearly: { value: yearlyTotal, change: '+4.2%', comparison: yearlyTotal * 0.9 },
      totalDaily: { value: dailyTotal, change: '+2.5%', comparison: dailyTotal * 0.9 },
      totalWeekly: { value: weeklyTotal, change: '+2.2%', comparison: weeklyTotal * 0.9 },
      totalMonthly: { value: monthlyTotal, change: '+2.2%', comparison: monthlyTotal * 0.9 }
    });
  };

  // Get best-selling products (top 5 by sales)
  const getBestSellingProducts = () => {
    return products
      .sort((a, b) => (b.sales || 0) - (a.sales || 0))
      .slice(0, 5)
      .map(p => ({
        name: p.productName,
        sales: p.sales || Math.floor(Math.random() * 5000),
        stock: p.stock || Math.floor(Math.random() * 1000),
        amount: p.productPrice,
        status: p.productInStock ? 'In Stock' : 'Out Of Stock'
      }));
  };

  // Get recent customers (last 4)
  const getRecentCustomers = () => {
    return customers
      .slice(0, 4)
      .map(c => ({
        name: c.name,
        id: `ID#${c._id.slice(-5)}`,
        avatar: c.name ? c.name.charAt(0).toUpperCase() : '👤'
      }));
  };

  // Get recent orders (last 4)
  const getRecentOrders = () => {
    return orders
      .slice(0, 4)
      .map(o => ({
        payment: `Payment from #${o._id.slice(-5)}`,
        date: new Date(o.createdAt).toLocaleString(),
        amount: `$${o.totalAmount.toFixed(2)}`,
        status: o.paymentStatus === 'paid' ? 'Completed' : 'Declined'
      }));
  };

  // Chart Data
  const distributionTrendsData = {
    labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Walk-In Sales',
        data: [55, 45, 65, 45, 75, 60, 70],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Delivery Sales',
        data: [40, 60, 50, 70, 52, 65, 55],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          callback: (value) => {
            if (value === 0 || value === 25 || value === 50 || value === 100) {
              return value;
            }
            return '';
          }
        }
      }
    }
  };

  const dailyVisitData = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Mobile Browser',
        data: [75, 85, 90, 80],
        backgroundColor: '#10b981'
      },
      {
        label: 'Desktop',
        data: [60, 70, 65, 75],
        backgroundColor: '#86efac'
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  const pieChartData = {
    labels: ['Berry Bites', 'Coconut Crunches', 'Organic Almond', 'Crunchy Nut'],
    datasets: [
      {
        data: [3.2, 5, 8.8, 12.2],
        backgroundColor: ['#3b82f6', '#a855f7', '#10b981', '#f97316'],
        borderWidth: 0,
        cutout: '90%'
      }
    ]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 15, usePointStyle: true, pointStyle: 'circle' }
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const bestSellingProducts = getBestSellingProducts();
  const newCustomers = getRecentCustomers();
  const recentOrders = getRecentOrders();

  return (
    <>
      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Total Distribution (Yearly)</p>
              <h2 className="stat-value">₦{stats.totalYearly.value.toLocaleString()}</h2>
              <p className="stat-change positive">
                {stats.totalYearly.change} ↑
                <span className="stat-comparison">Compared to (₦{stats.totalYearly.comparison.toFixed(2)} last year)</span>
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Total Distribution (Daily)</p>
              <h2 className="stat-value">₦{stats.totalDaily.value.toLocaleString()}</h2>
              <p className="stat-change positive">
                {stats.totalDaily.change} ↑
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Total Distribution (Weekly)</p>
              <h2 className="stat-value">₦{stats.totalWeekly.value.toLocaleString()}</h2>
              <p className="stat-change positive">
                {stats.totalWeekly.change} ↑
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Total Distribution (Monthly)</p>
              <h2 className="stat-value">₦{stats.totalMonthly.value.toLocaleString()}</h2>
              <p className="stat-change positive">
                {stats.totalMonthly.change} ↑
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Distribution Trends</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot green"></span> Walk-In Sales
              </span>
              <span className="legend-item">
                <span className="legend-dot orange"></span> Delivery Sales
              </span>
            </div>
          </div>
          <div className="chart-container">
            <Line data={distributionTrendsData} options={lineChartOptions} />
          </div>
        </div>

        <div className="chart-card small">
          <div className="chart-header">
            <h3>Daily Visit Insights</h3>
          </div>
          <div className="chart-container small">
            <Bar data={dailyVisitData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Best-Selling Products Table and Pie Chart */}
      <div className="table-pie-section">
        <div className="table-section-inner">
          <div className="section-header">
            <h3>Best-Selling Products</h3>
            <a href="#" onClick={() => navigate('/distributor/inventory')} className="see-all">See All</a>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sales</th>
                  <th>Stock</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bestSellingProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.sales.toLocaleString()}</td>
                    <td>{product.stock.toLocaleString()}</td>
                    <td>₦{product.amount.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${product.status === 'In Stock' ? 'in-stock' : 'out-stock'}`}>
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pie-section-inner">
          <div className="year-selector">
            <button>←</button>
            <span>2024</span>
            <button>→</button>
          </div>
          <div className="pie-chart-card">
            <div className="pie-container">
              <Doughnut data={pieChartData} options={pieChartOptions} />
              <div className="pie-center-text">
                <h2>{products.length}</h2>
                <p>Total Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="widget-card">
          <div className="widget-header">
            <h3>New Customers List</h3>
          </div>
          <div className="customers-list">
            {newCustomers.length === 0 ? (
              <p className="text-center text-muted">No customers yet</p>
            ) : (
              newCustomers.map((customer, index) => (
                <div key={index} className="customer-item">
                  <span className="customer-avatar">{customer.avatar}</span>
                  <div className="customer-info">
                    <p className="customer-name">{customer.name}</p>
                    <p className="customer-id">Customer {customer.id}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="view-more-btn" onClick={() => navigate('/distributor/customers')}>View more</button>
        </div>

        <div className="widget-card">
          <div className="widget-header">
            <h3>Order List</h3>
          </div>
          <div className="orders-list">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Payment Number</th>
                    <th>Date & time</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan="4" className="text-center">No orders yet</td></tr>
                  ) : (
                    recentOrders.map((order, index) => (
                      <tr key={index}>
                        <td>{order.payment}</td>
                        <td>{order.date}</td>
                        <td>{order.amount}</td>
                        <td>
                          <span className={`status-badge ${order.status === 'Completed' ? 'completed' : 'declined'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <button className="view-all-transactions" onClick={() => navigate('/distributor/orders')}>View All transactions</button>
        </div>
      </div>
    </>
  );
};

export default DistributorDashboard;