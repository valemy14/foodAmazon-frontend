import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { useCart } from '../context/CartContext';

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Fetch SALE products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/sale-products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
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

  if (loading) {
    return (
      <div className="text-center my-5">
        <p>Loading sale products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center my-5">
        <p>No products on sale at the moment</p>
      </div>
    );
  }

  return (
    <div className="sales-section">
      <h2 className="mb-4">Products on Sale</h2>
      <p className="mb-4">Don't miss out on these amazing deals!</p>
      
      <div className="product-bottom row">
        {products.map((product) => (
          <div key={product._id} className="col-sm-12 col-md-12 col-lg-4">
            {product.discount > 0 && (
              <div className="sale-badge">-{product.discount}%</div>
            )}
            <img 
              className='p-img' 
              src={Array.isArray(product.productImage) ? product.productImage[0] : product.productImage || 'https://via.placeholder.com/300'} 
              alt={product.productName} 
            />
            <div className="bottom-text">
              <div style={{marginBottom:'10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <small className='p-cat mt-3'>{product.category?.name || 'Product'}</small>
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <p style={{fontWeight:'bold', marginTop:'10px'}}>{product.productName}</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <FontAwesomeIcon icon={faStar} style={{ color: '#F58634', fontSize: '20px' }} />
                  <small>{product.productRating || '5.0'}</small>  
                </div>
                <div>
                  {product.discount > 0 ? (
                    <>
                      <small className='price' style={{textDecoration: 'line-through', color: '#999', marginRight: '8px'}}>
                        ${product.productPrice}
                      </small>
                      <small className='price'>
                        ${(product.productPrice * (1 - product.discount / 100)).toFixed(2)}
                      </small>
                    </>
                  ) : (
                    <small className='price'>${product.productPrice}</small>
                  )}
                </div>        
              </div>
              
              <div>
                <button 
                  className='pb-btn' 
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.productInStock}
                >
                  {product.productInStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>   
        ))}   
      </div>
    </div>
  );
};

export default Sales;