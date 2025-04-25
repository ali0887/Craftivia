import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="card h-100">
      <Link to={`/product/${product._id}`}>
        <img src={product.images[0]} className="card-img-top" alt={product.name} />
      </Link>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-success">${product.price}</p>
        <button
          className="btn btn-primary mt-auto"
          onClick={() => addToCart(product._id, 1)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
