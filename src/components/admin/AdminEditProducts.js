import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';

function AdminEditProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load products from API
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProducts = await productAPI.getAll();
        console.log('Fetched products:', fetchedProducts);
        
        // Ensure we have an array
        const productsList = Array.isArray(fetchedProducts) ? fetchedProducts : [];
        setProducts(productsList);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products from API: ' + (err.message || 'Unknown error'));
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toString().includes(searchTerm)
  );

  const handleEditClick = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">
                <i className="ri-edit-box-line me-2"></i>Edit Products
              </h5>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="ri-error-warning-line me-2"></i>
                  <strong>Error:</strong> {error}
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              )}

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading products...</p>
                </div>
              ) : (
                <>
                  {/* Search Bar */}
              <div className="mb-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="ri-search-line"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by product name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Products List */}
              {filteredProducts.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th>
                          <i className="ri-image-add-line me-2"></i>ID
                        </th>
                        <th>
                          <i className="ri-product-hunt-line me-2"></i>Product Name
                        </th>
                        <th>
                          <i className="ri-money-peso-circle-line me-2"></i>Price
                        </th>
                        <th>
                          <i className="ri-inbox-archive-line me-2"></i>Stock
                        </th>
                        <th>
                          <i className="ri-bookmark-line me-2"></i>Category
                        </th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id}>
                          <td className="fw-semibold">{product.id}</td>
                          <td>{product.name}</td>
                          <td>
                            <span className="badge bg-dark">
                              ₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td>
                            <span className="badge" style={{ backgroundColor: product.stock > 10 ? '#198754' : product.stock > 0 ? '#ffc107' : '#dc3545' }}>
                              {product.stock || 0}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {product.category && product.category.length > 0
                                ? product.category.join(', ')
                                : 'Uncategorized'}
                            </small>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className="btn btn-sm btn-dark"
                              onClick={() => handleEditClick(product.id)}
                            >
                              <i className="ri-edit-line me-1"></i>Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="ri-inbox-line" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                  <p className="text-muted mt-3">
                    {searchTerm ? 'No products found matching your search.' : 'No products available.'}
                  </p>
                </div>
              )}

              {/* Back Button */}
              <div className="mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/admin')}
                >
                  <i className="ri-arrow-left-line me-2"></i>Back to Dashboard
                </button>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEditProducts;
