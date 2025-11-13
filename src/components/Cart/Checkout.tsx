import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { formatEGP } from '../../utils/currency';
import { Order } from '../../types';
import './Checkout.css';

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    phone: user?.phone || '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.address.trim()) {
      newErrors.address = t('checkout.address');
    }

    if (!formData.city.trim()) {
      newErrors.city = t('checkout.city');
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = t('checkout.postalCode');
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = t('checkout.phone');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate order placement
    setTimeout(() => {
      const order: Order = {
        id: `ORDER-${Date.now()}`,
        userId: user?.id || '',
        items: cart,
        total: getCartTotal() + 50, // Including delivery fee (50 EGP)
        status: 'pending',
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
        phone: formData.phone,
        createdAt: new Date().toISOString(),
      };

      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Clear cart
      clearCart();

      // Show success message
      setLoading(false);
      navigate('/order-success', { state: { order } });
    }, 2000);
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>{t('checkout.title')}</h1>
      </div>

      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h2>{t('checkout.deliveryDetails')}</h2>

            <div className="form-group">
              <label htmlFor="address">{t('checkout.address')} *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={t('checkout.addressPlaceholder')}
                disabled={loading}
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">{t('checkout.city')} *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={t('checkout.cityPlaceholder')}
                  disabled={loading}
                />
                {errors.city && <span className="error">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="postalCode">{t('checkout.postalCode')} *</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder={t('checkout.postalCodePlaceholder')}
                  disabled={loading}
                />
                {errors.postalCode && (
                  <span className="error">{errors.postalCode}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t('checkout.phone')} *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t('checkout.phonePlaceholder')}
                disabled={loading}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="notes">{t('checkout.notes')}</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder={t('checkout.notesPlaceholder')}
                rows={4}
                disabled={loading}
              />
            </div>
          </div>

          <div className="checkout-summary">
            <h2>{t('checkout.orderSummary')}</h2>

            <div className="order-items">
              {cart.map((item) => (
                <div key={item.product.packagingId} className="order-item">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>{formatEGP(item.product.priceAfterDiscount * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>{t('checkout.subtotal')}</span>
              <span>{formatEGP(getCartTotal())}</span>
            </div>

            <div className="summary-row">
              <span>{t('checkout.deliveryFee')}</span>
              <span>{formatEGP(50)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>{t('checkout.total')}</span>
              <span>{formatEGP(getCartTotal() + 50)}</span>
            </div>

            <button type="submit" className="btn-place-order" disabled={loading}>
              {loading ? t('common.loading') : t('checkout.placeOrder')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
