import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    setError('');

    // TODO: replace this with real Laravel API call later
    // For now, accept any non-empty email+password as "admin"
    if (email.trim() && password.trim()) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Invalid email or password');
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

        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
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
            />
          </div>
          <button type="submit" className="btn btn-dark w-100 fw-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
