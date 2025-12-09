import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a small delay to prevent race conditions
    setTimeout(() => {
      // Get admin account from localStorage
      const adminAccountString = localStorage.getItem('adminAccount');
      let adminAccount = null;

      if (adminAccountString) {
        try {
          adminAccount = JSON.parse(adminAccountString);
        } catch (error) {
          console.error('Error parsing admin account:', error);
          setError('An error occurred. Please try again.');
          setIsLoading(false);
          return;
        }
      }

      // If no admin account exists, create default one
      if (!adminAccount) {
        adminAccount = {
          adminId: 'ADMIN001',
          username: 'admin',
          email: 'admin@kotsell.com',
          password: 'password123',
          name: 'Administrator'
        };
        localStorage.setItem('adminAccount', JSON.stringify(adminAccount));
      }

      // Validate credentials
      if (email === adminAccount.email && password === adminAccount.password) {
        localStorage.setItem('isAdmin', 'true');
        setIsLoading(false);
        // Use window.location or a small delay before navigate to ensure state is set
        navigate('/admin', { replace: true });
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 300);
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
