import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const nav = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    nav('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      nav(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Apply dark mode classes
  const navbarClass = `navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} sticky-top shadow-sm`;

  return (
    <nav className={navbarClass}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeMenu}>
          <span className="fs-4 fw-bold text-primary">Craftivia</span>
        </Link>
        
        {/* Mobile cart and toggle buttons */}
        <div className="d-flex align-items-center">
          {user && (
            <Link 
              className="nav-link position-relative me-2 d-lg-none" 
              to="/cart"
              onClick={closeMenu}
            >
              <i className="bi bi-cart3 fs-5"></i>
              {cartItems.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItems.length}
                  <span className="visually-hidden">items in cart</span>
                </span>
              )}
            </Link>
          )}
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            onClick={toggleMenu}
            aria-controls="navbarContent" 
            aria-expanded={isMenuOpen ? "true" : "false"} 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        
        {/* Navbar content */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarContent">
          {/* Search form */}
          <form className="d-flex mx-auto my-2 my-lg-0" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="search"
                className={`form-control ${darkMode ? 'bg-dark text-light border-dark' : ''}`}
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search"
              />
              <button className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-primary'}`} type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>
          
          {/* Nav links */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/')}`} 
                to="/"
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/artisians')}`} 
                to="/artisians"
                onClick={closeMenu}
              >
                Artisians
              </Link>
            </li>
            
            {/* Dark Mode Toggle */}
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link" 
                onClick={toggleDarkMode}
              >
                {darkMode ? (
                  <i className="bi bi-sun fs-5" title="Switch to Light Mode"></i>
                ) : (
                  <i className="bi bi-moon fs-5" title="Switch to Dark Mode"></i>
                )}
              </button>
            </li>
            
            {!user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="authDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Account
                </a>
                <ul className={`dropdown-menu dropdown-menu-end ${darkMode ? 'dropdown-menu-dark' : ''}`} aria-labelledby="authDropdown">
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/login"
                      onClick={closeMenu}
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i>Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/admin/login"
                      onClick={closeMenu}
                    >
                      <i className="bi bi-shield-lock me-2"></i>Admin Login
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/register"
                      onClick={closeMenu}
                    >
                      <i className="bi bi-person-plus me-2"></i>Register
                    </Link>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="d-none d-lg-inline-block me-1">Hi,</span> {user.name}
                  </a>
                  <ul className={`dropdown-menu dropdown-menu-end ${darkMode ? 'dropdown-menu-dark' : ''}`} aria-labelledby="userDropdown">
                    <li>
                      <Link 
                        className="dropdown-item" 
                        to="/profile"
                        onClick={closeMenu}
                      >
                        <i className="bi bi-person me-2"></i>My Profile
                      </Link>
                    </li>
                    {user.role === 'admin' && (
                      <li>
                        <Link 
                          className="dropdown-item" 
                          to="/admin"
                          onClick={closeMenu}
                        >
                          <i className="bi bi-speedometer2 me-2"></i>Dashboard
                        </Link>
                      </li>
                    )}
                    {user.role === 'artisan' && (
                      <li>
                        <Link 
                          className="dropdown-item" 
                          to="/admin"
                          onClick={closeMenu}
                        >
                          <i className="bi bi-grid me-2"></i>Manage Products
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
                
                {/* Cart - visible on larger screens */}
                <li className="nav-item ms-lg-2 d-none d-lg-block">
                  <Link 
                    className={`nav-link position-relative ${isActive('/cart')}`} 
                    to="/cart"
                    onClick={closeMenu}
                  >
                    <i className="bi bi-cart3 fs-5"></i>
                    {cartItems.length > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartItems.length}
                        <span className="visually-hidden">items in cart</span>
                      </span>
                    )}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
