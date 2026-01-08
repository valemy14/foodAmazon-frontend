import React, { useState, useEffect } from 'react';
import { reviewService } from '../services/reviewService';

const ReviewsPage = () => {
  const [activeTab, setActiveTab] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  
  // API States
  const [reviews, setReviews] = useState([]);
  const [topRatedReview, setTopRatedReview] = useState(null);
  const [worstRatedReview, setWorstRatedReview] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 6;

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (activeTab === 'published') {
      fetchReviewsByStatus('approved');
    } else if (activeTab === 'latest') {
      fetchReviewsByStatus('pending');
    }
  }, [activeTab]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [reviewsData, topRated, worstRated, statsData] = await Promise.all([
        reviewService.getAllReviews(),
        reviewService.getTopRated(),
        reviewService.getWorstRated(),
        reviewService.getStats()
      ]);

      setReviews(reviewsData);
      setTopRatedReview(topRated);
      setWorstRatedReview(worstRated);
      setStats(statsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching reviews data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewsByStatus = async (status) => {
    try {
      setLoading(true);
      const data = await reviewService.getReviewsByStatus(status);
      setReviews(data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching reviews by status:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (reviewId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
      await reviewService.updateStatus(reviewId, newStatus);
      
      setReviews(reviews.map(review => 
        review._id === reviewId ? { ...review, status: newStatus } : review
      ));
      
      const statsData = await reviewService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error updating review status:', err);
      alert('Failed to update review status');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter(review => review._id !== reviewId));
      fetchAllData();
      alert('Review deleted successfully');
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="reviews-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'reviews-star filled' : 'reviews-star'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffMs = now - reviewDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours}:${String(reviewDate.getMinutes()).padStart(2, '0')}${diffHours >= 12 ? 'pm' : 'am'} Today`;
    if (diffDays === 1) return 'Yesterday';
    return reviewDate.toLocaleDateString();
  };

  // Pagination
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = reviews.slice(startIndex, endIndex);

  if (loading && !reviews.length) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div>Loading reviews...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Title */}
      <div className="reviews-page-title">
        <h1>Reviews</h1>
        {stats && (
          <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
            Total: {stats.totalReviews} | Pending: {stats.pending} | Approved: {stats.approved}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ padding: '20px', color: 'red', textAlign: 'center', marginBottom: '20px' }}>
          Error loading reviews: {error.toString()}
        </div>
      )}

      {/* Top and Worst Rated Section */}
      <div className="reviews-rating-summary">
        {/* Top Rated */}
        <div className="reviews-rating-card">
          <div className="reviews-rating-header">
            <h3>Top Rated</h3>
            <span className="reviews-trend-up">▲</span>
          </div>
          <p className="reviews-rating-subtitle">Average Rating – 360 Organic Foodie</p>
          {topRatedReview ? (
            <>
              {renderStars(topRatedReview.rating)}
              <div className="reviews-preview-card">
                <div className="reviews-preview-header">
                  <span className="reviews-preview-name">
                    {topRatedReview.customer?.firstName} {topRatedReview.customer?.lastName}
                  </span>
                  <span className="reviews-preview-time">{formatTime(topRatedReview.createdAt)}</span>
                </div>
                <div className="reviews-preview-product">
                  <span className="reviews-product-icon">📦</span>
                  <span className="reviews-product-name">{topRatedReview.product?.productName}</span>
                  {renderStars(topRatedReview.rating)}
                </div>
                <p className="reviews-preview-text">{topRatedReview.comment}</p>
              </div>
            </>
          ) : (
            <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No approved reviews yet</p>
          )}
        </div>

        {/* Worst Rated */}
        <div className="reviews-rating-card">
          <div className="reviews-rating-header">
            <h3>Worst rated</h3>
            <span className="reviews-trend-down">▼</span>
          </div>
          <p className="reviews-rating-subtitle">Average Rating – 360 Organic Foodie</p>
          {worstRatedReview ? (
            <>
              {renderStars(worstRatedReview.rating)}
              <div className="reviews-preview-card">
                <div className="reviews-preview-header">
                  <span className="reviews-preview-name">
                    {worstRatedReview.customer?.firstName} {worstRatedReview.customer?.lastName}
                  </span>
                  <span className="reviews-preview-time">{formatTime(worstRatedReview.createdAt)}</span>
                </div>
                <div className="reviews-preview-product">
                  <span className="reviews-product-icon">📦</span>
                  <span className="reviews-product-name">{worstRatedReview.product?.productName}</span>
                  {renderStars(worstRatedReview.rating)}
                </div>
                <p className="reviews-preview-text">{worstRatedReview.comment}</p>
              </div>
            </>
          ) : (
            <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No approved reviews yet</p>
          )}
        </div>
      </div>

      {/* Tabs and Filter */}
      <div className="reviews-controls">
        <div className="reviews-tabs">
          <button 
            className={`reviews-tab ${activeTab === 'latest' ? 'active' : ''}`}
            onClick={() => setActiveTab('latest')}
          >
            Latest (Pending)
          </button>
          <button 
            className={`reviews-tab ${activeTab === 'published' ? 'active' : ''}`}
            onClick={() => setActiveTab('published')}
          >
            Published
          </button>
        </div>
        <button className="reviews-filter-btn" onClick={() => window.location.reload()}>
          Refresh <span className="reviews-filter-icon">🔄</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="reviews-grid">
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            Loading reviews...
          </div>
        ) : currentReviews.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
            No reviews to display
          </div>
        ) : (
          currentReviews.map((review) => (
            <div key={review._id} className="reviews-card">
              <div className="reviews-card-header">
                <div className="reviews-card-user">
                  <div className="reviews-card-avatar" style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    {review.customer?.firstName?.charAt(0) || '👤'}
                  </div>
                  <span className="reviews-card-arrow">▶</span>
                  <div className="reviews-card-info">
                    <h4 className="reviews-card-name">
                      {review.customer?.firstName} {review.customer?.lastName}
                    </h4>
                    <span className="reviews-card-time">{formatTime(review.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="reviews-card-product">
                <span className="reviews-product-icon">📦</span>
                <span className="reviews-product-name">{review.product?.productName || 'Product'}</span>
                {renderStars(review.rating)}
              </div>

              <h5 className="reviews-card-product-title">{review.product?.productName}</h5>

              <p className="reviews-card-text">{review.comment}</p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className={`reviews-action-btn ${review.status === 'approved' ? 'unpublish' : 'publish'}`}
                  onClick={() => handlePublishToggle(review._id, review.status)}
                >
                  {review.status === 'approved' ? 'Unpublish' : 'Publish to Website'}
                </button>
                <button 
                  className="reviews-action-btn"
                  style={{ backgroundColor: '#ef4444' }}
                  onClick={() => handleDeleteReview(review._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {reviews.length > 0 && (
        <div className="reviews-pagination">
          <div className="reviews-pagination-info">
            Showing {startIndex + 1} to {Math.min(endIndex, reviews.length)} of {reviews.length} Items
          </div>
          <div className="reviews-pagination-controls">
            <button 
              className="reviews-page-btn" 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              ‹
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button 
                key={index + 1}
                className={`reviews-page-btn ${currentPage === index + 1 ? 'active' : ''}`} 
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button 
              className="reviews-page-btn" 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;