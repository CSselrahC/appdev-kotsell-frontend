import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

function NavBar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar bg="dark" variant="dark" expand="md" fixed="top" className="topbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-info fw-bold">
          KOTSELL
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/"
              className={`nav-link-custom me-2 ${isActive('/') ? 'active' : ''}`}
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
              Marketplace
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
              className={`nav-link-custom ${isActive('/user') ? 'active' : ''}`}
            >
              <i className="ri-user-line me-2"></i>
              Account
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
