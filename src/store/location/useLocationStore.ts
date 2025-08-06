// src/store/location/useLocationStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the interface for our clean, transformed country data

interface RawApiCountry {
  name: {
    common: string;
    // Add other name properties if you use them, e.g., official, nativeName
  };
  cca2: string;
  currencies?: {
    [key: string]: { // Object where keys are currency codes (e.g., "USD", "EUR")
      name: string;
      symbol: string;
    };
  };
  flag: string; // The emoji flag
  // Add other properties if you fetch them with '?fields=' in the URL
}
export interface CountryData {
  name: string;
  code: string;
  currency: string;
  flag: string;
}

interface LocationState {
  country: CountryData;
  currency: string;
  // --- NEW: State for managing the fetched list of countries ---
  allCountries: CountryData[];
  isLoading: boolean;
  error: string | null;
  isAutoDetected: boolean; // Track if country was auto-detected
  // --- END NEW ---

  setCountryAndCurrency: (country: CountryData) => void;
  setCurrency: (currency: string) => void;
  // --- NEW: Action to fetch countries from the API ---
  fetchCountries: () => Promise<void>;
  detectUserCountry: () => Promise<void>; // Auto-detect user's country
  resetToAutoDetect: () => Promise<void>; // Reset and trigger auto-detection
  // --- END NEW ---
}

// A default country to use before data is loaded or if fetching fails
const defaultCountry: CountryData = {
  name: "United States",
  code: "US",
  currency: "USD",
  flag: "🇺🇸",
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      // --- INITIAL STATE ---
      country: defaultCountry,
      currency: defaultCountry.currency,
      allCountries: [],
      isLoading: false,
      error: null,
      isAutoDetected: false,

      // --- ACTIONS ---
      setCountryAndCurrency: (newCountry) => {
        set({
          country: newCountry,
          currency: newCountry.currency,
          isAutoDetected: false, // Manual selection overrides auto-detection
        });
      },

      setCurrency: (newCurrency) => {
        set({ currency: newCurrency });
      },

      // --- NEW: ASYNC ACTION TO FETCH DATA ---
      fetchCountries: async () => {
        // Simple caching: if we already have the data, don't fetch again.
        if (get().allCountries.length > 0) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch(
            'https://restcountries.com/v3.1/all?fields=name,cca2,currencies,flag'
          );
          if (!response.ok) {
            throw new Error('Failed to fetch country data.');
          }
          const rawData = await response.json();

          // Transform the raw API data into our clean `CountryData` format
          const transformedData = rawData
            .map((country: RawApiCountry): CountryData | null => {
              const currencyCode = Object.keys(country.currencies || {})[0];
              if (!currencyCode) return null; // Skip countries with no currency

              return {
                name: country.name.common,
                code: country.cca2,
                flag: country.flag,
                currency: currencyCode,
              };
            })
            .filter((country: CountryData | null): country is CountryData => country !== null) // Remove null entries
            .sort((a: CountryData, b: CountryData) => a.name.localeCompare(b.name)); // Sort alphabetically

          set({ allCountries: transformedData, isLoading: false });

        } catch (err) {
          console.error(err);
          set({
            error: 'Could not load country list. Please try again later.',
            isLoading: false,
          });
        }
      },

      // --- NEW: AUTO-DETECT USER'S COUNTRY ---
      detectUserCountry: async () => {
        // Only auto-detect if we haven't manually set a country
        const currentState = get();
        if (currentState.isAutoDetected === false && currentState.country !== defaultCountry) {
          return; // User has manually selected a country, don't override
        }

        try {
          const response = await fetch('/api/detect-country');
          const data = await response.json();

          if (data.country && data.country.code) {
            // Fetch all countries to find the complete data
            await get().fetchCountries();
            const allCountries = get().allCountries;
            
            // Find the detected country in our countries list
            const detectedCountry = allCountries.find(
              country => country.code === data.country.code
            );

            if (detectedCountry) {
              set({
                country: detectedCountry,
                currency: detectedCountry.currency,
                isAutoDetected: true,
              });
              console.log(`Auto-detected country: ${detectedCountry.name}`);
            }
          }
        } catch (error) {
          console.warn('Could not auto-detect country:', error);
          // Keep the default country if detection fails
        }
      },

      // --- RESET TO AUTO-DETECT ---
      resetToAutoDetect: async () => {
        // Reset to default state and trigger auto-detection
        set({
          country: defaultCountry,
          currency: defaultCountry.currency,
          isAutoDetected: false,
        });
        
        // Wait a bit for the state to update, then trigger detection
        setTimeout(() => {
          get().detectUserCountry();
        }, 100);
      },
    }),
    {
      name: 'location-storage',
      // We only want to persist the user's selection, not the entire list
      partialize: (state) => ({ 
        country: state.country, 
        currency: state.currency,
        isAutoDetected: state.isAutoDetected 
      }),
    }
  )
);