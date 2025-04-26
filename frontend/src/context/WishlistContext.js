import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user, token } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist when user changes or token changes
  useEffect(() => {
    if (user && token) {
      fetchWishlist();
    } else {
      // Clear wishlist when user logs out
      setWishlistItems([]);
    }
  }, [user, token]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await API.get('/wishlist');
      console.log('Wishlist API response:', res.data);
      setWishlistItems(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const res = await API.post('/wishlist', { productId });
      console.log('Add to wishlist response:', res.data);
      
      // Refresh wishlist after adding
      await fetchWishlist();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const res = await API.delete(`/wishlist/${productId}`);
      console.log('Remove from wishlist response:', res.data);
      
      // Refresh wishlist after removing
      await fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    if (!wishlistItems || wishlistItems.length === 0) return false;
    return wishlistItems.some(item => {
      // Check if the item has a product property and it has an _id
      if (item && item.product && item.product._id) {
        return item.product._id === productId;
      }
      return false;
    });
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      loading, 
      addToWishlist, 
      removeFromWishlist,
      isInWishlist,
      fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
} 