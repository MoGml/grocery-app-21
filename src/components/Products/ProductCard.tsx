import React from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../../types';
import { formatEGP } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { t } = useTranslation();
  const hasDiscount = product.discountPercentage > 0;
  const isOutOfStock = product.stockQty === 0;
  const isLowStock = product.stockQty > 0 && product.stockQty < 10;

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.pictureUrl}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {hasDiscount && (
          <span className="discount-badge">{product.discountPercentage.toFixed(0)}% OFF</span>
        )}
        {isLowStock && (
          <span className="stock-badge low">Low Stock</span>
        )}
        {isOutOfStock && (
          <span className="stock-badge out">Out of Stock</span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <div className="product-footer">
          <div className="product-pricing">
            {hasDiscount ? (
              <>
                <span className="product-price">{formatEGP(product.priceAfterDiscount)}</span>
                <span className="product-price-original">{formatEGP(product.price)}</span>
              </>
            ) : (
              <span className="product-price">{formatEGP(product.price)}</span>
            )}
            <span className="product-unit">/ {product.uomName}</span>
          </div>

          <button
            className="btn-add-cart"
            onClick={() => onAddToCart(product.packagingId)}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? t('products.outOfStock') : t('products.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
