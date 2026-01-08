import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext
import { useCart } from '../context/CartContext'; // Import CartContext

const AuthPages = ({ initialPage = 'signup' }) => {
  const navigate = useNavigate();
  const { register, login, loading } = useAuth();
  const { setUserId } = useCart(); // To update cart after login
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    rememberMe: false,
    agreeToTerms: false
  });

  // Update currentPage when initialPage changes (route changes)
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear errors when user types
    setError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!formData.password.trim()) {
      setError('Please enter a password');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    // Call register API
    const result = await register(formData.fullName, formData.email, formData.password);
    
    if (result.success) {
      setSuccessMessage('Account created successfully!');
      // Update cart userId
      setUserId(localStorage.getItem('userId'));
      // Navigate to success page or dashboard
      navigateToPage('success');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!formData.password.trim()) {
      setError('Please enter your password');
      return;
    }

    // Call login API
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Update cart userId
      setUserId(localStorage.getItem('userId'));
      setSuccessMessage('Login successful!');
     if (result.isSuperAdmin) {
    navigate('/superadmin/dashboard');
  } else if (result.isDistributor) {
    navigate('/distributor/dashboard');
  } else {
    navigate('/'); // fallback for normal users
  }
} else {
  setError(result.error || 'Login failed. Please check your credentials.');
}
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return;
    }

    // TODO: Add password reset API call when backend is ready
    // For now, just navigate to confirm page
    setSuccessMessage('Password reset link sent to your email!');
    navigateToPage('confirm');
  };

  const navigateToPage = (page) => {
    setCurrentPage(page);
    setError(''); // Clear errors on navigation
    setSuccessMessage(''); // Clear success messages
    
    // Update URL based on page
    switch(page) {
      case 'login':
        navigate('/distributor/login');
        break;
      case 'signup':
        navigate('/distributor/signup');
        break;
      case 'reset':
        navigate('/distributor/password-reset');
        break;
      case 'confirm':
        navigate('/distributor/confirm-email');
        break;
      case 'success':
        navigate('/distributor/success');
        break;
      default:
        break;
    }
  };

  const renderSignUp = () => (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        <p className="auth-subtitle">Create your account to get started</p>
        
        <form className="auth-form" onSubmit={handleSignUp}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullName"
              className="form-control" 
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              className="form-control" 
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control" 
                placeholder="Create a password (min 6 characters)"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-check mb-3">
            <input 
              type="checkbox" 
              name="agreeToTerms"
              className="form-check-input" 
              id="terms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              disabled={loading}
            />
            <label className="form-check-label" htmlFor="terms">
              I agree to the <a href="#terms">Terms & Conditions</a>
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-auth"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="auth-divider">
            <span>Or sign up with Google</span>
          </div>

          <button type="button" className="btn btn-google" disabled={loading}>
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Sign up with Google
          </button>

          <p className="auth-footer">
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigateToPage('login'); }}>Sign In</a>
          </p>
        </form>
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to your account</p>
        
        <form className="auth-form" onSubmit={handleLogin}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              className="form-control" 
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control" 
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input 
                type="checkbox" 
                name="rememberMe"
                className="form-check-input" 
                id="remember"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="remember">
                Remember me
              </label>
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateToPage('reset'); }} className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-auth"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="auth-divider">
            <span>Or login with Google</span>
          </div>

          <button type="button" className="btn btn-google" disabled={loading}>
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Login with Google
          </button>

          <p className="auth-footer">
            Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigateToPage('signup'); }}>Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );

  const renderPasswordReset = () => (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Password Reset</h2>
        <p className="auth-subtitle">Enter your email to reset your password</p>
        
        <form className="auth-form" onSubmit={handlePasswordReset}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              className="form-control" 
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-auth"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Continue'}
          </button>

          <p className="auth-footer">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateToPage('login'); }}>Back to Login</a>
          </p>
        </form>
      </div>
    </div>
  );

  const renderConfirmEmail = () => (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Confirm Email</h2>
        <p className="auth-subtitle">We've sent a confirmation link to your email</p>
        
        <div className="auth-form text-center">
          {successMessage && (
            <div className="alert alert-success mb-4" role="alert">
              {successMessage}
            </div>
          )}
          
          <div className="email-icon mb-4">
            📧
          </div>
          
          <p className="mb-4">
            Please check your email and click on the confirmation link to verify your account.
          </p>

          <button 
            type="button" 
            className="btn btn-primary btn-auth"
            onClick={() => navigateToPage('login')}
          >
            Back to Login
          </button>

          <p className="auth-footer mt-4">
            Didn't receive the email? <a href="#" onClick={(e) => e.preventDefault()}>Resend</a>
          </p>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-form text-center">
          <div className="success-icon mb-4">
            <div className="checkmark-circle">
              <svg viewBox="0 0 52 52" className="checkmark">
                <circle className="checkmark-circle-svg" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
          </div>
          
          <h2 className="auth-title">Almost There!</h2>
          <p className="auth-subtitle mb-4">
            Your account has been created successfully
          </p>

          <button 
            type="button" 
            className="btn btn-primary btn-auth"
            onClick={() => navigate('/distributor/dashboard')}
          >
            Go to Dashboard
          </button>

          <p className="auth-footer mt-4">
            Need help? <a href="#" onClick={(e) => e.preventDefault()}>Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="auth-wrapper">
      {currentPage === 'signup' && renderSignUp()}
      {currentPage === 'login' && renderLogin()}
      {currentPage === 'reset' && renderPasswordReset()}
      {currentPage === 'confirm' && renderConfirmEmail()}
      {currentPage === 'success' && renderSuccess()}
    </div>
  );
};

export default AuthPages;