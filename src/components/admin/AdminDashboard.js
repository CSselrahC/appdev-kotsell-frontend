import React from 'react';

function AdminDashboard() {
  return (
    <div className="w-100">
      <h2 className="fw-bold mb-3">Admin Dashboard</h2>
      <p>Welcome, Admin. Here you can manage products and monitor the store.</p>

      <div className="row g-3 g-md-4 mt-3">
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm p-3 h-100">
            <h6 className="text-muted mb-1">Total Products</h6>
            <h3>0</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm p-3 h-100">
            <h6 className="text-muted mb-1">Total Orders</h6>
            <h3>0</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm p-3 h-100">
            <h6 className="text-muted mb-1">Revenue</h6>
            <h3>₱0.00</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
