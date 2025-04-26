import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

export default function Footer() {
  const { darkMode } = useContext(ThemeContext);
  
  // Apply dark mode classes
  const footerClass = `${darkMode ? 'bg-dark text-light' : 'bg-light'} mt-5`;
  const textMutedClass = darkMode ? 'text-light opacity-75' : 'text-muted';
  const socialIconClass = darkMode ? 'text-light' : 'text-secondary';
  const linkClass = darkMode ? 'nav-link p-0 text-light opacity-75' : 'nav-link p-0 text-muted';
  const borderTopClass = darkMode ? 'border-secondary' : '';
  const secondaryLinkClass = darkMode ? 'link-light text-decoration-none' : 'link-secondary text-decoration-none';
  
  return (
    <footer className={footerClass}>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4 mb-3">
            <h5 className="text-primary mb-3">Craftivia</h5>
            <p className={`${textMutedClass} mb-3`}>
              Discover unique handcrafted items made with passion by talented artisans from around the world.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className={`${socialIconClass} fs-5`} title="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className={`${socialIconClass} fs-5`} title="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className={`${socialIconClass} fs-5`} title="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className={`${socialIconClass} fs-5`} title="Pinterest">
                <i className="bi bi-pinterest"></i>
              </a>
            </div>
          </div>
          
          <div className="col-6 col-md-2 mb-3">
            <h5 className="mb-3">Shop</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="/" className={linkClass}>All Products</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/?category=jewelry" className={linkClass}>Jewelry</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/?category=pottery" className={linkClass}>Pottery</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/?category=woodwork" className={linkClass}>Woodwork</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/?category=textiles" className={linkClass}>Textiles</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-6 col-md-2 mb-3">
            <h5 className="mb-3">Account</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="/login" className={linkClass}>Login</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/register" className={linkClass}>Register</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/cart" className={linkClass}>Cart</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/profile" className={linkClass}>My Account</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5 className="mb-3">Join Our Community</h5>
            <p className={`${textMutedClass} mb-3`}>Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="d-flex gap-2">
              <input
                type="email"
                className={`form-control ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                placeholder="Email address"
                aria-label="Email address"
                required
              />
              <button className="btn btn-primary" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className={`d-flex flex-column flex-sm-row justify-content-between pt-4 mt-4 border-top ${borderTopClass}`}>
          <p className={textMutedClass}>© {new Date().getFullYear()} Craftivia. All rights reserved.</p>
          <ul className="list-unstyled d-flex">
            <li className="me-3">
              <Link to="/privacy" className={secondaryLinkClass}>Privacy Policy</Link>
            </li>
            <li className="me-3">
              <Link to="/terms" className={secondaryLinkClass}>Terms of Service</Link>
            </li>
            <li>
              <Link to="/contact" className={secondaryLinkClass}>Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
} 