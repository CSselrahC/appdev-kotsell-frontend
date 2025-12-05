import React, { useState, useEffect } from 'react';
import coupons from '../data/coupons.json';
import CheckoutContact from './Checkout-contact';
import CheckoutSummary from './Checkout-summary';
import CheckoutConfirmation from './Checkout-confirmation';

function Checkout({ cart, setCart, onTransaction, usedCoupons, defaultContactInfo }) {
  const [purchased, setPurchased] = useState(false);
  const [boughtList, setBoughtList] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState('---');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

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
  const finalTotal = Math.max(0, total - appliedDiscount + shippingFee);
  const boughtFinalTotal = Math.max(0, boughtTotal - appliedDiscount + shippingFee);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const validateCoupon = (code) => {
    const coupon = coupons.find(c => c.code === code);
    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code', discount: 0 };
    }
    if (usedCoupons.includes(code)) {
      return { valid: false, message: 'Coupon has already been used', discount: 0 };
    }
    const currentDate = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);
    if (currentDate < startDate) {
      return { valid: false, message: 'Coupon is not yet active', discount: 0 };
    }
    if (currentDate > endDate) {
      return { valid: false, message: 'Coupon has expired', discount: 0 };
    }
    return {
      valid: true,
      message: `Coupon applied! ₱${coupon.discount} discount`,
      discount: coupon.discount
    };
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim() === '') {
      setCouponMessage('');
      setAppliedDiscount(0);
      setAppliedCouponCode('---');
      setCouponApplied(false);
      return;
    }
    const result = validateCoupon(couponCode);
    if (result.valid) {
      setAppliedDiscount(result.discount);
      setAppliedCouponCode(couponCode);
      setCouponMessage(result.message);
      setCouponApplied(true);
    } else {
      setAppliedDiscount(0);
      setAppliedCouponCode('---');
      setCouponMessage(result.message);
      setCouponApplied(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedDiscount(0);
    setAppliedCouponCode('---');
    setCouponMessage('');
    setCouponApplied(false);
  };

  const handleBuyProduct = () => {
    if (!contactInfo.firstName || !contactInfo.lastName || !contactInfo.houseStreet) {
      setContactError('Please fill in required contact information');
      return;
    }
    setContactError('');

    setBoughtList(cart);
    setPurchased(true);
    setCart([]);

    if (onTransaction) {
      onTransaction(cart, appliedDiscount, appliedCouponCode, contactInfo, paymentMethod);
    }
  };

  if (purchased) {
    return (
      <CheckoutConfirmation
        boughtList={boughtList}
        boughtTotal={boughtTotal}
        appliedDiscount={appliedDiscount}
        shippingFee={shippingFee}
        appliedCouponCode={appliedCouponCode}
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
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          couponApplied={couponApplied}
          handleApplyCoupon={handleApplyCoupon}
          handleRemoveCoupon={handleRemoveCoupon}
          couponMessage={couponMessage}
          appliedDiscount={appliedDiscount}
          shippingFee={shippingFee}
          finalTotal={finalTotal}
          onPlaceOrder={handleBuyProduct}
        />
      </div>
    </div>
  );
}

export default Checkout;