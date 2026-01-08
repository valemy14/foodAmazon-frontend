import { useState } from 'react';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api/foodAmazondocuments';

// Sign Up Component
export function SuperAdminSignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }

      // Get token from response header
      const token = response.headers.get('x-auth-token');
      const data = await response.json();
      
      // Save token and user info
      if (token) {
        localStorage.setItem('token', token);
      }
      localStorage.setItem('userId', data._id);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('role', 'superadmin'); 

      // Navigate to success page
      navigate('/superadmin-success');
      
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Sign Up</h1>
        <p className="auth-subtitle">Create your Super Admin account</p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password (min 5 characters)"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={5}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="#">Terms and Conditions</a>
            </label>
          </div>

          <button type="submit" className="btn-auth-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="auth-footer">
            <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/superadmin-login'); }}>Sign In</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

// Login Component
export function SuperAdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Login failed');
      }

      const data = await response.json();

      // Save token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data._id);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);
     localStorage.setItem('role', 'superadmin') 

      // Navigate to dashboard
      navigate('/superadmin');
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your Super Admin account</p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <div className="form-checkbox">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); navigate('/superadmin-reset'); }}>Forgot Password?</a>
          </div>

          <button type="submit" className="btn-auth-primary" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="auth-footer">
            <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/superadmin-signup'); }}>Sign Up</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

// Password Reset Component
export function SuperAdminPasswordReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sending email
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Password Reset</h1>
        <p className="auth-subtitle">Enter your email address and we'll send you a link to reset your password</p>

        {success && (
          <div className="alert alert-success">
            Password reset link sent! Please check your email.
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-auth-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="auth-footer">
            <p><a href="#" onClick={(e) => { e.preventDefault(); navigate('/superadmin-login'); }}>Back to Login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}

// Email Confirmation Component
export function SuperAdminEmailConfirm() {
  const navigate = useNavigate();

  const handleResend = () => {
    alert('Confirmation email sent!');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Confirm Email</h1>
        <p className="auth-subtitle">We've sent a confirmation link to your email address. Please check your inbox and click the link to verify your account.</p>

        <div className="auth-form">
          <button type="button" className="btn-auth-primary" onClick={handleResend}>
            Resend Email
          </button>

          <div className="auth-footer">
            <p><a href="#" onClick={(e) => { e.preventDefault(); navigate('/superadmin-login'); }}>Back to Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Almost There / Success Component
export function SuperAdminAlmostThere() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Admin';

  return (
    <div className="auth-container">
      <div className="auth-card success-card">
        <div className="success-icon">
          <CheckCircle size={64} color="#10b981" />
        </div>
        <h1 className="auth-title">Welcome, {userName}!</h1>
        <p className="auth-subtitle">Your Super Admin account has been created successfully. You now have full access to the admin dashboard.</p>

        <div className="auth-form">
          <button type="button" className="btn-auth-primary" onClick={() => navigate('/superadmin')}>
            Go to Dashboard
          </button>

          <div className="auth-footer">
            <p>Need help? <a href="#">Contact Support</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default export
export default function SuperAdminAuth() {
  return <SuperAdminLogin />;
}