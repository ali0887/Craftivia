import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/api';
import ProductCard from '../components/ProductCard';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [myProds, setMyProds] = useState([]);

  useEffect(() => {
    if (user.role === 'artisan') {
      API.get('/products').then(res =>
        setMyProds(res.data.filter(p => p.artisan._id === user.id))
      );
    }
  }, [user]);

  return (
    <div className="container">
      <h2 className="mt-4">{user.name}’s Profile</h2>
      <p>Email: {user.email}</p>
      {user.role === 'artisan' && (
        <>
          <h3 className="mt-4">My Products</h3>
          <div className="row g-4">
            {myProds.map(p => (
              <div className="col-sm-6 col-lg-4" key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
