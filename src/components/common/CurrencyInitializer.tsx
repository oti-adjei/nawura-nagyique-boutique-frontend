"use client";

import { useCurrencyInit } from '@/hooks/useCurrencyInit';

/**
 * Client component to initialize currency rates
 * This should be included once in your app layout
 */
export function CurrencyInitializer() {
  useCurrencyInit();
  return null; // This component doesn't render anything
}

export default CurrencyInitializer;
