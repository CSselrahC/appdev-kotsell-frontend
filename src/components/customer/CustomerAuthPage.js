// src/components/customer/CustomerAuthPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'http://localhost:8082/api';

function CustomerAuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // register-only
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // show/hide passwords (register)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const switchMode = (nextMode) => {
    if (nextMode === mode) return;
    resetMessages();
    setMode(nextMode);
  };

  // Helper function to safely parse JSON
  const parseJsonSafely = async (response) => {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200));
      throw new Error('Server returned invalid response format');
    }
    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    setIsLoading(true);

    try {
      if (mode === 'register') {
        if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
          setError('Please fill in all fields.');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/customers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            // User-entered fields
            username: username.trim(),
            email: email.trim(),
            password: password.trim(),

            // Optional fields - "default" strings ✅
            firstName: 'default',
            lastName: 'default',
            street: 'default',
            barangay: 'default',
            city: 'default',
            postalCode: 'default',
          }),
        });

        if (!response.ok) {
          const errorData = await parseJsonSafely(response).catch(() => ({
            message: `HTTP ${response.status}: ${response.statusText}`,
          }));
          throw new Error(errorData.message || 'Registration failed');
        }

        const data = await parseJsonSafely(response);
        setSuccess('Account created successfully. You can now login.');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setMode('login');
        setIsLoading(false);
        return;
      }

      // Login mode
      if (!email.trim() || !password.trim()) {
        setError('Please fill in all fields.');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/customers`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await parseJsonSafely(response);
      console.log('Customer data fetched:', data);

      let customers = Array.isArray(data) ? data : data.data || [];
      const customerAccount = customers.find(
        (customer) => customer.email === email.trim()
      );

      if (!customerAccount) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      if (password.trim() === customerAccount.password) {
        localStorage.setItem('isCustomer', 'true');
        localStorage.setItem('customerAccount', JSON.stringify(customerAccount));
        localStorage.setItem(
          'customerId',
          customerAccount.customersId || customerAccount.id
        );

        // Create full name from firstName + lastName or fallback to username
        const fullName = (customerAccount.firstName || '').trim() && (customerAccount.lastName || '').trim()
          ? `${customerAccount.firstName.trim()} ${customerAccount.lastName.trim()}`
          : customerAccount.username || 'User';

        localStorage.setItem('customerName', fullName);
        localStorage.setItem('customerEmail', customerAccount.email);

        setIsLoading(false);
        navigate('/homepage', { replace: true });
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setError(error.message || 'Failed to connect to server. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center w-100 bg-light position-relative"
      style={{ minHeight: '100vh', height: '100vh' }}
    >
      {/* Back button - positioned absolutely at top left */}
      <button
        className="btn btn-outline-secondary position-absolute top-0 start-0 m-3 m-md-4 p-2 shadow-sm"
        onClick={handleBack}
        style={{ width: '48px', height: '48px', zIndex: 10 }}
      >
        ←
      </button>

      <div className="w-100 px-3 px-sm-4">
        <div className="d-flex justify-content-center">
          <div style={{ width: '100%', maxWidth: 440 }}>
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
                  <div className="alert alert-danger py-2 small mb-3">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success py-2 small mb-3">
                    {success}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {mode === 'register' && (
                    <div className="mb-3">
                      <label className="form-label small">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small">Password</label>
                    <div className="input-group">
                      <input
                        type={
                          mode === 'register' && showPassword
                            ? 'text'
                            : 'password'
                        }
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        disabled={isLoading}
                      />
                      {mode === 'register' && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setShowPassword((prev) => !prev)}
                          disabled={isLoading}
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
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 fw-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        {mode === 'login' ? 'Logging in...' : 'Creating account...'}
                      </>
                    ) : mode === 'login' ? (
                      'Login'
                    ) : (
                      'Create Account'
                    )}
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
