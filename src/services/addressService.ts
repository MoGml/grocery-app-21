import { apiClient } from '../config/api';
import { Address, GuestAddress, GuestAddressResponse, PaginatedAddressResponse } from '../types';

/**
 * Create a new address for logged-in users
 * Returns paginated response with all addresses including the newly created one
 */
export const createAddress = async (address: Address): Promise<PaginatedAddressResponse> => {
  const response = await apiClient.post<PaginatedAddressResponse>('/customer/api/Addresses', address);
  return response.data;
};

/**
 * Create a guest address (no authentication required)
 * Returns the created guest address details
 */
export const createGuestAddress = async (guestAddress: GuestAddress): Promise<GuestAddressResponse> => {
  const response = await apiClient.post<GuestAddressResponse>('/customer/api/Addresses/GuestAddress', guestAddress);
  return response.data;
};

/**
 * Get all addresses for logged-in user
 * Extracts and returns the data array from paginated response
 */
export const getAddresses = async (): Promise<Address[]> => {
  const response = await apiClient.get<PaginatedAddressResponse>('/customer/api/Addresses');
  return response.data.data; // Extract the data array from paginated response
};

/**
 * Get guest address (no authentication required)
 * Returns the guest's single address from paginated response
 */
export const getGuestAddress = async (): Promise<Address | null> => {
  try {
    const response = await apiClient.get<PaginatedAddressResponse>('/customer/api/Addresses/GetGuestAddress');
    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0]; // Return the first (and only) address
    }
    return null;
  } catch (error) {
    console.error('Error fetching guest address:', error);
    return null;
  }
};

/**
 * Get address by ID
 */
export const getAddressById = async (id: number): Promise<Address> => {
  const response = await apiClient.get<Address>(`/customer/api/Addresses/${id}`);
  return response.data;
};

/**
 * Update an existing address
 */
export const updateAddress = async (id: number, address: Address): Promise<Address> => {
  const response = await apiClient.put<Address>(`/customer/api/Addresses/${id}`, address);
  return response.data;
};

/**
 * Delete an address
 */
export const deleteAddress = async (id: number): Promise<void> => {
  await apiClient.delete(`/customer/api/Addresses/${id}`);
};

/**
 * Set an address as default
 */
export const setDefaultAddress = async (id: number): Promise<void> => {
  await apiClient.put(`/customer/api/Addresses/${id}/set-default`);
};

/**
 * Get address description from coordinates using Google Geocoding API
 */
export const getAddressFromCoordinates = async (
  lat: number,
  lng: number
): Promise<string> => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  );
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    return data.results[0].formatted_address;
  }

  return '';
};
