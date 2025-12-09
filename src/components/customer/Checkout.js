import React, { useState, useEffect } from 'react';
import CheckoutContact from './Checkout-contact';
import CheckoutSummary from './Checkout-summary';
import CheckoutConfirmation from './Checkout-confirmation';
import { orderAPI } from '../../services/api';

function Checkout({ cart, setCart, onTransaction, defaultContactInfo }) {
  const [purchased, setPurchased] = useState(false);
  const [boughtList, setBoughtList] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [processing, setProcessing] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    houseStreet: '',
    barangay: '',
    city: '',
    postalCode: ''
  });

  const [contactError, setContactError] = useState('');

  useEffect(() => {
    if (defaultContactInfo) {
      setContactInfo({
        firstName: defaultContactInfo.firstName || '',
        lastName: defaultContactInfo.lastName || '',
        houseStreet: defaultContactInfo.houseStreet || '',
        barangay: defaultContactInfo.barangay || '',
        city: defaultContactInfo.city || '',
        postalCode: defaultContactInfo.postalCode || '',
      });
    }
  }, [defaultContactInfo]);

  const shippingFee = 0;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const boughtTotal = boughtList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, total + shippingFee);
  const boughtFinalTotal = Math.max(0, boughtTotal + shippingFee);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleBuyProduct = async () => {
    if (!contactInfo.firstName || !contactInfo.lastName || !contactInfo.houseStreet) {
      setContactError('Please fill in required contact information');
      return;
    }
    setContactError('');

    setProcessing(true);
    const customerId = localStorage.getItem('customerId');
    try {
      if (customerId && cart.length > 0) {
        await orderAPI.create({
          customersId: customerId,
          items: cart,
          total: finalTotal,
          paymentMethod: paymentMethod,
          deliveryAddress: `${contactInfo.houseStreet}, ${contactInfo.barangay}, ${contactInfo.city}, ${contactInfo.postalCode}`,
          status: 'pending'
        });
      } else {
        // Optionally create order for guest users as well
        await orderAPI.create({
          customersId: null,
          items: cart,
          total: finalTotal,
          paymentMethod: paymentMethod,
          deliveryAddress: `${contactInfo.houseStreet}, ${contactInfo.barangay}, ${contactInfo.city}, ${contactInfo.postalCode}`,
          status: 'pending'
        });
      }

      // Clear local cart storage (we ignore DB cart)
      try { localStorage.removeItem('cart'); } catch (e) {}

      setBoughtList(cart);
      setPurchased(true);
      setCart([]);

      if (onTransaction) {
        onTransaction(cart, 0, '---', contactInfo, paymentMethod);
      }
    } catch (err) {
      console.error('Error processing order:', err);
      setContactError('Failed to process order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (purchased) {
    return (
      <CheckoutConfirmation
        boughtList={boughtList}
        boughtTotal={boughtTotal}
        appliedDiscount={0}
        shippingFee={shippingFee}
        appliedCouponCode="---"
        boughtFinalTotal={boughtFinalTotal}
        paymentMethod={paymentMethod}
      />
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mt-4">
        <p>No items in your cart.</p>
        <a href="/products" className="btn btn-primary">Continue Shopping</a>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-4">Payment Transaction</h2>
      <div className="row">
        <CheckoutContact
          contactInfo={contactInfo}
          onContactChange={handleInputChange}
          contactError={contactError}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={e => setPaymentMethod(e.target.value)}
        />
        <CheckoutSummary
          cart={cart}
          shippingFee={shippingFee}
          finalTotal={finalTotal}
          onPlaceOrder={handleBuyProduct}
          isProcessing={processing}
        />
      </div>
    </div>
  );
}

export default Checkout;