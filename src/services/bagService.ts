import { apiClient } from '../config/api';
import { Bag, MutateBagRequest } from '../types';

/**
 * Get customer's bag details
 * Returns bag with express and tomorrow items
 */
export const getBag = async (): Promise<Bag> => {
  const response = await apiClient.get<Bag>('/customer/api/Bags');
  return response.data;
};

/**
 * Add, update, or remove item from bag
 * - Set quantity to 0 to remove item
 * - Returns updated bag details
 */
export const mutateBag = async (request: MutateBagRequest): Promise<Bag> => {
  const response = await apiClient.post<Bag>('/customer/api/Bags/MutateBag', request);
  return response.data;
};

export const bagService = {
  getBag,
  mutateBag,
};

export default bagService;
