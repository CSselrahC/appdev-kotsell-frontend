import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8082/api';

function AdminEditProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products
        const productsResponse = await fetch(`${API_BASE_URL}/products`);
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();
        const productsList = Array.isArray(productsData) ? productsData : productsData.data || [];
        setProducts(productsList);

        // Fetch categories for mapping
        const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json();
        const categoriesList = Array.isArray(categoriesData) ? categoriesData : categoriesData.data || [];
        
        // Create category name map
        const categoryMap = {};
        categoriesList.forEach(cat => {
          categoryMap[cat.categoryId || cat.id] = cat.name;
        });
        setCategoriesMap(categoryMap);

      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load products or categories: ' + err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productId?.toString().includes(searchTerm) ||
    product.id?.toString().includes(searchTerm)
  );

  const getProductCategories = (productId) => {
    // In a real implementation, you'd fetch product_categories junction
    // For now, show basic info - you can enhance this
    return 'Multiple';
  };

  const handleEditClick = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
              <p className="text-muted">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0 fw-bold">
                  <i className="ri-edit-box-line me-2 text-primary"></i>
                  Manage Products
                </h5>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate('/admin/products/add')}
                >
                  <i className="ri-add-line me-1"></i>Add New
                </button>
              </div>
              
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="ri-search-line text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="Search products by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              {error ? (
                <div className="alert alert-danger p-4 m-3">
                  <i className="ri-error-warning-line me-2"></i>
                  <strong>Error:</strong> {error}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-5">
                  <i className="ri-inbox-line fs-1 text-muted mb-3"></i>
                  <h5 className="text-muted">
                    {searchTerm ? 'No matching products found' : 'No products available'}
                  </h5>
                  <p className="text-muted">
                    {searchTerm ? 'Try a different search term.' : 'Add your first product to get started.'}
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light sticky-top">
                      <tr>
                        <th className="border-top-0">
                          <i className="ri-hashtag me-1"></i>ID
                        </th>
                        <th className="border-top-0">
                          <i className="ri-shopping-bag-line me-1"></i>Product
                        </th>
                        <th className="border-top-0">
                          <i className="ri-money-peso-circle-line me-1"></i>Price
                        </th>
                        <th className="border-top-0">
                          <i className="ri-inbox-line me-1"></i>Stock
                        </th>
                        <th className="border-top-0">Categories</th>
                        <th className="border-top-0 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.productId || product.id}>
                          <td className="fw-medium">
                            <code>{product.productId || product.id}</code>
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold">{product.name}</div>
                              <small className="text-muted">
                                {product.description?.substring(0, 80)}...
                              </small>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-success fs-6 px-3 py-2">
                              ₱{parseFloat(product.price || 0).toLocaleString('en-PH', { 
                                minimumFractionDigits: 2, maximumFractionDigits: 2 
                              })}
                            </span>
                          </td>
                          <td>
                            <span className={`badge fs-6 px-3 py-2 fw-semibold ${
                              (product.stock || 0) > 10 
                                ? 'bg-success' 
                                : (product.stock || 0) > 0 
                                ? 'bg-warning text-dark' 
                                : 'bg-danger'
                            }`}>
                              {product.stock || 0}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              Multiple categories
                              <br />
                              <span className="badge bg-light text-dark">Click Edit to view</span>
                            </small>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditClick(product.productId || product.id)}
                              title="Edit product"
                            >
                              <i className="ri-edit-2-line me-1"></i>Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="card-footer bg-light border-0 py-3">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <small className="text-muted">
                    Showing {filteredProducts.length} of {products.length} products
                  </small>
                </div>
                <div className="col-md-6 text-md-end">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate('/admin')}
                  >
                    <i className="ri-arrow-left-line me-1"></i>Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEditProducts;
