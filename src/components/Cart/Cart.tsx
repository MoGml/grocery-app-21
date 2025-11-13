import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAddress } from '../../contexts/AddressContext';
import { formatEGP } from '../../utils/currency';
import AddressDisplay from '../Address/AddressDisplay';
import './Cart.css';

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const { hasAddress } = useAddress();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!hasAddress) {
      navigate('/add-address');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <h2>{t('cart.empty')}</h2>
        <p>{t('home.hero.cta')}</p>
        <Link to="/products" className="btn-continue-shopping">
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>{t('cart.title')}</h1>
        <p>{cart.length} {t('cart.quantity')}</p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => {
            const hasDiscount = item.product.discountPercentage > 0;
            return (
              <div key={item.product.packagingId} className="cart-item">
                <img
                  src={item.product.pictureUrl}
                  alt={item.product.name}
                  className="cart-item-image"
                />

                <div className="cart-item-details">
                  <h3>{item.product.name}</h3>
                  <div className="cart-item-price">
                    {hasDiscount ? (
                      <>
                        <span className="price-discounted">{formatEGP(item.product.priceAfterDiscount)}</span>
                        <span className="price-original">{formatEGP(item.product.price)}</span>
                      </>
                    ) : (
                      <span>{formatEGP(item.product.price)}</span>
                    )}
                    <span className="unit-text">/ {item.product.uomName}</span>
                  </div>

                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.packagingId, item.quantity - 1)
                      }
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.packagingId, item.quantity + 1)
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <p className="cart-item-total">
                    {formatEGP(item.product.priceAfterDiscount * item.quantity)}
                  </p>
                  <button
                    className="btn-remove"
                    onClick={() => removeFromCart(item.product.packagingId)}
                    aria-label="Remove item"
                  >
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
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <div className="cart-summary-card">
            {/* Delivery Address Section - Show for both logged-in and guest users */}
            <div className="delivery-address-section">
              <h3>Delivery Address</h3>
              <AddressDisplay />
            </div>

            <h2>{t('cart.orderSummary')}</h2>

            <div className="summary-row">
              <span>{t('cart.subtotal')}</span>
              <span>{formatEGP(getCartTotal())}</span>
            </div>

            <div className="summary-row">
              <span>{t('cart.deliveryFee')}</span>
              <span>{formatEGP(50)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>{t('cart.total')}</span>
              <span>{formatEGP(getCartTotal() + 50)}</span>
            </div>

            <button className="btn-checkout" onClick={handleCheckout}>
              {isAuthenticated ? t('cart.proceedToCheckout') : t('nav.login')}
            </button>

            <Link to="/products" className="btn-continue">
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
