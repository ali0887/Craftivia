import React, { useState, useEffect } from 'react';
import API from '../api/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/products').then(res => setProducts(res.data));
  }, []);

  return (
    <div className="container">
      <div className="row g-4">
        {products.map(p => (
          <div className="col-sm-6 col-lg-4" key={p._id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
