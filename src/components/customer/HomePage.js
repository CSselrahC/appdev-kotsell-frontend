import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import coupons from '../data/coupons.json';
import products from '../data/products.json';

function HomePage({ userName }) {
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [activePromos, setActivePromos] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Filter current active promos by today's date
    const now = new Date();
    const filtered = coupons.filter(coupon => {
      const start = new Date(coupon.startDate);
      const end = new Date(coupon.endDate);
      return start <= now && end >= now;
    });
    setActivePromos(filtered);
  }, []);

  useEffect(() => {
    // Promo cycling interval set to 4 seconds (4000 ms)
    if (activePromos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % activePromos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activePromos]);

  useEffect(() => {
    // Select 4 random unique products from products.json
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    setFeaturedProducts(selected);
  }, []);

  const promo = activePromos.length > 0 ? activePromos[currentPromoIndex] : null;

  return (
    <div className="container mt-4">
      {/* Top Row: Welcome Banner & Buttons */}
      <div className="row align-items-center mb-4 g-3 flex-column flex-md-row">
        <div className="col-md">
          <h2 className="fw-bold mb-4">Welcome, {userName || "User"}!</h2>
        </div>
        <div className="col-auto d-flex justify-content-center justify-content-md-end gap-3 mt-3 mt-md-0">
          <button
            className="btn btn-link p-0 text-decoration-none"
            title="Products"
            onClick={() => navigate('/products')}
            style={{ color: '#222' }}
          >
            <i className="ri-shopping-cart-line fs-5"></i>
          </button>
          <button
            className="btn btn-link p-0 text-decoration-none"
            title="User"
            onClick={() => navigate('/user')}
            style={{ color: '#222' }}
          >
            <i className="ri-user-line fs-5"></i>
          </button>
        </div>
      </div>

      {/* PROMO CODE ADVERTISEMENT */}
      <div
        className="border bg-light d-flex align-items-center justify-content-center rounded mb-5 p-4"
        style={{ minHeight: '100px', position: 'relative', fontSize: '1.25rem' }}
      >
        {promo ? (
          <div className="text-center">
            <div>
              Use <strong>{promo.code}</strong> to get <strong>₱{promo.discount} off</strong> in your shopping!
            </div>
            <div>Promo valid until {new Date(promo.endDate).toLocaleDateString()}.</div>
          </div>
        ) : (
          <div className="text-muted fst-italic">
            No current promotions available.
          </div>
        )}
      </div>

      {/* FEATURED PRODUCTS */}
      <h5 className="text-center fw-bold mb-4">FEATURED PRODUCTS</h5>
      <div className="row justify-content-center">
        {featuredProducts.map((item) => (
          <div
            key={item.id}
            className="col-md-3 col-sm-6 mb-4 d-flex justify-content-center"
          >
            <div
              className="card border-0"
              style={{
                width: '220px',
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <div
                className="bg-light d-flex align-items-center justify-content-center"
                style={{
                  height: '160px',
                  borderTopLeftRadius: '15px',
                  borderTopRightRadius: '15px',
                  overflow: 'hidden',
                }}
              >
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <span
                    className="text-muted fst-italic"
                    style={{ fontSize: '1rem' }}
                  >
                    No images available
                  </span>
                )}
              </div>
              <div className="card-body text-start">
                <h6 className="fw-semibold mb-1">{item.name}</h6>
                <p
                  className="mb-1 text-muted"
                  style={{ fontSize: '0.9rem' }}
                >
                  ₱{item.price.toFixed(2)}
                </p>
                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-dark flex-fill"
                    style={{ borderRadius: '8px' }}
                    onClick={() => navigate(`/details/${item.id}`)}
                  >
                    BUY
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
