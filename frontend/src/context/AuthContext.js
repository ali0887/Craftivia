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

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, user, login, loginAdmin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
