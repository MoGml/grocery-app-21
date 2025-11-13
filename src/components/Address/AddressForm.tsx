import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAddress } from '../../contexts/AddressContext';
import LocationPicker from './LocationPicker';
import { createAddress, createGuestAddress } from '../../services/addressService';
import { Address, GuestAddress, Location } from '../../types';
import { getDeviceId } from '../../utils/deviceId';
import './AddressForm.css';

interface AddressFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  redirectAfterSave?: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ onSuccess, onCancel, redirectAfterSave }) => {
  const { isAuthenticated } = useAuth();
  const { setSelectedAddress, refreshAddresses, refreshGuestAddress } = useAddress();
  const navigate = useNavigate();

  const [location, setLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    addressTag: '',
    description: '',
    street: '',
    building: '',
    floor: '',
    appartmentNumber: '',
    landmark: '',
    contactPerson: '',
    contactPersonNumber: '',
    isDefault: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationSelect = (selectedLocation: Location, address: string) => {
    setLocation(selectedLocation);
    if (address && !formData.description) {
      setFormData((prev) => ({ ...prev, description: address }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.addressTag.trim()) {
      newErrors.addressTag = 'Address tag is required (e.g., Home, Work)';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Address description is required';
    }

    if (!location) {
      newErrors.location = 'Please select a location on the map';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !location) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isAuthenticated) {
        // Create address for logged-in user
        const addressData: Address = {
          addressTag: formData.addressTag,
          description: formData.description,
          street: formData.street || undefined,
          building: formData.building || undefined,
          floor: formData.floor ? parseInt(formData.floor) : undefined,
          appartmentNumber: formData.appartmentNumber ? parseInt(formData.appartmentNumber) : undefined,
          landmark: formData.landmark || undefined,
          latitude: location.lat,
          longitude: location.lng,
          contactPerson: formData.contactPerson || undefined,
          contactPersonNumber: formData.contactPersonNumber || undefined,
          isDefault: formData.isDefault,
        };

        const response = await createAddress(addressData);

        // Find the default address or the newly created one
        const defaultAddress = response.data.find((addr) => addr.isDefault);
        const newAddress = defaultAddress || response.data[response.data.length - 1];

        // Update context with the selected address
        if (newAddress) {
          setSelectedAddress(newAddress);
        }

        // Refresh addresses to sync with backend
        await refreshAddresses();

        if (onSuccess) {
          onSuccess();
        }

        if (redirectAfterSave) {
          navigate(redirectAfterSave);
        }
      } else {
        // Create guest address
        const guestAddressData: GuestAddress = {
          fcmToken: getDeviceId(), // Using device ID as FCM token for now
          description: formData.description,
          addressTag: formData.addressTag,
          latitude: location.lat,
          longitude: location.lng,
        };

        await createGuestAddress(guestAddressData);

        // Refresh guest address to get the full Address object from backend
        await refreshGuestAddress();

        if (onSuccess) {
          onSuccess();
        }

        if (redirectAfterSave) {
          navigate(redirectAfterSave);
        }
      }
    } catch (error: any) {
      console.error('Error creating address:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save address. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <h2 className="address-form-title">
        {isAuthenticated ? 'Add New Address' : 'Set Delivery Location'}
      </h2>

      {/* Location Picker */}
      <div className="form-section">
        <label className="form-label">Select Location *</label>
        <LocationPicker onLocationSelect={handleLocationSelect} />
        {errors.location && <span className="error-message">{errors.location}</span>}
      </div>

      {/* Address Tag */}
      <div className="form-group">
        <label htmlFor="addressTag" className="form-label">
          Address Label * (e.g., Home, Work)
        </label>
        <input
          type="text"
          id="addressTag"
          name="addressTag"
          value={formData.addressTag}
          onChange={handleInputChange}
          className={`form-input ${errors.addressTag ? 'error' : ''}`}
          placeholder="Home"
        />
        {errors.addressTag && <span className="error-message">{errors.addressTag}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Address Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className={`form-textarea ${errors.description ? 'error' : ''}`}
          placeholder="Full address with details"
          rows={3}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      {/* Additional fields for logged-in users */}
      {isAuthenticated && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="street" className="form-label">
                Street
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Street name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="building" className="form-label">
                Building
              </label>
              <input
                type="text"
                id="building"
                name="building"
                value={formData.building}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Building number"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="floor" className="form-label">
                Floor
              </label>
              <input
                type="number"
                id="floor"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Floor number"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="appartmentNumber" className="form-label">
                Apartment Number
              </label>
              <input
                type="number"
                id="appartmentNumber"
                name="appartmentNumber"
                value={formData.appartmentNumber}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Apartment number"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="landmark" className="form-label">
              Landmark
            </label>
            <input
              type="text"
              id="landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Nearby landmark"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactPerson" className="form-label">
                Contact Person
              </label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Contact person name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactPersonNumber" className="form-label">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactPersonNumber"
                name="contactPersonNumber"
                value={formData.contactPersonNumber}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Contact phone number"
              />
            </div>
          </div>

          <div className="form-group-checkbox">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              className="form-checkbox"
            />
            <label htmlFor="isDefault" className="checkbox-label">
              Set as default address
            </label>
          </div>
        </>
      )}

      {errors.submit && (
        <div className="error-message-box">{errors.submit}</div>
      )}

      {/* Form Actions */}
      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-cancel"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
