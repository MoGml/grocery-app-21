import React from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../../types';
import { formatEGP } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { t } = useTranslation();
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {product.stock < 10 && product.stock > 0 && (
          <span className="stock-badge low">Low Stock</span>
        )}
        {product.stock === 0 && (
          <span className="stock-badge out">Out of Stock</span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <div className="product-pricing">
            <span className="product-price">{formatEGP(product.price)}</span>
            <span className="product-unit">/ {product.unit}</span>
          </div>

          <button
            className="btn-add-cart"
            onClick={() => onAddToCart(product.id)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? t('products.outOfStock') : t('products.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
