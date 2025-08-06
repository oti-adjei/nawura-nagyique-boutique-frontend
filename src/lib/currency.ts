// Currency conversion utility using Stripe's live exchange rates
// Falls back to static rates if API is unavailable

export interface CurrencyRates {
  [key: string]: number;
}

// Fallback rates relative to CAD (Canadian Dollar) - used if Stripe API fails
export const FALLBACK_EXCHANGE_RATES: CurrencyRates = {
  'CAD': 1.00,    // Base currency
  'USD': 0.74,    // 1 CAD = 0.74 USD
  'EUR': 0.68,    // 1 CAD = 0.68 EUR
  'GBP': 0.58,    // 1 CAD = 0.58 GBP
  'JPY': 109.50,  // 1 CAD = 109.50 JPY
  'AUD': 1.10,    // 1 CAD = 1.10 AUD
  'CHF': 0.66,    // 1 CAD = 0.66 CHF
  'CNY': 5.35,    // 1 CAD = 5.35 CNY
  'INR': 61.50,   // 1 CAD = 61.50 INR
  'BRL': 4.20,    // 1 CAD = 4.20 BRL
  'MXN': 13.50,   // 1 CAD = 13.50 MXN
  'KRW': 985.00,  // 1 CAD = 985.00 KRW
};

// Cache for exchange rates
let cachedRates: CurrencyRates | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Fetch live exchange rates from Stripe API
 * @returns Promise<CurrencyRates>
 */
async function fetchLiveExchangeRates(): Promise<CurrencyRates> {
  try {
    const response = await fetch('/api/exchange-rates', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.rates) {
      // Cache the rates
      cachedRates = data.rates;
      cacheTimestamp = Date.now();
      return data.rates;
    } else {
      throw new Error('Invalid response from exchange rates API');
    }
  } catch (error) {
    console.warn('Failed to fetch live exchange rates, using fallback:', error);
    return FALLBACK_EXCHANGE_RATES;
  }
}

/**
 * Get current exchange rates (cached or fresh)
 * @returns Promise<CurrencyRates>
 */
export async function getExchangeRates(): Promise<CurrencyRates> {
  // Check if we have valid cached rates
  const now = Date.now();
  if (cachedRates && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedRates;
  }

  // Fetch fresh rates
  return await fetchLiveExchangeRates();
}

/**
 * Get exchange rates synchronously (uses cache or fallback)
 * @returns CurrencyRates
 */
export function getExchangeRatesSync(): CurrencyRates {
  // Check if we have valid cached rates
  const now = Date.now();
  if (cachedRates && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedRates;
  }

  // Return fallback rates if no valid cache
  return FALLBACK_EXCHANGE_RATES;
}

/**
 * Convert price from CAD to target currency (with live rates)
 * @param priceInCAD - Price in Canadian dollars
 * @param targetCurrency - Target currency code (e.g., 'USD', 'EUR')
 * @returns Converted price
 */
export function convertFromCAD(priceInCAD: number, targetCurrency: string): number {
  const currency = targetCurrency.toUpperCase();
  const rates = getExchangeRatesSync();
  const rate = rates[currency];
  
  if (!rate) {
    console.warn(`Exchange rate not found for ${currency}, using CAD price`);
    return priceInCAD;
  }
  
  return priceInCAD * rate;
}

/**
 * Convert price from any currency to CAD (with live rates)
 * @param price - Price in the source currency
 * @param sourceCurrency - Source currency code
 * @returns Price in CAD
 */
export function convertToCAD(price: number, sourceCurrency: string): number {
  const currency = sourceCurrency.toUpperCase();
  const rates = getExchangeRatesSync();
  const rate = rates[currency];
  
  if (!rate) {
    console.warn(`Exchange rate not found for ${currency}, assuming CAD`);
    return price;
  }
  
  return price / rate;
}

/**
 * Format price with currency symbol
 * @param price - Numeric price
 * @param currency - Currency code
 * @param locale - Locale for formatting (defaults to 'en-CA')
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string, locale: string = 'en-CA'): string {
  try {
    const currencyCode = currency.toUpperCase();
    
    // Use CDN$ for Canadian dollars
    if (currencyCode === 'CAD') {
      return `CDN$${price.toFixed(2)}`;
    }
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  } catch (error) {
    console.warn(`Failed to format price for ${currency}:`, error);
    return `${currency.toUpperCase()} ${price.toFixed(2)}`;
  }
}

/**
 * Get currency symbol for a given currency code
 * @param currency - Currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: { [key: string]: string } = {
    'CAD': 'CDN$',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'AUD': 'A$',
    'CHF': 'CHF',
    'CNY': '¥',
    'INR': '₹',
    'BRL': 'R$',
    'MXN': '$',
    'KRW': '₩',
  };
  
  return symbols[currency.toUpperCase()] || currency.toUpperCase();
}

/**
 * Round price to appropriate decimal places for currency
 * @param price - Price to round
 * @param currency - Currency code
 * @returns Rounded price
 */
export function roundPrice(price: number, currency: string): number {
  const curr = currency.toUpperCase();
  
  // Currencies that don't use decimal places
  if (['JPY', 'KRW'].includes(curr)) {
    return Math.round(price);
  }
  
  // Most currencies use 2 decimal places
  return Math.round(price * 100) / 100;
}

/**
 * Convert and format price from CAD to target currency
 * @param priceInCAD - Price in Canadian dollars
 * @param targetCurrency - Target currency code
 * @param locale - Locale for formatting
 * @returns Formatted price string in target currency
 */
export function convertAndFormat(
  priceInCAD: number, 
  targetCurrency: string, 
  locale?: string
): string {
  // For CAD, just return the formatted price without approximation symbol
  if (targetCurrency.toUpperCase() === 'CAD') {
    return formatPrice(priceInCAD, targetCurrency, locale);
  }
  
  const convertedPrice = convertFromCAD(priceInCAD, targetCurrency);
  const roundedPrice = roundPrice(convertedPrice, targetCurrency);
  const formattedPrice = formatPrice(roundedPrice, targetCurrency, locale);
  
  // Add approximate symbol for converted currencies
  return `≈ ${formattedPrice}`;
}

// Hook for easy use in React components
export function useCurrencyConverter() {
  return {
    convertFromCAD,
    convertToCAD,
    formatPrice,
    getCurrencySymbol,
    roundPrice,
    convertAndFormat,
    getExchangeRates,
    getExchangeRatesSync,
    exchangeRates: getExchangeRatesSync(), // For backward compatibility
  };
}
