import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="navbar">
      <Link to="/">Craftivia</Link>
      <div>
        {user ? (
          <><Link to="/profile">{user.name}</Link><button onClick={logout}>Logout</button></>
        ) : (
          <><Link to="/login">Login</Link><Link to="/register">Register</Link></>
        )}
        <Link to="/cart">Cart</Link>
      </div>
    </nav>
  );
};
export default Navbar;