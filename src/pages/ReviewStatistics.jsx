import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

const ReviewStatistics = () => {
  const { productid } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [userRating, setUserRating] = useState(0);
  const [headline, setHeadline] = useState("");
  const [review, setReview] = useState("");

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

  // Calculate rating statistics from real reviews
  const calculateRatings = () => {
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    reviews.forEach(review => {
      const rating = Math.round(review.rating);
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating]++;
      }
    });

    return [
      { stars: 5, count: ratingCounts[5] },
      { stars: 4, count: ratingCounts[4] },
      { stars: 3, count: ratingCounts[3] },
      { stars: 2, count: ratingCounts[2] },
      { stars: 1, count: ratingCounts[1] },
    ];
  };

  const ratings = calculateRatings();
  const totalReviews = reviews.length;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!userRating) {
      alert('Please select a rating');
      return;
    }

    if (!headline.trim()) {
      alert('Please add a headline');
      return;
    }

    if (!review.trim()) {
      alert('Please write a review');
      return;
    }

    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please login to submit a review');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          productId: productid,
          customerId: userId,
          rating: userRating,
          headline: headline,
          comment: review
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to submit review');
      }

      // Success - refresh reviews and reset form
      alert('Review submitted successfully!');
      setUserRating(0);
      setHeadline("");
      setReview("");
      fetchReviews(); // Reload reviews
      
    } catch (error) {
      alert('Failed to submit review: ' + error.message);
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="reviews-container">
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="reviews-container">
      <div className="reviews-left">
        <h4>Customer Reviews</h4>
        <p>Reviews ({totalReviews})</p>
        
        {totalReviews === 0 ? (
          <p className="text-muted">No reviews yet. Be the first to review!</p>
        ) : (
          ratings.map((r) => (
            <div key={r.stars} className="review-stat">
              <span>{r.stars} stars:</span>
              <span>{r.count}</span>
            </div>
          ))
        )}
      </div>

      <div className="reviews-right">
        <h4>How would you rate this?</h4>
        <div className="star-input">
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesomeIcon
              key={star}
              icon={faStar}
              onClick={() => setUserRating(star)}
              style={{
                cursor: "pointer",
                color: userRating >= star ? "#F58634" : "#ccc",
                marginRight: "5px",
                fontSize: "24px"
              }}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <label>Add a headline</label>
          <input
            type="text"
            placeholder="Write a summary of your review"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            required
          />

          <label>Write a review</label>
          <textarea
            placeholder="Tell us what you think"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="5"
            required
          ></textarea>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewStatistics;