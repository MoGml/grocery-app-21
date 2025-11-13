import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { Bag, BagContextType } from '../types';
import { bagService } from '../services/bagService';
import { useAuth } from './AuthContext';

const BagContext = createContext<BagContextType | undefined>(undefined);

export const useBag = () => {
  const context = useContext(BagContext);
  if (!context) {
    throw new Error('useBag must be used within a BagProvider');
  }
  return context;
};

interface BagProviderProps {
  children: ReactNode;
}

export const BagProvider: React.FC<BagProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [bag, setBag] = useState<Bag | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce timer ref
  const debounceTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Load bag when user is authenticated
  const refreshBag = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setBag(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bagData = await bagService.getBag();
      setBag(bagData);
    } catch (err: any) {
      console.error('Error loading bag:', err);
      setError(err.response?.data?.message || 'Failed to load bag');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Load bag on mount and when auth changes
  useEffect(() => {
    refreshBag();
  }, [refreshBag]);

  // Debounced mutate function
  const debouncedMutate = useCallback(
    async (packagingId: number, quantity: number, comment: string = '') => {
      // Clear existing timer for this packagingId
      const existingTimer = debounceTimers.current.get(packagingId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Set new timer
      const timer = setTimeout(async () => {
        try {
          const updatedBag = await bagService.mutateBag({
            packgingId: packagingId,
            quantity,
            comment,
          });
          setBag(updatedBag);
          setError(null);
        } catch (err: any) {
          console.error('Error mutating bag:', err);
          setError(err.response?.data?.message || 'Failed to update bag');
          // Refresh bag to get correct state
          await refreshBag();
        } finally {
          debounceTimers.current.delete(packagingId);
        }
      }, 1000); // 1 second debounce

      debounceTimers.current.set(packagingId, timer);
    },
    [refreshBag]
  );

  const addToBag = useCallback(
    async (packagingId: number, quantity: number, comment: string = '') => {
      if (!isAuthenticated) {
        setError('Please login to add items to bag');
        return;
      }

      // Find existing item quantity
      const existingItem =
        bag?.expressBagItems.find(item => item.packId === packagingId) ||
        bag?.tomorrowBagItems.find(item => item.packId === packagingId);

      const currentQty = existingItem?.bagQty || 0;
      const newQty = currentQty + quantity;

      await debouncedMutate(packagingId, newQty, comment);
    },
    [bag, isAuthenticated, debouncedMutate]
  );

  const updateBagItem = useCallback(
    async (packagingId: number, quantity: number, comment: string = '') => {
      if (!isAuthenticated) {
        setError('Please login to update bag');
        return;
      }

      // Ensure quantity is not negative
      if (quantity < 0) {
        console.warn('Quantity cannot be negative');
        return;
      }

      await debouncedMutate(packagingId, quantity, comment);
    },
    [isAuthenticated, debouncedMutate]
  );

  const removeFromBag = useCallback(
    async (packagingId: number) => {
      if (!isAuthenticated) {
        setError('Please login to remove items from bag');
        return;
      }

      await debouncedMutate(packagingId, 0, '');
    },
    [isAuthenticated, debouncedMutate]
  );

  const getBagTotal = useCallback(() => {
    if (!bag) return 0;
    return bag.bagSubTotal;
  }, [bag]);

  const getBagCount = useCallback(() => {
    if (!bag) return 0;

    const expressCount = bag.expressBagItems.reduce((sum, item) => sum + item.bagQty, 0);
    const tomorrowCount = bag.tomorrowBagItems.reduce((sum, item) => sum + item.bagQty, 0);

    return expressCount + tomorrowCount;
  }, [bag]);

  const value: BagContextType = {
    bag,
    loading,
    error,
    addToBag,
    updateBagItem,
    removeFromBag,
    refreshBag,
    getBagTotal,
    getBagCount,
  };

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
};
