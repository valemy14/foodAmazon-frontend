import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { useNavigate } from 'react-router-dom';
import {  Package, Search, Edit2, Trash2 } from 'lucide-react';
import { SuccessModal, DeleteConfirmModal } from '../components/ProductModals';

export default function SuperAdminProductPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // Modal states
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false); // ADD THIS

  // Products data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      
      if (response.success) {
        setProducts(response.products);
        setError(null);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const handleMenuClick = (item) => {
    setActiveMenu(item.id);
    navigate(item.route);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p._id)); // CHANGED: Use _id not id
    }
  };

  const handleAddProduct = () => {
    navigate('/superadmin/products/add');
  };

  const handleExport = () => {
    console.log('Exporting products...');
    setTimeout(() => {
      setShowExportSuccess(true);
    }, 500);
  };

  const handleEdit = (productId) => {
    console.log('Edit product:', productId);
    navigate(`/superadmin/products/edit/${productId}`);
  };

  const handleDelete = () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to delete');
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      
      const results = await Promise.all(
        selectedProducts.map(id => productService.deleteProduct(id))
      );
      
      const allSuccess = results.every(r => r.success);
      
      if (allSuccess) {
        setShowDeleteConfirm(false);
        setSelectedProducts([]);
        fetchProducts();
        alert('Products deleted successfully!');
      } else {
        alert('Some products could not be deleted');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(product => {
    if (!product) return false;
    const matchesSearch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading products...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
        Error: {error}
        <button onClick={fetchProducts} style={{ marginLeft: '10px', padding: '8px 16px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
        {/* Page Title and Actions */}
        <div className="superadmin-products-title-section">
          <h1 className="superadmin-products-page-title">Products ({products.length})</h1>
          <div className="superadmin-products-title-actions">
            <button className="superadmin-products-export-btn" onClick={handleExport}>
              Export
            </button>
            <button className="superadmin-products-add-btn" onClick={handleAddProduct}>
              + Add Product
            </button>
          </div>
        </div>

        {/* Filters and Actions Bar */}
        <div className="superadmin-products-filters-bar">
          <div className="superadmin-products-filters-left">
            <select className="superadmin-products-filter-select">
              <option>Filter</option>
              <option>In Stock</option>
              <option>Out of Stock</option>
              <option>Low Stock</option>
            </select>
            <div className="superadmin-products-search-input">
              <Search size={18} className="superadmin-products-search-icon-small" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="superadmin-products-filters-right">
            <button className="superadmin-products-action-icon-btn">
              <Edit2 size={18} />
            </button>
            <button className="superadmin-products-action-icon-btn delete" onClick={handleDelete}>
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="superadmin-products-table-container">
          <table className="superadmin-products-table">
            <thead>
              <tr>
                <th className="superadmin-products-checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="superadmin-products-product-col">Product</th>
                <th className="superadmin-products-inventory-col">Stock Status</th>
                <th className="superadmin-products-color-col">Variety</th>
                <th className="superadmin-products-price-col">Price</th>
                <th className="superadmin-products-rating-col">Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="superadmin-products-checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                      />
                    </td>
                    <td className="superadmin-products-product-cell">
                      <div className="superadmin-products-product-info">
                        <div className="superadmin-products-product-image">
                          {product.productImage && product.productImage[0] ? (
                            <img 
                              src={product.productImage[0]} 
                              alt={product.productName}
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          ) : (
                            '📦'
                          )}
                        </div>
                        <div className="superadmin-products-product-details">
                          <span className="superadmin-products-product-name">
                            {product.productName}
                          </span>
                          <span className="superadmin-products-product-category">
                            {product.category?.name || 'Uncategorized'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="superadmin-products-inventory-cell">
                      <span className={`superadmin-products-inventory-badge ${product.productInStock ? 'in-stock' : 'out-of-stock'}`}>
                        {product.productInStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="superadmin-products-color-cell">
                      {product.productVariety?.join(', ') || 'N/A'}
                    </td>
                    <td className="superadmin-products-price-cell">
                      ${product.productPrice?.toFixed(2) || '0.00'}
                    </td>
                    <td className="superadmin-products-rating-cell">
                      ⭐ {product.productRating || '0'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="superadmin-products-pagination">
          <button className="superadmin-products-page-btn">←</button>
          <button className="superadmin-products-page-btn active">1</button>
          <button className="superadmin-products-page-btn">2</button>
          <button className="superadmin-products-page-btn">3</button>
          <button className="superadmin-products-page-btn">4</button>
          <button className="superadmin-products-page-btn">5</button>
          <button className="superadmin-products-page-btn">6</button>
          <span className="superadmin-products-page-dots">...</span>
          <button className="superadmin-products-page-btn">24</button>
          <button className="superadmin-products-page-btn">→</button>
          <span className="superadmin-products-results-count">{filteredProducts.length} Results</span>
        </div>
     

      {/* Modals */}
      <SuccessModal
        show={showExportSuccess}
        onClose={() => setShowExportSuccess(false)}
        title="Export Successful!"
        type="success"
      />

      <DeleteConfirmModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        itemCount={selectedProducts.length}
      />

      <SuccessModal
        show={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
        title="Delete Successful!"
        type="delete"
      />
    </>
  );
}