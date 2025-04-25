import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('buyer');
  const { register }            = useContext(AuthContext);
  const nav                      = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      alert('Registered! Please log in.');
      nav('/login');
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400 }}>
      <h2 className="mt-4">Register</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={e=>setName(e.target.value)}
            required
          />
        </div>
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
        <div className="mb-3">
          <label>Role</label>
          <select
            className="form-select"
            value={role}
            onChange={e=>setRole(e.target.value)}
          >
            <option value="buyer">Buyer</option>
            <option value="artisan">Artisan</option>
          </select>
        </div>
        <button className="btn btn-primary w-100">Create Account</button>
      </form>
    </div>
  );
}
