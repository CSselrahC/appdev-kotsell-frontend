import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adminId: '',
    username: '',
    email: '',
    password: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load admin account data from localStorage
    const stored = localStorage.getItem('adminAccount');
    if (stored) {
      try {
        const adminData = JSON.parse(stored);
        setFormData(adminData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading admin account:', error);
        setError('Failed to load admin account data');
        setLoading(false);
      }
    } else {
      // Set default admin account if none exists
      const defaultAdmin = {
        adminId: 'ADMIN001',
        username: 'admin',
        email: 'admin@kotsell.com',
        password: 'password123',
        name: 'Administrator'
      };
      setFormData(defaultAdmin);
      localStorage.setItem('adminAccount', JSON.stringify(defaultAdmin));
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username || !formData.email || !formData.password || !formData.name) {
      setError('Please fill in all required fields.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      localStorage.setItem('adminAccount', JSON.stringify(formData));
      console.log('Admin account updated:', formData);
      setSuccess('Account updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update account: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-6">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading account details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">
                <i className="ri-admin-line me-2"></i>Admin Account Settings
              </h5>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="ri-error-warning-line me-2"></i>
                  <strong>Error:</strong> {error}
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              )}
              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="ri-check-circle-line me-2"></i>
                  <strong>Success:</strong> {success}
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Admin ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.adminId}
                    disabled
                    placeholder="Admin ID"
                  />
                  <small className="text-muted d-block mt-1">
                    <i className="ri-information-line me-1"></i>Admin ID cannot be changed
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`ri-${showPassword ? 'eye-off' : 'eye'}-line`}></i>
                    </button>
                  </div>
                  <small className="text-muted d-block mt-1">
                    Minimum 6 characters
                  </small>
                </div>

                <div className="d-flex gap-2 justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/admin')}
                  >
                    <i className="ri-arrow-left-line me-2"></i>Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-dark"
                  >
                    <i className="ri-save-line me-2"></i>Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAccount;
