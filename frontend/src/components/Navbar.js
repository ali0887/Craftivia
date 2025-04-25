import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems }   = useContext(CartContext);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Craftivia</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto align-items-center">
            {!user ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/login">Admin Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            ) : user.role === 'admin' ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/admin">Dashboard</Link></li>
                <li className="nav-item"><button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li className="nav-item"><span className="nav-link">Hi, {user.name}</span></li>
                {user.role === 'artisan' && (
                  <li className="nav-item"><Link className="nav-link" to="/admin">My Products</Link></li>
                )}
                <li className="nav-item position-relative">
                  <Link className="nav-link" to="/cart">
                    Cart
                    {cartItems.length > 0 && (
                      <span className="badge bg-secondary position-absolute top-0 start-100 translate-middle">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="nav-item"><button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
