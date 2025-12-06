// src/components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleCustomerClick = () => {
    navigate('/homepage'); // or /shop
  };

  const handleAdminClick = () => {
    navigate('/admin-login');
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center w-100"
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e40af 0%, #0f172a 100%)',
        padding: 'clamp(16px, 4vw, 20px)'
      }}
    >
      <div
        className="bg-white shadow-lg rounded-4 w-100"
        style={{ 
          maxWidth: 440, 
          padding: 'clamp(24px, 6vw, 40px)',
          margin: '0 auto'
        }}
      >
        {/* Header / brand */}
        <div className="text-center mb-4">
          <h1
            className="fw-bold mb-2"
            style={{ 
              color: '#2563eb', 
              letterSpacing: '0.14em', 
              fontSize: 'clamp(1.5rem, 5vw, 2rem)'
            }}
          >
            KOTSELL
          </h1>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Your complete e-commerce solution
          </p>
        </div>

        {/* Thin divider */}
        <div
          className="mx-auto mb-4"
          style={{ width: 64, height: 2, backgroundColor: '#e5e7eb' }}
        />

        {/* Welcome text */}
        <div className="text-center mb-4">
          <h2 className="h4 fw-semibold mb-2">Welcome!</h2>
          <p className="text-secondary mb-0" style={{ fontSize: '0.95rem' }}>
            Please select your role to continue.
          </p>
        </div>

        {/* Buttons (like a login card actions) */}
        <div className="d-grid gap-3 mb-4">
          <button
            type="button"
            className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2 fw-semibold"
            onClick={handleCustomerClick}
            style={{
              borderRadius: 999,
              background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
              border: 'none',
            }}
          >
            <span role="img" aria-label="cart">
              🛒
            </span>
            <span>Customer</span>
          </button>

          <button
            type="button"
            className="btn btn-light btn-lg d-flex align-items-center justify-content-center gap-2 fw-semibold"
            onClick={handleAdminClick}
            style={{
              borderRadius: 999,
              border: '2px solid #d1d5db',
              color: '#111827',
            }}
          >
            <span role="img" aria-label="admin">
              👨‍💼
            </span>
            <span>Admin</span>
          </button>
        </div>

        {/* Helper + footer text */}
        <div className="text-center mb-2">
          <small className="text-muted" style={{ fontSize: '0.8rem' }}>
            Later you can route these buttons to real login forms.
          </small>
        </div>

        <div className="pt-3 border-top text-center">
          <small className="text-muted" style={{ fontSize: '0.85rem' }}>
            Ready to start shopping or managing your store?
          </small>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
