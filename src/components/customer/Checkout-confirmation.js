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

    const shippingFee = 50;
    const paymentDisplayMap = {
        COD: 'Cash On Delivery',
        GCash: 'GCash',
        Card: 'Debit/Credit Card'
    };
    const totalPriceWithShipping = boughtFinalTotal + shippingFee;

    return (
        <div className="container mt-4">
            <h2>Thank you for your purchase!</h2>
            <p>You have bought the following products:</p>
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>Product Name</th>
                        <th>Price (₱)</th>
                        <th>Quantity</th>
                        <th>Total (₱)</th>
                    </tr>
                </thead>
                <tbody>
                    {boughtList.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>₱{item.price.toFixed(2)}</td>
                            <td>{item.quantity}</td>
                            <td>₱{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Subtotal: ₱{boughtTotal.toFixed(2)}</h3>
            <h3>Discount: ₱{appliedDiscount.toFixed(2)}</h3>
            <h3>Shipping Fee: ₱{shippingFee.toFixed(2)}</h3>
            {appliedCouponCode !== '---' && (
                <h3 className="text-success">Coupon Used: {appliedCouponCode}</h3>
            )}
            <h3>Total Price: ₱{totalPriceWithShipping.toFixed(2)}</h3>
            <h4 className="mt-3">Payment Method: {paymentDisplayMap[paymentMethod] || paymentMethod}</h4>
            <div className="mt-4">
                <Link to="/">
                    <button className="btn btn-primary">Return Home</button>
                </Link>
            </div>
        </div>
    );
}

export default CheckoutConfirmation;