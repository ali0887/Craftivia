import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const { loginAdmin }          = useContext(AuthContext);
  const nav                      = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await loginAdmin(email, password);
      nav('/admin');
    } catch (err) {
      alert(err.response?.data?.msg || 'Admin login failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400 }}>
      <h2 className="mt-4">Admin Login</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-danger w-100">Sign In</button>
      </form>
    </div>
  );
}
