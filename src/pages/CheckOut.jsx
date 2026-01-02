import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { C4, C5 } from "../assets/Index";

const CheckOut = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Cart data
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  
  // Form data
  const [formData, setFormData] = useState({
    email: localStorage.getItem('userEmail') || "",
    firstName: "",
    lastName: "",
    address: "",
    country: "Nigeria",
    state: "",
    city: "",
    zipCode: "",
    phoneNumber: "",
    orderNote: ""
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/foodAmazondocuments/carts/get-cart/${userId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        setError('Your cart is empty');
        setCartItems([]);
        setCartTotal(0);
      } else {
        setCartItems(data.items);
        setCartTotal(data.totalAmount);
      }
    } catch (err) {
      setError('Failed to load cart: ' + err.message);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotals = () => {
    const subtotal = cartTotal;
    const savings = 0; // You can calculate savings based on discounts if needed
    const shipping = 0; // FREE shipping
    const tax = subtotal * 0.01; // 1% tax
    const total = subtotal - savings + shipping + tax;

    return { subtotal, savings, shipping, tax, total };
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phoneNumber || !formData.address || !formData.city || 
        !formData.state) {
      setError("Please fill all required fields");
      setSubmitting(false);
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      setSubmitting(false);
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const totals = calculateTotals();

      // Prepare order items matching your schema
      const orderItems = cartItems.map(item => ({
        productId: item.product._id,
        name: item.productName,
        image: item.productImage || '',
        price: item.productPrice,
        quantity: item.quantity,
        subTotal: item.productPrice * item.quantity
      }));

      // Prepare order data matching your Order schema
      const orderData = {
        customerId: userId,
        customerSnapshot: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          zipCode: formData.zipCode,
          phoneNumber: formData.phoneNumber,
          orderNote: formData.orderNote
        },
        items: orderItems,
        totalAmount: totals.total
      };

      console.log('Sending order data:', orderData);

      // Create order and initialize Paystack payment
      const response = await fetch(
        'http://localhost:3000/api/foodAmazondocuments/orders/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify(orderData)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create order');
      }

      const result = await response.json();
      console.log('Order created:', result);

      // Clear cart after successful order
      await fetch(
        `http://localhost:3000/api/foodAmazondocuments/carts/clear-cart/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );

      // Redirect to Paystack payment page
      window.location.href = result.authorizationUrl;

    } catch (err) {
      setError('Failed to place order: ' + err.message);
      console.error('Error placing order:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="container checkout-wrapper py-5">
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      <div className="row g-5">
        {/* LEFT SECTION - Billing Details */}
        <div className="col-lg-7">
          <h4 className="mb-4 fw-bold">Billing Details</h4>

          <form onSubmit={handlePlaceOrder}>
            {/* Email */}
            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control email-input"
                placeholder="Your email address *"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Country */}
            <div className="mb-3">
              <label className="form-label">Country</label>
              <select 
                name="country"
                className="form-select form-select-lg custom-select wide-input"
                value={formData.country}
                onChange={handleChange}
              >
                <option>Nigeria</option>
              </select>
            </div>

            {/* First & Last Name */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  placeholder="First name *"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3 last-name">
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  placeholder="Last name *"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-3">
              <input
                type="text"
                name="address"
                className="form-control"
                placeholder="Address *"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            {/* City / State / Zip */}
            <div className="row">
              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  placeholder="City *"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  name="state"
                  className="form-control"
                  placeholder="State *"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  name="zipCode"
                  className="form-control"
                  placeholder="Zip code"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="mb-3">
              <input
                type="tel"
                name="phoneNumber"
                className="form-control"
                placeholder="Phone number *"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Notes */}
            <div className="mb-3">
              <textarea
                name="orderNote"
                className="form-control"
                rows="3"
                placeholder="Order note (optional)"
                value={formData.orderNote}
                onChange={handleChange}
              ></textarea>
            </div>
          </form>
        </div>

        {/* RIGHT SECTION - Order Summary */}
        <div className="col-lg-5">
          <div className="order-summary-section">
            <h5 className="fw-bold mb-3">Your Order</h5>
            <hr />

            {/* Cart Items */}
            {cartItems.length > 0 && (
              <div className="mb-3">
                <h6 className="fw-bold">Items:</h6>
                {cartItems.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between mb-2">
                    <span className="small">
                      {item.productName} x {item.quantity}
                    </span>
                    <span className="small">
                      ₦{(item.productPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <hr />
              </div>
            )}

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>₦{totals.subtotal.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Savings</span>
              <span className="text-danger">-₦{totals.savings.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span className="text-success">FREE</span>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span>Estimated Tax (1%)</span>
              <span>₦{totals.tax.toFixed(2)}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-3">
              <strong>Total</strong>
              <strong>₦{totals.total.toFixed(2)}</strong>
            </div>
          </div>

          {/* PAYMENT SECTION */}
          <div className="payment-section mt-4">
            <h5 className="fw-bold mb-3">Pay With</h5>

            {/* Card Option */}
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <label className="ms-2">Card</label>
              <img src={C5} alt="Cards" style={{ marginLeft: '10px' }} />
            </div>

            {/* PayPal Option */}
            <div className="form-check mt-3">
              <input 
                className="form-check-input"
                type="radio"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
              />
              <label style={{color:'#566363'}} className="ms-2">PayPal</label>
              <img src={C4} alt="PayPal" style={{ marginLeft: '10px' }} />
            </div>

            <button 
              className="btn btn-warning mt-4 w-100 py-2 fw-semibold"
              onClick={handlePlaceOrder}
              disabled={submitting || cartItems.length === 0}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Processing...
                </>
              ) : (
                'Place Order'
              )}
            </button>

            <p className="text-muted small mt-3 text-center">
              You will be redirected to Paystack for secure payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;