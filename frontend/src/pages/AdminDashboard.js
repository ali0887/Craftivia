import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/api';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', 
    description: '', 
    category: '', 
    price: '', 
    countInStock: '', 
    images: []
  });
  const [imageUrls, setImageUrls] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Failed to load products. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrlAdd = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      setImageUrls([...imageUrls, url.trim()]);
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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // In a real implementation, you'd first upload the images to your server/cloud storage
      // Then use the returned URLs in your product creation
      
      await API.post('/products', {
        ...form,
        price: Number(form.price),
        countInStock: Number(form.countInStock),
        // Ensure we're sending the array of image URLs
        images: form.images
      });
      
      // Reset form
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
      
      // Reload products
      await loadProducts();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await API.delete(`/products/${id}`);
      setProducts(ps => ps.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  // if artisan, show only own products
  const viewList = user.role === 'artisan'
    ? products.filter(p => p.artisan && p.artisan._id === user.id)
    : products;

  return (
    <div className="container py-4">
      <h2 className="mb-4">
        {user.role === 'admin' ? 'Admin Dashboard' : 'My Products'}
      </h2>

      {user.role === 'artisan' && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-light">
            <h5 className="mb-0">Add New Product</h5>
          </div>
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
              
              <div className="d-grid mt-3">
                <button 
                  type="submit" 
                  className="btn btn-success"
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
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Product List</h5>
          <span className="badge bg-primary">{viewList.length} Products</span>
        </div>
        
        {viewList.length === 0 ? (
          <div className="card-body text-center py-5">
            <p className="text-muted mb-0">No products found. Add your first product above!</p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {viewList.map(p => (
              <div key={p._id} className="list-group-item">
                <div className="d-flex align-items-center">
                  {p.images && p.images[0] && (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="me-3 rounded"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="flex-grow-1">
                    <h5 className="mb-1">{p.name}</h5>
                    <div className="d-flex flex-wrap gap-2">
                      <small className="text-success">${p.price}</small>
                      <small className="text-muted">Category: {p.category}</small>
                      <small className="text-muted">In Stock: {p.countInStock}</small>
                    </div>
                  </div>
                  <div className="btn-group">
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onDelete(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
