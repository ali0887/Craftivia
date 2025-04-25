import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-light mt-5">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4 mb-3">
            <h5 className="text-primary mb-3">Craftivia</h5>
            <p className="text-muted mb-3">
              Discover unique handcrafted items made with passion by talented artisans from around the world.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="text-secondary fs-5" title="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-secondary fs-5" title="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-secondary fs-5" title="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="text-secondary fs-5" title="Pinterest">
                <i className="bi bi-pinterest"></i>
              </a>
            </div>
          </div>
          
          <div className="col-6 col-md-2 mb-3">
            <h5 className="mb-3">Shop</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="/" className="nav-link p-0 text-muted">All Products</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/?category=jewelry" className="nav-link p-0 text-muted">Jewelry</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/?category=pottery" className="nav-link p-0 text-muted">Pottery</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/?category=woodwork" className="nav-link p-0 text-muted">Woodwork</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/?category=textiles" className="nav-link p-0 text-muted">Textiles</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-6 col-md-2 mb-3">
            <h5 className="mb-3">Account</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="/login" className="nav-link p-0 text-muted">Login</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/register" className="nav-link p-0 text-muted">Register</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/cart" className="nav-link p-0 text-muted">Cart</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/profile" className="nav-link p-0 text-muted">My Account</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5 className="mb-3">Join Our Community</h5>
            <p className="text-muted mb-3">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="d-flex gap-2">
              <input
                type="email"
                className="form-control"
                placeholder="Email address"
                aria-label="Email address"
                required
              />
              <button className="btn btn-primary" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="d-flex flex-column flex-sm-row justify-content-between pt-4 mt-4 border-top">
          <p className="text-muted">© {new Date().getFullYear()} Craftivia. All rights reserved.</p>
          <ul className="list-unstyled d-flex">
            <li className="me-3">
              <Link to="/privacy" className="link-secondary text-decoration-none">Privacy Policy</Link>
            </li>
            <li className="me-3">
              <Link to="/terms" className="link-secondary text-decoration-none">Terms of Service</Link>
            </li>
            <li>
              <Link to="/contact" className="link-secondary text-decoration-none">Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
} 