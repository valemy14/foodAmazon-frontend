import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

const Testimonials = () => {
  const { productid } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    if (productid) {
      fetchReviews();
    }
  }, [productid]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/product/${productid}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  const displayedReviews = reviews.slice(0, displayCount);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h4>Customer Reviews</h4>
        <p className="text-muted">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h4 className="mb-4">Customer Reviews ({reviews.length})</h4>
      
      <div className="row g-4">
        {displayedReviews.map((review) => (
          <div className="col-sm-12 col-md-12 col-lg-4 testimonial-col" key={review._id}>
            <div className="border rounded p-3 shadow-sm h-100">
              
              {/* Top (Image + Name + Stars) */}
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                  style={{ width: '60px', height: '60px', fontSize: '24px', fontWeight: 'bold' }}
                >
                  {review.customer?.name?.charAt(0).toUpperCase() || 'U'}
                </div>

                <div>
                  <h5 className="mb-1 fw-bold">
                    {review.customer?.name || 'Anonymous'}
                  </h5>
                  <div className="text-warning">
                    {[...Array(Math.round(review.rating))].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} size="sm" />
                    ))}
                    {[...Array(5 - Math.round(review.rating))].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} size="sm" style={{ color: '#ddd' }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Headline */}
              {review.headline && (
                <h6 className="mt-3 fw-semibold text-success">{review.headline}</h6>
              )}

              {/* Review Text */}
              <p className="text-muted mt-2">{review.comment}</p>

              {/* Date */}
              <small className="text-muted">
                {new Date(review.createdAt || review.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </small>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {displayCount < reviews.length && (
        <div className="text-center mt-4">
          <button className="btn btn-success px-4" onClick={handleLoadMore}>
            Load More ({reviews.length - displayCount} more)
          </button>
        </div>
      )}
    </div>
  );
};

export default Testimonials;