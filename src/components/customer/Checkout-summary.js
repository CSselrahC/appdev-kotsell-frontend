import React from 'react';
import products from '../data/products.json';

function CheckoutSummary({
  cart,
  couponCode,
  setCouponCode,
  couponApplied,
  handleApplyCoupon,
  handleRemoveCoupon,
  couponMessage,
  appliedDiscount,
  finalTotal,
  onPlaceOrder
}) {
  const shippingFee = 50;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Helper function to get product image from products.json
  const getProductImage = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product && product.images && product.images.length > 0) {
      return product.images[0];
    }
    return null;
  };

  return (
    <div className="col-md-5">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Order Summary</h5>

          {cart.map((item) => {
            const imageUrl = getProductImage(item.id);
            return (
              <div key={item.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={item.name}
                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', marginRight: '12px' }}
                  />
                ) : (
                  <div
                    className="bg-secondary text-white d-flex align-items-center justify-content-center me-3"
                    style={{ width: '60px', height: '60px', borderRadius: '8px', fontSize: '10px' }}
                  >
                    Product<br />Image
                  </div>
                )}
                <div className="flex-grow-1">
                  <div className="fw-bold">{item.name}</div>
                  <div className="text-muted small">Qty: {item.quantity}</div>
                </div>
                <div className="fw-bold">₱{item.price.toFixed(2)}</div>
              </div>
            );
          })}

          <div className="mb-3">
            <label className="form-label">Redeem Code</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code"
                disabled={couponApplied}
              />
              {!couponApplied ? (
                <button className="btn btn-outline-secondary" onClick={handleApplyCoupon}>
                  ✓
                </button>
              ) : (
                <button className="btn btn-outline-danger" onClick={handleRemoveCoupon}>
                  ✗
                </button>
              )}
            </div>
            {couponMessage && (
              <div className={`alert ${couponApplied ? 'alert-success' : 'alert-danger'} mt-2 py-1 px-2 small`}>
                {couponMessage}
              </div>
            )}
          </div>

          <div className="border-top pt-3">
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            {appliedDiscount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Discount:</span>
                <span>-₱{appliedDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping Fee:</span>
              <span>₱{shippingFee.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between fw-bold border-top pt-2 mt-2">
              <span>Total:</span>
              <span>₱{(subtotal - appliedDiscount + shippingFee).toFixed(2)}</span>
            </div>
          </div>

          <button className="btn btn-dark w-100 mt-3" onClick={onPlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSummary;
