import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cartItems, updateItem, removeItem, clearCart } = useContext(CartContext);

  if (cartItems.length === 0) {
    return <p className="text-center mt-4">Your cart is empty.</p>;
  }

  const total = cartItems.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity, 0
  );

  return (
    <div className="container">
      <h2 className="my-4">Your Cart</h2>
      {cartItems.map(item => (
        <div key={item._id} className="d-flex align-items-center border-bottom py-2">
          <Link to={`/product/${item.product._id}`} className="d-flex align-items-center me-auto">
            <img
              src={item.product.images[0]}
              alt=""
              style={{ width: 80, height: 80, objectFit: 'cover' }}
              className="me-3"
            />
            <span>{item.product.name}</span>
          </Link>
          <span className="me-3">${item.product.price}</span>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={e => updateItem(item._id, +e.target.value)}
            className="form-control form-control-sm w-auto me-3"
          />
          <button className="btn btn-outline-danger btn-sm" onClick={() => removeItem(item._id)}>
            Remove
          </button>
        </div>
      ))}

      <div className="d-flex justify-content-between align-items-center my-4">
        <button className="btn btn-link" onClick={clearCart}>Clear Cart</button>
        <h4>Total: ${total.toFixed(2)}</h4>
        <button className="btn btn-success">Checkout</button>
      </div>
    </div>
  );
}
