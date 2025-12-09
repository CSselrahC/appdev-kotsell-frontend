import React from 'react';

function CheckoutSummary({
  cart,
  finalTotal,
  onPlaceOrder
}) {
  const shippingFee = 50;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const imageFiles = [
    'HKS-1.jpg',
    'HKS-2.jpg',
    'HKS-3.jpg',
    'HWSkyline-1.webp',
    'HWSkyline-2.webp',
    'agv-k6.jpg',
    'alpinestars-gloves.jpg',
    'arai-rx7v-helmet.jpg',
    'brembo-brake.jpg',
    'brembo-ceramic.jpg',
    'bride-zeta.jpg',
    'bridgestone-tires.jpg',
    'chain-brush.jpg',
    'dainese-jacket.jpg',
    'diecast-car.jpg',
    'gopro-mount.jpg',
    'led-headlight.jpg',
    'minigt-porsche-1.jpg',
    'minigt-porsche-2.jpg',
    'minigt-porsche-3.jpg',
    'minigt-porsche-4.jpg',
    'motul-oil.jpg',
    'nismo.webp',
    'ohlins-shock.jpg',
    'oxford-tankbag.jpg',
    'paddock-stand.jpg',
    'pirelli-tires.jpg',
    'racing-keychain.jpg',
    'revit-pants.jpg',
    'riding-backpack.jpg',
    'shoei-helmet.jpg',
    'tire-gauge.jpg',
    'yokohama.png',
    'yoshimura-exhaust.jpg',
  ];

  // Get consistent random image based on product ID (same as other components)
  const getProductImageSrc = (productId) => {
    const index = productId % imageFiles.length;
    return `/designs/images/${imageFiles[index]}`;
  };

  return (
    <div className="col-12 col-md-5">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">Order Summary</h5>

          {cart.map((item) => {
            const imageUrl = getProductImageSrc(item.id);
            return (
              <div key={item.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="rounded me-3"
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  onError={(e) => {
                    // Replace image with placeholder only on error
                    e.target.src = '/designs/images/default-placeholder.jpg'; // or use a base64 placeholder
                    // Alternative: hide image and show placeholder div
                    // e.target.style.display = 'none';
                    // e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="flex-grow-1">
                  <div className="fw-bold">{item.name}</div>
                  <div className="text-muted small">Qty: {item.quantity}</div>
                </div>
                <div className="fw-bold">₱{item.price.toFixed(2)}</div>
              </div>
            );
          })}

          <div className="border-top pt-3">
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping Fee:</span>
              <span>₱{shippingFee.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between fw-bold border-top pt-2 mt-2">
              <span>Total:</span>
              <span>₱{(subtotal + shippingFee).toFixed(2)}</span>
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
