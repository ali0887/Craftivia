import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await API.get('/products');
        setProducts(res.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(res.data.map(p => p.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter products by category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold">Welcome to Craftivia</h1>
              <p className="lead">Discover unique handcrafted items made with passion by talented artisans</p>
              {!user && (
                <div className="mt-4">
                  <Link to="/register" className="btn btn-light btn-lg me-2">Join Now</Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg">Login</Link>
                </div>
              )}
              {user && user.role === 'artisan' && (
                <div className="mt-4">
                  <Link to="/admin" className="btn btn-light btn-lg">Manage Your Products</Link>
                </div>
              )}
            </div>
            <div className="col-md-6 d-none d-md-block">
              <img 
                src="https://images.unsplash.com/photo-1558997519-83ea9252edf8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="Craftivia" 
                className="img-fluid rounded shadow" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Category Filter */}
        <div className="mb-4">
          <h2 className="mb-3">Browse Categories</h2>
          <div className="d-flex flex-wrap gap-2">
            <button 
              className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Products
            </button>
            {categories.map(category => (
              <button 
                key={category} 
                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Product Listing */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              {selectedCategory === 'all' 
                ? 'Our Products' 
                : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`
              }
            </h2>
            {user && user.role === 'artisan' && (
              <Link to="/admin" className="btn btn-success">Add New Product</Link>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.length === 0 ? (
                <div className="col-12">
                  <p className="text-center">No products found in this category.</p>
                </div>
              ) : (
                filteredProducts.map(p => (
                  <div className="col-sm-6 col-lg-4 col-xl-3" key={p._id}>
                    <ProductCard product={p} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Featured Section */}
        <div className="bg-light p-4 rounded-3 mb-5">
          <h2 className="mb-4">Why Choose Craftivia?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <i className="bi bi-hand-thumbs-up fs-4"></i>
                </div>
                <h4>Quality Craftsmanship</h4>
                <p>Every item is handcrafted with attention to detail and quality.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <i className="bi bi-people fs-4"></i>
                </div>
                <h4>Support Artisans</h4>
                <p>Your purchase directly supports independent artisans and creators.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <i className="bi bi-gift fs-4"></i>
                </div>
                <h4>Unique Finds</h4>
                <p>Discover one-of-a-kind items you won't find anywhere else.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
