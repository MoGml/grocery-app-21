import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

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
  const [pendingAuth, setPendingAuth] = useState<{ phone: string; name: string } | null>(null);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (phone: string, name: string) => {
    // Store pending authentication data
    setPendingAuth({ phone, name });
    // In a real app, you would send OTP to the phone number here
  };

  const verifyOTP = (otp: string): boolean => {
    // Simple OTP verification (in real app, verify with backend)
    if (otp === '1234' && pendingAuth) {
      const newUser: User = {
        id: Date.now().toString(),
        name: pendingAuth.name,
        phone: pendingAuth.phone,
        isGuest: false,
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setPendingAuth(null);
      return true;
    }
    return false;
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: `guest-${Date.now()}`,
      name: 'Guest',
      phone: '',
      isGuest: true,
    };
    setUser(guestUser);
    localStorage.setItem('user', JSON.stringify(guestUser));
  };

  const logout = () => {
    setUser(null);
    setPendingAuth(null);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null && !user.isGuest,
    isGuest: user?.isGuest || false,
    login,
    logout,
    loginAsGuest,
    verifyOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
