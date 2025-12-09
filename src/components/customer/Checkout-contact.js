import React from 'react';

function CheckoutContact({
  contactInfo,
  onContactChange,
  contactError,
  paymentMethod,
  onPaymentMethodChange
}) {
  return (
    <div className="col-12 col-md-7">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Payment Method</h5>

          <div className="form-check mb-3 p-3 border rounded">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              id="cod"
              value="COD"
              checked={paymentMethod === 'COD'}
              onChange={onPaymentMethodChange}
            />
            <label className="form-check-label ms-2" htmlFor="cod">
              <strong>Cash On Delivery (COD)</strong>
              <div className="text-muted small">Pay with cash upon delivery</div>
            </label>
          </div>

          <div className="form-check mb-3 p-3 border rounded">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              id="gcash"
              value="GCash"
              checked={paymentMethod === 'GCash'}
              onChange={onPaymentMethodChange}
            />
            <label className="form-check-label ms-2" htmlFor="gcash">
              <strong>GCash</strong>
              <div className="text-muted small">Pay instantly with GCash</div>
            </label>
          </div>

          <div className="form-check mb-3 p-3 border rounded">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              id="card"
              value="Card"
              checked={paymentMethod === 'Card'}
              onChange={onPaymentMethodChange}
            />
            <label className="form-check-label ms-2" htmlFor="card">
              <strong>Debit/Credit Card</strong>
              <div className="text-muted small">Pay with your card</div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutContact;