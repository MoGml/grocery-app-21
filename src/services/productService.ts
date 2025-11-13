import apiClient from '../config/api';
import { Category, BrowseProductsResponse } from '../types';

export const productService = {
  // Browse products by category
  browseProducts: async (params: {
    categoryId: number;
    subCategoryId?: number;
    page?: number;
    pageSize?: number;
  }): Promise<BrowseProductsResponse> => {
    try {
      const { categoryId, subCategoryId, page = 1, pageSize = 20 } = params;
      const queryParams: any = { page, pageSize };

      if (subCategoryId) {
        queryParams.subCategoryId = subCategoryId;
      }

      const response = await apiClient.get(
        `/customer/api/Catalog/${categoryId}/browse`,
        { params: queryParams }
      );
      return response.data;
    } catch (error) {
      console.error('Browse products error:', error);
      throw error;
    }
  },

  // Get categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get('/customer/api/Categories');
      // API returns { categories: [...] }, extract the categories array
      return response.data.categories || [];
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

};

export default productService;
