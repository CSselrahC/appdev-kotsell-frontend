import React from 'react';

function AdminDashboard() {
  return (
    <div>
      <h2 className="fw-bold mb-3">Admin Dashboard</h2>
      <p>Welcome, Admin. Here you can manage products, view orders, and monitor your store.</p>

      <div className="row g-3 mt-3">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6 className="text-muted mb-1">Total Products</h6>
            <h3>0</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6 className="text-muted mb-1">Total Orders</h6>
            <h3>0</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6 className="text-muted mb-1">Revenue</h6>
            <h3>₱0.00</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
