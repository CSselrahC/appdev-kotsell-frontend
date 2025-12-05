import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin-login');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container-fluid">
          {/* Brand/Logo */}
          <Link className="navbar-brand fw-bold" to="/admin">
            KOTSELL Admin
          </Link>

          {/* Toggle button for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#adminNavbar"
            aria-controls="adminNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible Navbar Content */}
          <div className="collapse navbar-collapse" id="adminNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  <i className="bi bi-house-door me-1"></i>Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/products/add">
                  <i className="bi bi-plus-circle me-1"></i>Add Products
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/products/edit">
                  <i className="bi bi-pencil me-1"></i>Edit Products
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/account">
                  <i className="bi bi-person me-1"></i>Account
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item">
                <button className="btn btn-outline-light ms-3" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i>Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
