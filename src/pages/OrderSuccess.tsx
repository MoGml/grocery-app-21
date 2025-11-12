import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatEGP } from '../utils/currency';
import { Order } from '../types';
import './OrderSuccess.css';

const OrderSuccess: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const order = location.state?.order as Order | undefined;

  if (!order) {
    return (
      <div className="order-success-container">
        <div className="order-success-card">
          <h2>{t('common.error')}</h2>
          <Link to="/products" className="btn-primary">
            {t('orderSuccess.continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <div className="success-icon">
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1>{t('orderSuccess.title')}</h1>
        <p className="success-message">
          {t('orderSuccess.message')}
        </p>

        <div className="order-details">
          <div className="detail-row">
            <span className="detail-label">{t('orderSuccess.orderId')}:</span>
            <span className="detail-value">{order.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('orderSuccess.total')}:</span>
            <span className="detail-value total">{formatEGP(order.total)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('orderSuccess.deliveryAddress')}:</span>
            <span className="detail-value">{order.deliveryAddress}</span>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/orders" className="btn-primary">
            {t('orderSuccess.viewOrders')}
          </Link>
          <Link to="/products" className="btn-secondary">
            {t('orderSuccess.continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
