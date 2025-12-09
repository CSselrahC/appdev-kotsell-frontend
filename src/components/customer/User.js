import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8082/api';

function User() {
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updating, setUpdating] = useState(false);

  // Customer data
  const [firstName, setFirstName] = useState('default');
  const [lastName, setLastName] = useState('default');
  const [houseStreet, setHouseStreet] = useState('default');
  const [barangay, setBarangay] = useState('default');
  const [city, setCity] = useState('default');
  const [postalCode, setPostalCode] = useState('default');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [customersId, setCustomersId] = useState(null);

  // Form state
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formHouseStreet, setFormHouseStreet] = useState('');
  const [formBarangay, setFormBarangay] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formPostalCode, setFormPostalCode] = useState('');

  // Transactions
  

  // Fetch customer data and transactions
  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const customerAccount = localStorage.getItem('customerAccount');
      
      if (!customerAccount) {
        navigate('/customer/login');
        return;
      }

      const customer = JSON.parse(customerAccount);
      setCustomersId(customer.customersId || customer.id);
      setUsername(customer.username || '');
      setEmail(customer.email || '');

      // Fetch full customer details
      const response = await fetch(`${API_BASE_URL}/customers`);
      if (!response.ok) throw new Error('Failed to fetch customer data');
      
      const customers = await response.json();
      const currentCustomer = Array.isArray(customers) 
        ? customers.find(c => c.customersId === customer.customersId || c.id === customer.customersId)
        : customers.data?.find(c => c.customersId === customer.customersId || c.id === customer.customersId);

      if (currentCustomer) {
        setFirstName(currentCustomer.firstName || 'default');
        setLastName(currentCustomer.lastName || 'default');
        setHouseStreet(currentCustomer.street || 'default');
        setBarangay(currentCustomer.barangay || 'default');
        setCity(currentCustomer.city || 'default');
        setPostalCode(currentCustomer.postalCode || 'default');
      }

      // no transaction history required
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load account data');
    } finally {
      setLoading(false);
    }
  };

  

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      setError('');
      setSuccess('');

      const updateData = {
        firstName: formFirstName.trim() === "" ? "No first name" : formFirstName.trim(),
        lastName: formLastName.trim() === "" ? "No last name" : formLastName.trim(),
        street: formHouseStreet.trim() === "" ? "No house/street" : formHouseStreet.trim(),
        barangay: formBarangay.trim() === "" ? "No barangay" : formBarangay.trim(),
        city: formCity.trim() === "" ? "No city" : formCity.trim(),
        postalCode: formPostalCode.trim() === "" ? "No postal code" : formPostalCode.trim(),
      };

      // Update customer in backend
      const response = await fetch(`${API_BASE_URL}/customers/${customersId}`, {
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
        throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
      }

      // Update localStorage with new customer data
      const customerAccount = localStorage.getItem('customerAccount');
      if (customerAccount) {
        const customer = JSON.parse(customerAccount);
        const updatedCustomer = { ...customer, firstName: updateData.firstName, lastName: updateData.lastName };
        localStorage.setItem('customerAccount', JSON.stringify(updatedCustomer));
      }

      // Update local state
      setFirstName(updateData.firstName);
      setLastName(updateData.lastName);
      setHouseStreet(updateData.street);
      setBarangay(updateData.barangay);
      setCity(updateData.city);
      setPostalCode(updateData.postalCode);

      setSuccess('Profile updated successfully!');
      setEdit(false);
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormFirstName(firstName);
    setFormLastName(lastName);
    setFormHouseStreet(houseStreet);
    setFormBarangay(barangay);
    setFormCity(city);
    setFormPostalCode(postalCode);
    setEdit(false);
    setError('');
    setSuccess('');
  };

  const handleLogout = () => {
    localStorage.removeItem('isCustomer');
    localStorage.removeItem('customerAccount');
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerName');
    localStorage.removeItem('customerEmail');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container my-5" style={{ maxWidth: '900px' }}>
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: '900px' }}>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
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
          {success}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccess('')}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Account</h2>
          <p className="text-muted mb-0">Welcome, {username}</p>
          <small className="text-muted">Email: {email}</small>
        </div>
        <button 
          className="btn btn-outline-danger px-4" 
          onClick={handleLogout}
        >
          <i className="ri-logout-box-line me-2"></i>
          Logout
        </button>
      </div>
      
      <div className="card p-4" style={{ borderRadius: '10px' }}>
        <h3 className="fw-bold mb-4">Contact Information</h3>
        {edit ? (
          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  className="form-control"
                  type="text"
                  value={formFirstName}
                  onChange={e => setFormFirstName(e.target.value)}
                  disabled={updating}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  className="form-control"
                  type="text"
                  value={formLastName}
                  onChange={e => setFormLastName(e.target.value)}
                  disabled={updating}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">House No./Street</label>
                <input
                  className="form-control"
                  type="text"
                  value={formHouseStreet}
                  onChange={e => setFormHouseStreet(e.target.value)}
                  disabled={updating}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Barangay</label>
                <input
                  className="form-control"
                  type="text"
                  value={formBarangay}
                  onChange={e => setFormBarangay(e.target.value)}
                  disabled={updating}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input
                  className="form-control"
                  type="text"
                  value={formCity}
                  onChange={e => setFormCity(e.target.value)}
                  disabled={updating}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Postal Code</label>
                <input
                  className="form-control"
                  type="text"
                  value={formPostalCode}
                  onChange={e => setFormPostalCode(e.target.value)}
                  disabled={updating}
                />
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button 
                type="submit" 
                className="btn btn-success px-4" 
                disabled={updating}
              >
                {updating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary px-4" 
                onClick={handleCancel}
                disabled={updating}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input className="form-control" value={firstName} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input className="form-control" value={lastName} disabled />
              </div>
              <div className="col-12">
                <label className="form-label">House No./Street</label>
                <input className="form-control" value={houseStreet} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">Barangay</label>
                <input className="form-control" value={barangay} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input className="form-control" value={city} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">Postal Code</label>
                <input className="form-control" value={postalCode} disabled />
              </div>
            </div>
            <button 
              className="btn btn-primary px-4 mt-3" 
              onClick={() => {
                setFormFirstName(firstName);
                setFormLastName(lastName);
                setFormHouseStreet(houseStreet);
                setFormBarangay(barangay);
                setFormCity(city);
                setFormPostalCode(postalCode);
                setEdit(true);
              }}
            >
              Edit Details
            </button>
          </div>
        )}
      </div>

      
    </div>
  );
}

export default User;
