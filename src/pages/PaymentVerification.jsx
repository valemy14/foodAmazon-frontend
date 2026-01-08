import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, failed
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const reference = searchParams.get('reference');
    
    if (!reference) {
      setStatus('failed');
      setError('No payment reference found');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orders/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ reference })
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setOrderDetails(data.order);
        
        // Clear cart after successful payment
        const userId = localStorage.getItem('userId');
        if (userId) {
          await fetch(`${API_BASE_URL}/carts/clear-cart/${userId}`, {
            method: 'DELETE',
            headers: {
              'x-auth-token': localStorage.getItem('token')
            }
          });
        }
      } else {
        setStatus('failed');
        setError(data.message || 'Payment verification failed');
      }
    } catch (err) {
      setStatus('failed');
      setError('Failed to verify payment. Please contact support.');
      console.error('Verification error:', err);
    }
  };

  if (status === 'verifying') {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3 className="mt-4">Verifying your payment...</h3>
        <p className="text-muted">Please wait while we confirm your transaction</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="success-icon mb-4">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="#28a745" />
              <path d="M30 50 L45 65 L70 35" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          
          <h2 className="text-success mb-3">Payment Successful!</h2>
          <p className="lead">Thank you for your order</p>
          
          {orderDetails && (
            <div className="card mt-4 mx-auto" style={{ maxWidth: '500px' }}>
              <div className="card-body">
                <h5 className="card-title">Order Details</h5>
                <hr />
                <div className="text-start">
                  <p><strong>Order ID:</strong> {orderDetails._id}</p>
                  <p><strong>Amount:</strong> ₦{orderDetails.totalAmount.toFixed(2)}</p>
                  <p><strong>Payment Status:</strong> 
                    <span className="badge bg-success ms-2">{orderDetails.paymentStatus}</span>
                  </p>
                  <p><strong>Transaction ID:</strong> {orderDetails.transactionId}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <button 
              className="btn btn-warning btn-lg me-3"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
            <button 
              className="btn btn-outline-secondary btn-lg"
              onClick={() => navigate('/orders')}
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="error-icon mb-4">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="#dc3545" />
              <path d="M35 35 L65 65 M65 35 L35 65" stroke="white" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>
          
          <h2 className="text-danger mb-3">Payment Failed</h2>
          <p className="lead">{error}</p>
          
          <div className="mt-4">
            <button 
              className="btn btn-warning btn-lg me-3"
              onClick={() => navigate('/checkout')}
            >
              Try Again
            </button>
            <button 
              className="btn btn-outline-secondary btn-lg"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default PaymentVerification;