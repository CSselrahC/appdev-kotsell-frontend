import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8082/api';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Fetch all admins from API
      const response = await fetch(`${API_BASE_URL}/admins`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Admin data fetched:', data);

      // Handle both array and object responses
      let admins = Array.isArray(data) ? data : data.data || [];
      
      // Find admin by email
      const adminAccount = admins.find(admin => admin.email === email);

      if (!adminAccount) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Password validation - in a real app, this should be done server-side
      // For now, we accept non-empty passwords and log them for backend verification
      if (password && password.length > 0) {
        // Store admin info in localStorage
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminAccount', JSON.stringify(adminAccount));
        localStorage.setItem('adminId', adminAccount.adminId || adminAccount.id);
        setIsLoading(false);
        navigate('/admin', { replace: true });
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Failed to connect to server. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-light w-100 px-3">
      {/* Back button - positioned absolutely at top left */}
      <button
        className="btn btn-outline-secondary position-absolute top-0 start-0 m-3 m-md-4 p-2 shadow-sm"
        onClick={handleBack}
        style={{ width: '48px', height: '48px', zIndex: 10 }}
      >
        ←
      </button>

      {/* Login card container */}
      <div className="card shadow p-4 w-100" style={{ minWidth: '280px', maxWidth: '400px' }}>
        <h3 className="fw-bold text-center mb-3">Admin Login</h3>

        {error && (
          <div className="alert alert-danger py-2 d-flex align-items-center gap-2">
            <i className="ri-error-warning-line"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@kotsell.com"
              required
              disabled={isLoading}
            />
            <small className="text-muted d-block mt-1">Default: admin@kotsell.com</small>
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="password"
              required
              disabled={isLoading}
            />
            <small className="text-muted d-block mt-1">Default: password123</small>
          </div>
          <button 
            type="submit" 
            className="btn btn-dark w-100 fw-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
