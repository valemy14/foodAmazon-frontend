import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { U1 } from "../assets/Index";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    agreedToTerms: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.agreedToTerms) {
      setError("You must agree to the Privacy Policy and Terms of Use");
      return;
    }

    if (formData.password.length < 5) {
      setError("Password must be at least 5 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/foodAmazondocuments/users/register', {
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

      const data = await response.json();

      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);

      // Redirect to home page
      navigate('/');
      
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="signup-page">

        {/* LEFT IMAGE */}
        <div className="signup-left">
          <img src={U1} alt="Signup" />
        </div>

        {/* RIGHT FORM */}
        <div className="signup-right">
          <div className="signup-form-container">

            <h2 className="signup-title">Sign up</h2>

            <p className="signup-text">
              Already have an account? <Link to="/login" className="signin-link">Sign in</Link>
            </p>

            {error && (
              <div style={{
                padding: "12px",
                marginBottom: "15px",
                backgroundColor: "#fee",
                color: "#c33",
                borderRadius: "6px",
                border: "1px solid #fcc",
                fontSize: "14px"
              }}>
                {error}
              </div>
            )}

            <form className="signup-form" onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="name"
                placeholder="Your name" 
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
              
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              
              <input 
                type="text" 
                name="phone"
                placeholder="Phone Number" 
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
              
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                required
                minLength={5}
                disabled={loading}
              />

              <label className="checkbox-row">
                <input 
                  type="checkbox" 
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>I agree with Privacy Policy and Terms of Use</span>
              </label>

              <button 
                type="submit" 
                className="signup-btn"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

          </div>
        </div>

      </div>
    </>
  );
};

export default SignUpPage;