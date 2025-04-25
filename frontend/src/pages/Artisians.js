import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function Artisians() {
  const [artisians, setArtisians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtisians = async () => {
      try {
        setLoading(true);
        const response = await API.get('/users/artisans');
        setArtisians(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching artisians:', err);
        setError('Failed to load artisians. Please try again later.');
        setLoading(false);
      }
    };

    fetchArtisians();
  }, []);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  // Default artisians if none are returned from API
  const displayArtisians = artisians.length > 0 ? artisians : [
    {
      _id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
      bio: 'Skilled jewelry designer with 8 years of experience in handcrafted silver and gold pieces.'
    },
    {
      _id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
      bio: 'Wood carving specialist focusing on intricate decorative items and functional home decor.'
    },
    {
      _id: '3',
      name: 'Aisha Patel',
      email: 'aisha@example.com',
      profileImage: 'https://randomuser.me/api/portraits/women/3.jpg',
      bio: 'Textile artist creating unique hand-woven tapestries and sustainable fashion accessories.'
    },
    {
      _id: '4',
      name: 'James Wilson',
      email: 'james@example.com',
      profileImage: 'https://randomuser.me/api/portraits/men/4.jpg',
      bio: 'Ceramic artist specializing in wheel-thrown pottery with custom glazes and finishes.'
    }
  ];

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Our Talented Artisians</h1>
        <p className="lead text-muted">
          Meet the creative minds behind our unique handcrafted products
        </p>
      </div>

      <div className="row g-4">
        {displayArtisians.map(artisian => (
          <div className="col-md-6 col-lg-3" key={artisian._id}>
            <div className="card h-100 border-0 shadow-sm">
              <div className="text-center pt-4">
                <img 
                  src={artisian.profileImage || 'https://via.placeholder.com/150'} 
                  className="rounded-circle img-thumbnail" 
                  alt={artisian.name}
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
              <div className="card-body text-center">
                <h5 className="card-title">{artisian.name}</h5>
                <p className="card-text text-muted">
                  {artisian.bio || 'Talented artisan creating unique handcrafted items'}
                </p>
              </div>
              <div className="card-footer bg-transparent border-0 text-center pb-4">
                <Link 
                  to={`/products?artisan=${artisian._id}`} 
                  className="btn btn-outline-primary"
                >
                  View Products
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 