import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../services/api';

function AdminAddProduct() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categories: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load products and categories from API
    const loadData = async () => {
      try {
        const fetchedProducts = await productAPI.getAll();
        setProducts(fetchedProducts);
        
        const fetchedCategories = await categoryAPI.getAll();
        console.log('Raw categories from API:', fetchedCategories);
        
        // Handle different API response formats
        let processedCategories = [];
        if (Array.isArray(fetchedCategories)) {
          processedCategories = fetchedCategories;
        } else if (fetchedCategories.data && Array.isArray(fetchedCategories.data)) {
          processedCategories = fetchedCategories.data;
        }
        
        console.log('Processed categories:', processedCategories);
        setCategories(processedCategories);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load categories. Please refresh the page.');
      }
    };
    
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.price || !formData.stock || formData.categories.length === 0) {
      setError('Please fill in all required fields.');
      return;
    }

    // Validate price and stock are positive numbers
    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock);

    if (isNaN(price) || price < 0) {
      setError('Price must be a valid positive number.');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      setError('Stock must be a valid positive number.');
      return;
    }

    try {
      setLoading(true);
      const newProduct = {
        name: formData.name.trim(),
        description: formData.description.trim() || '',
        price: price,
        stock: stock,
        categories: formData.categories
      };
      
      console.log('Sending product to API:', newProduct);
      
      // Call API to add product
      const addedProduct = await productAPI.create(newProduct);
      
      console.log('Product added successfully:', addedProduct);
      setSuccess('Product added successfully!');
      setFormData({ name: '', description: '', price: '', stock: '', categories: [] });
      
      // Reload products list to show the newly added product
      const updatedProducts = await productAPI.getAll();
      setProducts(updatedProducts);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product: ' + (error.message || 'Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">
                <i className="ri-add-box-line me-2"></i>Add New Product
              </h5>

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
              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="ri-check-circle-line me-2"></i>
                  <strong>Success:</strong> {success}
                  <button 
                    type="button" 
                    className="btn-close" 
                    data-bs-dismiss="alert" 
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Product Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Yokohama BluEarth-Es ES32"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    name="description" 
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description..."
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Price (₱)</label>
                    <div className="input-group">
                      <span className="input-group-text">₱</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        min="0"
                        className="form-control" 
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Stock</label>
                    <input 
                      type="number" 
                      min="0"
                      className="form-control" 
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Categories</label>
                  <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                    {categories.length === 0 ? (
                      <small className="text-muted">Loading categories...</small>
                    ) : (
                      categories.map((cat) => {
                        const catId = cat.id || cat.categoryId || cat;
                        const catName = cat.name || cat.category_name || cat;
                        const isChecked = formData.categories.includes(catName);
                        return (
                          <div key={catId} className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`category-${catId}`}
                              value={catName}
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    categories: [...formData.categories, catName]
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    categories: formData.categories.filter(c => c !== catName)
                                  });
                                }
                              }}
                            />
                            <label className="form-check-label" htmlFor={`category-${catId}`}>
                              {catName}
                            </label>
                          </div>
                        );
                      })
                    )}
                  </div>
                  {categories.length === 0 && (
                    <small className="text-muted d-block mt-2">Categories not loaded. Check console for errors.</small>
                  )}
                  {formData.categories.length > 0 && (
                    <small className="text-muted d-block mt-2">
                      Selected: {formData.categories.join(', ')}
                    </small>
                  )}
                  {formData.categories.length === 0 && (
                    <small className="text-danger d-block mt-2">Please select at least one category.</small>
                  )}
                </div>

                <div className="d-flex gap-2 justify-content-between mt-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/admin')}
                    disabled={loading}
                  >
                    <i className="ri-arrow-left-line me-2"></i>Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-dark"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="ri-add-line me-2"></i>Add Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAddProduct;
