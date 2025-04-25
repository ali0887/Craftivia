import React, { useState } from 'react';
import API from '../api/api';
const Register = () => {
  const [form,setForm]=useState({name:'',email:'',pw:''});
  const submit=async e=>{ e.preventDefault(); await API.post('/auth/register',{ name:form.name,email:form.email,password:form.pw,role:'buyer' }); };
  return (
    <form onSubmit={submit}>
      <input placeholder="Name" onChange={e=>setForm({...form,name:e.target.value})} />
      <input placeholder="Email" onChange={e=>setForm({...form,email:e.target.value})} />
      <input type="password" placeholder="Password" onChange={e=>setForm({...form,pw:e.target.value})} />
      <button type="submit">Register</button>
    </form>
  );
};
export default Register;