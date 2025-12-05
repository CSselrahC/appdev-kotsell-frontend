import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Landing page
import LandingPage from './components/LandingPage';

// Customer components
import HomePage from './components/customer/HomePage';  // Renamed for clarity
import NavBar from './components/customer/NavBar';
import ProductList from './components/customer/ProductList';
import Cart from './components/customer/Cart';
import ProductDetails from './components/customer/ProductDetails';
import Checkout from './components/customer/Checkout';
import User from './components/customer/User';

// Admin/Login components
import AdminLoginPage from './components/admin/AdminLoginPage'; // Admin login
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';

// Simple guard for admin-only routes
function RequireAdmin({ children }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/" replace />;
}

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

          {/* Admin routes (protected) - FIXED NESTED ROUTING */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard transactions={transactions} usedCoupons={usedCoupons} />} />
            <Route path="products" element={
              <div className="p-4">
                <h2>Products Management</h2>
                <p>Products page coming soon...</p>
              </div>
            } />
            <Route path="orders" element={
              <div className="p-4">
                <h2>Orders Management</h2>
                <p>Orders page coming soon...</p>
              </div>
            } />
            <Route path="users" element={
              <div className="p-4">
                <h2>Users Management</h2>
                <p>Users page coming soon...</p>
              </div>
            } />
          </Route>

          {/* Fallback to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
