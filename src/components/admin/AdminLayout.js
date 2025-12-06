import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import '../../App.css';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin-login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex flex-column min-vh-100 w-100">
      {/* Top Navbar */}
      <Navbar bg="dark" variant="dark" expand="md" fixed="top" className="topbar">
        <Container>
          <Navbar.Brand as={Link} to="/admin" className="text-info fw-bold">
            KOTSELL Admin
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-navbar" />
          <Navbar.Collapse id="admin-navbar">
            <Nav className="ms-auto">
              <Nav.Link
                as={Link}
                to="/admin"
                className={`nav-link-custom me-2 ${isActive('/admin') ? 'active' : ''}`}
              >
                <i className="ri-home-line me-2"></i>
                Dashboard
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/products/add"
                className={`nav-link-custom me-2 ${isActive('/admin/products/add') ? 'active' : ''}`}
              >
                <i className="ri-add-circle-line me-2"></i>
                Add Products
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/products/edit"
                className={`nav-link-custom me-2 ${isActive('/admin/products/edit') ? 'active' : ''}`}
              >
                <i className="ri-edit-line me-2"></i>
                Edit Products
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/account"
                className={`nav-link-custom me-2 ${isActive('/admin/account') ? 'active' : ''}`}
              >
                <i className="ri-user-line me-2"></i>
                Account
              </Nav.Link>
              <button 
                className="btn btn-link nav-link-custom text-decoration-none" 
                onClick={handleLogout}
                style={{ color: '#f8f9fa' }}
              >
                <i className="ri-logout-box-line me-2"></i>
                Logout
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main content */}
      <main className="flex-grow-1 w-100 bg-light mt-5">
        <Container className="py-4">
          <Outlet />
        </Container>
      </main>
    </div>
  );
}

export default AdminLayout;
