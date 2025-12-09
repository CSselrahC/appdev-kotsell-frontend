import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';

function HomePage({ userName }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [displayName, setDisplayName] = useState(userName);
  const navigate = useNavigate();

  // Static image files from public/designs/images/
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
    'Add files via upload',
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
    'yoshimura-exhaust.jpg'
  ];

  // Get consistent random image based on product ID (same as ProductList)
  const getProductImageSrc = (productId) => {
    const index = productId % imageFiles.length;
    return `/designs/images/${imageFiles[index]}`;
  };

  useEffect(() => {
    const customerName = localStorage.getItem('customerName');
    if (customerName) {
      setDisplayName(customerName);
    } else if (userName) {
      setDisplayName(userName);
    } else {
      setDisplayName('User');
    }
  }, [userName]);

  useEffect(() => {
    // Fetch products from API and select 4 random unique products
    productAPI.getAll()
      .then(fetchedProducts => {
        const shuffled = [...fetchedProducts].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);
        setFeaturedProducts(selected);
      })
      .catch(() => {
        setFeaturedProducts([]);
      });
  }, []);

  // Rotating advertisement messages
  const ads = [
    'Upgrade your ride with premium vehicle parts! 99+ products available',
    'Looking for car diecasts? Browse 99+ premium diecast models starting at great prices!',
    'Looking for motor accessories? We got you! Everything you need at affordable prices.'
  ];
  const [currentAd, setCurrentAd] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentAd(prev => (prev + 1) % ads.length);
    }, 10000); // 10 seconds
    return () => clearInterval(id);
  }, []);

  return (
    <div className="container mt-4">
      {/* Top Row: Welcome Banner & Buttons */}
      <div className="row align-items-center mb-4 g-3 flex-column flex-md-row">
        <div className="col-md">
          <h2 className="fw-bold mb-4">Welcome, {displayName}!</h2>
        </div>
      </div>

      {/* ROTATING ADVERTISEMENT BANNER */}
      <div className="ad-rotator border bg-light rounded mb-5 p-3">
        {ads.map((text, idx) => (
          <div
            key={idx}
            className={`ad-item d-flex flex-wrap flex-column flex-md-row align-items-center justify-content-between w-100 ${idx === currentAd ? 'active' : ''}`}
          >
            <div className="ad-text text-center text-md-start px-3 py-2 flex-fill">
              <h5 className="mb-1 fw-bold">{text}</h5>
            </div>

            <div className="px-3 py-2 d-flex align-items-center justify-content-center" style={{ minWidth: 0 }}>
            </div>
          </div>
        ))}
      </div>

      {/* FEATURED PRODUCTS */}
      <h5 className="text-center fw-bold mb-4">FEATURED PRODUCTS</h5>
      <div className="row g-3 justify-content-center">
        {featuredProducts.map((item) => (
          <div
            key={item.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
          >
            <div
              className="card border-0 w-100"
              style={{
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
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
                <img
                  src={getProductImageSrc(item.id)}
                  alt={item.name}
                  className="img-fluid"
                  style={{
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span
                  className="text-muted fst-italic"
                  style={{
                    fontSize: '1rem',
                    display: 'none'
                  }}
                >
                  No images available
                </span>
              </div>
              <div className="card-body text-start">
                <h6 className="fw-semibold mb-1 text-truncate">{item.name}</h6>
                <p className="mb-1 text-muted" style={{ fontSize: '0.9rem' }}>
                  ₱{item.price.toFixed(2)}
                </p>
                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-dark flex-fill"
                    style={{ borderRadius: '8px' }}
                    onClick={() => navigate(`/details/${item.id}`)}
                  >
                    View Product
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
