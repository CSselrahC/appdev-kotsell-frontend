import React, { useState } from 'react';
import { Offcanvas, Nav, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

function NavBar() {
  const [show, setShow] = useState(false);
  const location = useLocation();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Sidebar for desktop (fixed, always visible) */}
      <div className="sidebar d-none d-md-block bg-dark text-white">
        <div className="p-4 d-flex justify-content-center">
          <div className="fs-5 fw-bold text-info mb-4">
            KOTSELL
          </div>
        </div>
        <Nav className="flex-column px-3">
          <Nav.Link
            as={Link}
            to="/"
            className={`sidebar-link mb-2 ${isActive('/') ? 'active' : ''}`}
          >
            <i className="ri-home-line me-2"></i>
            Home
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/products"
            className={`sidebar-link mb-2 ${isActive('/products') ? 'active' : ''}`}
          >
            <i className="ri-shopping-basket-line me-2"></i>
            Marketplace
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/cart"
            className={`sidebar-link mb-2 ${isActive('/cart') ? 'active' : ''}`}
          >
            <i className="ri-shopping-cart-line me-2"></i>
            Cart
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/user"
            className={`sidebar-link mb-2 ${isActive('/user') ? 'active' : ''}`}
          >
            <i className="ri-user-line me-2"></i>
            Account
          </Nav.Link>
        </Nav>
      </div>

      {/* Toggle button for mobile */}
      <Button
        variant="dark"
        className="d-md-none position-fixed top-0 start-0 m-3"
        onClick={handleShow}
        style={{ zIndex: 1045 }}
        aria-label="Open menu"
      >
        ☰
      </Button>

      {/* Offcanvas version for mobile */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        className="bg-dark text-white d-md-none"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="text-info fw-bold">
            KOTSELL
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link
              as={Link}
              to="/"
              onClick={handleClose}
              className={`sidebar-link mb-2 ${isActive('/') ? 'active' : ''}`}
            >
              <i className="ri-home-line me-2"></i>
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/products"
              onClick={handleClose}
              className={`sidebar-link mb-2 ${isActive('/products') ? 'active' : ''}`}
            >
              <i className="ri-shopping-basket-line me-2"></i>
              Marketplace
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/cart"
              onClick={handleClose}
              className={`sidebar-link mb-2 ${isActive('/cart') ? 'active' : ''}`}
            >
              <i className="ri-shopping-cart-line me-2"></i>
              Cart
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/user"
              onClick={handleClose}
              className={`sidebar-link mb-2 ${isActive('/user') ? 'active' : ''}`}
            >
              <i className="ri-user-line me-2"></i>
              Account
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NavBar;
