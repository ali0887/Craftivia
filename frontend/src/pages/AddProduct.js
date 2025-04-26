import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function AddProduct() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    countInStock: '',
    images: []
  });
  const [imagePreview, setImagePreview] = useState([]);
  const fileInputRef = useRef(null);

  // Check if user is artisan, if not redirect
  useEffect(() => {
    if (!user || user.role !== 'artisan') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrlAdd = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      setForm(prev => ({ ...prev, images: [...prev.images, url.trim()] }));
      setImagePreview([...imagePreview, url.trim()]);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // For demonstration, we're using local file URLs
    // In a real app, you would upload these to a server or cloud storage
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    // For simplicity in this example, we'll use the file name as the URL
    // In a real app, you would get the URL from your server/cloud storage after upload
    const fakeUploadedUrls = files.map(file => `https://example.com/uploads/${file.name}`);
    
    setImagePreview([...imagePreview, ...newPreviewUrls]);
    setForm(prev => ({ ...prev, images: [...prev.images, ...fakeUploadedUrls] }));
  };

  const removeImage = (index) => {
    const newPreview = [...imagePreview];
    newPreview.splice(index, 1);
    setImagePreview(newPreview);
    
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm(prev => ({ ...prev, images: newImages }));
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      category: '',
      price: '',
      countInStock: '',
      images: []
    });
    setImagePreview([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (form.images.length === 0) {
      alert('Please add at least one product image');
      return;
    }
    
    try {
      setLoading(true);
      
      const productData = {
        ...form,
        price: Number(form.price),
        countInStock: Number(form.countInStock),
        images: form.images
      };

      await API.post('/products', productData);
      alert('Product added successfully!');
      
      // Reset form
      resetForm();
      
      // Redirect to dashboard
      navigate('/admin');
      
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Add New Product</h2>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => navigate('/admin')}
        >
          <i className="bi bi-arrow-left me-1"></i>
          Back to Dashboard
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="name" className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="category" className="form-label">Category</label>
                <input
                  type="text"
                  className="form-control"
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="price" className="form-label">Price ($)</label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="countInStock" className="form-label">Quantity in Stock</label>
                <input
                  type="number"
                  className="form-control"
                  id="countInStock"
                  name="countInStock"
                  min="0"
                  value={form.countInStock}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-12">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              
              <div className="col-12">
                <label className="form-label">Product Images</label>
                <div className="d-flex gap-2 mb-2">
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                  />
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={handleImageUrlAdd}
                  >
                    Add URL
                  </button>
                </div>
                
                {imagePreview.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {imagePreview.map((url, index) => (
                      <div key={index} className="position-relative" style={{ width: '100px' }}>
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="img-thumbnail"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          onClick={() => removeImage(index)}
                          style={{ fontSize: '0.7rem', padding: '0.1rem 0.3rem' }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {imagePreview.length === 0 && (
                  <div className="alert alert-warning" role="alert">
                    Please add at least one product image
                  </div>
                )}
              </div>
            </div>
            
            <div className="d-flex mt-3 gap-2">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || imagePreview.length === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding Product...
                  </>
                ) : (
                  'Add Product'
                )}
              </button>
              
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={resetForm}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 