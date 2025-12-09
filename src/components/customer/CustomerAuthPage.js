// src/components/customer/CustomerAuthPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function CustomerAuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // register-only
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // show/hide passwords (register)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const switchMode = (nextMode) => {
    if (nextMode === mode) return;
    resetMessages();
    setMode(nextMode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    resetMessages();

    if (mode === 'register') {
      if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        setError('Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const user = { name: name.trim(), email: email.trim(), password: password.trim() };
      localStorage.setItem('kotSellCustomer', JSON.stringify(user));
      setSuccess('Account created successfully. You can now login.');
      setMode('login');
      return;
    }

    const stored = localStorage.getItem('kotSellCustomer');
    if (!stored) {
      setError('No account found. Please register first.');
      return;
    }

    const user = JSON.parse(stored);
    if (email.trim() === user.email && password.trim() === user.password) {
      localStorage.setItem('isCustomer', 'true');
      navigate('/homepage');
    } else {
      setError('Incorrect email or password.');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center w-100 bg-light"
    style={{minHeight: "100vh"}}
    >
      <div className="container px-3 px-sm-4">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-sm-5">
                {/* Header */}
                <div className="text-center mb-3">
                  <h1
                    className="fw-bold mb-1 text-primary"
                    style={{ letterSpacing: '0.14em' }}
                  >
                    KOTSELL
                  </h1>
                  <p className="text-muted small mb-0">Customer Account</p>
                </div>

                {/* Tabs */}
                <div className="d-flex mb-4 rounded-pill bg-light p-1">
                  <button
                    type="button"
                    className={`flex-fill btn btn-sm rounded-pill ${
                      mode === 'login'
                        ? 'btn-primary text-white'
                        : 'btn-link text-muted text-decoration-none'
                    }`}
                    onClick={() => switchMode('login')}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className={`flex-fill btn btn-sm rounded-pill ${
                      mode === 'register'
                        ? 'btn-primary text-white'
                        : 'btn-link text-muted text-decoration-none'
                    }`}
                    onClick={() => switchMode('register')}
                  >
                    Register
                  </button>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 small mb-3">{error}</div>
                )}
                {success && (
                  <div className="alert alert-success py-2 small mb-3">{success}</div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {mode === 'register' && (
                    <div className="mb-3">
                      <label className="form-label small">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Juan Dela Cruz"
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  {/* Password field */}
                  <div className="mb-3">
                    <label className="form-label small">Password</label>
                    <div className="input-group">
                      <input
                        type={mode === 'register' && showPassword ? 'text' : 'password'}
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                      />
                      {mode === 'register' && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Confirm password with show/hide in register mode */}
                  {mode === 'register' && (
                    <div className="mb-3">
                      <label className="form-label small">Confirm Password</label>
                      <div className="input-group">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="form-control"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                        >
                          {showConfirmPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 fw-semibold"
                  >
                    {mode === 'login' ? 'Login' : 'Create Account'}
                  </button>
                </form>

                <div className="pt-3 mt-3 border-top text-center">
                  <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                    {mode === 'login'
                      ? "Don't have an account yet? Switch to Register."
                      : 'Already registered? Switch to Login.'}
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

export default CustomerAuthPage;
