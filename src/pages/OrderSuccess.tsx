import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Order } from '../types';
import './OrderSuccess.css';

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const order = location.state?.order as Order | undefined;

  if (!order) {
    return (
      <div className="order-success-container">
        <div className="order-success-card">
          <h2>Order Not Found</h2>
          <Link to="/products" className="btn-primary">
            Continue Shopping
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

        <h1>Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for your order. We'll send you a confirmation shortly.
        </p>

        <div className="order-details">
          <div className="detail-row">
            <span className="detail-label">Order ID:</span>
            <span className="detail-value">{order.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total Amount:</span>
            <span className="detail-value total">${order.total.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Delivery Address:</span>
            <span className="detail-value">{order.deliveryAddress}</span>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/orders" className="btn-primary">
            View Orders
          </Link>
          <Link to="/products" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
