import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Address } from '../types';
import { getAddresses, getGuestAddress } from '../services/addressService';
import { useAuth } from './AuthContext';

interface AddressContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  guestAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  setGuestAddressData: (address: Address | null) => void;
  refreshAddresses: () => Promise<void>;
  refreshGuestAddress: () => Promise<void>;
  isLoading: boolean;
  hasAddress: boolean;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [guestAddress, setGuestAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setGuestAddressData = (address: Address | null) => {
    setGuestAddress(address);
  };

  const refreshAddresses = async () => {
    if (!isAuthenticated) {
      setAddresses([]);
      setSelectedAddress(null);
      return;
    }

    setIsLoading(true);
    try {
      const fetchedAddresses = await getAddresses();
      setAddresses(fetchedAddresses);

      // Auto-select default address or first address
      const defaultAddress = fetchedAddresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (fetchedAddresses.length > 0) {
        setSelectedAddress(fetchedAddresses[0]);
      } else {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setSelectedAddress(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshGuestAddress = async () => {
    if (isAuthenticated) {
      return;
    }

    setIsLoading(true);
    try {
      const fetchedGuestAddress = await getGuestAddress();
      setGuestAddress(fetchedGuestAddress);
    } catch (error) {
      console.error('Error fetching guest address:', error);
      setGuestAddress(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshAddresses();
      // Clear guest address when user logs in
      setGuestAddress(null);
    } else {
      setAddresses([]);
      setSelectedAddress(null);
      // Fetch guest address if not authenticated
      refreshGuestAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const hasAddress = isAuthenticated ? selectedAddress !== null : guestAddress !== null;

  const value = {
    addresses,
    selectedAddress,
    guestAddress,
    setSelectedAddress,
    setGuestAddressData,
    refreshAddresses,
    refreshGuestAddress,
    isLoading,
    hasAddress,
  };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
};

export const useAddress = (): AddressContextType => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};
