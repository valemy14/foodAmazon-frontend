import React, { useState, useEffect } from 'react';
import { inventoryService } from '../services/inventoryService';

const InventoryPage = () => {
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  
  // API Data States
  const [stats, setStats] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    productId: '',
    buyingPrice: '',
    quantity: '',
    unit: 'Packets',
    thresholdValue: '',
    expiryDate: '',
    supplier: '',
    location: ''
  });

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch inventory data when page changes
  useEffect(() => {
    fetchInventory();
  }, [currentPage]);

  const fetchStats = async () => {
    try {
      const data = await inventoryService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err);
    }
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getInventory(currentPage, 14);
      
      // Format data for display
      const formattedData = data.inventory.map(item => ({
        id: item._id,
        product: item.product.productName,
        buyingPrice: `₦${item.buyingPrice}`,
        quantity: `${item.quantity} ${item.unit}`,
        threshold: `${item.thresholdValue} ${item.unit}`,
        expiry: new Date(item.expiryDate).toLocaleDateString(),
        availability: item.availability
      }));

      setInventoryData(formattedData);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err);
      setLoading(false);
    }
  };

  const getAvailabilityClass = (availability) => {
    switch(availability) {
      case 'In-stock':
        return 'status-in-stock';
      case 'Out of stock':
        return 'status-out-stock';
      case 'Low stock':
        return 'status-low-stock';
      default:
        return '';
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProduct = async () => {
    try {
      await inventoryService.createInventory(formData);
      
      // Reset form and close modal
      setShowAddProductModal(false);
      setImagePreview(null);
      setFormData({
        productId: '',
        buyingPrice: '',
        quantity: '',
        unit: 'Packets',
        thresholdValue: '',
        expiryDate: '',
        supplier: '',
        location: ''
      });

      // Refresh data
      fetchInventory();
      fetchStats();
      
      alert('Product added successfully!');
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Error adding product: ' + err);
    }
  };

  const handleCancel = () => {
    setShowAddProductModal(false);
    setImagePreview(null);
    setFormData({
      productId: '',
      buyingPrice: '',
      quantity: '',
      unit: 'Packets',
      thresholdValue: '',
      expiryDate: '',
      supplier: '',
      location: ''
    });
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (loading && !stats) {
    return <div className="loading">Loading inventory...</div>;
  }

  return (
    <div className="inventory-content">
      <h1 className="page-title">Inventory</h1>

      {/* Overall Inventory Stats */}
      <div className="inventory-stats">
        <h3 className="stats-title">Overall Inventory</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat-value">{stats?.categories || 0}</div>
            <div className="stat-footer">Last 7 days</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Total Products</span>
            </div>
            <div className="stat-values">
              <span className="stat-value">{stats?.totalProducts?.count || 0}</span>
              <span className="stat-revenue">₦{stats?.totalProducts?.revenue?.toLocaleString() || 0}</span>
            </div>
            <div className="stat-footers">
              <span className="stat-footer">Last 7 days</span>
              <span className="stat-footer">Revenue</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Top Selling</span>
            </div>
            <div className="stat-values">
              <span className="stat-value">{stats?.topSelling?.count || 0}</span>
              <span className="stat-revenue">₦{stats?.topSelling?.cost?.toLocaleString() || 0}</span>
            </div>
            <div className="stat-footers">
              <span className="stat-footer">Last 7 days</span>
              <span className="stat-footer">Cost</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Low Stocks</span>
            </div>
            <div className="stat-values">
              <span className="stat-value">{stats?.lowStock?.ordered || 0}</span>
              <span className="stat-revenue">{stats?.lowStock?.notInStock || 0}</span>
            </div>
            <div className="stat-footers">
              <span className="stat-footer">Ordered</span>
              <span className="stat-footer">Not in stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <div className="products-header">
          <h3 className="section-title">Products</h3>
          <div className="products-actions">
            <button className="add-product-btn" onClick={() => setShowAddProductModal(true)}>
              Add Product
            </button>
            <button className="filters-btn">
              <span className="filter-icon">⚙</span> Filters
            </button>
            <button className="download-btn">
              Download all
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="products-table-container">
          {loading ? (
            <div className="loading">Loading inventory data...</div>
          ) : error ? (
            <div className="error">Error loading inventory: {error.toString()}</div>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th>Products</th>
                  <th>Buying Price</th>
                  <th>Quantity</th>
                  <th>Threshold Value</th>
                  <th>Expiry Date</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                {inventoryData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product}</td>
                    <td>{item.buyingPrice}</td>
                    <td>{item.quantity}</td>
                    <td>{item.threshold}</td>
                    <td>{item.expiry}</td>
                    <td>
                      <span className={`availability-badge ${getAvailabilityClass(item.availability)}`}>
                        {item.availability}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <button 
            className="pagination-btn" 
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">Page {currentPage} of {totalPages}</span>
          <button 
            className="pagination-btn" 
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <>
          <div className="modal-overlay" onClick={handleCancel}></div>
          <div className="add-product-modal">
            <div className="modal-header-simple">
              <h2>New Product</h2>
            </div>
            <div className="modal-body-scroll">
              <form className="product-form">
                {/* Image Upload */}
                <div className="image-upload-section">
                  <div 
                    className="image-upload-box"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="image-preview" />
                    ) : (
                      <>
                        <div className="upload-placeholder">
                          <div className="dashed-box"></div>
                        </div>
                        <p className="upload-text">Drag image here</p>
                        <p className="upload-or">or</p>
                        <label htmlFor="file-upload" className="browse-link">
                          Browse image
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="form-field">
                  <label>Product ID</label>
                  <input 
                    type="text" 
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    placeholder="Enter product ID" 
                  />
                </div>

                <div className="form-field">
                  <label>Buying Price</label>
                  <input 
                    type="number" 
                    name="buyingPrice"
                    value={formData.buyingPrice}
                    onChange={handleInputChange}
                    placeholder="Enter buying price" 
                  />
                </div>

                <div className="form-field">
                  <label>Quantity</label>
                  <input 
                    type="number" 
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter product quantity" 
                  />
                </div>

                <div className="form-field">
                  <label>Unit</label>
                  <select 
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                  >
                    <option value="Packets">Packets</option>
                    <option value="Boxes">Boxes</option>
                    <option value="Pieces">Pieces</option>
                    <option value="Kg">Kg</option>
                    <option value="Liters">Liters</option>
                    <option value="Units">Units</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Threshold Value</label>
                  <input 
                    type="number" 
                    name="thresholdValue"
                    value={formData.thresholdValue}
                    onChange={handleInputChange}
                    placeholder="Enter threshold value" 
                  />
                </div>

                <div className="form-field">
                  <label>Expiry Date</label>
                  <input 
                    type="date" 
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-field">
                  <label>Supplier (Optional)</label>
                  <input 
                    type="text" 
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    placeholder="Enter supplier name" 
                  />
                </div>

                <div className="form-field">
                  <label>Location (Optional)</label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter storage location" 
                  />
                </div>

                {/* Form Actions */}
                <div className="modal-form-actions">
                  <button type="button" className="cancel-btn-modal" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="button" className="add-btn" onClick={handleAddProduct}>
                    Add Product
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

export default InventoryPage;