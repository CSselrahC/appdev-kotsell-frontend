import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../../services/api';

function ProductDetails({ cart, setCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [message, setMessage] = useState('');

  // Static image files from public/designs/images/
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
    'Add files via upload',
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

  // FIXED: Generate consistent images based on product ID (deterministic)
  const getProductImages = (productId) => {
    // Use product ID to create consistent "random" selection
    const numImages = 5; // Fixed number of images
    const seed = productId || 1;
    const shuffled = [...imageFiles].sort(() => {
      return (seed * 12345 + 67890) % 1000 / 1000 - 0.5;
    });
    return shuffled.slice(0, numImages).map(filename => `/designs/images/${filename}`);
  };

  useEffect(() => {
    setLoading(true);
    productAPI.getById(id)
      .then(fetchedProduct => {
        setProduct(fetchedProduct);
        setLoading(false);
      })
      .catch(() => {
        setError('Product not found for ID ' + id);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container"><p>Loading product...</p></div>;
  if (error) return <div className="container"><p className="text-danger">{error}</p></div>;
  if (!product) return <div>Product not found for ID {id}</div>;

  const parsedStock = Number(product.stock);
  const hasStockNumber = Number.isFinite(parsedStock);
  const stock = hasStockNumber ? parsedStock : 0;
  const productImages = getProductImages(parseInt(id)); // FIXED: Use product ID for consistency

  const handleImageError = () => {
    if (!imageError) setImageError(true);
  };

  const prevImage = () => {
    setImageError(false);
    setCurrentImageIndex(prevIndex =>
      prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setImageError(false);
    setCurrentImageIndex(prevIndex =>
      productImages.length > 1 ? (prevIndex === productImages.length - 1 ? 0 : prevIndex + 1) : 0
    );
  };

  const selectImage = (index) => {
    setImageError(false);
    setCurrentImageIndex(index);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      let parsed = value === '' ? 0 : parseInt(value, 10);
      if (hasStockNumber) parsed = Math.min(parsed, stock);
      setQuantity(parsed);
    }
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 0 ? prev - 1 : 0));
  };

  const incrementQuantity = () => {
    setQuantity(prev => {
      if (hasStockNumber) {
        return prev < stock ? prev + 1 : prev;
      }
      return prev + 1;
    });
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
      setTimeout(() => setMessage(''), 3000);
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
              {productImages.length > 1 && (
                <button
                  onClick={prevImage}
                  aria-label="Previous Image"
                  className="btn btn-link text-primary p-0 me-2 d-none d-md-inline"
                  style={{ fontSize: '1.75rem' }}
                >&lt;</button>
              )}

              <div className="product-image-box w-100" style={{
                minHeight: '180px',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px'
              }}>
                {imageError ? (
                  <div style={{ fontStyle: 'italic', color: '#888' }}>No images available</div>
                ) : (
                  <img
                    src={productImages[currentImageIndex]}
                    alt={`${product.name} ${currentImageIndex + 1}`}
                    onError={handleImageError}
                    className="img-fluid"
                    style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: '8px' }}
                  />
                )}
              </div>

              {productImages.length > 1 && (
                <button
                  onClick={nextImage}
                  aria-label="Next Image"
                  className="btn btn-link text-primary p-0 ms-2 d-none d-md-inline"
                  style={{ fontSize: '1.75rem' }}
                >&gt;</button>
              )}
            </div>

            {/* Dots for all breakpoints */}
            {productImages.length > 1 && (
              <div className="text-center mt-3">
                {productImages.map((_, idx) => (
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
            {stock > 0 ? (
              <p className="mb-2" style={{ color: 'green' }}><strong>In Stock: {stock}</strong></p>
            ) : (
              <p className="mb-1" style={{ color: 'red' }}>Out of Stock</p>
            )}

            <div className="d-flex flex-column gap-2 align-items-stretch" style={{ marginBottom: '15px' }}>
              <div className="d-flex align-items-center" style={{ gap: '8px', minWidth: 0 }}>
                <button
                  className="btn btn-outline-secondary"
                  onClick={decrementQuantity}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 0 || stock === 0}
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
                  disabled={stock === 0 || quantity >= stock}
                  style={{ width: '40px', height: '40px' }}
                >+</button>
              </div>
              <div className="d-flex gap-2 w-100">
                <button
                  onClick={handleAddToCart}
                  className={`btn ${quantity > 0 ? 'btn-success' : 'btn-secondary'} flex-grow-1`}
                  disabled={quantity <= 0 || stock === 0}
                  style={{ height: '40px' }}
                >
                  Add to Cart
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
