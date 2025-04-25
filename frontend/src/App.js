import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar         from './components/Navbar';
import Home           from './pages/Home';
import Login          from './pages/Login';
import AdminLogin     from './pages/AdminLogin';
import Register       from './pages/Register';
import Cart           from './pages/Cart';
import Profile        from './pages/Profile';
import ProductDetail  from './pages/ProductDetail';
import AdminDashboard from './pages/AdminDashboard';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/cart"        element={<Cart />} />
        <Route path="/profile"     element={<Profile />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        {user && <Route path="/admin" element={<AdminDashboard />} />}
      </Routes>
    </>
  );
}

export default App;
