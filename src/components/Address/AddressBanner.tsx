import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAddress } from '../../contexts/AddressContext';
import './AddressBanner.css';

const AddressBanner: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { selectedAddress, guestAddress, hasAddress } = useAddress();

  // Don't show on login page or add-address page
  const currentPath = window.location.pathname;
  if (currentPath === '/login' || currentPath === '/add-address') {
    return null;
  }

  if (!hasAddress) {
    return (
      <div className="address-banner no-address-banner">
        <div className="banner-container">
          <div className="banner-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="banner-content">
            <span className="banner-message">
              No delivery address set. Add an address to start shopping.
            </span>
          </div>
          <Link to="/add-address" className="banner-btn">
            Add Address
          </Link>
        </div>
      </div>
    );
  }

  if (isAuthenticated && selectedAddress) {
    return (
      <div className="address-banner">
        <div className="banner-container">
          <div className="banner-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="banner-content">
            <span className="banner-label">Delivering to:</span>
            <span className="banner-address">
              <strong>{selectedAddress.addressTag}</strong> - {selectedAddress.description}
            </span>
          </div>
          <Link to="/add-address" className="banner-link">
            Change
          </Link>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && guestAddress) {
    return (
      <div className="address-banner">
        <div className="banner-container">
          <div className="banner-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="banner-content">
            <span className="banner-label">Delivering to:</span>
            <span className="banner-address">
              <strong>{guestAddress.addressTag}</strong> - {guestAddress.description}
            </span>
          </div>
          <Link to="/add-address" className="banner-link">
            Change
          </Link>
        </div>
      </div>
    );
  }

  return null;
};

export default AddressBanner;
