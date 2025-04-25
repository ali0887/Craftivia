import React, { useEffect, useState } from 'react';
import API from '../api/api';

const ProductDetail = ({ match }) => {
  const [prod,setProd] = useState(null);
  useEffect(()=>{ API.get(`/products/${match.params.id}`).then(res=>setProd(res.data)); },[]);
  if(!prod) return <p>Loading...</p>;
  return (
    <div>
      <img src={prod.images[0]} alt={prod.name} />
      <h1>{prod.name}</h1>
      <p>{prod.description}</p>
      <p>${prod.price}</p>
    </div>
  );
};
export default ProductDetail;