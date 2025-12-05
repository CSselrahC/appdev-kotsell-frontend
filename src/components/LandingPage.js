// src/components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleCustomerClick = () => {
    // Temporarily goes to shop (no customer login yet)
    navigate('/homepage');
  };

  const handleAdminClick = () => {
    navigate('/admin-login');
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="text-center p-5 border-0 rounded-4 bg-white shadow-lg" style={{ maxWidth: '500px', width: '90%' }}>
        {/* Logo/Title */}
        <div className="mb-5">
          <h1 className="display-4 fw-bold text-primary mb-3">KOTSELL</h1>
          <p className="lead text-muted">Your complete e-commerce solution</p>
        </div>

        {/* Welcome message */}
        <div className="mb-5">
          <h2 className="h3 fw-normal text-dark mb-3">Welcome!</h2>
          <p className="text-secondary mb-0">Please select your role to continue.</p>
        </div>

        {/* Buttons */}
        <div className="d-grid gap-4">
          <button
            className="btn btn-primary btn-lg py-3 fs-5 fw-semibold shadow-sm"
            onClick={handleCustomerClick}
          >
            🛒 Customer
          </button>
          <button
            className="btn btn-outline-secondary btn-lg py-3 fs-5 fw-semibold shadow-sm border-3"
            onClick={handleAdminClick}
          >
            👨‍💼 Admin
          </button>
        </div>

        {/* Footer text */}
        <div className="mt-5 pt-4 border-top">
          <small className="text-muted">
            Ready to start shopping or managing your store?
          </small>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
