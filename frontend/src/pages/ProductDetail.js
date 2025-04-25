import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart, loading: cartLoading } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Product not found.
        </div>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item">
            <Link to={`/?category=${product.category}`}>{product.category}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="row">
        {/* Image Gallery */}
        <div className="col-md-6 mb-4">
          <div className="position-relative mb-3">
            <img 
              src={product.images[activeImage]} 
              alt={product.name} 
              className="img-fluid rounded shadow"
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="d-flex gap-2 overflow-auto pb-2">
              {product.images.map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className={`thumbnail cursor-pointer rounded ${activeImage === index ? 'border border-primary' : ''}`}
                  style={{ width: '80px', height: '60px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>
          
          <div className="d-flex align-items-center mb-3">
            <h2 className="text-primary mb-0">${product.price}</h2>
            {product.countInStock > 0 ? (
              <span className="badge bg-success ms-3">In Stock</span>
            ) : (
              <span className="badge bg-danger ms-3">Out of Stock</span>
            )}
          </div>

          <div className="mb-4">
            <h5>Description</h5>
            <p className="text-muted">{product.description}</p>
          </div>

          <div className="d-flex flex-wrap mb-4">
            <div className="me-4 mb-3">
              <h5>Category</h5>
              <Link to={`/?category=${product.category}`} className="badge bg-light text-dark text-decoration-none p-2">
                {product.category}
              </Link>
            </div>
            <div className="me-4 mb-3">
              <h5>Artisan</h5>
              <span className="badge bg-light text-dark p-2">
                {product.artisan?.name || 'Unknown Artisan'}
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center mb-4">
            <div className="input-group me-3" style={{ width: '130px' }}>
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={cartLoading}
              >
                -
              </button>
              <input 
                type="number" 
                className="form-control text-center" 
                value={quantity} 
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val > 0) setQuantity(val);
                }}
                min="1"
                disabled={cartLoading}
              />
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                disabled={cartLoading}
              >
                +
              </button>
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={cartLoading || !product.countInStock}
            >
              {cartLoading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>

          {showSuccess && (
            <div className="alert alert-success" role="alert" id="addToCartSuccess">
              <i className="bi bi-check-circle me-2"></i>
              Item added to cart successfully!
            </div>
          )}

          {user && user.role === 'artisan' && product.artisan?._id === user.id && (
            <div className="mt-3">
              <Link to={`/admin?edit=${product._id}`} className="btn btn-outline-primary">
                Edit Product
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Additional Product Info Tabs */}
      <div className="row mt-5">
        <div className="col-12">
          <ul className="nav nav-tabs" id="productTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link active" 
                id="details-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#details" 
                type="button" 
                role="tab" 
                aria-controls="details" 
                aria-selected="true"
              >
                Details
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link" 
                id="shipping-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#shipping" 
                type="button" 
                role="tab" 
                aria-controls="shipping" 
                aria-selected="false"
              >
                Shipping
              </button>
            </li>
          </ul>
          <div className="tab-content p-4 border border-top-0 rounded-bottom" id="productTabsContent">
            <div 
              className="tab-pane fade show active" 
              id="details" 
              role="tabpanel" 
              aria-labelledby="details-tab"
            >
              <div className="row">
                <div className="col-md-6">
                  <h5>Product Details</h5>
                  <ul className="list-unstyled">
                    <li><strong>Material:</strong> {product.material || 'Not specified'}</li>
                    <li><strong>Dimensions:</strong> {product.dimensions || 'Not specified'}</li>
                    <li><strong>Weight:</strong> {product.weight || 'Not specified'}</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>Care Instructions</h5>
                  <p>{product.careInstructions || 'No specific care instructions provided.'}</p>
                </div>
              </div>
            </div>
            <div 
              className="tab-pane fade" 
              id="shipping" 
              role="tabpanel" 
              aria-labelledby="shipping-tab"
            >
              <h5>Shipping Information</h5>
              <p>Standard shipping takes 3-5 business days. Express shipping options are available at checkout.</p>
              <p>International shipping is available for select countries.</p>
              <p>For custom orders or specific shipping requests, please contact us.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-5">
        <h3 className="mb-4">You Might Also Like</h3>
        <div className="row g-4">
          {/* This would ideally be filled with actual related products from an API call */}
          <div className="col-12">
            <p className="text-muted text-center">Explore more from the same category.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
