import React from 'react';

function CheckoutContact({
  contactInfo,
  onContactChange,
  contactError,
  paymentMethod,
  onPaymentMethodChange
}) {
  return (
    <div className="col-md-7">
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Contact Information</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={contactInfo.firstName}
                onChange={onContactChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={contactInfo.lastName}
                onChange={onContactChange}
              />
            </div>
            <div className="col-12">
              <label className="form-label">House No./Street</label>
              <input
                type="text"
                className="form-control"
                name="houseStreet"
                value={contactInfo.houseStreet}
                onChange={onContactChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Barangay</label>
              <input
                type="text"
                className="form-control"
                name="barangay"
                value={contactInfo.barangay}
                onChange={onContactChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={contactInfo.city}
                onChange={onContactChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Postal Code</label>
              <input
                type="text"
                className="form-control"
                name="postalCode"
                value={contactInfo.postalCode}
                onChange={onContactChange}
              />
            </div>
          </div>
          {contactError && <div className="text-danger mt-2">{contactError}</div>}
        </div>
      </div>

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