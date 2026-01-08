import { useState } from 'react';
import { Home, ShoppingCart, Package, Grid, Users, FileText, Gift, Mail, Settings, LogOut, Bell, Search, ChevronDown, ShoppingBag, Download, X, Check } from 'lucide-react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
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
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function SuperAdminReportsPage() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [timeRange, setTimeRange] = useState('Last 12 Months');
  const [funnelTimeRange, setFunnelTimeRange] = useState('Last 7 Days');

 

  // Customer Growth Chart Data
  const customerGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Returning Customers',
        data: [450, 380, 420, 480, 520, 390, 480, 510, 460, 490, 530, 480],
        backgroundColor: '#f97316',
        borderRadius: 6,
        barThickness: 20,
      },
      {
        label: 'New Customers',
        data: [350, 280, 220, 320, 280, 220, 280, 210, 180, 260, 180, 240],
        backgroundColor: '#10b981',
        borderRadius: 6,
        barThickness: 20,
      }
    ]
  };

  const customerGrowthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 12 } }
      },
      y: {
        grid: { color: '#f3f4f6', borderDash: [5, 5] },
        ticks: { color: '#9ca3af', stepSize: 100 },
        beginAtZero: true,
        max: 500
      }
    }
  };

  // Average Order Value Line Chart
  const avgOrderValueData = {
    labels: ['4am', '6am', '10am', '4pm', '8pm', 'Jan 12'],
    datasets: [{
      data: [25, 35, 45, 50, 60, 40],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 0,
      fill: true,
    }]
  };

  const avgOrderValueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 11 } }
      },
      y: {
        display: false
      }
    }
  };

  // Sales Goal Doughnut Chart
  const salesGoalData = {
    datasets: [{
      data: [75, 25],
      backgroundColor: ['#f97316', '#f3f4f6'],
      borderWidth: 0,
      cutout: '80%'
    }]
  };

  const salesGoalOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  // Conversion Rate Doughnut Chart
  const conversionRateData = {
    datasets: [{
      data: [25, 75],
      backgroundColor: ['#10b981', '#f3f4f6'],
      borderWidth: 0,
      cutout: '80%'
    }]
  };

  // Store Funnel Bar Chart
  const storeFunnelData = {
    labels: ['Visited Site', 'Added to Cart', 'Proceed to Checkout', 'Made a Purchase'],
    datasets: [{
      data: [450, 330, 250, 150],
      backgroundColor: '#10b981',
      borderRadius: 8,
    }]
  };

  const storeFunnelOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const percentages = ['73%', '65%', '64%'];
            return percentages[context.dataIndex] || '';
          }
        }
      }
    },
    scales: {
      x: {
        display: false,
        beginAtZero: true,
        max: 500
      },
      y: {
        grid: { display: false },
        ticks: { color: '#374151', font: { size: 13, weight: '500' } }
      }
    }
  };

  // Age Distribution Doughnut
  const ageDistributionData = {
    datasets: [{
      data: [50, 30, 10, 10],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6b7280'],
      borderWidth: 0,
    }]
  };

  const ageDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    cutout: '75%'
  };

  const topCustomers = [
    { id: 1, name: 'Lee Henry', initial: 'A', orders: 52, spent: '$869.37', color: '#10b981' },
    { id: 2, name: 'Myrtie McBride', initial: 'M', orders: 43, spent: '$929.54', color: '#3b82f6' },
    { id: 3, name: 'Tommy Walker', initial: 'T', orders: 41, spent: '$728.90', color: '#f59e0b' },
    { id: 4, name: 'Lela Cannon', initial: 'L', orders: 38, spent: '$679.42', color: '#10b981' },
    { id: 5, name: 'Jimmy Cook', initial: 'J', orders: 34, spent: '$549.71', color: '#3b82f6' }
  ];

  const topProducts = [
    { id: 1, name: 'Berry Bliss Bites', image: '🫐', clicks: 12040, units: 195 },
    { id: 2, name: 'Coconut Crunches', image: '🥥', clicks: 11234, units: 146 },
    { id: 3, name: 'Berry Bliss Bites', image: '🫐', clicks: 10054, units: 122 },
    { id: 4, name: 'Coconut Crunches', image: '🥥', clicks: 8405, units: 110 },
    { id: 5, name: 'Organic Almond Delight', image: '🥜', clicks: 5600, units: 87 }
  ];

  const handleExport = () => {
    setShowExportModal(true);
    setTimeout(() => {
      setShowExportModal(false);
    }, 2000);
  };

  return (
    <>
        {/* Page Title */}
        <div className="page-title-section">
          <h1 className="page-title">Reports</h1>
          <button className="export-report-btn" onClick={handleExport}>
            <Download size={18} />
            Export Report
          </button>
        </div>

        {/* Customer Growth Chart */}
        <div className="chart-section">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Customer Growth</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-dot orange"></span>
                  Returning Customers
                </span>
                <span className="legend-item">
                  <span className="legend-dot green"></span>
                  New Customers
                </span>
              </div>
            </div>
            <select 
              className="time-filter"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <div className="chart-wrapper large">
            <Bar data={customerGrowthData} options={customerGrowthOptions} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <label className="stat-label">Existing Users</label>
            <h3 className="stat-value">5,653</h3>
            <span className="stat-change positive">22.45% ↑</span>
          </div>
          <div className="stat-card">
            <label className="stat-label">New Users</label>
            <h3 className="stat-value">1,650</h3>
            <span className="stat-change positive">15.34% ↑</span>
          </div>
          <div className="stat-card">
            <label className="stat-label">Total Visits</label>
            <h3 className="stat-value">9,504</h3>
            <span className="stat-change negative">18.25% ↓</span>
          </div>
          <div className="stat-card">
            <label className="stat-label">Unique Visits</label>
            <h3 className="stat-value">5,423</h3>
            <span className="stat-change positive">10.24% ↑</span>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-row">
          {/* Sales Goal */}
          <div className="metric-card">
            <h3 className="card-title">Sales Goal</h3>
            <div className="doughnut-wrapper">
              <Doughnut data={salesGoalData} options={salesGoalOptions} />
              <div className="doughnut-center">
                <span className="doughnut-percentage">75%</span>
              </div>
            </div>
            <div className="metric-details">
              <div className="metric-row">
                <span className="metric-label">Sold for:</span>
                <span className="metric-value">$15,000</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Month goal:</span>
                <span className="metric-value">$20,000</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Left:</span>
                <span className="metric-value">$5,000</span>
              </div>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="metric-card">
            <h3 className="card-title">Conversion Rate</h3>
            <div className="doughnut-wrapper">
              <Doughnut data={conversionRateData} options={salesGoalOptions} />
              <div className="doughnut-center">
                <span className="doughnut-percentage">25%</span>
              </div>
            </div>
            <div className="metric-details">
              <div className="metric-row">
                <span className="metric-label">Cart:</span>
                <span className="metric-value">35%</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Checkout:</span>
                <span className="metric-value">29%</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Purchase:</span>
                <span className="metric-value">25%</span>
              </div>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="metric-card wide">
            <h3 className="card-title">Average Order Value</h3>
            <div className="order-value-info">
              <div className="order-value-item">
                <span className="order-value-label">This Month</span>
                <span className="order-value-amount">$48.90</span>
              </div>
              <div className="order-value-item">
                <span className="order-value-label">Previous Month</span>
                <span className="order-value-amount">$48.90</span>
              </div>
            </div>
            <div className="chart-wrapper small">
              <Line data={avgOrderValueData} options={avgOrderValueOptions} />
            </div>
          </div>
        </div>

        {/* Map and Devices Row */}
        <div className="map-devices-row">
          {/* Customer Demographics */}
          <div className="demographics-card">
            <h3 className="card-title">Customer Demographics</h3>
            <div className="map-placeholder">
              <div className="map-marker lagos">
                <span className="marker-label">Lagos State</span>
                <span className="marker-value">29,051</span>
              </div>
              <div className="map-marker oyo">
                <span className="marker-label">Oyo State</span>
                <span className="marker-value">18,041</span>
              </div>
              <div className="map-marker osun">
                <span className="marker-label">Osun State</span>
                <span className="marker-value">10,430</span>
              </div>
              <div className="map-marker other">
                <span className="marker-label">Other State</span>
                <span className="marker-value">5,420</span>
              </div>
            </div>
          </div>

          {/* Visits by Device & Online Sessions */}
          <div className="devices-sessions-column">
            <div className="visits-device-card">
              <h3 className="card-title">Visits by Device</h3>
              <div className="device-list">
                <div className="device-item">
                  <span className="device-icon">📱</span>
                  <span className="device-name">Mobile</span>
                  <span className="device-percentage">62%</span>
                </div>
                <div className="device-item">
                  <span className="device-icon">💻</span>
                  <span className="device-name">Laptop</span>
                  <span className="device-percentage">20%</span>
                </div>
                <div className="device-item">
                  <span className="device-icon">📱</span>
                  <span className="device-name">Tablet</span>
                  <span className="device-percentage">13%</span>
                </div>
                <div className="device-item">
                  <span className="device-icon">🖥️</span>
                  <span className="device-name">Other</span>
                  <span className="device-percentage">5%</span>
                </div>
              </div>
            </div>

            <div className="online-sessions-card">
              <h3 className="card-title">Online Sessions</h3>
              <div className="sessions-count">128</div>
              <div className="sessions-label">Active Users</div>
            </div>
          </div>
        </div>

        {/* Top Customers & Products */}
        <div className="tables-row">
          <div className="table-card">
            <h3 className="table-title">Top Customers</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Orders</th>
                  <th>Spent</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-info">
                        <div className="customer-initial" style={{ backgroundColor: customer.color }}>
                          {customer.initial}
                        </div>
                        <span>{customer.name}</span>
                      </div>
                    </td>
                    <td>{customer.orders}</td>
                    <td className="spent-value">{customer.spent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-card">
            <h3 className="table-title">Top Products</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Clicks</th>
                  <th>Units Sold</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-info">
                        <span className="product-image">{product.image}</span>
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.clicks.toLocaleString()}</td>
                    <td>{product.units}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Store Funnel & Age Distribution */}
        <div className="funnel-age-row">
          <div className="funnel-card">
            <div className="card-header-with-filter">
              <div>
                <h3 className="card-title">Store Funnel</h3>
                <div className="funnel-info">
                  <span className="funnel-rate">Conversion Rate <strong>28%</strong></span>
                  <span className="funnel-increase">4% Increase</span>
                </div>
              </div>
              <select 
                className="time-filter small"
                value={funnelTimeRange}
                onChange={(e) => setFunnelTimeRange(e.target.value)}
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            <div className="chart-wrapper funnel">
              <Bar data={storeFunnelData} options={storeFunnelOptions} />
            </div>
          </div>

          <div className="age-distribution-card">
            <h3 className="card-title">Age Distribution</h3>
            <div className="age-chart-wrapper">
              <Doughnut data={ageDistributionData} options={ageDistributionOptions} />
            </div>
            <div className="age-legend">
              <div className="age-legend-item">
                <span className="age-dot blue"></span>
                <span className="age-label">0-18 years</span>
                <span className="age-percent">50%</span>
              </div>
              <div className="age-legend-item">
                <span className="age-dot green"></span>
                <span className="age-label">18-30 years</span>
                <span className="age-percent">30%</span>
              </div>
              <div className="age-legend-item">
                <span className="age-dot orange"></span>
                <span className="age-label">30-40 years</span>
                <span className="age-percent">10%</span>
              </div>
              <div className="age-legend-item">
                <span className="age-dot gray"></span>
                <span className="age-label">Other</span>
                <span className="age-percent">10%</span>
              </div>
            </div>
            <button className="find-more-btn">Find out more</button>
          </div>
        </div>
      

      {/* Export Success Modal */}
      {showExportModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowExportModal(false)}></div>
          <div className="export-modal">
            <button className="modal-close" onClick={() => setShowExportModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-icon">
              <div className="success-checkmark">
                <Check size={32} />
              </div>
            </div>
            <h2 className="modal-title">Export Successfull</h2>
            <button className="modal-continue-btn" onClick={() => setShowExportModal(false)}>
              Continue
            </button>
          </div>
        </>
      )}
    </>
  );
}