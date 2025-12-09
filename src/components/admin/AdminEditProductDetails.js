import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { imageAPI, productImageAPI, productAPI } from '../../services/api';

const API_BASE_URL = 'http://localhost:8082/api';

function AdminEditProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryIds: []
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        console.log('🔄 Loading data for product ID:', id);

        // 1. Fetch ALL categories FIRST
        console.log('📥 Fetching categories...');
        const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
        if (!categoriesResponse.ok) {
          throw new Error(`Categories fetch failed: ${categoriesResponse.status}`);
        }
        const categoriesData = await categoriesResponse.json();
        const categoriesList = Array.isArray(categoriesData) ? categoriesData : categoriesData.data || [];
        console.log('✅ Categories loaded:', categoriesList.length);
        setCategories(categoriesList);

        // 2. Fetch specific PRODUCT by ID (use productAPI to normalize images)
        console.log('📥 Fetching product via productAPI.getById:', id);
        const productData = await productAPI.getById(id);
        console.log('✅ Product loaded (normalized):', productData);
        setProduct(productData);

        // 3. Fetch THIS PRODUCT'S categories from junction table
        console.log('🔗 Fetching product categories for product ID:', id);
        const productCategoriesResponse = await fetch(`${API_BASE_URL}/product_categories?productId=${id}`);
        
        let productCategoryIds = [];
        if (productCategoriesResponse.ok) {
          const productCategoriesData = await productCategoriesResponse.json();
          console.log('🔗 Raw product categories response:', productCategoriesData);
          
          // Handle different response formats
          if (Array.isArray(productCategoriesData)) {
            productCategoryIds = productCategoriesData.map(pc => parseInt(pc.categoryId));
          } else if (productCategoriesData.data && Array.isArray(productCategoriesData.data)) {
            productCategoryIds = productCategoriesData.data.map(pc => parseInt(pc.categoryId));
          }
        } else {
          console.warn('⚠️ No product_categories endpoint or empty response');
        }
        
        console.log('✅ Product category IDs loaded:', productCategoryIds);

        // 4. Set form with ALL loaded data
        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price?.toString() || '',
          stock: productData.stock?.toString() || '',
          categoryIds: productCategoryIds
        });

        console.log('🎉 Data loaded - Categories pre-selected:', productCategoryIds);

      } catch (err) {
        console.error('💥 Load error:', err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadData();
    }
  }, [id]);

  const handleImageError = () => setImageError(true);

  const prevImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
    }
    setImageError(false);
  };

  const nextImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
    }
    setImageError(false);
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
    setImageError(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryChange = (categoryId, checked) => {
    const categoryIntId = parseInt(categoryId);
    let newCategoryIds;
    
    if (checked) {
      newCategoryIds = [...formData.categoryIds, categoryIntId];
    } else {
      newCategoryIds = formData.categoryIds.filter(id => id !== categoryIntId);
    }
    
    console.log('Category change:', categoryId, checked, '→ New selection:', newCategoryIds);
    setFormData({
      ...formData,
      categoryIds: newCategoryIds
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdating(true);

    try {
      // Validation
      if (!formData.name.trim() || !formData.price || formData.stock === '' || formData.categoryIds.length === 0) {
        throw new Error('Please fill all required fields and select at least one category.');
      }

      const price = parseFloat(formData.price);
      const stock = parseInt(formData.stock);

      if (isNaN(price) || price < 0) throw new Error('Price must be a valid positive number.');
      if (isNaN(stock) || stock < 0) throw new Error('Stock must be a valid positive number.');

      console.log('💾 Saving product + categories:', { id, ...formData, price, stock });

      // 1. UPDATE PRODUCT details
      const productResponse = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price,
          stock
        })
      });

      if (!productResponse.ok) {
        const errorText = await productResponse.text();
        throw new Error(`Product update failed (${productResponse.status}): ${errorText}`);
      }
      console.log('✅ Product updated');

      // 2. UPDATE CATEGORIES (junction table) - Clear then add
      console.log('🔄 Updating categories...');
      
      // Clear existing
      try {
        const deleteResponse = await fetch(`${API_BASE_URL}/product_categories?productId=${id}`, {
          method: 'DELETE',
          headers: { 'Accept': 'application/json' }
        });
        console.log('🗑️ Clear response:', deleteResponse.status);
      } catch (deleteErr) {
        console.warn('⚠️ Clear categories failed (might not exist):', deleteErr.message);
      }

      // Add new ones
      for (const categoryId of formData.categoryIds) {
        const postResponse = await fetch(`${API_BASE_URL}/product_categories`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            productId: parseInt(id),
            categoryId: parseInt(categoryId)
          })
        });
        
        if (!postResponse.ok) {
          console.error(`❌ Category ${categoryId} failed:`, postResponse.status);
        }
      }
      console.log('✅ Categories updated');

      // If files selected, upload and link them
      if (selectedFiles && selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          try {
            const uploaded = await imageAPI.upload(file, file.name);
            const imageId = uploaded.imageId || uploaded.id || uploaded.image_id;
            const prodId = id;
            if (imageId) {
              await productImageAPI.link(prodId, imageId);
            }
          } catch (uploadErr) {
            console.error('Failed to upload/link image:', uploadErr);
          }
        }
        // reload product images using normalized fetch
        try {
          const refreshed = await productAPI.getById(id);
          setProduct(refreshed);
        } catch (rerr) { console.warn(rerr); }
      }

      setSuccess('Product and categories updated successfully!');
      // Go back to products list
      setTimeout(() => navigate('/admin/products/edit'), 2000);
      
    } catch (error) {
      console.error('💥 Save error:', error);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setUpdating(true);
      const response = await fetch(`${API_BASE_URL}/products/${id}`, { 
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Delete failed (${response.status})`);
      }
      
      setShowDeleteModal(false);
      setSuccess('Product deleted successfully!');
      // Go back to products list
      setTimeout(() => navigate('/admin/products/edit'), 1500);
    } catch (error) {
      setError('Failed to delete product: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}></div>
              <p className="text-muted">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !product && !categories.length) {
    return (
      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="alert alert-danger text-center py-5">
              <i className="ri-error-warning-line fs-1 mb-3 d-block"></i>
              <h4>Unable to load product</h4>
              <p>{error}</p>
              <button className="btn btn-primary me-2" onClick={() => window.location.reload()}>
                <i className="ri-refresh-line me-2"></i>Retry
              </button>
              <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/products/edit')}>
                <i className="ri-arrow-left-line me-2"></i>Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="card-title mb-1">
                    <i className="ri-edit-box-line me-2 text-primary"></i>
                    Edit Product: <strong>{formData.name || 'Loading...'}</strong>
                  </h5>
                  <small className="text-muted">ID: {id} | {formData.categoryIds.length} categories selected</small>
                </div>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate('/admin/products/edit')}
                >
                  <i className="ri-arrow-left-line me-1"></i>Back
                </button>
              </div>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show mb-4">
                  <i className="ri-error-warning-line me-2"></i>{error}
                  <button className="btn-close" onClick={() => setError('')} />
                </div>
              )}

              {success && (
                <div className="alert alert-success alert-dismissible fade show mb-4">
                  <i className="ri-check-circle-line me-2"></i>{success}
                  <button className="btn-close" onClick={() => setSuccess('')} />
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Preview - unchanged */}
                  <div className="col-12 col-lg-4">
                    <label className="form-label fw-semibold mb-3">Preview</label>
                    <div className="position-relative">
                      {product?.images?.length > 1 && (
                        <>
                          <button 
                            type="button"
                            onClick={prevImage} 
                            className="btn btn-primary btn-sm position-absolute top-50 start-0 translate-middle-y z-3 rounded-end-0"
                            style={{fontSize: '1rem'}}
                          >&lt;</button>
                          <button 
                            type="button"
                            onClick={nextImage} 
                            className="btn btn-primary btn-sm position-absolute top-50 end-0 translate-middle-y z-3 rounded-start-0"
                            style={{fontSize: '1rem'}}
                          >&gt;</button>
                        </>
                      )}
                      <div className="w-100 bg-light d-flex justify-content-center align-items-center rounded-3 border p-4 text-center" style={{minHeight: '250px'}}>
                        {!product?.images?.length || imageError ? (
                          <div className="text-muted">
                            <i className="ri-image-line fs-2 mb-2 d-block opacity-50"></i>
                            <small>No images</small>
                          </div>
                        ) : (
                          <img
                            src={product.images[currentImageIndex]}
                            alt={product.name}
                            onError={handleImageError}
                            className="img-fluid rounded-2"
                            style={{maxHeight: '220px', objectFit: 'contain'}}
                          />
                        )}
                      </div>
                      {product?.images?.length > 1 && (
                        <div className="text-center mt-2">
                          {product.images.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => selectImage(idx)}
                              className={`btn btn-xs rounded-circle me-1 ${idx === currentImageIndex ? 'btn-primary' : 'btn-outline-secondary'}`}
                              style={{width: '10px', height: '10px', padding: 0}}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="col-12 col-lg-8">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold">Product Name <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={updating}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          rows="3"
                          value={formData.description}
                          onChange={handleChange}
                          disabled={updating}
                        />
                      </div>

                      <div className="col-lg-6">
                        <label className="form-label fw-semibold">Price (₱) <span className="text-danger">*</span></label>
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
                            required
                            disabled={updating}
                          />
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <label className="form-label fw-semibold">Stock <span className="text-danger">*</span></label>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          name="stock"
                          value={formData.stock}
                          onChange={handleChange}
                          required
                          disabled={updating}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">Categories <span className="text-danger">*</span></label>
                        <div className="border rounded-3 p-3 bg-light" style={{maxHeight: '200px', overflowY: 'auto'}}>
                          {categories.length === 0 ? (
                            <div className="text-center py-3 text-muted">No categories available</div>
                          ) : (
                            categories.map(category => {
                              const categoryId = category.categoryId || category.id;
                              const isChecked = formData.categoryIds.includes(parseInt(categoryId));
                              return (
                                <div key={categoryId} className="form-check mb-2">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`cat-${categoryId}`}
                                    checked={isChecked}
                                    onChange={e => handleCategoryChange(categoryId, e.target.checked)}
                                    disabled={updating}
                                  />
                                  <label className="form-check-label fw-medium" htmlFor={`cat-${categoryId}`}>
                                    {category.name}
                                  </label>
                                </div>
                              );
                            })
                          )}
                        </div>
                        <div className="mt-2">
                          {formData.categoryIds.length === 0 ? (
                            <small className="text-danger">
                              <i className="ri-alert-line me-1"></i>At least one category required
                            </small>
                          ) : (
                            <small className="text-success">
                              <i className="ri-check-line me-1"></i>
                              {formData.categoryIds.length} categories selected
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                  <div className="mb-3">
                    <label className="form-label">Upload Images</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      multiple
                      onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                      disabled={updating}
                    />
                    {selectedFiles.length > 0 && (
                      <div className="mt-2 d-flex gap-2 flex-wrap">
                        {selectedFiles.map((f, idx) => (
                          <div key={idx} className="small text-muted border rounded p-2">{f.name}</div>
                        ))}
                      </div>
                    )}
                  </div>

                <div className="d-flex gap-3 justify-content-between flex-wrap">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate('/admin/products/edit')}
                    disabled={updating}
                  >
                    <i className="ri-arrow-left-line me-2"></i>Cancel
                  </button>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-danger px-4"
                      onClick={() => setShowDeleteModal(true)}
                      disabled={updating}
                    >
                      <i className="ri-delete-bin-line me-2"></i>Delete
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="ri-save-3-line me-2"></i>Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <>
          <div className="modal-backdrop fade show" style={{zIndex: 1040}}></div>
          <div className="modal fade show d-block" tabIndex="-1" style={{zIndex: 1050}}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title fw-bold">
                    <i className="ri-alert-fill me-2"></i>Delete Product
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setShowDeleteModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <p className="fw-bold mb-2">
                    Delete <strong>{formData.name}</strong>?
                  </p>
                  <p className="text-muted small mb-0">
                    This cannot be undone.
                  </p>
                </div>
                <div className="modal-footer gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Deleting...
                      </>
                    ) : (
                      'Yes, Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminEditProductDetails;
