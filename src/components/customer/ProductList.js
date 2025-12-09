import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';

function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const [imageErrorMap, setImageErrorMap] = useState({});

  useEffect(() => {
    setLoading(true);
    productAPI.getAll()
      .then(fetchedProducts => {
        setProducts(fetchedProducts);
        // Initialize quantities for each product
        const initialQuantities = {};
        fetchedProducts.forEach(product => initialQuantities[product.id] = 0);
        setQuantities(initialQuantities);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load products.');
        setLoading(false);
      });
  }, []);

  const handleQuantityChange = (productId, value) => {
    if (/^\d*$/.test(value)) {
      const raw = value === '' ? 0 : parseInt(value, 10);
      const prod = products.find(p => p.id === productId);
      const stock = prod && typeof prod.stock === 'number' ? prod.stock : 0;
      const numValue = Math.min(raw, stock);
      setQuantities(prev => ({ ...prev, [productId]: numValue }));
    }
  };

  const handleIncrement = (productId) => {
    const currentQty = quantities[productId] || 0;
    const prod = products.find(p => p.id === productId);
    const stock = prod && typeof prod.stock === 'number' ? prod.stock : 0;
    if (stock === 0) return;
    if (currentQty < stock) {
      setQuantities(prev => ({ ...prev, [productId]: currentQty + 1 }));
    }
  };

  const handleDecrement = (productId) => {
    const currentQty = quantities[productId] || 0;
    const prod = products.find(p => p.id === productId);
    const stock = prod && typeof prod.stock === 'number' ? prod.stock : 0;
    if (stock === 0) return;
    if (currentQty > 0) {
      setQuantities(prev => ({ ...prev, [productId]: currentQty - 1 }));
    }
  };

  const handleAddToCartWithQuantity = (product) => {
    const quantity = quantities[product.id] || 0;
    if (quantity < 1 || !Number.isInteger(quantity) || quantity > (product.stock || 0)) return;
    if (addToCart) addToCart(product, quantity);
    const message = quantity === 1
      ? `${product.name} has been added to cart`
      : `${quantity} ${product.name} have been added to cart`;
    setConfirmationMessage({ productId: product.id, message });
    setTimeout(() => setConfirmationMessage(null), 3000);
    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
  };

  const handleInputBlur = (productId) => {
    if (!quantities[productId] || quantities[productId] < 0) {
      setQuantities(prev => ({ ...prev, [productId]: 0 }));
    }
  };

  const handleImageError = (productId) => {
    setImageErrorMap(prev => ({ ...prev, [productId]: true }));
  };

  // Get random image from public/designs/images/ directory
  const getRandomProductImage = (productId) => {
    // Array of known image filenames in public/designs/images/
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

    // Use product ID to seed consistent "random" selection for same product
    const index = productId % imageFiles.length;
    return `/designs/images/${imageFiles[index]}`;
  };

  if (loading) return <div className="container"><p>Loading products...</p></div>;
  if (error) return <div className="container"><p className="text-danger">{error}</p></div>;

  return (
    <div className="container">
      <h1 className="mb-3 text-center">Product List</h1>
      <div className="row g-3">
        {products.map(product => {
          const imageErrored = imageErrorMap[product.id];
          const quantity = quantities[product.id] || 0;
          const imageSrc = getRandomProductImage(product.id);

          return (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 d-flex">
              <div className="card product-card shadow-sm h-100 w-100">
                <div className="product-image-container">
                  {imageErrored ? (
                    <div className="no-image">No images available</div>
                  ) : (
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="product-image img-fluid"
                      onError={() => handleImageError(product.id)}
                    />
                  )}
                </div>

                <div className="card-body d-flex flex-column">
                  <h5 className="product-name mb-2">{product.name}</h5>

                  <p className="product-desc text-muted mb-2" style={{ flexGrow: 1 }}>
                    {product.description.length > 120
                      ? product.description.slice(0, 120) + '...'
                      : product.description
                    }
                  </p>

                  <div className="d-flex align-items-center justify-content-between mb-2 gap-3">
                    <div className="price-block">
                      <div className="price-accent">₱{product.price.toFixed(2)}</div>
                      <div className="text-muted small">{Array.isArray(product.category) ? product.category.join(', ') : product.category}</div>
                      <div className={product.stock > 0 ? 'text-success small mt-1' : 'text-danger small mt-1'}>
                        {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                      </div>
                    </div>
                  </div>

                  <div className="controls-row d-flex align-items-center gap-2 flex-nowrap">
                    <div className="d-flex align-items-center qty-controls" style={{ gap: '8px', flexShrink: 0 }}>
                      <button
                        className="btn btn-outline-secondary qty-btn"
                        onClick={() => handleDecrement(product.id)}
                        aria-label="Decrease quantity"
                        disabled={quantity <= 0 || product.stock === 0}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control text-center qty-input"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        onBlur={() => handleInputBlur(product.id)}
                        aria-label="Quantity input"
                      />
                      <button
                        className="btn btn-outline-secondary qty-btn"
                        onClick={() => handleIncrement(product.id)}
                        aria-label="Increase quantity"
                        disabled={product.stock === 0 || quantity >= (product.stock || 0)}
                      >
                        +
                      </button>
                    </div>

                    <div className="card-actions d-flex gap-2 align-items-center" role="group" aria-label="Product actions">
                      <button
                        onClick={() => handleAddToCartWithQuantity(product)}
                        className="btn btn-icon btn-icon-unified"
                        disabled={quantity < 1 || product.stock === 0 || quantity > (product.stock || 0)}
                        aria-label="Add to cart"
                        title="Add to cart"
                      >
                        <i className="ri-shopping-cart-line" aria-hidden="true"></i>
                      </button>

                      <Link
                        to={`/details/${product.id}`}
                        className="btn btn-icon btn-icon-unified"
                        aria-label="View details"
                        title="View details"
                      >
                        <i className="ri-list-view" aria-hidden="true"></i>
                      </Link>
                    </div>
                  </div>

                  {confirmationMessage && confirmationMessage.productId === product.id && (
                    <div className="alert alert-success mt-3 mb-0 py-2 small" role="alert">
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
