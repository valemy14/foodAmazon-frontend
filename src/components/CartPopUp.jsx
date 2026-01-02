import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPopUp = ({ onClose }) => {
  const { cart, loading, fetchCart, userId, removeFromCart } = useCart();

  useEffect(() => {
    if (userId) {
      fetchCart(userId);
    }
  }, [userId]);

  const handleRemove = async (productId) => {
    const result = await removeFromCart(productId);
    if (result.success) {
      alert('Item removed from cart');
    }
  };

  const total = cart?.totalAmount || 0;
  const itemCount = cart?.totalItems || 0;

  return (
    <div className="cart-overlay">
      <div className="cart-popup">
        <button className="close-btn" onClick={onClose}>✕</button>

        <div style={{paddingLeft:'50px'}} className="popup-content">
          {/* LEFT SIDE - ITEMS */}
          <div className="cart-items">
            {loading ? (
              <p>Loading cart...</p>
            ) : !cart || !cart.items || cart.items.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              cart.items.map((item, index) => (
                <div className="cart-item" key={item._id}>
                  <img 
                    src={item.productImage || 'https://via.placeholder.com/100'} 
                    alt={item.productName} 
                  />

                  <div className="item-info">
                    <div style={{display:'flex'}} className="item-infoTop">
                      <h6>Item {index + 1}</h6>
                      <div className="actions">
                        <button>Edit</button>
                        <button onClick={() => handleRemove(item.product)} disabled={loading}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <p>{item.productName}</p>
                    <p>Quantity: {item.quantity}</p>
                    <strong>${item.productPrice * item.quantity}</strong>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT SIDE - SUMMARY */}
          <div className="cart-summary">
            <h3>Cart Order Total ({itemCount})</h3>
            <h2>${total.toFixed(2)}</h2>

            <p className="free-shipping">Congrats! You get free shipping.</p>
            <Link to="/cart" onClick={onClose}>
              <button className="view-cart-btn">View Cart</button>
            </Link>  
            <Link to="/checkout" onClick={onClose}>
              <button className="checkout-btn">Check Out</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPopUp;