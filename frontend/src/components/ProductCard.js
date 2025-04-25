import React from 'react';
import { Link } from 'react-router-dom';
const ProductCard = ({ product }) => (
  <div className="product-card">
    <img src={product.images[0]} alt={product.name} />
    <h3>{product.name}</h3>
    <p>${product.price}</p>
    <Link to={`/product/${product._id}`}>View</Link>
  </div>
);
export default ProductCard;