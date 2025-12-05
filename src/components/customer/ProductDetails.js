import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import products from '../data/products.json';

function ProductDetails({ cart, setCart }) {
  const { id } = useParams();
  const productId = parseInt(id);
  const product = products.find(p => p.id === productId);

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

  return (
    <div className="container mt-4">
      <Link to="/products" className="btn btn-secondary mb-3">Back to Product List</Link>
      <div className="card p-3 shadow-sm">
        <h3>{product.name}</h3>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '400px', margin: 'auto', position: 'relative', marginBottom: '1rem' }}>

          {/* Show arrows only if product has more than 1 image */}
          {hasImages && product.images.length > 1 &&
            <button
              onClick={prevImage}
              aria-label="Previous Image"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: '#0d6efd',
                marginRight: '10px',
                userSelect: 'none'
              }}
            >&lt;</button>
          }

          <div className="product-image-box" style={{ position: 'relative', width: '100%', minHeight: '180px', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px' }}>
            {!hasImages || imageError ? (
              <div style={{ fontStyle: 'italic', color: '#888' }}>No images available</div>
            ) : (
              <img
                src={product.images[currentImageIndex]}
                alt={`${product.name} ${currentImageIndex + 1}`}
                onError={handleImageError}
                style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '8px' }}
              />
            )}
          </div>

          {hasImages && product.images.length > 1 &&
            <button
              onClick={nextImage}
              aria-label="Next Image"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: '#0d6efd',
                marginLeft: '10px',
                userSelect: 'none'
              }}
            >&gt;</button>
          }
        </div>

        {/* Dots only if product has images */}
        {hasImages && product.images.length > 0 && (
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            {product.images.map((_, idx) => (
              <span
                key={idx}
                onClick={() => selectImage(idx)}
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  margin: '0 4px',
                  backgroundColor: idx === currentImageIndex ? '#0d6efd' : '#ccc',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }}
                aria-label={`Select image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        <p>{product.description}</p>
        <h5 style={{ fontSize: '0.8rem', color: '#666' }}>
          Category: {Array.isArray(product.category) ? product.category.join(', ') : product.category}
        </h5>
        <p>Price: ₱{product.price.toFixed(2)}</p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '10px',
          maxWidth: '350px',
          marginBottom: '15px'
        }}>
          <div className="d-flex align-items-center" style={{ flexGrow: 1, minWidth: '160px' }}>
            <button
              className="btn btn-outline-secondary"
              onClick={decrementQuantity}
              aria-label="Decrease quantity"
              disabled={quantity <= 0}
              style={{ minWidth: '38px', height: '38px' }}
            >-</button>
            <input
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              style={{
                textAlign: 'center',
                width: '70px',
                margin: '0 5px',
                height: '38px',
                fontSize: '1rem',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
              aria-label="Quantity input"
            />
            <button
              className="btn btn-outline-secondary"
              onClick={incrementQuantity}
              aria-label="Increase quantity"
              style={{ minWidth: '38px', height: '38px' }}
            >+</button>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn"
            style={{
              backgroundColor: quantity > 0 ? 'green' : 'grey',
              color: 'white',
              cursor: quantity > 0 ? 'pointer' : 'not-allowed',
              flexGrow: 1,
              minWidth: '120px',
              height: '38px'
            }}
            disabled={quantity <= 0}
          >
            Add to Cart
          </button>
        </div>

        {message && <p className="mt-3 text-success">{message}</p>}
      </div>
    </div>
  );
}

export default ProductDetails;
