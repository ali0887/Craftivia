import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cartItems, updateItem, removeItem, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-4">Your Cart</h2>
        <div className="alert alert-info">
          Your cart is empty.
        </div>
        <Link to="/" className="btn btn-primary mt-3">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const total = cartItems.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity, 0
  );

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Your Cart</h2>
      
      <div className="card shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <Link to={`/product/${item.product._id}`}>
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            style={{ width: 60, height: 60, objectFit: 'cover' }}
                            className="me-3 rounded"
                          />
                        </Link>
                        <Link to={`/product/${item.product._id}`} className="text-decoration-none text-dark">
                          {item.product.name}
                        </Link>
                      </div>
                    </td>
                    <td>${item.product.price.toFixed(2)}</td>
                    <td width="150">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => updateItem(item._id, +e.target.value)}
                        className="form-control form-control-sm"
                      />
                    </td>
                    <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                    <td className="text-end pe-4">
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeItem(item._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="d-flex">
            <button 
              className="btn btn-outline-secondary me-2" 
              onClick={clearCart}
            >
              Clear Cart
            </button>
            <Link to="/" className="btn btn-outline-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong className="text-success">${total.toFixed(2)}</strong>
              </div>
              <button 
                className="btn btn-success w-100"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
