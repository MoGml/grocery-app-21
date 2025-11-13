import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAddress } from '../../contexts/AddressContext';
import './AddressDisplay.css';

interface AddressDisplayProps {
  showChangeButton?: boolean;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({ showChangeButton = true }) => {
  const { isAuthenticated } = useAuth();
  const { selectedAddress, guestAddress, hasAddress } = useAddress();

  if (!hasAddress) {
    return (
      <div className="address-display no-address">
        <div className="address-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
        <div className="address-content">
          <h3>No delivery address set</h3>
          <p>Please add a delivery address to continue</p>
          <Link to="/add-address" className="btn-add-address">
            Add Address
          </Link>
        </div>
      </div>
    );
  }

  if (isAuthenticated && selectedAddress) {
    return (
      <div className="address-display">
        <div className="address-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
        <div className="address-content">
          <div className="address-header">
            <span className="address-tag">{selectedAddress.addressTag}</span>
            {selectedAddress.isDefault && <span className="default-badge">Default</span>}
          </div>
          <p className="address-description">{selectedAddress.description}</p>
          {selectedAddress.street && (
            <p className="address-details">
              {selectedAddress.street}
              {selectedAddress.building && `, Building ${selectedAddress.building}`}
              {selectedAddress.floor !== undefined && `, Floor ${selectedAddress.floor}`}
              {selectedAddress.appartmentNumber !== undefined && `, Apt ${selectedAddress.appartmentNumber}`}
            </p>
          )}
          {selectedAddress.contactPerson && (
            <p className="address-contact">
              Contact: {selectedAddress.contactPerson}
              {selectedAddress.contactPersonNumber && ` - ${selectedAddress.contactPersonNumber}`}
            </p>
          )}
        </div>
        {showChangeButton && (
          <Link to="/add-address" className="btn-change-address">
            Change
          </Link>
        )}
      </div>
    );
  }

  if (!isAuthenticated && guestAddress) {
    return (
      <div className="address-display">
        <div className="address-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
        <div className="address-content">
          <div className="address-header">
            <span className="address-tag">{guestAddress.addressTag}</span>
            {guestAddress.isDefault && <span className="default-badge">Default</span>}
          </div>
          <p className="address-description">{guestAddress.description}</p>
        </div>
        {showChangeButton && (
          <Link to="/add-address" className="btn-change-address">
            Change
          </Link>
        )}
      </div>
    );
  }

  return null;
};

export default AddressDisplay;
