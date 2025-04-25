import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/api';
import ProductCard from '../components/ProductCard';

export default function Profile() {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [myProds, setMyProds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || ''
  });
  const [imagePreview, setImagePreview] = useState(user?.profileImage || '');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user && user.role === 'artisan') {
      API.get('/products').then(res =>
        setMyProds(res.data.filter(p => p.artisan._id === user.id))
      );
    }
    
    // Initialize form with user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        profileImage: user.profileImage || ''
      });
      setImagePreview(user.profileImage || '');
    }
  }, [user]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setErrorMsg('');
    setSuccess(false);
    
    // Reset form data when canceling edit
    if (editMode) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        profileImage: user.profileImage || ''
      });
      setImagePreview(user.profileImage || '');
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Convert image to base64 string for submission
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);
    
    try {
      // Create update data object
      const updateData = {
        name: formData.name,
        bio: formData.bio
      };
      
      // Only include profile image if it's provided and user is an artisan
      if (formData.profileImage && user.role === 'artisan') {
        updateData.profileImage = formData.profileImage;
      }
      
      // Use context method to update profile
      await updateUserProfile(updateData);
      
      setSuccess(true);
      setEditMode(false);
    } catch (err) {
      console.error('Profile update error:', err);
      setErrorMsg(err.response?.data?.msg || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="container text-center py-5">Loading profile...</div>;
  }
  
  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h4 className="mb-0">My Profile</h4>
              <button 
                className={`btn btn-sm ${editMode ? 'btn-secondary' : 'btn-primary'}`}
                onClick={toggleEditMode}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            
            <div className="card-body">
              {success && (
                <div className="alert alert-success" role="alert">
                  Profile updated successfully!
                </div>
              )}
              
              {errorMsg && (
                <div className="alert alert-danger" role="alert">
                  {errorMsg}
                </div>
              )}
              
              {editMode ? (
                /* Edit Profile Form */
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      disabled
                    />
                    <div className="form-text text-muted">Email cannot be changed.</div>
                  </div>
                  
                  {user.role === 'artisan' && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="bio" className="form-label">Bio / Description</label>
                        <textarea
                          className="form-control"
                          id="bio"
                          name="bio"
                          rows="3"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself and your craft..."
                        ></textarea>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="profileImage" className="form-label">Profile Image</label>
                        <input
                          type="file"
                          className="form-control"
                          id="profileImage"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          ref={fileInputRef}
                        />
                        
                        {imagePreview && (
                          <div className="mt-2 text-center">
                            <img
                              src={imagePreview}
                              alt="Profile Preview"
                              className="img-thumbnail"
                              style={{ maxHeight: '200px', maxWidth: '200px' }}
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </form>
              ) : (
                /* Profile Display */
                <div className="row">
                  {user.role === 'artisan' && user.profileImage && (
                    <div className="col-md-4 text-center mb-3 mb-md-0">
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="img-thumbnail rounded-circle"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  
                  <div className={user.role === 'artisan' && user.profileImage ? "col-md-8" : "col-12"}>
                    <h5>{user.name}</h5>
                    <p className="text-muted mb-2">
                      <i className="bi bi-envelope me-2"></i>{user.email}
                    </p>
                    <p className="text-muted mb-2">
                      <i className="bi bi-person-badge me-2"></i>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </p>
                    
                    {user.role === 'artisan' && user.bio && (
                      <div className="mt-3">
                        <h6>About Me</h6>
                        <p>{user.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {user.role === 'artisan' && (
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">My Products</h5>
              </div>
              <div className="card-body">
                {myProds.length === 0 ? (
                  <div className="alert alert-info">
                    You haven't added any products yet.
                  </div>
                ) : (
                  <div className="row g-4">
                    {myProds.map(p => (
                      <div className="col-sm-6 col-lg-4" key={p._id}>
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
