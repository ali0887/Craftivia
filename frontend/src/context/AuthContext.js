import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUser(jwtDecode(token));
  }, []);

  const login = async (email,password) => {
    const { data } = await API.post('/auth/login',{ email,password });
    localStorage.setItem('token',data.token);
    setUser(jwtDecode(data.token));
  };

  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};