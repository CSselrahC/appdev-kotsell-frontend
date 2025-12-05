import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import products from '../data/products.json';

function ProductList({ addToCart }) {
  const [quantities, setQuantities] = useState(() => {
    const initialQuantities = {};
    products.forEach(product => initialQuantities[product.id] = 0);
    return initialQuantities;
  });

  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const [imageErrorMap, setImageErrorMap] = useState({});

  const handleQuantityChange = (productId, value) => {
    const numValue = parseInt(value);
    if (/^\d*$/.test(value) && (numValue >= 0 || value === '')) {
      setQuantities({ ...quantities, [productId]: value === '' ? 0 : numValue });
    }
  };

  const handleIncrement = (productId) => {
    const currentQty = quantities[productId] || 0;
    setQuantities({ ...quantities, [productId]: currentQty + 1 });
  };

  const handleDecrement = (productId) => {
    const currentQty = quantities[productId] || 0;
    if (currentQty > 0) {
      setQuantities({ ...quantities, [productId]: currentQty - 1 });
    }
  };

  const handleAddToCartWithQuantity = (product) => {
    const quantity = quantities[product.id];
    if (quantity < 1 || !Number.isInteger(quantity)) return;
    if (addToCart) addToCart(product, quantity);
    const message = quantity === 1
      ? `${product.name} has been added to cart`
      : `${quantity} ${product.name} have been added to cart`;
    setConfirmationMessage({ productId: product.id, message });
    setTimeout(() => setConfirmationMessage(null), 3000);
  };

  const handleInputBlur = (productId) => {
    if (!quantities[productId] || quantities[productId] < 0) {
      setQuantities({ ...quantities, [productId]: 0 });
    }
  };

  const handleImageError = (productId) => {
    setImageErrorMap(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <div className="container">
      <h1 className="mb-3">Product List</h1>
      <div className="row">
        {products.map(product => {
          const hasImage = product.images && product.images.length > 0;
          const imageErrored = imageErrorMap[product.id];
          const quantity = quantities[product.id] || 0;

          return (
            <div key={product.id} className="col-md-4 mb-3">
              <div className="card shadow-sm h-100 d-flex flex-column">
                <div style={{
                  height: '180px',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f8f9fa',
                  color: '#888',
                  fontStyle: 'italic'
                }}>
                  {!hasImage || imageErrored ? (
                    <div>No images available</div>
                  ) : (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      onError={() => handleImageError(product.id)}
                    />
                  )}
                </div>
                <div className="card-body d-flex flex-column flex-grow-1">
                  <h5>{product.name}</h5>
                  <p style={{
                    flexGrow: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    marginBottom: '0.5rem',
                  }}>
                    {product.description.length > 100
                      ? product.description.slice(0, 100) + '... view more'
                      : product.description
                    }
                  </p>
                  <p>Price: ₱{product.price.toFixed(2)}</p>
                  <Link to={`/details/${product.id}`} className="btn btn-outline-primary btn-sm mb-2">
                    View Product
                  </Link>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '10px',
                    flexGrow: 0,
                    marginTop: 'auto',
                    justifyContent: 'start',
                    maxWidth: '300px',
                  }} className="quantity-addcart-container">
                    <div className="d-flex align-items-center" style={{ minWidth: '160px' }}>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => handleDecrement(product.id)}
                        aria-label="Decrease quantity"
                        disabled={quantity <= 0}
                        style={{ minWidth: '38px', height: '38px' }}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control form-control-sm text-center"
                        style={{
                          width: '80px',
                          margin: '0 5px',
                          height: '38px',
                          fontSize: '1rem',
                          borderRadius: '4px',
                          border: '1px solid #ced4da',
                          color: '#000',
                        }}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        onBlur={() => handleInputBlur(product.id)}
                        aria-label="Quantity input"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => handleIncrement(product.id)}
                        aria-label="Increase quantity"
                        style={{ minWidth: '38px', height: '38px' }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleAddToCartWithQuantity(product)}
                      className="btn btn-success btn-sm"
                      disabled={quantity < 1}
                      style={{
                        backgroundColor: quantity >= 1 ? 'green' : 'grey',
                        cursor: quantity >= 1 ? 'pointer' : 'not-allowed',
                        flexGrow: 1,
                        minWidth: '120px',
                        height: '38px',
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>

                  {confirmationMessage && confirmationMessage.productId === product.id && (
                    <div className="alert alert-success mt-2 mb-0 py-2 small" role="alert">
                      {confirmationMessage.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Link to="/cart" className="btn btn-dark mt-3">View Cart</Link>
    </div>
  );
}

export default ProductList;
