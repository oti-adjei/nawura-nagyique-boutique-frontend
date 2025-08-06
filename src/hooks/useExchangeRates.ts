import { useState, useEffect } from 'react';

interface ExchangeRates {
  [currency: string]: number;
}

// Fallback rates (CAD as base)
const FALLBACK_RATES: ExchangeRates = {
  CAD: 1,
  USD: 0.73,
  EUR: 0.68,
  GBP: 0.58,
  AUD: 1.13,
  JPY: 107.50,
  CNY: 5.30,
  INR: 61.20,
  BRL: 3.85,
  MXN: 12.45
};

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRates>(FALLBACK_RATES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/exchange-rates');
        if (!response.ok) {
          throw new Error(`Failed to fetch rates: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.rates) {
          setRates(data.rates);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.warn('Failed to fetch live exchange rates, using fallback:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setRates(FALLBACK_RATES);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return { rates, loading, error };
}
