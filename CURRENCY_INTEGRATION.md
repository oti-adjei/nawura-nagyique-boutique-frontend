# Currency Integration Guide

## 🌍 Overview
Your application now supports multi-currency display with automatic conversion from Canadian Dollars (CAD) as the base currency.

## 🔧 How It Works

### 1. Currency Selection
- Users select their country in the header
- This automatically sets the currency based on the country
- Currency is stored in the location store (`useLocationStore`)

### 2. Price Display
- All prices are stored in CAD (Canadian Dollars) in the database
- Prices are converted to the user's selected currency for display
- Conversion happens using the `convertAndFormat()` function

### 3. Payment Processing
- The selected currency is passed to Stripe
- Stripe handles the actual payment in the customer's currency
- Canada Post shipping rates are calculated and converted

## 💱 Exchange Rates

The system uses static exchange rates defined in `/src/lib/currency.ts`:

```typescript
export const EXCHANGE_RATES: CurrencyRates = {
  'CAD': 1.00,    // Base currency
  'USD': 0.74,    // 1 CAD = 0.74 USD
  'EUR': 0.68,    // 1 CAD = 0.68 EUR
  'GBP': 0.58,    // 1 CAD = 0.58 GBP
  // ... more currencies
};
```

### 🔄 Using Live Exchange Rates (Recommended for Production)

For production, consider integrating with a live exchange rate API:

```typescript
// Example with exchangerate-api.com
const fetchLiveRates = async () => {
  const response = await fetch('https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/CAD');
  const data = await response.json();
  return data.conversion_rates;
};
```

## 🛠 Adding Currency Support to New Components

### 1. Import Required Functions
```typescript
import { useLocationStore } from '@/store/location/useLocationStore';
import { convertAndFormat } from '@/lib/currency';
```

### 2. Get Currency in Component
```typescript
const { currency } = useLocationStore();
```

### 3. Display Prices
```typescript
// Instead of: ${price.toFixed(2)}
// Use: {convertAndFormat(price, currency)}

<span>{convertAndFormat(29.99, currency)}</span>
// Displays: C$29.99 (CAD), $22.19 (USD), €20.39 (EUR), etc.
```

## 📱 Components Updated

### ✅ Already Updated
- ✅ **Header**: Currency selector
- ✅ **OrderSummary**: All price displays
- ✅ **PayBill**: Passes currency to Stripe
- ✅ **PayPalBill**: Passes currency to payment
- ✅ **CheckoutClient**: Uses location store

### 🔄 Need Updates (Examples)
- **ProductCard**: Product listing prices
- **Cart**: Cart item prices
- **ProductDetail**: Individual product prices

### Example: Updating ProductCard
```typescript
// Before
<span className="price">${product.price.toFixed(2)}</span>

// After
import { useLocationStore } from '@/store/location/useLocationStore';
import { convertAndFormat } from '@/lib/currency';

const { currency } = useLocationStore();
<span className="price">{convertAndFormat(product.price, currency)}</span>
```

## 🎯 Benefits

1. **Localized Experience**: Customers see prices in their local currency
2. **Accurate Payments**: Stripe processes payments in the correct currency
3. **Global Reach**: Support for 12+ major currencies
4. **Consistent UX**: Currency changes throughout the entire application

## 🔍 Testing

### Test Currency Conversion
1. Change country in header
2. Verify prices update throughout the app
3. Complete a test purchase
4. Check Stripe dashboard for correct currency

### Supported Currencies
- 🇨🇦 CAD (Canadian Dollar) - Base
- 🇺🇸 USD (US Dollar)
- 🇪🇺 EUR (Euro)
- 🇬🇧 GBP (British Pound)
- 🇯🇵 JPY (Japanese Yen)
- 🇦🇺 AUD (Australian Dollar)
- 🇨🇭 CHF (Swiss Franc)
- 🇨🇳 CNY (Chinese Yuan)
- 🇮🇳 INR (Indian Rupee)
- 🇧🇷 BRL (Brazilian Real)
- 🇲🇽 MXN (Mexican Peso)
- 🇰🇷 KRW (South Korean Won)

## 🚀 Next Steps

1. **Update remaining components** with currency support
2. **Consider live exchange rates** for production
3. **Add currency preference** to user accounts
4. **Test thoroughly** with different currencies
5. **Monitor conversion accuracy** and update rates regularly
