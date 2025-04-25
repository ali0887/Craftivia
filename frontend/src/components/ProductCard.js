import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart, loading } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product._id, 1);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="card h-100 shadow-sm hover-shadow border-0">
      <div className="position-relative">
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <img 
            src={product.images[0]} 
            className="card-img-top" 
            alt={product.name} 
            style={{ 
              height: '200px', 
              objectFit: 'cover',
              borderTopLeftRadius: 'calc(0.375rem - 1px)',
              borderTopRightRadius: 'calc(0.375rem - 1px)'
            }} 
          />
          {product.countInStock <= 0 && (
            <span className="position-absolute top-0 end-0 badge bg-danger m-2">
              Sold Out
            </span>
          )}
          <div className="card-category position-absolute bottom-0 start-0 m-2">
            <span className="badge bg-primary text-white">
              {product.category}
            </span>
          </div>
        </Link>
      </div>

      <div className="card-body d-flex flex-column p-3">
        <div className="mb-2">
          <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
            <h5 className="card-title mb-1">{product.name}</h5>
          </Link>
          <div className="d-flex justify-content-between align-items-center">
            <p className="card-text text-success fw-bold mb-0">${product.price}</p>
            {product.artisan && (
              <small className="text-muted">
                by {product.artisan.name}
              </small>
            )}
          </div>
        </div>

        <div className="mt-auto">
          {showSuccess && (
            <div className="alert alert-success py-1 mb-2 text-center" role="alert">
              Added to cart!
            </div>
          )}
          {user ? (
            <button
              className="btn btn-outline-primary w-100"
              onClick={handleAddToCart}
              disabled={loading || product.countInStock <= 0}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : product.countInStock > 0 ? (
                <>
                  <i className="bi bi-cart-plus me-2"></i>Add to Cart
                </>
              ) : (
                'Out of Stock'
              )}
            </button>
          ) : (
            <Link to="/login" className="btn btn-outline-primary w-100">
              Sign in to purchase
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
