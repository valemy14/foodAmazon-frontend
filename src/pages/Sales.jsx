import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { S1, S3 } from '../assets/Index'; // Keep S1 (big banner) and S3 (out of stock badge)
import { useCart } from '../context/CartContext';

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

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
      <div className="sales">
        <div className="text-center my-5">
          <p>Loading sale products...</p>
        </div>
      </div>
    );
  }

  // Get first product for the right side card
  const featuredProduct = products[0];

  return (
    <>
      <div className="sales">
        <div className="sales-top">
          <h3>Hurry Do not Miss Out On <br />This Offers!</h3>
          <div><button className='s-btn'>Browse All</button></div>
        </div>

        <div className="sales-bottom row">
          {/* LEFT SIDE - Keep your original big banner */}
          <div className="col-sm-12 col-md-12 col-lg-8">
            <img className='s-img' src={S1} alt="Sale Banner" />
          </div>

          {/* RIGHT SIDE - Dynamic product from API */}
          <div className="col-sm-12 col-md-12 col-lg-4">
            {featuredProduct ? (
              <>
                <div className='img-s' style={{ position: 'relative' }}>
                  <img 
                    className='p-img' 
                    src={Array.isArray(featuredProduct.productImage) 
                      ? featuredProduct.productImage[0] 
                      : featuredProduct.productImage || 'https://via.placeholder.com/300'
                    } 
                    alt={featuredProduct.productName} 
                  />
                  {!featuredProduct.productInStock && (
                    <img className='of-stock' src={S3} alt="Out of stock" />
                  )}
                  {featuredProduct.discount > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: '#F58634',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      -{featuredProduct.discount}%
                    </div>
                  )}
                </div>

                <div style={{marginBottom:'10', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'20px'}}>
                  <small>{featuredProduct.category?.name || 'Coconut Flakes'}</small>
                  <FontAwesomeIcon icon={faHeart} />
                </div>

                <div className='c-crunch'>
                  <p>{featuredProduct.productName}</p>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FontAwesomeIcon icon={faStar} style={{ color: '#F58634', fontSize: '20px' }} />
                      <small>{featuredProduct.productRating || '5.0'}</small>
                    </div>
                    
                    <div>
                      {featuredProduct.discount > 0 ? (
                        <>
                          <small style={{ textDecoration: 'line-through', color: '#999', marginRight: '8px' }}>
                            ${featuredProduct.productPrice}
                          </small>
                          <small className='price'>
                            ${(featuredProduct.productPrice * (1 - featuredProduct.discount / 100)).toFixed(2)}
                          </small>
                        </>
                      ) : (
                        <small className='price'>${featuredProduct.productPrice}</small>
                      )}
                    </div>
                  </div>
                  <button 
                    className='pb-btn'
                    onClick={() => handleAddToCart(featuredProduct)}
                    disabled={!featuredProduct.productInStock}
                  >
                    {featuredProduct.productInStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </>
            ) : (
              <p>No featured product available</p>
            )}
          </div>
        </div>

        {/* BOTTOM - 3 Product Cards */}
        <div className="sales-section mt-5">
          
          <div className="product-bottom row">
            {products.map((product) => (
              <div key={product._id} className="col-sm-12 col-md-12 col-lg-4">
                <div style={{ position: 'relative' }}>
                  {product.discount > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: '#F58634',
                      color: 'white',
                      padding: '5px 15px',
                      borderRadius: '5px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      zIndex: 1
                    }}>
                      -{product.discount}%
                    </div>
                  )}
                  <img 
                    className='p-img' 
                    src={Array.isArray(product.productImage) ? product.productImage[0] : product.productImage || 'https://via.placeholder.com/300'} 
                    alt={product.productName} 
                  />
                </div>
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
      </div>
    </>
  );
};

export default Sales;