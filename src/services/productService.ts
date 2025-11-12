import apiClient from '../config/api';
import { Product, Category } from '../types';

interface ProductsResponse {
  products: Product[];
  total: number;
}

export const productService = {
  // Get all products
  getProducts: async (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ProductsResponse> => {
    try {
      const response = await apiClient.get('/api/products', { params });
      return response.data;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await apiClient.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  },

  // Get categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get('/customer/api/Categories');
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (query: string): Promise<ProductsResponse> => {
    try {
      const response = await apiClient.get('/api/products/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  },
};

export default productService;
