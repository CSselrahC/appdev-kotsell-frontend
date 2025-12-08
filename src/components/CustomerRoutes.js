// src/components/CustomerRoutes.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import NavBar from './customer/NavBar';
import HomePage from './customer/HomePage';
import ProductList from './customer/ProductList';
import Cart from './customer/Cart';
import ProductDetails from './customer/ProductDetails';
import Checkout from './customer/Checkout';
import User from './customer/User';
import CustomerAuthPage from './customer/CustomerAuthPage';

function CustomerRoutes({
  cart,
  setCart,
  transactions,
  onTransaction,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  houseStreet,
  setHouseStreet,
  barangay,
  setBarangay,
  city,
  setCity,
  postalCode,
  setPostalCode,
  addToCart,
}) {
  const location = useLocation();
  const hideNavOnAuth = location.pathname === '/customer-auth';

  return (
    <>
      {/* Hide NavBar on customer login/register page */}
      {!hideNavOnAuth && <NavBar cart={cart} />}

      <main className="main-content">
        <Routes>
          {/* Customer login / register */}
          <Route path="/customer-auth" element={<CustomerAuthPage />} />

          {/* Customer shop pages */}
          <Route path="/homepage" element={<HomePage userName={firstName} />} />
          <Route path="/products" element={<ProductList addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route
            path="/details/:id"
            element={<ProductDetails cart={cart} setCart={setCart} />}
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                cart={cart}
                setCart={setCart}
                onTransaction={onTransaction}
                defaultContactInfo={{
                  firstName,
                  lastName,
                  houseStreet,
                  barangay,
                  city,
                  postalCode,
                }}
              />
            }
          />
          <Route
            path="/user"
            element={
              <User
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                houseStreet={houseStreet}
                setHouseStreet={setHouseStreet}
                barangay={barangay}
                setBarangay={setBarangay}
                city={city}
                setCity={setCity}
                postalCode={postalCode}
                setPostalCode={setPostalCode}
                transactions={transactions}
              />
            }
          />

          {/* Default for customer area → go to auth first */}
          <Route path="/" element={<Navigate to="/customer-auth" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default CustomerRoutes;
