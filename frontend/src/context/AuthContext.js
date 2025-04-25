import React, { createContext, useState, useEffect } from 'react';
import API from '../api/api';
import { jwtDecode } from 'jwt-decode';


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user,  setUser ] = useState(() => {
    try { return token ? jwtDecode(token).user : null; }
    catch { return null; }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(jwtDecode(token).user);
    } else {
      localStorage.removeItem('token');
      delete API.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    setToken(res.data.token);
  };

  const loginAdmin = async (email, password) => {
    const res = await API.post('/auth/admin/login', { email, password });
    setToken(res.data.token);
  };

  const register = async (name, email, password, role, profileImage, bio) => {
    // Create the registration data object with required fields
    const registrationData = { name, email, password, role };
    
    // Add optional fields if provided
    if (profileImage) registrationData.profileImage = profileImage;
    if (bio) registrationData.bio = bio;
    
    await API.post('/auth/register', registrationData);
  };

  const updateUserProfile = async (userData) => {
    const res = await API.put('/users/profile', userData);
    
    // Update current user with new data (we can't directly update the token, 
    // so we update just the user state until next login)
    if (user) {
      const updatedUser = {
        ...user,
        name: res.data.name,
        bio: res.data.bio
      };
      
      if (res.data.profileImage) {
        updatedUser.profileImage = res.data.profileImage;
      }
      
      setUser(updatedUser);
    }
    
    return res.data;
  };

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      login, 
      loginAdmin, 
      register, 
      updateUserProfile,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
