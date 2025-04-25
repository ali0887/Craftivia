import React, { useState, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [role, setRole] = useState('buyer');
  const [profileImage, setProfileImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  const { register } = useContext(AuthContext);
  const nav = useNavigate();

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Convert image to base64 string for submission
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form inputs
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Artisans should upload a profile image
    if (role === 'artisan' && !profileImage) {
      setError('As an artisan, please upload a profile image');
      setLoading(false);
      return;
    }

    try {
      // Build registration data
      const userData = { name, email, password, role };
      
      // Add optional fields for artisans
      if (role === 'artisan') {
        userData.profileImage = profileImage;
        userData.bio = bio;
      }
      
      await register(name, email, password, role, profileImage, bio);
      alert('Registration successful! Please log in.');
      nav('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <h2>Create an Account</h2>
                <p className="text-muted">Join our community of artisans and buyers</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="passwordConfirm" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordConfirm"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="form-label">I want to join as</label>
                  <select
                    className="form-select"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="buyer">Buyer - I want to shop for products</option>
                    <option value="artisan">Artisan - I want to sell my creations</option>
                  </select>
                </div>

                {/* Additional fields for artisans */}
                {role === 'artisan' && (
                  <div className="border rounded p-3 mb-4 bg-light">
                    <h5 className="mb-3">Artisan Profile</h5>
                    
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
                    
                    <div className="mb-3">
                      <label htmlFor="bio" className="form-label">Bio / Description</label>
                      <textarea
                        className="form-control"
                        id="bio"
                        rows="3"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself and your craft..."
                      ></textarea>
                    </div>
                  </div>
                )}

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-4 text-center">
                <p>
                  Already have an account? <Link to="/login">Log in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
