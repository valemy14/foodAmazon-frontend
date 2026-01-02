import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/wishlistContext";
import { useCart } from "../context/CartContext";

const WishList = () => {
  const navigate = useNavigate();
  const { wishlist, loading, removeFromWishlist, clearWishlist, fetchWishlist, userId } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (userId) {
      fetchWishlist(userId);
    }
  }, [userId]);

  const handleRemove = async (productId) => {
    const result = await removeFromWishlist(productId);
    if (result.success) {
      // Silently remove, no alert needed
    }
  };

  const handleAddToCart = async (item) => {
    const result = await addToCart(
      item.product._id || item.product,
      item.productName,
      item.productPrice,
      item.productImage,
      1
    );

    if (result.success) {
      alert('Item added to cart!');
    } else {
      alert(result.error || 'Failed to add to cart');
    }
  };

  const handleAddAllToCart = async () => {
    if (!wishlist || !wishlist.items || wishlist.items.length === 0) return;

    let successCount = 0;
    for (const item of wishlist.items) {
      const result = await addToCart(
        item.product._id || item.product,
        item.productName,
        item.productPrice,
        item.productImage,
        1
      );
      if (result.success) successCount++;
    }

    if (successCount > 0) {
      alert(`${successCount} items added to cart!`);
    }
  };

  const calculateTotal = () => {
    if (!wishlist || !wishlist.items) return 0;
    return wishlist.items.reduce((total, item) => total + item.productPrice, 0);
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <h3>Loading wishlist...</h3>
      </div>
    );
  }

  if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
    return (
      <div className="container my-5 text-center">
        <h2 className="mb-3">Wish List</h2>
        <p className="text-muted mb-4">0 items in your wishlist</p>
        <button className="btn btn-success" onClick={() => navigate('/products')}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Wish List</h2>
          <p className="text-muted mb-0">{wishlist.items.length} items in your wishlist</p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th style={{ width: '50px' }}></th>
              <th>Product Name</th>
              <th className="text-center">Unit Price</th>
              <th className="text-center">Stock Status</th>
              <th style={{ width: '150px' }}></th>
            </tr>
          </thead>
          <tbody>
            {wishlist.items.map((item) => (
              <tr key={item._id}>
                {/* Remove Button */}
                <td>
                  <button
                    className="btn btn-link text-muted p-0"
                    onClick={() => handleRemove(item.product._id || item.product)}
                    style={{ fontSize: '20px', textDecoration: 'none' }}
                  >
                    ×
                  </button>
                </td>

                {/* Product Image & Name */}
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={item.productImage || 'https://via.placeholder.com/80'}
                      alt={item.productName}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        marginRight: '15px',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/product/${item.product._id || item.product}`)}
                    />
                    <span 
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/product/${item.product._id || item.product}`)}
                    >
                      {item.productName}
                    </span>
                  </div>
                </td>

                {/* Unit Price */}
                <td className="text-center">
                  <strong>${item.productPrice}</strong>
                </td>

                {/* Stock Status */}
                <td className="text-center">
                  <span className="text-success">In Stock</span>
                </td>

                {/* Add to Cart Button */}
                <td className="text-end">
                  <button
                    className="btn btn-success"
                    onClick={() => handleAddToCart(item)}
                    disabled={loading}
                  >
                    Add To Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total and Add All Button */}
      <div className="d-flex justify-content-end align-items-center mt-4">
        <div className="text-end me-3">
          <small className="text-muted">Estimated Total:</small>
          <h4 className="mb-0">${calculateTotal().toFixed(2)}</h4>
        </div>
        <button
          className="btn btn-success btn-lg"
          onClick={handleAddAllToCart}
          disabled={loading}
          style={{ minWidth: '200px' }}
        >
          Add All to Cart
        </button>
      </div>
    </div>
  );
};

export default WishList;