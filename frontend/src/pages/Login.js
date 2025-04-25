import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
const Login = () => {
  const { login } = useContext(AuthContext);
  const [email,setEmail]=useState(''); const [pw,setPw]=useState('');
  return (
    <form onSubmit={e=>{e.preventDefault();login(email,pw);}}>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
};
export default Login;