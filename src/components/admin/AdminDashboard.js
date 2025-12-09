import React, { useState, useEffect } from 'react';
import { productAPI } from '../../services/api';

const API_BASE_URL = 'http://localhost:8082/api';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bestSellingProduct, setBestSellingProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Static image files from public/designs/images/ (same as other components)
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

  // Get consistent images for carousel based on product ID
  const getProductImages = (productId) => {
    const numImages = 5;
    const seed = productId || 1;
    const shuffled = [...imageFiles].sort(() => {
      return (seed * 12345 + 67890) % 1000 / 1000 - 0.5;
    });
    return shuffled.slice(0, numImages).map(filename => `/designs/images/${filename}`);
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products
        const productsResponse = await fetch(`${API_BASE_URL}/products`);
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();
        const loadedProducts = Array.isArray(productsData) ? productsData : productsData.data || [];
        setProducts(loadedProducts);

        // Fetch orders
        const ordersResponse = await fetch(`${API_BASE_URL}/orders`);
        if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
        const ordersData = await ordersResponse.json();
        const loadedOrders = Array.isArray(ordersData) ? ordersData : ordersData.data || [];
        setOrders(loadedOrders);

        // Calculate best-selling product from orders
        if (loadedOrders.length > 0) {
          const productSales = {};
          
          loadedOrders.forEach(order => {
            // Handle different possible order structures
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach(item => {
                const productId = item.productId || item.id;
                if (productId) {
                  if (productSales[productId]) {
                    productSales[productId].quantity += item.quantity || 1;
                  } else {
                    productSales[productId] = {
                      quantity: item.quantity || 1,
                      name: item.name || `Product ${productId}`,
                      price: parseFloat(item.price) || 0
                    };
                  }
                }
              });
            }
          });

          // Find product with most sales
          let bestProduct = null;
          let maxSales = 0;
          
          Object.entries(productSales).forEach(([id, sales]) => {
            if (sales.quantity > maxSales) {
              maxSales = sales.quantity;
              bestProduct = loadedProducts.find(p => p.id === parseInt(id));
              if (bestProduct) {
                bestProduct.salesQuantity = sales.quantity;
              }
            }
          });

          // If no sales data found, pick random product
          if (!bestProduct && loadedProducts.length > 0) {
            bestProduct = loadedProducts[Math.floor(Math.random() * loadedProducts.length)];
          }

          setBestSellingProduct(bestProduct);
        } else if (loadedProducts.length > 0) {
          // No orders, pick random product
          const randomProduct = loadedProducts[Math.floor(Math.random() * loadedProducts.length)];
          setBestSellingProduct(randomProduct);
        }

      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try refreshing.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Calculate stats from loaded data
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => {
    return sum + parseFloat(order.total || order.totalPrice || 0);
  }, 0);

  const handleImageError = () => {
    setImageError(true);
  };

  const productImages = bestSellingProduct ? getProductImages(bestSellingProduct.id) : [];

  const prevImage = () => {
    setImageError(false);
    if (productImages.length > 1) {
      setCurrentImageIndex(prevIndex =>
        prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
      );
    }
  };

  const nextImage = () => {
    setImageError(false);
    if (productImages.length > 1) {
      setCurrentImageIndex(prevIndex =>
        prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const selectImage = (index) => {
    setImageError(false);
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading dashboard...</span>
              </div>
              <p className="text-muted">Loading dashboard statistics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="fw-bold mb-2">Admin Dashboard</h2>
          <p className="text-muted mb-0">Welcome back! Here's what's happening with your store.</p>
        </div>
      </div>

      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              <i className="ri-alert-line me-2"></i>{error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-2">
                <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                  <i className="ri-boxing-line text-primary fs-5"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Products</h6>
                  <h3 className="fw-bold text-dark mb-0">{totalProducts}</h3>
                </div>
              </div>
              <small className="text-success">
                <i className="ri-arrow-up-line me-1"></i>Live from API
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-2">
                <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                  <i className="ri-file-list-3-line text-success fs-5"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Orders</h6>
                  <h3 className="fw-bold text-dark mb-0">{totalOrders}</h3>
                </div>
              </div>
              <small className="text-success">
                <i className="ri-arrow-up-line me-1"></i>{totalOrders} orders processed
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-2">
                <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3">
                  <i className="ri-money-dollar-circle-line text-info fs-5"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Revenue</h6>
                  <h3 className="fw-bold text-dark mb-0">
                    ₱{totalRevenue.toLocaleString('en-PH', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </h3>
                </div>
              </div>
              <small className="text-success">
                <i className="ri-arrow-up-line me-1"></i>From all orders
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Best Selling Product */}
      {bestSellingProduct ? (
        <>
          <div className="row g-4 mb-4">
            <div className="col-12">
              <h5 className="fw-bold mb-4">
                <i className="ri-crown-line text-warning me-2"></i>
                Best Selling Product
              </h5>
              <div className="card border-0 shadow-lg">
                <div className="card-body p-4">
                  <div className="row g-4 align-items-center">
                    {/* Image Section */}
                    <div className="col-12 col-lg-5">
                      <div className="position-relative">
                        {productImages.length > 1 && (
                          <>
                            <button 
                              type="button"
                              onClick={prevImage} 
                              className="btn btn-primary btn-sm position-absolute top-50 start-0 translate-middle-y z-3 rounded-end-0 shadow"
                              style={{ fontSize: '1.25rem' }}
                              aria-label="Previous Image"
                            >
                              ‹
                            </button>
                            <button 
                              type="button"
                              onClick={nextImage} 
                              className="btn btn-primary btn-sm position-absolute top-50 end-0 translate-middle-y z-3 rounded-start-0 shadow"
                              style={{ fontSize: '1.25rem' }}
                              aria-label="Next Image"
                            >
                              ›
                            </button>
                          </>
                        )}

                        <div 
                          className="product-image-box w-100 bg-light d-flex justify-content-center align-items-center rounded-3 border"
                          style={{ 
                            minHeight: '300px',
                            border: '2px solid #e9ecef'
                          }}
                        >
                          {imageError ? (
                            <div className="text-center text-muted p-4">
                              <i className="ri-image-line fs-1 mb-2 opacity-50"></i>
                              <p className="mb-0 fst-italic">No images available</p>
                            </div>
                          ) : (
                            <img
                              src={productImages[currentImageIndex]}
                              alt={`${bestSellingProduct.name} ${currentImageIndex + 1}`}
                              onError={handleImageError}
                              className="img-fluid rounded-2"
                              style={{ maxHeight: '280px', objectFit: 'contain' }}
                            />
                          )}
                        </div>

                        {/* Image Dots */}
                        {productImages.length > 1 && (
                          <div className="text-center mt-3">
                            {productImages.map((_, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => selectImage(idx)}
                                className={`btn btn-sm rounded-circle me-1 shadow-sm ${
                                  idx === currentImageIndex 
                                    ? 'btn-primary' 
                                    : 'btn-outline-secondary bg-light'
                                }`}
                                style={{ width: '12px', height: '12px', padding: 0 }}
                                aria-label={`Select image ${idx + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="col-12 col-lg-7">
                      <div className="row g-3">
                        <div className="col-12">
                          <h4 className="fw-bold mb-1">{bestSellingProduct.name}</h4>
                          {bestSellingProduct.salesQuantity && (
                            <span className="badge bg-success mb-2">
                              <i className="ri-fire-line me-1"></i>
                              {bestSellingProduct.salesQuantity} units sold
                            </span>
                          )}
                        </div>
                        
                        <div className="col-md-6">
                          <div className="border rounded-2 p-3 bg-light">
                            <small className="text-muted">Price</small>
                            <div className="h5 fw-bold text-success mb-0">
                              ₱{bestSellingProduct.price?.toLocaleString('en-PH', { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                              })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="border rounded-2 p-3 bg-light">
                            <small className="text-muted">Stock</small>
                            <div className={`h6 fw-bold mb-0 ${
                              bestSellingProduct.stock > 10 
                                ? 'text-success' 
                                : bestSellingProduct.stock > 0 
                                ? 'text-warning' 
                                : 'text-danger'
                            }`}>
                              {bestSellingProduct.stock || 0} units
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="border rounded-2 p-3 bg-light">
                            <small className="text-muted">Description</small>
                            <p className="mb-0 lh-sm">{bestSellingProduct.description || 'No description available'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5 text-muted">
              <i className="ri-inbox-line fs-1 mb-3 opacity-50"></i>
              <h5>No products available</h5>
              <p className="mb-0">Add some products to see analytics here</p>
            </div>
          </div>
        </div>
      )}

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h6 className="text-muted mb-2">
                <i className="ri-time-line me-2"></i>
                Data updated: {new Date().toLocaleString('en-PH')}
              </h6>
              <small className="text-muted">
                Stats are fetched live from your backend APIs
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
