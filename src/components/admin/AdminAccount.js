import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8082/api';

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
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // First check localStorage for quick access
      const stored = localStorage.getItem('adminAccount');
      if (stored) {
        try {
          const adminData = JSON.parse(stored);
          setFormData(adminData);
          setLoading(false);
          return;
        } catch (parseError) {
          console.error('Error parsing localStorage admin data:', parseError);
          localStorage.removeItem('adminAccount');
        }
      }

      // Fetch from backend API
      const response = await fetch(`${API_BASE_URL}/admins`);
      if (!response.ok) {
        throw new Error(`Failed to fetch admin data: ${response.status}`);
      }

      const admins = await response.json();
      let adminData = null;

      if (Array.isArray(admins)) {
        adminData = admins.find(admin => admin.username === 'admin') || admins[0];
      } else if (admins.data) {
        adminData = admins.data.find(admin => admin.username === 'admin') || admins.data[0];
      }

      if (adminData) {
        // Don't expose password in frontend state
        const { password, ...safeAdminData } = adminData;
        setFormData(safeAdminData);
        localStorage.setItem('adminAccount', JSON.stringify(safeAdminData));
      } else {
        // Fallback to default if no admin found
        const defaultAdmin = {
          adminId: 'ADMIN001',
          username: 'admin',
          email: 'admin@kotsell.com',
          name: 'Administrator'
        };
        setFormData(defaultAdmin);
        localStorage.setItem('adminAccount', JSON.stringify(defaultAdmin));
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
      
      // Fallback to localStorage default
      const stored = localStorage.getItem('adminAccount');
      if (stored) {
        try {
          setFormData(JSON.parse(stored));
        } catch {
          // Set default if localStorage is corrupted
          const defaultAdmin = {
            adminId: 'ADMIN001',
            username: 'admin',
            email: 'admin@kotsell.com',
            name: 'Administrator'
          };
          setFormData(defaultAdmin);
          localStorage.setItem('adminAccount', JSON.stringify(defaultAdmin));
        }
      } else {
        const defaultAdmin = {
          adminId: 'ADMIN001',
          username: 'admin',
          email: 'admin@kotsell.com',
          name: 'Administrator'
        };
        setFormData(defaultAdmin);
        localStorage.setItem('adminAccount', JSON.stringify(defaultAdmin));
      }
      
      setError('Using fallback data. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdating(true);

    try {
      // Validation
      if (!formData.username || !formData.email || !formData.name) {
        throw new Error('Please fill in all required fields.');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address.');
      }

      // Password validation (optional field for update)
      if (formData.password && formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      // Prepare update data (only send password if provided)
      const updateData = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        ...(formData.password && { password: formData.password })
      };

      // Determine admin ID for update
      const adminId = formData.adminId || 1; // Fallback to ID 1 if no adminId

      // Update admin in backend
      const response = await fetch(`${API_BASE_URL}/admins/${adminId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update response error:', errorText);
        throw new Error(`Failed to update admin: ${response.status} ${response.statusText}`);
      }

      // Update localStorage with new data (without password)
      const { password, ...safeFormData } = formData;
      localStorage.setItem('adminAccount', JSON.stringify(safeFormData));

      setSuccess('Admin account updated successfully!');
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Update error:', error);
      setError(error.message || 'Failed to update admin account');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminAccount');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-6">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold mb-0">
                <i className="ri-admin-line me-2"></i>Admin Account Settings
              </h5>
              <p className="text-muted mb-0">Manage your admin profile</p>
            </div>
            <button 
              className="btn btn-outline-danger px-3" 
              onClick={handleLogout}
            >
              <i className="ri-logout-box-line me-2"></i>
              Logout
            </button>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="ri-error-warning-line me-2"></i>
                  <strong>Error:</strong> {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError('')}
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
                    onClick={() => setSuccess('')}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Admin ID</label>
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
                  <label className="form-label fw-semibold">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                    disabled={updating}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Username *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    required
                    disabled={updating}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    required
                    disabled={updating}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">New Password (optional)</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current password"
                      disabled={updating}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={updating}
                    >
                      <i className={`ri-${showPassword ? 'eye-off' : 'eye'}-line`}></i>
                    </button>
                  </div>
                  <small className="text-muted d-block mt-1">
                    Minimum 6 characters (leave blank to keep current)
                  </small>
                </div>

                <div className="d-flex gap-2 justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate('/admin')}
                    disabled={updating}
                  >
                    <i className="ri-arrow-left-line me-2"></i>Back to Dashboard
                  </button>
                  <button
                    type="submit"
                    className="btn btn-dark px-4"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="ri-save-line me-2"></i>Save Changes
                      </>
                    )}
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
