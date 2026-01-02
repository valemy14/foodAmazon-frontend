import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { U1 } from "../assets/Index";

function SignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/foodAmazondocuments/users/login', {
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

      // Save token
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data._id);  // ← ADD THIS LINE
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);

      // Redirect to home
      navigate('/');
      
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src={U1} alt="Login Visual" />
      </div>

      <div className="login-right">
        <h2 className="login-title">Login</h2>

        <p className="signup-text">
          Don't have an account yet?{" "}
          <Link to="/signup" className="signup-link">Sign Up</Link>
        </p>

        {error && (
          <div style={{
            padding: "12px",
            marginBottom: "15px",
            backgroundColor: "#fee",
            color: "#c33",
            borderRadius: "6px",
            border: "1px solid #fcc"
          }}>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email"
            placeholder="Email Address" 
            value={formData.email}
            onChange={handleChange}
            required 
          />

          <div className="password-container">
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="remember-row">
            <label>
              <input type="checkbox" /> Remember me
            </label>

            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignInPage;