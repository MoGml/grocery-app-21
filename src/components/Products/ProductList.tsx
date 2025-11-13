import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBag } from '../../contexts/BagContext';
import { useAddress } from '../../contexts/AddressContext';
import { productService } from '../../services/productService';
import { Product, Category } from '../../types';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList: React.FC = () => {
  const { t } = useTranslation();
  const { addToBag } = useBag();
  const { hasAddress } = useAddress();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productService.getCategories();
        // Ensure data is an array
        if (Array.isArray(data)) {
          setCategories(data);
          if (data.length > 0) {
            setSelectedCategory(data[0].id);
          }
        } else {
          console.error('Categories response is not an array:', data);
          setCategories([]);
          setError('Invalid categories data received');
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        setCategories([]);
        setError('Failed to load categories');
      }
    };

    loadCategories();
  }, []);

  // Load products when category changes
  useEffect(() => {
    const loadProducts = async () => {
      if (!selectedCategory || !hasAddress) {
        setProducts([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await productService.browseProducts({
          categoryId: selectedCategory,
          subCategoryId: selectedSubCategory || undefined,
          page,
          pageSize: 20,
        });

        setProducts(response.packs);
        setTotalProducts(response.totalProducts);
      } catch (err: any) {
        console.error('Error loading products:', err);
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, selectedSubCategory, page, hasAddress]);

  const handleAddToBag = async (productId: number) => {
    const product = products.find((p) => p.packagingId === productId);
    if (product) {
      await addToBag(productId, 1);
      showToast(t('products.addedToBag'));
    }
  };

  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const selectedCategoryData = Array.isArray(categories)
    ? categories.find(c => c.id === selectedCategory)
    : undefined;

  if (!hasAddress) {
    return (
      <div className="product-list-container">
        <div className="product-header">
          <h1>{t('products.title')}</h1>
        </div>
        <div className="no-products">
          <p>{t('products.noAddress')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-header">
        <h1>{t('products.title')}</h1>
        <p>{t('home.hero.subtitle')}</p>
      </div>

      {/* Categories Filter */}
      <div className="category-filter">
        {Array.isArray(categories) && categories.map((category) => (
          <button
            key={category.id}
            className={`category-btn ${
              selectedCategory === category.id ? 'active' : ''
            }`}
            onClick={() => {
              setSelectedCategory(category.id);
              setSelectedSubCategory(null);
              setPage(1);
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Sub-Categories Filter */}
      {selectedCategoryData && Array.isArray(selectedCategoryData.subCategories) && selectedCategoryData.subCategories.length > 0 && (
        <div className="subcategory-filter">
          <button
            className={`subcategory-btn ${
              selectedSubCategory === null ? 'active' : ''
            }`}
            onClick={() => {
              setSelectedSubCategory(null);
              setPage(1);
            }}
          >
            {t('products.allSubCategories')}
          </button>
          {selectedCategoryData.subCategories.map((subCategory) => (
            <button
              key={subCategory.id}
              className={`subcategory-btn ${
                selectedSubCategory === subCategory.id ? 'active' : ''
              }`}
              onClick={() => {
                setSelectedSubCategory(subCategory.id);
                setPage(1);
              }}
            >
              {subCategory.name}
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <p>{t('products.loading')}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length === 0 ? (
        <div className="no-products">
          <p>{t('products.noProducts')}</p>
        </div>
      ) : (
        !loading && !error && (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.packagingId}
                  product={product}
                  onAddToCart={handleAddToBag}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalProducts > 20 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  {t('products.previous')}
                </button>
                <span>{t('products.page', { page, total: Math.ceil(totalProducts / 20) })}</span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(totalProducts / 20)}
                >
                  {t('products.next')}
                </button>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default ProductList;
