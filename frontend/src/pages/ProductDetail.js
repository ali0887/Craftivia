import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';
import { CartContext } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [prod, setProd] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    API.get(`/products/${id}`).then(res => setProd(res.data));
  }, [id]);

  if (!prod) return <p className="text-center mt-4">Loading…</p>;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <img src={prod.images[0]} alt={prod.name} className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h2>{prod.name}</h2>
          <p className="text-success h4">${prod.price}</p>
          <p>{prod.description}</p>
          <button
            className="btn btn-primary"
            onClick={() => addToCart(prod._id, 1)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
