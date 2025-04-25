import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/api';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name:'', description:'', category:'', price:'', countInStock:'', images:'' 
  });

  useEffect(() => {
    API.get('/products').then(res => setProducts(res.data));
  }, []);

  const onSubmit = async e => {
    e.preventDefault();
    await API.post('/products', {
      ...form,
      price: Number(form.price),
      countInStock: Number(form.countInStock),
      images: form.images.split(',').map(u=>u.trim())
    });
    setForm({ name:'', description:'', category:'', price:'', countInStock:'', images:'' });
    const res = await API.get('/products');
    setProducts(res.data);
  };

  const onDelete = async id => {
    await API.delete(`/products/${id}`);
    setProducts(ps => ps.filter(p=>p._id!==id));
  };

  // if artisan, show only own products
  const viewList = user.role === 'artisan'
    ? products.filter(p=>p.artisan._id===user.id)
    : products;

  return (
    <div className="container">
      <h2 className="mt-4">
        {user.role==='admin' ? 'Admin Dashboard' : 'My Products'}
      </h2>

      {user.role === 'artisan' && (
        <form className="row g-2 my-3" onSubmit={onSubmit}>
          {['name','description','category','price','countInStock','images'].map(key => (
            <div className="col-md-4" key={key}>
              <input
                className="form-control"
                placeholder={key.charAt(0).toUpperCase()+key.slice(1)}
                value={form[key]}
                onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                required
                type={key==='price'||key==='countInStock'?'number':'text'}
              />
            </div>
          ))}
          <div className="col-md-4">
            <button className="btn btn-success w-100">Add Product</button>
          </div>
        </form>
      )}

      <div className="list-group">
        {viewList.map(p => (
          <div key={p._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">{p.name}</h5>
              <small className="text-muted">${p.price}</small>
            </div>
            <button className="btn btn-outline-danger btn-sm" onClick={()=>onDelete(p._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
