import { useEffect } from 'react';
import { getExchangeRates } from '@/lib/currency';

/**
 * Hook to initialize currency rates on app startup
 * This ensures rates are cached before users need them
 */
export function useCurrencyInit() {
  useEffect(() => {
    // Pre-fetch exchange rates when app loads
    const initRates = async () => {
      try {
        await getExchangeRates();
        console.log('Exchange rates initialized successfully');
      } catch (error) {
        console.warn('Failed to initialize exchange rates:', error);
      }
    };

    initRates();

    // Set up periodic refresh (every 30 minutes)
    const interval = setInterval(async () => {
      try {
        await getExchangeRates();
        console.log('Exchange rates refreshed');
      } catch (error) {
        console.warn('Failed to refresh exchange rates:', error);
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, []);
}

/**
 * Hook to manually refresh exchange rates
 * Useful for buttons or user actions
 */
export function useRefreshRates() {
  const refreshRates = async () => {
    try {
      await fetch('/api/exchange-rates', { method: 'POST' });
      console.log('Exchange rates manually refreshed');
      return true;
    } catch (error) {
      console.error('Failed to refresh exchange rates:', error);
      return false;
    }
  };

  return { refreshRates };
}
