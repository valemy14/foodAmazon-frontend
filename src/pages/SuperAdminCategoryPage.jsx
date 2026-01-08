import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { Plus, ArrowLeft, Edit2, Trash2 } from 'lucide-react';

const SuperAdminCategoryPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryDetails, setShowCategoryDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [categoryImage, setCategoryImage] = useState(null);
  
  // ADD THIS MISSING STATE - This was causing the error!
  const [showNotifications, setShowNotifications] = useState(false);

  // API States
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Products data for the category
  const categoryProducts = [
    { id: 1, name: 'Organic Almond Delight', image: '🥜' },
    { id: 2, name: 'Berry Bliss Bites', image: '🍓' },
    { id: 3, name: 'Coconut Crunchies', image: '🥥' },
    { id: 4, name: 'Organic Almond Delight', image: '🥜' },
    { id: 5, name: 'Coconut Crunchies', image: '🥥' },
    { id: 6, name: 'Berry Bliss Bites', image: '🍓' },
    { id: 7, name: 'Organic Almond Delight', image: '🥜' },
    { id: 8, name: 'Coconut Crunchies', image: '🥥' },
    { id: 9, name: 'Coconut Crunchies', image: '🥥' },
    { id: 10, name: 'Berry Bliss Bites', image: '🍓' },
    { id: 11, name: 'Organic Almond Delight', image: '🥜' },
    { id: 12, name: 'Coconut Crunchies', image: '🥥' }
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      
      if (response.success) {
        setCategories(response.categories);
        setError(null);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setIsVisible(category.visible);
    setShowCategoryDetails(true);
  };

  const handleAddCategory = () => {
    setShowAddModal(true);
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      setSubmitLoading(true);
      const response = await categoryService.createCategory({
        name: categoryName
      });
      
      if (response.success) {
        setShowAddModal(false);
        setCategoryName('');
        setSelectedProduct('');
        loadCategories();
        alert('Category created successfully!');
      } else {
        alert('Error: ' + response.error);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!selectedCategory || !categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      setSubmitLoading(true);
      const response = await categoryService.updateCategory(selectedCategory._id, {
        name: categoryName
      });
      
      if (response.success) {
        setShowCategoryDetails(false);
        loadCategories();
        alert('Category updated successfully!');
      } else {
        alert('Error: ' + response.error);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await categoryService.deleteCategory(categoryId);
      
      if (response.success) {
        loadCategories();
        alert('Category deleted successfully!');
      } else {
        alert('Error: ' + response.error);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleBackToCategories = () => {
    setShowCategoryDetails(false);
    setSelectedCategory(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryImage(reader.result);
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
        setCategoryImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div>Loading categories...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: 'red' }}>
          Error: {error}
          <button onClick={loadCategories} style={{ marginLeft: '10px', padding: '8px 16px' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Conditional Rendering: Categories Grid or Category Details */}
      {!showCategoryDetails ? (
        <>
          {/* Page Title Section */}
          <div className="page-title-section">
            <h1 className="page-title">Categories</h1>
            <button className="add-category-btn" onClick={handleAddCategory}>
              <Plus size={18} />
              Add Category
            </button>
          </div>

          {/* Categories Grid */}
          <div className="categories-grid">
            {categories.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  gridColumn: '1 / -1',
                  color: '#9ca3af'
                }}
              >
                No categories found. Create your first category!
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category._id}
                  className="category-card"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="category-image">
                    <img
                      src={`https://images.unsplash.com/photo-${1500000000000 + category._id}?w=400&h=300&fit=crop`}
                      alt={category.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="category-placeholder" style={{ display: 'none' }}>
                      <span style={{ fontSize: '48px' }}>
                        {category.image || '📦'}
                      </span>
                    </div>
                    <div className="edit-overlay">
                      <button className="edit-overlay-btn">
                        <Edit2 size={16} />
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="category-info">
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-items">
                      {category.items || 0} items
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          {/* Category Details View */}
          <div className="category-details-header">
            <button className="back-btn" onClick={handleBackToCategories}>
              <ArrowLeft size={20} />
              Back
            </button>
            <h1 className="category-details-title">{selectedCategory?.name}</h1>
            <div className="category-actions">
              <button className="cancel-btn" onClick={handleBackToCategories}>Cancel</button>
              <button className="save-btn" onClick={handleSaveCategory}>Save</button>
            </div>
          </div>

          <div className="category-details-content">
            {/* Left Side - Products List */}
            <div className="products-list-section">
              <h3 className="section-heading">Products <span className="products-count">{categoryProducts.length}</span></h3>
              
              <div className="products-list">
                {categoryProducts.map((product) => (
                  <div key={product.id} className="product-item">
                    <div className="product-drag-handle">⋮⋮</div>
                    <div className="product-image-small">
                      <span style={{ fontSize: '24px' }}>{product.image}</span>
                    </div>
                    <span className="product-name">{product.name}</span>
                    <div className="product-actions">
                      <button className="product-action-btn">
                        <Edit2 size={16} />
                      </button>
                      <button className="product-action-btn delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="add-product-btn">
                <Plus size={18} />
                Add Product
              </button>
            </div>

            {/* Right Side - Category Info */}
            <div className="category-info-section">
              <div className="info-card">
                <h3 className="info-card-title">Category Visibility</h3>
                <div className="visibility-toggle">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={isVisible}
                      onChange={(e) => setIsVisible(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">Visible on site</span>
                </div>
              </div>

              <div className="info-card">
                <h3 className="info-card-title">Category Info</h3>
                <div className="form-group">
                  <label>Category Name</label>
                  <input 
                    type="text" 
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                  />
                </div>

                <div className="form-group">
                  <label>Image</label>
                  <div 
                    className="image-upload-area"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {categoryImage ? (
                      <img src={categoryImage} alt="Category" className="uploaded-image" />
                    ) : (
                      <>
                        <div className="upload-placeholder">
                          <span className="upload-icon">📁</span>
                          <p className="upload-text">Or drag and drop files</p>
                        </div>
                        <label className="add-file-btn">
                          Add File
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}></div>
          <div className="add-category-modal">
            <div className="modal-header">
              <h2>Add Category</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-form-group">
                <label>Category Name</label>
                <input 
                  type="text" 
                  placeholder="Coconut Crunchies"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>

              <div className="modal-form-group">
                <label>Add Products</label>
                <select 
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Choose a Product</option>
                  <option value="organic-almond">Organic Almond Delight</option>
                  <option value="berry-bites">Berry Bliss Bites</option>
                  <option value="coconut">Coconut Crunchies</option>
                </select>
              </div>

              <div className="modal-actions">
                <button 
                  className="modal-cancel-btn" 
                  onClick={() => setShowAddModal(false)}
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button 
                  className="modal-create-btn" 
                  onClick={handleCreateCategory}
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Notification Popup */}
      {showNotifications && (
        <>
          <div className="notification-overlay" onClick={() => setShowNotifications(false)}></div>
          <div className="notification-popup">
            <div className="notification-header">
              <h3>Notifications</h3>
              <button className="close-notification" onClick={() => setShowNotifications(false)}>
                ✕
              </button>
            </div>
            <div className="notification-list">
              <div className="notification-item">
                <p><strong>New Category Added</strong></p>
                <p>Coconut Crunchies has been added</p>
                <small>2 mins ago</small>
              </div>
              <div className="notification-item">
                <p><strong>Category Updated</strong></p>
                <p>Berry Bliss Bites was updated</p>
                <small>1 hour ago</small>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SuperAdminCategoryPage;