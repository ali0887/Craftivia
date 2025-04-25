import React, { useEffect, useState } from 'react';
import API from '../api/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products,setProducts] = useState([]);
  useEffect(() => { API.get('/products').then(res=>setProducts(res.data)); }, []);
  return <div className="grid">{products.map(p=><ProductCard key={p._id} product={p} />)}</div>;
};
export default Home;