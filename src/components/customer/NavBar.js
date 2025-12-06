import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../App.css';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // Clear any user session data if needed
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="md" fixed="top" className="topbar">
      <Container>
        <Navbar.Brand as={Link} to="/homepage" className="text-info fw-bold">
          KOTSELL
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="customer-navbar" />
        <Navbar.Collapse id="customer-navbar">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/homepage"
              className={`nav-link-custom me-2 ${isActive('/homepage') ? 'active' : ''}`}
            >
              <i className="ri-home-line me-2"></i>
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/products"
              className={`nav-link-custom me-2 ${isActive('/products') ? 'active' : ''}`}
            >
              <i className="ri-shopping-basket-line me-2"></i>
              Shop
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/cart"
              className={`nav-link-custom me-2 ${isActive('/cart') ? 'active' : ''}`}
            >
              <i className="ri-shopping-cart-line me-2"></i>
              Cart
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/user"
              className={`nav-link-custom me-2 ${isActive('/user') ? 'active' : ''}`}
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
  );
}

export default NavBar;
