import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddressForm from '../components/Address/AddressForm';
import './AddAddress.css';

const AddAddress: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigate to checkout after saving address
    navigate('/checkout');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="add-address-page">
      <div className="page-container">
        <AddressForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default AddAddress;
