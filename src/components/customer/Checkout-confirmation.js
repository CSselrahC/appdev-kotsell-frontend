// src/components/CheckoutConfirmation.js
import React from 'react';
import { Link } from 'react-router-dom';

function CheckoutConfirmation({
  boughtList,
  boughtTotal,
  appliedDiscount,
  appliedCouponCode,
  boughtFinalTotal,
  paymentMethod,
}) {
  const paymentDisplayMap = {
    COD: 'Cash On Delivery',
    GCash: 'GCash',
    Card: 'Debit/Credit Card',
  };

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          {/* Outer highlighted box */}
          <div
            className="rounded-4 p-2 p-md-3 mb-3"
            style={{
              border: '2px solid #020202ff',
              boxShadow: '0 0 15px rgba(37,99,235,0.25)',
              background:
                'linear-gradient(135deg, #eff6ff 0%, #ffffff 40%, #f9fafb 100%)',
            }}
          >
            {/* Top banner */}
            <div className="card border-0 shadow-sm mb-3">
              <div
                className="card-body text-center"
                style={{
                  background:
                    'linear-gradient(90deg, #ffffff 0%, #f9fafb 50%, #ffffff 100%)',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <h2 className="h4 fw-bold mb-1 text-dark">
                  Thank you for your purchase!
                </h2>
                <p className="mb-0" style={{ fontSize: '0.95rem', color: '#4b5563' }}>
                  Your order has been placed successfully. Here is your order
                  confirmation.
                </p>
              </div>
            </div>

            {/* Main content */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                {/* Items section */}
                <h5 className="fw-semibold mb-3">Items Purchased</h5>
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th className="text-end">Price (₱)</th>
                        <th className="text-center">Qty</th>
                        <th className="text-end">Total (₱)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boughtList.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td className="text-end">₱{item.price.toFixed(2)}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">
                            ₱{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Details row */}
                <div className="row mt-4 g-3">
                  {/* Payment box */}
                  <div className="col-12 col-md-6">
                    <div
                      className="p-3 h-100 rounded-3"
                      style={{
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <h6 className="fw-semibold mb-2">Payment Details</h6>
                      <p className="mb-1">
                        <span className="text-muted">Payment method: </span>
                        <span className="fw-semibold">
                          {paymentDisplayMap[paymentMethod] || paymentMethod}
                        </span>
                      </p>
                      {appliedCouponCode !== '---' && (
                        <p className="mb-0">
                          <span className="text-muted">Coupon used: </span>
                          <span className="fw-semibold text-success">
                            {appliedCouponCode}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Highlighted summary box */}
                  <div className="col-12 col-md-6">
                    <div
                      className="p-3 h-100 rounded-3 d-flex flex-column justify-content-between"
                      style={{
                        background:
                          'linear-gradient(135deg, #eff6ff 0%, #dbeafe 40%, #dcfce7 100%)',
                        border: '1px solid #93c5fd',
                        boxShadow: '0 0 0 2px rgba(37,99,235,0.18)',
                      }}
                    >
                      <h6 className="fw-semibold mb-2 text-primary">
                        Order Summary
                      </h6>
                      <div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Subtotal</span>
                          <span>₱{boughtTotal.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Discount</span>
                          <span className="text-success">
                            -₱{appliedDiscount.toFixed(2)}
                          </span>
                        </div>
                        <hr className="my-2" />
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">Total Paid</span>
                        <span
                          className="fw-bold"
                          style={{
                            fontSize: '1.6rem',
                            color: '#1d4ed8',
                          }}
                        >
                          ₱{boughtFinalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-4 gap-2">
                  <Link to="/">
                    <button className="btn btn-outline-secondary w-100 w-sm-auto">
                      Return Home
                    </button>
                  </Link>
                  <Link to="/products">
                    <button className="btn btn-primary w-100 w-sm-auto">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            {/* end main card */}
          </div>
          {/* end highlighted outer wrapper */}
        </div>
      </div>
    </div>
  );
}

export default CheckoutConfirmation;
