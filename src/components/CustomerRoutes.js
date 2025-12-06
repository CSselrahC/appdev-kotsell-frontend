import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Customer components
import NavBar from './customer/NavBar';
import HomePage from './customer/HomePage';
import ProductList from './customer/ProductList';
import Cart from './customer/Cart';
import ProductDetails from './customer/ProductDetails';
import Checkout from './customer/Checkout';
import User from './customer/User';

function CustomerRoutes({
  cart,
  setCart,
  transactions,
  onTransaction,
  usedCoupons,
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
  return (
    <>
      <NavBar cart={cart} />
      <main className="main-content">
        <Routes>
          <Route path="/homepage" element={<HomePage userName={firstName} />} />
          <Route path="/products" element={<ProductList addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/details/:id" element={<ProductDetails cart={cart} setCart={setCart} />} />
          <Route
            path="/checkout"
            element={
              <Checkout
                cart={cart}
                setCart={setCart}
                onTransaction={onTransaction}
                usedCoupons={usedCoupons}
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
          {/* Redirect to homepage for customer root */}
          <Route path="/" element={<Navigate to="/homepage" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default CustomerRoutes;
