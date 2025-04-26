import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar         from './components/Navbar';
import Footer         from './components/Footer';
import Home           from './pages/Home';
import Login          from './pages/Login';
import AdminLogin     from './pages/AdminLogin';
import Register       from './pages/Register';
import Cart           from './pages/Cart';
import Profile        from './pages/Profile';
import ProductDetail  from './pages/ProductDetail';
import AdminDashboard from './pages/AdminDashboard';
import AddProduct     from './pages/AddProduct';
import Artisians      from './pages/Artisians';
import SearchResults  from './pages/SearchResults';
import Checkout       from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/cart"        element={<Cart />} />
          <Route path="/profile"     element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/artisians"   element={<Artisians />} />
          <Route path="/search/:query" element={<SearchResults />} />
          {user && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            </>
          )}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
