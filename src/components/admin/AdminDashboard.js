import React, { useState, useEffect } from 'react';
import { productAPI } from '../../services/api';

function AdminDashboard({ transactions = [] }) {
  const [products, setProducts] = useState([]);
  const [bestSellingProduct, setBestSellingProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load products from API
    const loadProducts = async () => {
      try {
        setLoading(true);
        const loadedProducts = await productAPI.getAll();
        setProducts(loadedProducts);
        
        // Calculate best-selling product from transactions
    if (transactions && transactions.length > 0) {
      const productSales = {};
      
      transactions.forEach(transaction => {
        transaction.items?.forEach(item => {
          if (productSales[item.id]) {
            productSales[item.id].quantity += item.quantity;
          } else {
            productSales[item.id] = {
              quantity: item.quantity,
              name: item.name,
              price: item.price
            };
          }
        });
      });

      // Find product with most sales
      let bestProduct = null;
      let maxSales = 0;
      
      Object.entries(productSales).forEach(([id, sales]) => {
        if (sales.quantity > maxSales) {
          maxSales = sales.quantity;
          bestProduct = loadedProducts.find(p => p.id === parseInt(id));
        }
      });

      // If no sales, pick a random product
      if (!bestProduct && loadedProducts.length > 0) {
        bestProduct = loadedProducts[Math.floor(Math.random() * loadedProducts.length)];
      }

      setBestSellingProduct(bestProduct);
    } else if (loadedProducts.length > 0) {
      // If no transactions, pick a random product
      const randomProduct = loadedProducts[Math.floor(Math.random() * loadedProducts.length)];
        setBestSellingProduct(randomProduct);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products from API');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [transactions]);

  const totalProducts = products.length;
  const totalOrders = transactions?.length || 0;
  const totalRevenue = transactions?.reduce((sum, t) => sum + (t.totalAmount || 0), 0) || 0;

  const handleImageError = () => {
    setImageError(true);
  };

  const prevImage = () => {
    setImageError(false);
    if (bestSellingProduct?.images && bestSellingProduct.images.length > 0) {
      setCurrentImageIndex(prevIndex =>
        prevIndex === 0 ? bestSellingProduct.images.length - 1 : prevIndex - 1
      );
    }
  };

  const nextImage = () => {
    setImageError(false);
    if (bestSellingProduct?.images && bestSellingProduct.images.length > 0) {
      setCurrentImageIndex(prevIndex =>
        prevIndex === bestSellingProduct.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const selectImage = (index) => {
    setImageError(false);
    setCurrentImageIndex(index);
  };

  return (
    <div className="w-100">
      <h2 className="fw-bold mb-3">Admin Dashboard</h2>
      <p>Welcome, Admin. Here you can manage products and monitor the store.</p>

      <div className="row g-3 g-md-4 mt-3">
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm p-3 h-100">
            <h6 className="text-muted mb-1">Total Products</h6>
            <h3>{totalProducts}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm p-3 h-100">
            <h6 className="text-muted mb-1">Total Orders</h6>
            <h3>{totalOrders}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm p-3 h-100">
            <h6 className="text-muted mb-1">Revenue</h6>
            <h3>₱{totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
        </div>
      </div>

      {bestSellingProduct && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Best Selling Product</h5>
                
                <div className="row g-3">
                  {/* Image Section */}
                  <div className="col-12 col-md-5">
                    <label className="form-label text-muted small mb-3">Product Image</label>
                    <div className="d-flex justify-content-center align-items-center" style={{ position: 'relative', minHeight: '280px' }}>
                      {bestSellingProduct?.images && bestSellingProduct.images.length > 1 && (
                        <button 
                          type="button"
                          onClick={prevImage} 
                          className="btn btn-link text-primary p-0 me-2" 
                          style={{ fontSize: '1.75rem', position: 'absolute', left: 0, zIndex: 10 }}
                          aria-label="Previous Image"
                        >
                          &lt;
                        </button>
                      )}

                      <div 
                        className="product-image-box w-100" 
                        style={{ 
                          minHeight: '280px', 
                          backgroundColor: '#f8f9fa', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          borderRadius: '8px',
                          border: '1px solid #dee2e6'
                        }}
                      >
                        {!bestSellingProduct?.images || bestSellingProduct.images.length === 0 || imageError ? (
                          <div style={{ fontStyle: 'italic', color: '#888' }}>No images available</div>
                        ) : (
                          <img
                            src={bestSellingProduct.images[currentImageIndex]}
                            alt={`${bestSellingProduct.name} ${currentImageIndex + 1}`}
                            onError={handleImageError}
                            className="img-fluid"
                            style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain', borderRadius: '8px' }}
                          />
                        )}
                      </div>

                      {bestSellingProduct?.images && bestSellingProduct.images.length > 1 && (
                        <button 
                          type="button"
                          onClick={nextImage} 
                          className="btn btn-link text-primary p-0 ms-2" 
                          style={{ fontSize: '1.75rem', position: 'absolute', right: 0, zIndex: 10 }}
                          aria-label="Next Image"
                        >
                          &gt;
                        </button>
                      )}
                    </div>

                    {/* Image Navigation Dots */}
                    {bestSellingProduct?.images && bestSellingProduct.images.length > 0 && (
                      <div className="text-center mt-3">
                        {bestSellingProduct.images.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => selectImage(idx)}
                            className={`btn btn-sm me-1 ${idx === currentImageIndex ? 'btn-primary' : 'btn-outline-secondary'}`}
                            aria-label={`Select image ${idx + 1}`}
                            style={{ width: '10px', height: '10px', padding: 0, borderRadius: '50%' }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Details Section */}
                  <div className="col-12 col-md-7">
                    <div className="mb-3">
                      <label className="form-label text-muted small">Product Name</label>
                      <p className="fw-bold">{bestSellingProduct.name}</p>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted small">Description</label>
                      <p>{bestSellingProduct.description || 'No description available'}</p>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted small">Price</label>
                      <p className="fw-bold text-success">₱{bestSellingProduct.price?.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted small">Current Stock</label>
                      <p className={`fw-bold ${bestSellingProduct.stock > 10 ? 'text-success' : bestSellingProduct.stock > 0 ? 'text-warning' : 'text-danger'}`}>
                        {bestSellingProduct.stock || 0} units
                      </p>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted small">Category</label>
                      <div>
                        {bestSellingProduct.category?.map((cat, idx) => (
                          <span key={idx} className="badge bg-dark me-2 mb-2">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
