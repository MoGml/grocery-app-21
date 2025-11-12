import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to 21</h1>
          <p className="hero-subtitle">Fresh Groceries Delivered to Your Doorstep</p>
          <p className="hero-description">
            Shop from a wide selection of quality products and enjoy fast, reliable delivery.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn-hero-primary">
              Shop Now
            </Link>
            {!user && (
              <Link to="/login" className="btn-hero-secondary">
                Sign In
              </Link>
            )}
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"
            alt="Fresh groceries"
            loading="lazy"
          />
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h3>Fast Delivery</h3>
          <p>Get your orders delivered within hours</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3>Best Prices</h3>
          <p>Competitive prices on all products</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h3>Quality Assured</h3>
          <p>Fresh and high-quality products guaranteed</p>
        </div>
      </section>

      <section className="cta">
        <h2>Start Shopping Today</h2>
        <p>Join thousands of happy customers enjoying fresh groceries delivered to their homes</p>
        <Link to="/products" className="btn-cta">
          Browse Products
        </Link>
      </section>
    </div>
  );
};

export default Home;
