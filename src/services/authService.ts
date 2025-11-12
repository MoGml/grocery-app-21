import apiClient from '../config/api';

interface CheckCustomerExistResponse {
  isExist: boolean;
  userName: string;
}

interface Address {
  id: number;
  addressTag: string;
  appartmentNumber: number;
  floor: number;
  building: string;
  street: string;
  landmark: string;
  latitude: number;
  longitude: number;
  newContact: boolean;
  contactPerson: string;
  contactPersonNumber: string;
  description: string;
}

interface LoginResponse {
  customerId: number;
  wallet: number;
  points: number;
  phoneNumber: string;
  displayName: string;
  token: string;
  isExist: boolean;
  selectedAddress: Address | null;
}

export const authService = {
  // Check if customer exists
  checkCustomerExist: async (
    phoneNumber: string,
    countryCode: number
  ): Promise<CheckCustomerExistResponse> => {
    try {
      const response = await apiClient.get(
        `/customer/api/Accounts/CheckCustomerExist`,
        {
          params: {
            phoneNumber,
            countryCode,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Check customer exist error:', error);
      throw error;
    }
  },

  // Login with OTP
  login: async (
    fcmToken: string | null,
    otp: string,
    phoneNumber: string,
    countryCode: number
  ): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/customer/api/Accounts/Login', {
        fcmToken,
        otp,
        phoneNumber,
        countryCode,
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
};

export default authService;
