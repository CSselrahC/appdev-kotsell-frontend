import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import products from '../../data/products.json';

function ProductDetails({ cart, setCart }) {
  const { id } = useParams();
  const productId = parseInt(id);
  const product = products.find(p => p.id === productId);
  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [message, setMessage] = useState('');

  if (!product) return <div>Product not found for ID {id}</div>;

  const hasImages = product.images && product.images.length > 0;

  const handleImageError = (event) => {
    if (!imageError) {
      setImageError(true);
    }
  };

  const prevImage = () => {
    setImageError(false);
    setCurrentImageIndex(prevIndex =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setImageError(false);
    setCurrentImageIndex(prevIndex =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const selectImage = (index) => {
    setImageError(false);
    setCurrentImageIndex(index);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setQuantity(value === '' ? 0 : parseInt(value, 10));
    }
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 0 ? prev - 1 : 0));
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      const existingIndex = cart.findIndex(item => item.id === product.id);
      let newCart = [...cart];
      if (existingIndex !== -1) {
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity,
        };
      } else {
        newCart.push({ ...product, quantity });
      }
      setCart(newCart);
      const msg = quantity === 1
        ? `${product.name} has been added to the cart`
        : `${quantity} ${product.name} have been added to the cart`;
      setMessage(msg);
    }
  };

  const handleBuyNow = () => {
    // Use the same add-to-cart logic, then navigate to checkout
    if (quantity > 0) {
      // reuse existing add-to-cart behavior
      handleAddToCart();
      // after adding, navigate to checkout and pass product + quantity
      navigate('/', { state: { product, quantity } });
    }
  };

  return (
    <div className="container mt-4">
      <Link to="/products" className="btn btn-secondary mb-3">Back to Product List</Link>
      <div className="card p-3 shadow-sm">
        <h3 className="mb-3">{product.name}</h3>

        <div className="row g-3 align-items-start">
          <div className="col-12 col-md-6">
            <div className="d-flex justify-content-center align-items-center" style={{ position: 'relative' }}>
              {hasImages && product.images.length > 1 && (
                <button onClick={prevImage} aria-label="Previous Image" className="btn btn-link text-primary p-0 me-2 d-none d-md-inline" style={{ fontSize: '1.75rem' }}>&lt;</button>
              )}

              <div className="product-image-box w-100" style={{ minHeight: '180px', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px' }}>
                {!hasImages || imageError ? (
                  <div style={{ fontStyle: 'italic', color: '#888' }}>No images available</div>
                ) : (
                  <img
                    src={product.images[currentImageIndex]}
                    alt={`${product.name} ${currentImageIndex + 1}`}
                    onError={handleImageError}
                    className="img-fluid"
                    style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: '8px' }}
                  />
                )}
              </div>

              {hasImages && product.images.length > 1 && (
                <button onClick={nextImage} aria-label="Next Image" className="btn btn-link text-primary p-0 ms-2 d-none d-md-inline" style={{ fontSize: '1.75rem' }}>&gt;</button>
              )}
            </div>

            {/* Dots for all breakpoints */}
            {hasImages && product.images.length > 0 && (
              <div className="text-center mt-3">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectImage(idx)}
                    className={`btn btn-sm me-1 ${idx === currentImageIndex ? 'btn-primary' : 'btn-outline-secondary'}`}
                    aria-label={`Select image ${idx + 1}`}
                    style={{ width: '10px', height: '10px', padding: 0, borderRadius: '50%' }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <p className="mb-2">{product.description}</p>
            <h6 className="text-muted mb-2">Category: {Array.isArray(product.category) ? product.category.join(', ') : product.category}</h6>
            <p className="mb-3">Price: <strong>₱{product.price.toFixed(2)}</strong></p>

            <div className="d-flex flex-column gap-2 align-items-stretch" style={{ marginBottom: '15px' }}>
              <div className="d-flex align-items-center" style={{ gap: '8px', minWidth: 0 }}>
                <button
                  className="btn btn-outline-secondary"
                  onClick={decrementQuantity}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 0}
                  style={{ width: '40px', height: '40px' }}
                >-</button>
                <input
                  type="text"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="form-control text-center"
                  style={{ width: '5.5rem', maxWidth: '100%' }}
                  aria-label="Quantity input"
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={incrementQuantity}
                  aria-label="Increase quantity"
                  style={{ width: '40px', height: '40px' }}
                >+</button>
              </div>
              <div className="d-flex gap-2 w-100">
                <button
                  onClick={handleAddToCart}
                  className={`btn ${quantity > 0 ? 'btn-success' : 'btn-secondary'} flex-grow-4`}
                  disabled={quantity <= 0}
                  style={{ height: '40px' }}
                >
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="btn btn-outline-primary"
                  style={{ height: '40px' }}
                >
                  Buy Product
                </button>
              </div>
            </div>

            {message && <p className="mt-2 text-success">{message}</p>}
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default ProductDetails;
