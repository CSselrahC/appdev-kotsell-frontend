import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Landing page
import LandingPage from './components/LandingPage';

// Customer routes
import CustomerRoutes from './components/CustomerRoutes';

// Admin components
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminRoutes from './components/AdminRoutes';

const defaultPaymentMethod = "COD";
const shippingFee = 50;

function App() {
  // Cart state
  const [cart, setCart] = useState([]);

  // Transaction state
  const [transactions, setTransactions] = useState([]);
  const [usedCoupons, setUsedCoupons] = useState([]);

  // User details state
  const [userDetails, setUserDetails] = useState({
    firstName: "Juan",
    lastName: "Dela Cruz",
    houseStreet: "Blk 2 Lot 4",
    barangay: "Pulo",
    city: "Cabuyao",
    postalCode: "4025"
  });

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
      : `${userDetails.houseStreet}, ${userDetails.barangay}, ${userDetails.city}, ${userDetails.postalCode}`;

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

          {/* Admin login */}
          <Route path="/admin-login" element={<AdminLoginPage />} />

          {/* Admin routes (protected) */}
          <Route
            path="/admin/*"
            element={
              localStorage.getItem('isAdmin') === 'true' ? (
                <AdminRoutes transactions={transactions} usedCoupons={usedCoupons} />
              ) : (
                <Navigate to="/admin-login" replace />
              )
            }
          />

          {/* Customer routes */}
          <Route
            path="/*"
            element={
              <CustomerRoutes
                cart={cart}
                setCart={setCart}
                transactions={transactions}
                onTransaction={handleTransaction}
                usedCoupons={usedCoupons}
                firstName={userDetails.firstName}
                setFirstName={(value) => setUserDetails({ ...userDetails, firstName: value })}
                lastName={userDetails.lastName}
                setLastName={(value) => setUserDetails({ ...userDetails, lastName: value })}
                houseStreet={userDetails.houseStreet}
                setHouseStreet={(value) => setUserDetails({ ...userDetails, houseStreet: value })}
                barangay={userDetails.barangay}
                setBarangay={(value) => setUserDetails({ ...userDetails, barangay: value })}
                city={userDetails.city}
                setCity={(value) => setUserDetails({ ...userDetails, city: value })}
                postalCode={userDetails.postalCode}
                setPostalCode={(value) => setUserDetails({ ...userDetails, postalCode: value })}
                addToCart={addToCart}
              />
            }
          />

          {/* Fallback to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
