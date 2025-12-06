import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';

function AdminAddProduct() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load products from API
    const loadProducts = async () => {
      try {
        const fetchedProducts = await productAPI.getAll();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error loading products:', err);
      }
    };
    
    loadProducts();
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

    if (!formData.name || !formData.price || !formData.stock || !formData.category) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      const newProduct = {
        name: formData.name,
        description: formData.description || '',
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: [formData.category],
        images: []
      };
      
      // Call API to add product
      const addedProduct = await productAPI.create(newProduct);
      
      // Update local products list
      setProducts([...products, addedProduct]);
      
      console.log('Product added:', addedProduct);
      setSuccess('Product added successfully!');
      setFormData({ name: '', description: '', price: '', stock: '', category: '' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add product: ' + error.message);
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
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select" 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category...</option>
                    <option value="Car Parts">Car Parts</option>
                    <option value="Tires">Tires</option>
                    <option value="Spoiler">Spoiler</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home">Home & Garden</option>
                    <option value="Sports">Sports</option>
                    <option value="Merchandise">Merchandise</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="d-flex gap-2 justify-content-between mt-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/admin')}
                  >
                    <i className="ri-arrow-left-line me-2"></i>Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-dark"
                  >
                    <i className="ri-add-line me-2"></i>Add Product
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
