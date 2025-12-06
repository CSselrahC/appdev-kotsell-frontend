import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../../services/api';

function AdminEditProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Load product from API
    const loadProduct = async () => {
      try {
        setLoading(true);
        const foundProduct = await productAPI.getById(parseInt(id));
        setProduct(foundProduct);
        setFormData({
          name: foundProduct.name,
          description: foundProduct.description || '',
          price: foundProduct.price,
          stock: foundProduct.stock || 0,
          category: foundProduct.category?.[0] || ''
        });
        setError('');
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product from API');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleImageError = () => {
    setImageError(true);
  };

  const prevImage = () => {
    setImageError(false);
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex(prevIndex =>
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

  const nextImage = () => {
    setImageError(false);
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex(prevIndex =>
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const selectImage = (index) => {
    setImageError(false);
    setCurrentImageIndex(index);
  };

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

    if (!formData.name || !formData.price || formData.stock === '' || !formData.category) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const updatedProduct = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: [formData.category]
      };

      // Call API to update product
      await productAPI.update(parseInt(id), updatedProduct);
      
      console.log('Product updated:', updatedProduct);
      setSuccess('Product updated successfully!');

      // Redirect after 2 seconds
      setTimeout(() => navigate('/admin/products/edit'), 2000);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update product: ' + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      // Call API to delete product
      await productAPI.delete(parseInt(id));

      setShowDeleteModal(false);
      setSuccess('Product deleted successfully!');
      setTimeout(() => navigate('/admin/products/edit'), 1500);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to delete product: ' + error.message);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-6">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">
                <i className="ri-edit-box-line me-2"></i>Edit Product Details
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
                <div className="row g-3">
                  {/* Image Section */}
                  <div className="col-12 col-md-5">
                    <label className="form-label text-muted small mb-3">Product Images</label>
                    <div className="d-flex justify-content-center align-items-center" style={{ position: 'relative', minHeight: '300px' }}>
                      {product?.images && product.images.length > 1 && (
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
                          minHeight: '300px', 
                          backgroundColor: '#f8f9fa', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          borderRadius: '8px',
                          border: '1px solid #dee2e6'
                        }}
                      >
                        {!product?.images || product.images.length === 0 || imageError ? (
                          <div style={{ fontStyle: 'italic', color: '#888' }}>No images available</div>
                        ) : (
                          <img
                            src={product.images[currentImageIndex]}
                            alt={`${formData.name} ${currentImageIndex + 1}`}
                            onError={handleImageError}
                            className="img-fluid"
                            style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px' }}
                          />
                        )}
                      </div>

                      {product?.images && product.images.length > 1 && (
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
                    {product?.images && product.images.length > 0 && (
                      <div className="text-center mt-3">
                        {product.images.map((_, idx) => (
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

                  {/* Form Section */}
                  <div className="col-12 col-md-7">
                    <div className="mb-3">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Product name"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Product description"
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
                  </div>
                </div>

                <div className="d-flex gap-2 justify-content-between mt-4 flex-wrap">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/admin/products/edit')}
                  >
                    <i className="ri-arrow-left-line me-2"></i>Back
                  </button>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <i className="ri-delete-bin-line me-2"></i>Delete
                    </button>
                    <button
                      type="submit"
                      className="btn btn-dark"
                    >
                      <i className="ri-save-line me-2"></i>Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <div className="d-flex align-items-center gap-2">
                  <i className="ri-alert-fill"></i>
                  <h5 className="modal-title fw-bold">Delete Product</h5>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDeleteModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-flex gap-3 mb-3">
                  <i className="ri-error-warning-line" style={{ color: '#dc3545', fontSize: '1.5rem' }}></i>
                  <div>
                    <p className="fw-bold mb-2">Are you sure you want to delete this product?</p>
                    <p className="text-muted mb-0">
                      <strong>{formData.name}</strong>
                    </p>
                    <p className="text-muted small">
                      This action cannot be undone. The product will be permanently removed from the system.
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  <i className="ri-close-line me-2"></i>Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  <i className="ri-delete-bin-line me-2"></i>Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEditProductDetails;
