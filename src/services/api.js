// API Service for handling all backend requests
const API_BASE_URL = 'http://localhost:8082/api';

// Cache storage
let productsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function to transform API response to frontend format
const transformProduct = (product) => {
  return {
    id: product.productId || product.id,
    name: product.name || '',
    description: product.description || '',
    price: parseFloat(product.price) || 0,
    stock: parseInt(product.stock) || 0,
    category: product.categories || product.category || [],
    images: product.images || []
  };
};

// Helper function to check if cache is still valid
const isCacheValid = () => {
  if (!productsCache || !cacheTimestamp) return false;
  return (Date.now() - cacheTimestamp) < CACHE_DURATION;
};

// Products API
export const productAPI = {
  // Get all products (with caching)
  getAll: async () => {
    try {
      // Return cached data if still valid
      if (isCacheValid()) {
        console.log('Returning cached products');
        return productsCache;
      }

      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetching fresh products from API');
      
      // Handle both array and object responses
      const products = Array.isArray(data) ? data : data.data || [];
      const transformedProducts = products.map(transformProduct);
      
      // Update cache
      productsCache = transformedProducts;
      cacheTimestamp = Date.now();
      
      return transformedProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product by ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Raw product response:', data);
      
      // Handle both direct product and wrapped response
      const product = data.data || data;
      return transformProduct(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Create new product
  create: async (productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Invalidate cache on create
      productsCache = null;
      cacheTimestamp = null;
      
      return transformProduct(data.data || data);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  update: async (id, productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Invalidate cache on update
      productsCache = null;
      cacheTimestamp = null;
      
      return transformProduct(data.data || data);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Invalidate cache on delete
      productsCache = null;
      cacheTimestamp = null;
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Manually clear cache (useful for force refresh)
  clearCache: () => {
    productsCache = null;
    cacheTimestamp = null;
    console.log('Products cache cleared');
  },

  // Get cache status for debugging
  getCacheStatus: () => {
    return {
      isCached: isCacheValid(),
      cacheAge: cacheTimestamp ? Date.now() - cacheTimestamp : null,
      cacheSize: productsCache ? productsCache.length : 0
    };
  }
};

// Categories API
export const categoryAPI = {
  // Get all categories
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetching categories from API');
      
      // Handle both array and object responses
      const categories = Array.isArray(data) ? data : data.data || [];
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};

// Orders API
export const orderAPI = {
  // Get all orders for a customer
  getByCustomerId: async (customerId) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/carts?customersId=${customerId}`);
      if (!resp.ok) throw new Error('Failed to fetch carts');
      const data = await resp.json();

      const carts = Array.isArray(data) ? data : data.data || [];

      // Normalize: try to include product details. If product not included, fetch it.
      const normalized = await Promise.all(carts.map(async (c) => {
        const productId = c.productId || c.product_id || c.product?.productId || c.product?.id;
        let product = c.product || c.product_data || null;
        if (!product && productId) {
          try {
            product = await productAPI.getById(productId);
          } catch (e) {
            product = null;
          }
        }

        return {
          cartId: c.cartId || c.id || c.cart_id,
          id: productId,
          name: product?.name || c.name || '',
          price: parseFloat(c.price) || (product ? product.price : 0),
          quantity: parseInt(c.quantity) || 0,
          images: product?.images || [],
          stock: product?.stock || 0,
        };
      }));

      return normalized;
    } catch (error) {
      console.error('orderAPI.getByCustomerId error:', error);
      throw error;
    }
  },

  // Create new order
  create: async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
};

// Carts API
export const cartAPI = {
  // Get cart for a customer
  getByCustomerId: async (customerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/carts?customer_id=${customerId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetching cart from API');
      
      const carts = Array.isArray(data) ? data : data.data || [];
      return carts.length > 0 ? carts[0] : null;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Add item to cart
  addItem: async (customerId, productId, quantity) => {
    try {
      // get product price
      let price = 0;
      try {
        const prod = await productAPI.getById(productId);
        price = prod.price || 0;
      } catch (e) {
        // ignore, fallback price 0
      }

      const body = {
        customersId: customerId,
        productId,
        quantity,
        price
      };

      const resp = await fetch(`${API_BASE_URL}/carts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!resp.ok) throw new Error('Failed to add cart item');
      const data = await resp.json();

      // Return created cart item normalized
      const created = data.data || data || {};
      return {
        cartId: created.cartId || created.id || created.cart_id,
        id: created.productId || created.product_id,
        quantity: parseInt(created.quantity) || quantity,
        price: parseFloat(created.price) || price,
      };
    } catch (error) {
      console.error('cartAPI.addItem error:', error);
      throw error;
    }
  },

  // Update cart item
  updateItem: async (customerId, productId, quantity) => {
    try {
      // Find cart entry for this customer and product
      const resp = await fetch(`${API_BASE_URL}/carts?customersId=${customerId}&productId=${productId}`);
      if (!resp.ok) throw new Error('Failed to find cart item');
      const data = await resp.json();
      const carts = Array.isArray(data) ? data : data.data || [];
      const entry = carts[0];
      if (!entry) throw new Error('Cart entry not found');

      const cartId = entry.cartId || entry.id || entry.cart_id;
      const body = { quantity };

      const updateResp = await fetch(`${API_BASE_URL}/carts/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!updateResp.ok) throw new Error('Failed to update cart item');
      const updated = await updateResp.json();

      return {
        cartId: cartId,
        id: productId,
        quantity: parseInt(quantity),
        price: parseFloat(updated.price) || parseFloat(entry.price) || 0,
      };
    } catch (error) {
      console.error('cartAPI.updateItem error:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeItem: async (customerId, productId) => {
    try {
      // Find cart entry
      const resp = await fetch(`${API_BASE_URL}/carts?customersId=${customerId}&productId=${productId}`);
      if (!resp.ok) throw new Error('Failed to find cart item');
      const data = await resp.json();
      const carts = Array.isArray(data) ? data : data.data || [];
      const entry = carts[0];
      if (!entry) return true;

      const cartId = entry.cartId || entry.id || entry.cart_id;
      const del = await fetch(`${API_BASE_URL}/carts/${cartId}`, { method: 'DELETE' });
      if (!del.ok) throw new Error('Failed to delete cart item');
      return true;
    } catch (error) {
      console.error('cartAPI.removeItem error:', error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async (customerId) => {
    try {
      // Attempt to delete all cart entries for the customer
      const resp = await fetch(`${API_BASE_URL}/carts?customersId=${customerId}`);
      if (!resp.ok) throw new Error('Failed to fetch carts for clear');
      const data = await resp.json();
      const carts = Array.isArray(data) ? data : data.data || [];
      await Promise.all(carts.map(async (c) => {
        const cartId = c.cartId || c.id || c.cart_id;
        if (cartId) {
          await fetch(`${API_BASE_URL}/carts/${cartId}`, { method: 'DELETE' });
        }
      }));
      return true;
    } catch (error) {
      console.error('cartAPI.clearCart error:', error);
      throw error;
    }
  }
};

export default {
  productAPI,
  categoryAPI,
  orderAPI,
  cartAPI
};
