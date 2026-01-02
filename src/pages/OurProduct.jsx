import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/wishlistContext';

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

const OurProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/get-all-products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    
    const result = await addToCart(
      product._id,
      product.productName,
      product.productPrice,
      Array.isArray(product.productImage) ? product.productImage[0] : product.productImage,
      1
    );

    if (result.success) {
      alert('Item added to cart!');
    } else {
      alert(result.error || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (e, product) => {
    e.stopPropagation();
    
    const result = await addToWishlist(
      product._id,
      product.productName,
      product.productPrice,
      Array.isArray(product.productImage) ? product.productImage[0] : product.productImage
    );

    if (result.success) {
      alert('Added to wishlist!');
    } else {
      alert(result.error || 'Failed to add to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <h3>Loading products...</h3>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Our Products</h2>
      <p className="mb-5">Browse all our amazing products</p>
      
      <div className="row">
        {products.map((product) => (
          <div 
            key={product._id} 
            className="col-sm-12 col-md-6 col-lg-4 mb-4"
          >
            <div 
              className="product-card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img 
                className='p-img' 
                src={Array.isArray(product.productImage) ? product.productImage[0] : product.productImage || 'https://via.placeholder.com/300'} 
                alt={product.productName} 
              />
              <div className="bottom-text">
                <div style={{marginBottom:'10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <small className='p-cat mt-3'>{product.category?.name || 'Product'}</small>
                  <FontAwesomeIcon 
                    icon={faHeart}
                    onClick={(e) => handleAddToWishlist(e, product)}
                    style={{
                      cursor: 'pointer',
                      color: isInWishlist(product._id) ? '#F58634' : '#ddd',
                      fontSize: '20px',
                      transition: 'color 0.3s'
                    }}
                  />
                </div>
                <p style={{fontWeight:'bold', marginTop:'10px'}}>{product.productName}</p>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FontAwesomeIcon icon={faStar} style={{ color: '#F58634', fontSize: '20px' }} />
                    <small>{product.productRating || '5.0'}</small>  
                  </div>
                  <div>
                    <small className='price'>${product.productPrice}</small>
                  </div>        
                </div>
                
                <div>
                  <button 
                    className='pb-btn' 
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={!product.productInStock}
                  >
                    {product.productInStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurProducts;