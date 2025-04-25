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
  // State for editing product
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

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
    setEditMode(false);
    setEditProductId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const productData = {
        ...form,
        price: Number(form.price),
        countInStock: Number(form.countInStock),
        images: form.images
      };

      if (editMode && editProductId) {
        // Update existing product
        await API.put(`/products/${editProductId}`, productData);
        alert('Product updated successfully!');
      } else {
        // Create new product
        await API.post('/products', productData);
        alert('Product added successfully!');
      }
      
      // Reset form
      resetForm();
      
      // Reload products
      await loadProducts();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error with product operation:', error);
      alert(`Failed to ${editMode ? 'update' : 'add'} product. Please try again.`);
    }
  };

  const onEdit = (product) => {
    // Set form with product data
    setForm({
      name: product.name,
      description: product.description || '',
      category: product.category || '',
      price: product.price.toString(),
      countInStock: product.countInStock.toString(),
      images: product.images || []
    });

    // Set image previews
    setImagePreview(product.images || []);
    
    // Set edit mode
    setEditMode(true);
    setEditProductId(product._id);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onCancelEdit = () => {
    resetForm();
  };

  const onDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await API.delete(`/products/${id}`);
      setProducts(ps => ps.filter(p => p._id !== id));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const onUpdateStock = async (id, product, newStock) => {
    try {
      // Get current stock
      const currentStock = product.countInStock;
      
      // Ask for new stock amount
      const input = prompt('Enter new stock quantity:', currentStock);
      
      if (input === null) return; // Cancelled
      
      const stockAmount = parseInt(input);
      if (isNaN(stockAmount) || stockAmount < 0) {
        alert('Please enter a valid number (0 or higher)');
        return;
      }
      
      // Update product with new stock
      await API.put(`/products/${id}`, {
        countInStock: stockAmount
      });
      
      // Update local state
      setProducts(products.map(p => 
        p._id === id ? { ...p, countInStock: stockAmount } : p
      ));
      
      alert('Stock updated successfully!');
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock. Please try again.');
    }
  };

  const onToggleAvailability = async (id, product) => {
    try {
      const newStatus = product.countInStock > 0 ? 0 : 10; // Toggle between available (10) and unavailable (0)
      
      await API.put(`/products/${id}`, {
        countInStock: newStatus
      });
      
      // Update local state
      setProducts(products.map(p => 
        p._id === id ? { ...p, countInStock: newStatus } : p
      ));
      
      alert(`Product is now ${newStatus > 0 ? 'available' : 'discontinued'}`);
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Failed to update product availability. Please try again.');
    }
  };

  // if artisan, show only own products
  const viewList = user?.role === 'artisan'
    ? products.filter(p => p.artisan && p.artisan._id === user.id)
    : products;

  return (
    <div className="container py-4">
      <h2 className="mb-4">
        {user?.role === 'admin' ? 'Admin Dashboard' : 'My Products'}
      </h2>

      {user?.role === 'artisan' && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-light">
            <h5 className="mb-0">{editMode ? 'Edit Product' : 'Add New Product'}</h5>
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
              
              <div className="d-flex mt-3 gap-2">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={loading || imagePreview.length === 0}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {editMode ? 'Updating Product...' : 'Adding Product...'}
                    </>
                  ) : (
                    editMode ? 'Update Product' : 'Add Product'
                  )}
                </button>
                
                {editMode && (
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={onCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0">Products</h5>
        </div>
        <div className="card-body">
          {viewList.length === 0 ? (
            <div className="alert alert-info">
              {user?.role === 'artisan' 
                ? "You haven't added any products yet." 
                : "No products found."}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {viewList.map(product => (
                    <tr key={product._id}>
                      <td>
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="img-thumbnail"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>${product.price}</td>
                      <td>
                        <span className={`badge ${product.countInStock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.countInStock > 0 ? product.countInStock : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            type="button" 
                            className="btn btn-outline-primary"
                            onClick={() => onEdit(product)}
                          >
                            Edit
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={() => onUpdateStock(product._id, product)}
                          >
                            Update Stock
                          </button>
                          <button 
                            type="button" 
                            className={`btn btn-outline-${product.countInStock > 0 ? 'warning' : 'success'}`}
                            onClick={() => onToggleAvailability(product._id, product)}
                          >
                            {product.countInStock > 0 ? 'Discontinue' : 'Reactivate'}
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-outline-danger"
                            onClick={() => onDelete(product._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
