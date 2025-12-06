import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../../App.css';

function NavBar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar bg="dark" variant="dark" expand="md" fixed="top" className="topbar">
      <Container>
        <Navbar.Brand as={Link} to="/homepage" className="text-light fw-bold">
          KOTSELL
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/homepage"
              className={`nav-link-custom me-4 ${isActive('/homepage') ? 'active' : ''}`}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/products"
              className={`nav-link-custom me-4 ${isActive('/products') ? 'active' : ''}`}
            >
              Marketplace
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/cart"
              className={`nav-link-custom me-4 ${isActive('/cart') ? 'active' : ''}`}
            >
              Cart
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/user"
              className={`nav-link-custom ${isActive('/user') ? 'active' : ''}`}
            >
              Account
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
