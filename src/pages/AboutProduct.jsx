import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faStar } from "@fortawesome/free-solid-svg-icons";
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/wishlistContext';

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

const AboutProduct = () => {
    const { productid } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist } = useWishlist();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [count, setCount] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedVariety, setSelectedVariety] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [productid]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/products/get-single-product/${productid}`);
            
            if (!response.ok) {
                throw new Error('Product not found');
            }

            const data = await response.json();
            setProduct(data);
            setSelectedVariety(data.productVariety || '');
        } catch (err) {
            setError(err.message);
            console.error('Error fetching product:', err);
        } finally {
            setLoading(false);
        }
    };

    const increment = () => setCount((c) => c + 1);
    const decrement = () => setCount((c) => (c > 1 ? c - 1 : 1));

    const handleAddToCart = async () => {
        const result = await addToCart(
            product._id,
            product.productName,
            product.productPrice,
            Array.isArray(product.productImage) ? product.productImage[0] : product.productImage,
            count
        );

        if (result.success) {
            alert('Added to cart successfully!');
        } else {
            alert(result.error || 'Failed to add to cart');
        }
    };

    const handleAddToWishlist = async () => {
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

    const handleCheckout = async () => {
        // First add to cart, then navigate to checkout
        await handleAddToCart();
        navigate('/checkout');
    };

    const nextImage = () => {
        if (Array.isArray(product.productImage) && product.productImage.length > 1) {
            setCurrentImageIndex((prev) => 
                prev === product.productImage.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (Array.isArray(product.productImage) && product.productImage.length > 1) {
            setCurrentImageIndex((prev) => 
                prev === 0 ? product.productImage.length - 1 : prev - 1
            );
        }
    };

    const calculateDiscountedPrice = () => {
        if (product.onSale && product.discount > 0) {
            return (product.productPrice * (1 - product.discount / 100)).toFixed(2);
        }
        return product.productPrice;
    };

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <h3>Loading product...</h3>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container my-5 text-center">
                <h3>{error || 'Product not found'}</h3>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/products')}>
                    Back to Products
                </button>
            </div>
        );
    }

    const displayImage = Array.isArray(product.productImage) 
        ? product.productImage[currentImageIndex] 
        : product.productImage;

    const thumbnails = Array.isArray(product.productImage) 
        ? product.productImage 
        : [product.productImage];

    return (
        <>
        <div className="about-product">
            <div className="row">
                {/* LEFT SIDE */}
                <div className="col-sm-12 col-md-12 col-lg-6 Ap-left">
                    <img 
                        className='big-img' 
                        src={displayImage || 'https://via.placeholder.com/500'} 
                        alt={product.productName} 
                    />

                    <div className='scrolling'>
                        <FontAwesomeIcon 
                            icon={faArrowLeft} 
                            onClick={prevImage}
                            style={{ cursor: 'pointer' }}
                        />
                        {thumbnails.map((img, index) => (
                            <img 
                                key={index} 
                                src={img || 'https://via.placeholder.com/100'} 
                                alt={product.productName}
                                onClick={() => setCurrentImageIndex(index)}
                                style={{ 
                                    cursor: 'pointer',
                                    border: index === currentImageIndex ? '2px solid #F58634' : 'none'
                                }}
                            />
                        ))}
                        <FontAwesomeIcon 
                            icon={faArrowRight} 
                            onClick={nextImage}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="col-sm-12 col-md-12 col-lg-6 Ap-right">
                    <small className='pc'>{product.category?.name || 'Product'}</small>
                    <h5>{product.productName}</h5>

                    <div className="prices">
                        {product.onSale && product.discount > 0 ? (
                            <>
                                <small className='old-price'>${product.productPrice}</small>
                                <small className='new-price'>${calculateDiscountedPrice()}</small>
                                <span className="badge bg-danger ms-2">-{product.discount}%</span>
                            </>
                        ) : (
                            <small className='new-price'>${product.productPrice}</small>
                        )}
                    </div>

                    <div className="rating">
                        <FontAwesomeIcon icon={faStar} style={{ color: '#F58634', marginRight: '5px' }} />
                        <span>{product.productRating || '5.0'}</span>
                    </div>

                    {product.productVariety && (
                        <div className='variety'>
                            <small>Variety:</small>
                            <p>{product.productVariety}</p>
                        </div>
                    )}

                    <div className='quantity'>
                        <small>Quantity:</small>
                        <button className='quantity-btn' onClick={decrement}>-</button>
                        <span className='count'>{count}</span>
                        <button className='quantity-btn' onClick={increment}>+</button>
                    </div>

                    {product.productDescription && (
                        <p>{product.productDescription}</p>
                    )}

                    <div className="mb-3">
                        <small className={product.productInStock ? 'text-success' : 'text-danger'}>
                            {product.productInStock ? '✓ In Stock' : '✗ Out of Stock'}
                        </small>
                    </div>

                    <div className='Ap-btn'>
                        <button 
                            className='one' 
                            onClick={handleAddToCart}
                            disabled={!product.productInStock}
                        >
                            Add to Cart
                        </button>
                        <button 
                            className='two' 
                            onClick={handleCheckout}
                            disabled={!product.productInStock}
                        >
                            Check Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default AboutProduct;