import { useState, useCallback } from 'react';

export interface ShippingOption {
  serviceName: string;
  serviceCode: string;
  price: number;
  transitTime?: string;
  description?: string;
}

export interface ShippingCalculation {
  options: ShippingOption[];
  selectedOption: ShippingOption | null;
  isLoading: boolean;
  error: string | null;
}

export const useShippingCalculator = () => {
  const [calculation, setCalculation] = useState<ShippingCalculation>({
    options: [],
    selectedOption: null,
    isLoading: false,
    error: null
  });

  const calculateShipping = useCallback(async (
    destinationCountry: string,
    destinationProvince: string,
    destinationPostalCode: string,
    weight: number,
    originPostalCode?: string
  ) => {
    setCalculation(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/shipping/canada-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originPostalCode: originPostalCode || process.env.NEXT_PUBLIC_ORIGIN_POSTAL_CODE || 'K1A0A6',
          destinationPostalCode,
          destinationCountry,
          destinationProvince,
          weight
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const options = data.services || [];
        setCalculation({
          options,
          selectedOption: data.recommendedService || options[0] || null,
          isLoading: false,
          error: null
        });
      } else {
        throw new Error(data.error || 'Failed to calculate shipping');
      }
    } catch (error) {
      console.error('Shipping calculation error:', error);
      setCalculation(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to calculate shipping'
      }));
    }
  }, []);

  const selectShippingOption = useCallback((option: ShippingOption) => {
    setCalculation(prev => ({ ...prev, selectedOption: option }));
  }, []);

  const resetCalculation = useCallback(() => {
    setCalculation({
      options: [],
      selectedOption: null,
      isLoading: false,
      error: null
    });
  }, []);

  return {
    calculation,
    calculateShipping,
    selectShippingOption,
    resetCalculation
  };
};
