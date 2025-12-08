// src/components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleCustomerClick = () => {
    // go to customer login/register page
    navigate('/customer-auth');
  };

  const handleAdminClick = () => {
    navigate('/admin-login');
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center w-100 bg-light"
      style={{ minHeight: '100vh' }}
    >
      <div className="container px-3 px-sm-4">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-sm-5">
                {/* Header / Brand */}
                <div className="text-center mb-4">
                  <h1
                    className="fw-bold mb-2 text-primary"
                    style={{ letterSpacing: '0.14em' }}
                  >
                    KOTSELL
                  </h1>
                  <p className="text-muted mb-0 small">
                    Your one stop shop for everything cars!
                  </p>
                </div>

                {/* Divider */}
                <div
                  className="mx-auto mb-4"
                  style={{
                    width: '60px',
                    height: '2px',
                    backgroundColor: '#e5e7eb',
                  }}
                />

                {/* Welcome Text */}
                <div className="text-center mb-4">
                  <h2 className="h4 fw-semibold mb-2">Welcome!</h2>
                  <p className="text-secondary mb-0 small">
                    Please select your role to continue.
                  </p>
                </div>

                {/* Buttons */}
                <div className="d-grid gap-3 mb-4">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2 fw-semibold"
                    onClick={handleCustomerClick}
                    style={{
                      borderRadius: '999px',
                      background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
                      border: 'none',
                    }}
                  >
                    <span>Customer</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-light btn-lg d-flex align-items-center justify-content-center gap-2 fw-semibold"
                    onClick={handleAdminClick}
                    style={{
                      borderRadius: '999px',
                      border: '2px solid #d1d5db',
                      color: '#111827',
                    }}
                  >
                    <span>Admin</span>
                  </button>
                </div>

                {/* Footer */}
                <div className="pt-3 border-top text-center">
                  <small
                    className="text-muted d-block"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Powered by React.js
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
