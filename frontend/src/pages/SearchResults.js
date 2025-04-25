import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { searchProducts } from '../api/productService';

const SearchResults = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const data = await searchProducts(query);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load search results. Please try again.');
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h2>Error</h2>
        <p className="text-danger">{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Search Results for "{query}"</h2>
      
      {products.length === 0 ? (
        <div className="text-center my-5">
          <h3>No products found</h3>
          <p>We couldn't find any products matching your search.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Return to Home
          </button>
        </div>
      ) : (
        <>
          <p className="mb-4">{products.length} products found</p>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {products.map((product) => (
              <div className="col" key={product._id}>
                <div className="card h-100 product-card">
                  <img 
                    className="card-img-top"
                    src={product.imageUrl} 
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text text-muted mb-1">
                      {product.category}
                    </p>
                    <p className="card-text mb-2">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="card-text text-truncate mb-3">
                      {product.description}
                    </p>
                    <div className="mt-auto">
                      <Link 
                        to={`/product/${product._id}`} 
                        className="btn btn-primary w-100"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults; 