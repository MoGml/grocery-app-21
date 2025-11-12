import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import authService from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const checkCustomerExist = async (
    phoneNumber: string,
    countryCode: number
  ): Promise<{ isExist: boolean; userName: string }> => {
    try {
      const response = await authService.checkCustomerExist(phoneNumber, countryCode);
      return response;
    } catch (error) {
      console.error('Check customer exist error:', error);
      throw error;
    }
  };

  const verifyOTP = async (
    otp: string,
    phoneNumber: string,
    countryCode: number
  ): Promise<boolean> => {
    try {
      const response = await authService.login(null, otp, phoneNumber, countryCode);

      // Create user object from response
      const newUser: User = {
        id: response.customerId.toString(),
        name: response.displayName,
        phone: response.phoneNumber,
        token: response.token,
        countryCode: countryCode,
        isGuest: false,
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Verify OTP error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null && !user.isGuest,
    checkCustomerExist,
    verifyOTP,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
