import React, { useState } from 'react';

function User({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  houseStreet,
  setHouseStreet,
  barangay,
  setBarangay,
  city,
  setCity,
  postalCode,
  setPostalCode,
  transactions
}) {
  const [edit, setEdit] = useState(false);
  const [formFirstName, setFormFirstName] = useState(firstName);
  const [formLastName, setFormLastName] = useState(lastName);
  const [formHouseStreet, setFormHouseStreet] = useState(houseStreet);
  const [formBarangay, setFormBarangay] = useState(barangay);
  const [formCity, setFormCity] = useState(city);
  const [formPostalCode, setFormPostalCode] = useState(postalCode);

  const handleSave = (e) => {
    e.preventDefault();
    setFirstName(formFirstName.trim() === "" ? "No first name" : formFirstName);
    setLastName(formLastName.trim() === "" ? "No last name" : formLastName);
    setHouseStreet(formHouseStreet.trim() === "" ? "No house/street" : formHouseStreet);
    setBarangay(formBarangay.trim() === "" ? "No barangay" : formBarangay);
    setCity(formCity.trim() === "" ? "No city" : formCity);
    setPostalCode(formPostalCode.trim() === "" ? "No postal code" : formPostalCode);
    setEdit(false);
  };

  const handleCancel = () => {
    setFormFirstName(firstName);
    setFormLastName(lastName);
    setFormHouseStreet(houseStreet);
    setFormBarangay(barangay);
    setFormCity(city);
    setFormPostalCode(postalCode);
    setEdit(false);
  };

  return (
    <div className="container my-5" style={{ maxWidth: '900px' }}>
      <h2 className="fw-bold mb-4">Account</h2>
      <div className="card p-4" style={{ borderRadius: '10px' }}>
        <h3 className="fw-bold mb-4">Contact Information</h3>
        {edit ? (
          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  className="form-control"
                  type="text"
                  value={formFirstName}
                  onChange={e => setFormFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  className="form-control"
                  type="text"
                  value={formLastName}
                  onChange={e => setFormLastName(e.target.value)}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">House No./Street</label>
                <input
                  className="form-control"
                  type="text"
                  value={formHouseStreet}
                  onChange={e => setFormHouseStreet(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Barangay</label>
                <input
                  className="form-control"
                  type="text"
                  value={formBarangay}
                  onChange={e => setFormBarangay(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input
                  className="form-control"
                  type="text"
                  value={formCity}
                  onChange={e => setFormCity(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Postal Code</label>
                <input
                  className="form-control"
                  type="text"
                  value={formPostalCode}
                  onChange={e => setFormPostalCode(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-success px-4">Save</button>
              <button type="button" className="btn btn-outline-secondary px-4" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input className="form-control" value={firstName} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input className="form-control" value={lastName} disabled />
              </div>
              <div className="col-12">
                <label className="form-label">House No./Street</label>
                <input className="form-control" value={houseStreet} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">Barangay</label>
                <input className="form-control" value={barangay} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input className="form-control" value={city} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">Postal Code</label>
                <input className="form-control" value={postalCode} disabled />
              </div>
            </div>
            <button className="btn btn-primary px-4 mt-3" onClick={() => setEdit(true)}>
              Edit Details
            </button>
          </div>
        )}
      </div>

      <hr className="my-5" />

      <h3>Transaction History</h3>
      <div className="table-responsive">
        <table className="table table-striped mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col">Order Number</th>
              <th scope="col">Total Price (₱)</th>
              <th scope="col">Coupon Code</th>
              <th scope="col">Payment Method</th>
              <th scope="col">Delivery Address</th>
              <th scope="col">Date &amp; Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No transactions yet.</td>
              </tr>
            ) : (
              transactions.map(tx => (
                <tr key={tx.orderNumber}>
                  <td>{tx.orderNumber}</td>
                  <td>₱{tx.totalPrice.toFixed(2)}</td>
                  <td>{tx.couponCode || '---'}</td>
                  <td>{tx.paymentMethod}</td>
                  <td>{tx.deliveryAddress}</td>
                  <td>{tx.dateTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default User;
