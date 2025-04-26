import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { ThemeContext } from '../context/ThemeContext';

export default function ProductCard({ product }) {
  const { addToCart, loading: cartLoading } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist, loading: wishlistLoading } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWishlistSuccess, setShowWishlistSuccess] = useState(false);
  const [showWishlistRemoved, setShowWishlistRemoved] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  // Check if product is in wishlist whenever wishlist context changes
  useEffect(() => {
    if (product && product._id) {
      const isItemInWishlist = isInWishlist(product._id);
      setInWishlist(isItemInWishlist);
    }
  }, [product, isInWishlist]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product._id, 1);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    try {
      if (inWishlist) {
        await removeFromWishlist(product._id);
        setInWishlist(false);
        // Show removed message
        setShowWishlistRemoved(true);
        setTimeout(() => setShowWishlistRemoved(false), 2000);
      } else {
        await addToWishlist(product._id);
        setInWishlist(true);
        // Show success message
        setShowWishlistSuccess(true);
        setTimeout(() => setShowWishlistSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };
  
  // Add dark mode compatible class
  const cardClass = `card h-100 shadow-sm hover-shadow border-0 ${darkMode ? 'bg-dark text-white' : ''}`;

  return (
    <div className={cardClass}>
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
        
        {/* Wishlist heart icon */}
        {user && (
          <button 
            className={`position-absolute top-0 start-0 btn btn-sm btn-${inWishlist ? 'danger' : (darkMode ? 'light' : 'dark')} m-2 rounded-circle`}
            style={{ width: '32px', height: '32px', padding: '0.25rem' }}
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
          >
            {wishlistLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <i className={`bi bi-heart${inWishlist ? '-fill' : ''}`}></i>
            )}
          </button>
        )}
      </div>

      <div className={`card-body d-flex flex-column p-3 ${darkMode ? 'bg-dark' : ''}`}>
        <div className="mb-2">
          <Link to={`/product/${product._id}`} className={`text-decoration-none ${darkMode ? 'text-white' : 'text-dark'}`}>
            <h5 className="card-title mb-1">{product.name}</h5>
          </Link>
          <div className="d-flex justify-content-between align-items-center">
            <p className="card-text text-success fw-bold mb-0">${product.price}</p>
            {product.artisan && (
              <small className={`${darkMode ? 'text-light' : 'text-muted'}`}>
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
          
          {showWishlistSuccess && (
            <div className="alert alert-success py-1 mb-2 text-center" role="alert">
              Added to wishlist!
            </div>
          )}
          
          {showWishlistRemoved && (
            <div className="alert alert-info py-1 mb-2 text-center" role="alert">
              Removed from wishlist!
            </div>
          )}
          
          {user ? (
            <button
              className="btn btn-outline-primary w-100"
              onClick={handleAddToCart}
              disabled={cartLoading || product.countInStock <= 0}
            >
              {cartLoading ? (
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
