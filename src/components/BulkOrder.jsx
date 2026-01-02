import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { B4 } from '../assets/Index'
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

const BulkOrder = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBulkProducts();
    }, []);

    const fetchBulkProducts = async () => {
        try {
            // Fetch first 3 products from your database
            const response = await fetch(`${API_BASE_URL}/products/get-all-products`);
            const data = await response.json();
            
            // Take only first 3 products
            setProducts(data.slice(0, 3));
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container pb-5 text-center">
                <p>Loading products...</p>
            </div>
        );
    }

    return (
        <div className="container pb-5">
            <div className="row">
                {products.map((product) => (
                    <div key={product._id} className="col-sm-12 col-md-12 col-lg-3">
                        <div className="bulk-card">
                            <img 
                                className='w-100' 
                                src={
                                    Array.isArray(product.productImage) 
                                        ? product.productImage[0] 
                                        : product.productImage || 'https://via.placeholder.com/300'
                                } 
                                alt={product.productName} 
                            />
                            <div className="bcard-bottom">
                                <p>{product.productName}</p>
                                <small>
                                    {product.productDescription 
                                        ? product.productDescription.substring(0, 60) + '...' 
                                        : product.productVariety || 'Delicious and healthy snack'}
                                </small>
                                <div>
                                    <button
                                        className='b-btn'
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        ORDER NOW <FontAwesomeIcon icon={faArrowRight} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="col-sm-12 col-md-12 col-lg-3">
                    <div className="green-card">
                        <img className='b-img' src={B4} alt="Others" />
                        <div className='gcard-content'>
                            <p>Others</p>
                            <small>Milk, Tools, Spice, etc.</small>
                            <div>
                                <button 
                                    className='g-btn'
                                    onClick={() => navigate('/products')}
                                >
                                    See Others <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BulkOrder;