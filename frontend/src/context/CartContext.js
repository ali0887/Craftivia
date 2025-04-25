import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (token) {
      API.get('/cart').then(res => setCartItems(res.data.items));
    } else {
      setCartItems([]);
    }
  }, [token]);

  const addToCart = async (productId, quantity=1) => {
    const res = await API.post('/cart', { productId, quantity });
    setCartItems(res.data.items);
  };

  const updateItem = async (itemId, quantity) => {
    const res = await API.put(`/cart/${itemId}`, { quantity });
    setCartItems(res.data.items);
  };

  const removeItem = async itemId => {
    const res = await API.delete(`/cart/${itemId}`);
    setCartItems(res.data.items);
  };

  const clearCart = async () => {
    await API.delete('/cart');
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, updateItem, removeItem, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}
