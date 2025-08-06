"use client";

import { useEffect } from 'react';
import { useLocationStore } from '@/store/location/useLocationStore';

export default function CountryDetector() {
  const { detectUserCountry, isAutoDetected, country } = useLocationStore();

  useEffect(() => {
    // Only auto-detect on the first visit or if we're still using the default
    if (isAutoDetected === false && country.name === "United States" && country.code === "US") {
      detectUserCountry();
    }
  }, [detectUserCountry, isAutoDetected, country]);

  // This component doesn't render anything
  return null;
}
