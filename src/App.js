import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { cartAPI } from './services/api';

// Landing page
import LandingPage from './components/LandingPage';

// Customer routes
import CustomerRoutes from './components/CustomerRoutes';

// Admin components
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminRoutes from './components/AdminRoutes';

const defaultPaymentMethod = 'COD';
const shippingFee = 50;

function App() {
  // Cart state
  const [cart, setCart] = useState([]);

  // Transaction state
  const [transactions, setTransactions] = useState([]);

  // User details state
  const [userDetails, setUserDetails] = useState({
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    houseStreet: 'Blk 2 Lot 4',
    barangay: 'Pulo',
    city: 'Cabuyao',
    postalCode: '4025',
  });

  useEffect(() => {
    document.title = 'KOTSELL';
    // Load cart from backend if customer logged in
    const loadCart = async () => {
      const customerId = localStorage.getItem('customerId');
      if (customerId) {
        try {
          const remoteCart = await cartAPI.getByCustomerId(customerId);
          if (remoteCart && Array.isArray(remoteCart)) {
            setCart(remoteCart.map(item => ({ ...item })));
          }
        } catch (e) {
          console.error('Failed to load remote cart:', e);
        }
      }
    };
    loadCart();
  }, []);

  const addToCart = async (productToAdd, quantityToAdd = 1) => {
    const customerId = localStorage.getItem('customerId');
    if (customerId) {
      try {
        const created = await cartAPI.addItem(customerId, productToAdd.id, quantityToAdd);
        // Merge into local cart state
        setCart(prev => {
          const existing = prev.find(p => p.id === productToAdd.id);
          if (existing) {
            return prev.map(p => p.id === productToAdd.id ? { ...p, quantity: p.quantity + quantityToAdd } : p);
          }
          // include product details when available
          return [...prev, { ...productToAdd, id: productToAdd.id, quantity: created.quantity || quantityToAdd }];
        });
      } catch (e) {
        console.error('Failed to add item to remote cart, falling back to local:', e);
        // fallback to local-only
        const existingProduct = cart.find((item) => item.id === productToAdd.id);
        if (existingProduct) {
          setCart(
            cart.map((item) =>
              item.id === productToAdd.id
                ? { ...item, quantity: item.quantity + quantityToAdd }
                : item
            )
          );
        } else {
          setCart([...cart, { ...productToAdd, quantity: quantityToAdd }]);
        }
      }
    } else {
      const existingProduct = cart.find((item) => item.id === productToAdd.id);
      if (existingProduct) {
        setCart(
          cart.map((item) =>
            item.id === productToAdd.id
              ? { ...item, quantity: item.quantity + quantityToAdd }
              : item
          )
        );
      } else {
        setCart([...cart, { ...productToAdd, quantity: quantityToAdd }]);
      }
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
    const totalPrice = price + shippingFee;
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
                <AdminRoutes transactions={transactions} />
              ) : (
                <Navigate to="/admin-login" replace />
              )
            }
          />

          {/* Customer routes (includes /customer-auth and shop pages) */}
          <Route
            path="/*"
            element={
              <CustomerRoutes
                cart={cart}
                setCart={setCart}
                transactions={transactions}
                onTransaction={handleTransaction}
                firstName={userDetails.firstName}
                setFirstName={(value) =>
                  setUserDetails({ ...userDetails, firstName: value })
                }
                lastName={userDetails.lastName}
                setLastName={(value) =>
                  setUserDetails({ ...userDetails, lastName: value })
                }
                houseStreet={userDetails.houseStreet}
                setHouseStreet={(value) =>
                  setUserDetails({ ...userDetails, houseStreet: value })
                }
                barangay={userDetails.barangay}
                setBarangay={(value) =>
                  setUserDetails({ ...userDetails, barangay: value })
                }
                city={userDetails.city}
                setCity={(value) =>
                  setUserDetails({ ...userDetails, city: value })
                }
                postalCode={userDetails.postalCode}
                setPostalCode={(value) =>
                  setUserDetails({ ...userDetails, postalCode: value })
                }
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
