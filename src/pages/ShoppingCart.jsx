import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { cart, loading, updateQuantity, removeFromCart, fetchCart, userId } = useCart();

  useEffect(() => {
    if (userId) {
      fetchCart(userId);
    }
  }, [userId]);

  const increaseQty = async (productId, currentQty) => {
    await updateQuantity(productId, currentQty + 1);
  };

  const decreaseQty = async (productId, currentQty) => {
    if (currentQty > 1) {
      await updateQuantity(productId, currentQty - 1);
    }
  };

  const removeItem = async (productId) => {
    const result = await removeFromCart(productId);
    if (result.success) {
      alert('Item removed from cart');
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <h3>Loading cart...</h3>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h3>Your cart is empty</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  // SUMMARY VALUES
  const total = cart.totalAmount || 0;
  const savings = 82;
  const estimatedTax = 3.5;
  const grandTotal = total - savings + estimatedTax;

  return (
    <div className="container my-5">
      <div className="row g-5">
        {/* LEFT SIDE */}
        <div className="col-lg-8">
          <h3 className="mb-4">Shopping Cart ({cart.totalItems || 0} Items)</h3>

          {cart.items.map((item, index) => (
            <div
              key={item._id}
              className="row py-4 border-bottom align-items-center"
            >
              <div className="col-3">
                <img
                  src={item.productImage || 'https://via.placeholder.com/150'}
                  alt={item.productName}
                  className="img-fluid rounded"
                />
              </div>

              <div className="col-6">
                <h6 className="fw-bold">Item {index + 1}</h6>
                <p className="mb-1">{item.productName}</p>
                <p className="text-muted mb-1">Product ID: {typeof item.product === 'string' ? item.product : item.product?._id}</p>
                <strong className="d-block mb-2">${item.productPrice}</strong>

                <button className="btn btn-link p-0 me-3">Save for later</button>
                <button
                  className="btn btn-link p-0 text-danger"
                  onClick={() => removeItem(typeof item.product === 'string' ? item.product : item.product?._id)}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>

              {/* QTY SECTION */}
              <div className="col-3">
                <label className="fw-semibold">Qty:</label>
                <div className="input-group mt-1 qty-box">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => decreaseQty(typeof item.product === 'string' ? item.product : item.product?._id, item.quantity)}
                    disabled={loading}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="form-control text-center"
                    value={item.quantity}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => increaseQty(typeof item.product === 'string' ? item.product : item.product?._id, item.quantity)}
                    disabled={loading}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="col-lg-4">
          <div className="border p-4 rounded shadow-sm">
            <h5 className="mb-4 fw-bold">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2">
              <span>Original Price</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Savings</span>
              <span className="text-danger">-${savings.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span className="text-success">FREE</span>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span>Estimated Sales Tax</span>
              <span>${estimatedTax.toFixed(2)}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-3">
              <strong>Total</strong>
              <strong>${grandTotal.toFixed(2)}</strong>
            </div>

            <button 
              className="btn btn-warning w-100 fw-semibold py-2" 
              onClick={() => navigate('/checkout')}
              disabled={loading}
            >
              Proceed to Check Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;