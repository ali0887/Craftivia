import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { token, user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get('/cart');
      setCartItems(res.data.items || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart items');
      setCartItems([]);
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      // If not logged in, redirect to login
      if (window.confirm('You must be logged in to add items to cart. Go to login page?')) {
        window.location.href = '/login';
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await API.post('/cart', { productId, quantity });
      setCartItems(res.data.items || []);
      setLoading(false);
      // Show success feedback
      if (document.getElementById('addToCartSuccess')) {
        const element = document.getElementById('addToCartSuccess');
        element.style.display = 'block';
        setTimeout(() => {
          element.style.display = 'none';
        }, 3000);
      } else {
        alert('Item added to cart successfully!');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setLoading(false);
      if (err.response?.status === 403) {
        setError('Permission denied: You may not have buyer privileges');
        alert('Permission denied: You may need to login with a buyer account to add items to cart.');
      } else {
        setError('Failed to add item to cart');
        alert('Failed to add item to cart. Please try again.');
      }
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.put(`/cart/${itemId}`, { quantity });
      setCartItems(res.data.items || []);
      setLoading(false);
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError('Failed to update cart item');
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.delete(`/cart/${itemId}`);
      setCartItems(res.data.items || []);
      setLoading(false);
    } catch (err) {
      console.error('Error removing cart item:', err);
      setError('Failed to remove cart item');
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      await API.delete('/cart');
      setCartItems([]);
      setLoading(false);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems, 
      loading,
      error,
      addToCart, 
      updateItem, 
      removeItem, 
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}
