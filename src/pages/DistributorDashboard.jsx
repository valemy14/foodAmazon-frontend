import React from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";


const DistributorDashboard = () => {
  return (
    <div className="dashboard-wrapper">

      {/* =============== LEFT SIDEBAR =============== */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">360 Organic Foodie</div>

        <nav className="sidebar-menu">
          <a href="/distributor-dashboard" className="active">📊 Dashboard</a>
          <a href="#">📦 Orders</a>
          <a href="#">👥 Customers</a>
          <a href="#">🏬 Inventory</a>
          <a href="#">⚙️ Settings</a>
        </nav>

        <div className="sidebar-logout">
          <a href="/login">🔓 Logout</a>
        </div>
      </aside>
       
       <div className="dashboard-topnav">
          <div className="left-section">
            <h3 className="page-title">Dashboard</h3>
          </div>

          <div className="search-container">
            <input type="text" placeholder="Search..." />
          </div>

          <div className="topnav-icons">
            <span className="icon">🛒</span>
            <span className="icon">🔔</span>

            {/* Profile dropdown */}
            <div className="profile-section">
              <img
                src="https://via.placeholder.com/40"
                alt="profile"
                className="profile-img"
              />
              <select className="profile-dropdown">
                <option>John Doe</option>
                <option>Settings</option>
                <option>Logout</option>
              </select>
            </div>
          </div>
        </div>

      {/* =============== MAIN CONTENT =============== */}
      <div className="dashboard-content container-fluid">

        {/* TOP CARDS */}
        <div className="row g-3 mb-4">
          {[
            { title: "Total Distribution (Yearly)", value: "$84,573", up: "+3.2%" },
            { title: "Total Distribution (Daily)", value: "$12,405", up: "+2.3%" },
            { title: "Total Distribution (Weekly)", value: "$4,512", up: "-2.2%" },
            { title: "Total Distribution (Monthly)", value: "$17,856", up: "+3.2%" }
          ].map((card, i) => (
            <div className="col-md-3" key={i}>
              <div className="card stats-card shadow-sm">
                <div className="card-body">
                  <p className="stats-title">{card.title}</p>
                  <h3 className="stats-value">{card.value}</h3>
                  <small className={card.up.includes("+") ? "text-success" : "text-danger"}>
                    {card.up}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS ROW */}
        <div className="row g-3 mb-4">
          <div className="col-lg-8">
            <div className="card shadow-sm p-3">
              <h5 className="mb-3">Distribution Trends</h5>
              <Line
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  datasets: [
                    {
                      label: "Website Traffic",
                      data: [30, 45, 40, 60, 55, 70],
                      borderColor: "#00A859",
                      tension: 0.4,
                    },
                    {
                      label: "Delivery Sales",
                      data: [20, 35, 50, 40, 65, 60],
                      borderColor: "#F58634",
                      tension: 0.4,
                    },
                  ],
                }}
              />
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm p-3">
              <h5 className="mb-3">Daily Visit Insights</h5>
              <Bar
                data={{
                  labels: ["Sep", "Oct", "Nov", "Dec"],
                  datasets: [
                    {
                      label: "Mobile Browser",
                      data: [40, 35, 50, 45],
                      backgroundColor: "#00A859",
                    },
                    {
                      label: "Desktop",
                      data: [30, 25, 40, 35],
                      backgroundColor: "#F58634",
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="row g-3">

          {/* BEST SELLING PRODUCTS */}
          <div className="col-lg-8">
            <div className="card shadow-sm p-3">
              <div className="d-flex justify-content-between mb-3">
                <h5>Best-Selling Products</h5>
                <a href="#" className="see-all">See All</a>
              </div>

              <table className="table table-hover mt-3">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sales</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <img src="/images/berry.png" alt="" className="product-img" />
                      Berry Bliss Bites
                    </td>
                    <td>3,421</td>
                    <td>$12,400</td>
                    <td><span className="badge bg-success">In Stock</span></td>
                  </tr>

                  <tr>
                    <td>
                      <img src="/images/almond.png" alt="" className="product-img" />
                      Organic Almond Delight
                    </td>
                    <td>2,569</td>
                    <td>$8,900</td>
                    <td><span className="badge bg-danger">Out of Stock</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PIE CHART + CUSTOMER LIST & ORDERS */}
          <div className="col-lg-4">
            <div className="card shadow-sm p-3 mb-3">
              <h5 className="mb-3">2024 Best-Selling Categories</h5>
              <Doughnut
                data={{
                  labels: ["Berry Bliss", "Coconut Crunchies", "Almond Mix"],
                  datasets: [
                    {
                      data: [42, 31, 27],
                      backgroundColor: ["#F58634", "#00A859", "#6C63FF"],
                    },
                  ],
                }}
              />
            </div>

            {/* NEW CUSTOMERS LIST */}
            <div className="card shadow-sm p-3 mb-3">
              <h5 className="mb-3">New Customers</h5>

              <ul className="list-unstyled customer-list">
                <li><img src="/avatar1.png" /> Annette Black</li>
                <li><img src="/avatar2.png" /> Rohan Ravindra</li>
                <li><img src="/avatar3.png" /> Musa Ahmed</li>
                <li><img src="/avatar4.png" /> Alexander Omot</li>
              </ul>
            </div>

            {/* ORDER LIST */}
            <div className="card shadow-sm p-3">
              <h5 className="mb-3">Order List</h5>

              <ul className="order-list">
                <li>
                  Payment for #40321  
                  <span className="badge bg-warning">Pending</span>
                </li>
                <li>
                  Processed #00190  
                  <span className="badge bg-success">Completed</span>
                </li>
                <li>
                  Delivery #84333  
                  <span className="badge bg-info">In Transit</span>
                </li>
                <li>
                  Refund #90013  
                  <span className="badge bg-danger">Refunded</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default DistributorDashboard;
