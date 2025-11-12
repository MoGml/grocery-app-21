import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { formatEGP } from '../../utils/currency';
import { Order } from '../../types';
import './Orders.css';

const Orders: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = storedOrders.filter(
      (order: Order) => order.userId === user?.id
    );
    setOrders(userOrders.reverse()); // Show newest first
  }, [user]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'processing':
        return '#2196F3';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status: Order['status']) => {
    const statusKey = `orders.statusValues.${status}`;
    return t(statusKey);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
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
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <h2>{t('orders.noOrders')}</h2>
        <p>{t('orders.startShopping')}</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>{t('orders.title')}</h1>
        <p>{orders.length} {orders.length === 1 ? t('orders.items') : t('orders.items')}</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header-section">
              <div className="order-info">
                <h3>{t('orders.orderId')} {order.id}</h3>
                <p className="order-date">{formatDate(order.createdAt)}</p>
              </div>
              <div
                className="order-status"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {getStatusText(order.status)}
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <p className="order-item-name">{item.product.name}</p>
                    <p className="order-item-quantity">{t('cart.quantity')}: {item.quantity}</p>
                  </div>
                  <p className="order-item-price">
                    {formatEGP(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-address">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
                <span>{order.deliveryAddress}</span>
              </div>
              <div className="order-total">
                <span>{t('orders.total')}:</span>
                <span className="total-amount">{formatEGP(order.total)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
