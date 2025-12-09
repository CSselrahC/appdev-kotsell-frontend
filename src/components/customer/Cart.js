import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { cartAPI } from '../../services/api';

function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate("/checkout", { state: { cart } });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    // Ensure quantity is at least 1
    if (newQuantity < 1) return;
    const customerId = localStorage.getItem('customerId');
    if (customerId) {
      cartAPI.updateItem(customerId, productId, newQuantity)
        .then(() => {
          setCart(cart.map(item =>
            item.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          ));
        })
        .catch(err => console.error('Failed to update quantity:', err));
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const handleIncrement = (productId) => {
    const customerId = localStorage.getItem('customerId');
    const item = cart.find(i => i.id === productId);
    const newQty = (item?.quantity || 0) + 1;
    if (customerId) {
      cartAPI.updateItem(customerId, productId, newQty)
        .then(() => setCart(cart.map(i => i.id === productId ? { ...i, quantity: newQty } : i)))
        .catch(err => console.error('Failed increment:', err));
    } else {
      setCart(cart.map(i => i.id === productId ? { ...i, quantity: newQty } : i));
    }
  };

  const handleDecrement = (productId) => {
    const customerId = localStorage.getItem('customerId');
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    const newQty = Math.max(1, item.quantity - 1);
    if (customerId) {
      cartAPI.updateItem(customerId, productId, newQty)
        .then(() => setCart(cart.map(i => i.id === productId ? { ...i, quantity: newQty } : i)))
        .catch(err => console.error('Failed decrement:', err));
    } else {
      setCart(cart.map(i => i.id === productId ? { ...i, quantity: newQty } : i));
    }
  };

  const handleRemoveItem = (productId) => {
    const customerId = localStorage.getItem('customerId');
    if (customerId) {
      cartAPI.removeItem(customerId, productId)
        .then(() => setCart(cart.filter(item => item.id !== productId)))
        .catch(err => console.error('Failed to remove item:', err));
    } else {
      setCart(cart.filter(item => item.id !== productId));
    }
  };

  return (
    <div className="container mt-4">
      <h2><i className="ri-shopping-cart-line me-2"></i>Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="alert alert-info mt-3">
          <p className="mb-0">Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="table-responsive mt-3">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>₱{item.price.toFixed(2)}</td>
                    <td>
                      <div className="d-inline-flex align-items-center">
                        <div className="btn-group" role="group">
                          <button
                            onClick={() => handleDecrement(item.id)}
                            className="btn btn-outline-secondary btn-sm"
                            type="button"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            className="form-control form-control-sm text-center"
                            style={{ width: '5.5rem', maxWidth: '100%' }}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            min="1"
                            step="1"
                          />
                          <button
                            onClick={() => handleIncrement(item.id)}
                            className="btn btn-outline-secondary btn-sm"
                            type="button"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>₱{(item.price * item.quantity).toFixed(2)}</strong>
                    </td>
                    <td>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="btn btn-danger btn-sm"
                        title="Remove item"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-end mt-3">
            <div className="text-end">
              <h4>Total: <strong>₱{total.toFixed(2)}</strong></h4>
              <button onClick={handleCheckout} className="btn btn-dark btn-lg mt-2">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;