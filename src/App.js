import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Landing page
import LandingPage from './components/LandingPage';

// Customer components
import HomePage from './components/customer/HomePage';
import NavBar from './components/customer/NavBar';
import ProductList from './components/customer/ProductList';
import Cart from './components/customer/Cart';
import ProductDetails from './components/customer/ProductDetails';
import Checkout from './components/customer/Checkout';
import User from './components/customer/User';

// Admin components
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminRoutes from './components/AdminRoutes';

function App() {
  const [cart, setCart] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [usedCoupons, setUsedCoupons] = useState([]);

  // User details
  const [firstName, setFirstName] = useState("Juan");
  const [lastName, setLastName] = useState("Dela Cruz");
  const [houseStreet, setHouseStreet] = useState("Blk 2 Lot 4");
  const [barangay, setBarangay] = useState("Pulo");
  const [city, setCity] = useState("Cabuyao");
  const [postalCode, setPostalCode] = useState("4025");

  // Payment method default
  const defaultPaymentMethod = "COD";
  const shippingFee = 50;

  useEffect(() => {
    document.title = "KOTSELL";
  }, []);

  const addToCart = (productToAdd, quantityToAdd = 1) => {
    const existingProduct = cart.find(item => item.id === productToAdd.id);
    if (existingProduct) {
      setCart(cart.map(item =>
        item.id === productToAdd.id
          ? { ...item, quantity: item.quantity + quantityToAdd }
          : item
      ));
    } else {
      setCart([...cart, { ...productToAdd, quantity: quantityToAdd }]);
    }
  };

  const handleTransaction = (
    orderItems,
    discount = 0,
    couponCode = '---',
    contactInfo = null,
    paymentMethod = defaultPaymentMethod
  ) => {
    const orderNumber = transactions.length + 1;
    const price = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalPrice = price - discount + shippingFee;
    const dateTime = new Date().toLocaleString();

    const deliveryAddress = contactInfo
      ? `${contactInfo.houseStreet}, ${contactInfo.barangay}, ${contactInfo.city}, ${contactInfo.postalCode}`
      : `${houseStreet}, ${barangay}, ${city}, ${postalCode}`;

    setTransactions([
      ...transactions,
      {
        orderNumber,
        price,
        discount,
        totalPrice,
        couponCode,
        paymentMethod,
        deliveryAddress,
        dateTime,
        items: orderItems,
      },
    ]);

    if (couponCode !== '---') {
      setUsedCoupons([...usedCoupons, couponCode]);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Landing page as root */}
          <Route path="/" element={<LandingPage />} />

          {/* Homepage route */}
          <Route path="/homepage" element={
            <>
              <NavBar cart={cart} />
              <main className="main-content">
                <HomePage userName={firstName} />
              </main>
            </>
          } />

          {/* Admin login */}
          <Route path="/admin-login" element={<AdminLoginPage />} />

          {/* Admin routes (protected) */}
          <Route
            path="/admin/*"
            element={
              localStorage.getItem('isAdmin') === 'true' ? (
                <AdminRoutes transactions={transactions} usedCoupons={usedCoupons} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          
          <Route path="/products" element={
            <>
              <NavBar cart={cart} />
              <main className="main-content">
                <ProductList addToCart={addToCart} />
              </main>
            </>
          } />
          
          <Route path="/cart" element={
            <>
              <NavBar cart={cart} />
              <main className="main-content">
                <Cart cart={cart} setCart={setCart} />
              </main>
            </>
          } />
          
          <Route path="/details/:id" element={
            <>
              <NavBar cart={cart} />
              <main className="main-content">
                <ProductDetails cart={cart} setCart={setCart} />
              </main>
            </>
          } />
          
          <Route path="/checkout" element={
            <>
              <NavBar cart={cart} />
              <main className="main-content">
                <Checkout
                  cart={cart}
                  setCart={setCart}
                  onTransaction={handleTransaction}
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
              </main>
            </>
          } />
          
          <Route path="/user" element={
            <>
              <NavBar cart={cart} />
              <main className="main-content">
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
              </main>
            </>
          } />

          {/* Fallback to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
