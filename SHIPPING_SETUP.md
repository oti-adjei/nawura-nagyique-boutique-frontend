# Canada Post Shipping Integration Setup Guide

## 🚀 Overview
This integration provides real-time shipping calculations using Canada Post's official API with automatic fallback to manual calculations if the API is unavailable.

## 📋 Prerequisites

### 1. Canada Post Developer Account
1. Visit [Canada Post Developer Portal](https://www.canadapost.ca/cpo/mc/business/productsservices/developers/services/webservices.jsf)
2. Sign up for a developer account
3. Apply for access to the Rating API
4. Get your credentials:
   - Username
   - Password  
   - Customer Number

### 2. Environment Variables
Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
# Canada Post API Configuration
CANADA_POST_USERNAME=your_username_here
CANADA_POST_PASSWORD=your_password_here
CANADA_POST_CUSTOMER_NUMBER=your_customer_number_here

# Your business postal code (where you ship from)
NEXT_PUBLIC_ORIGIN_POSTAL_CODE=K1A0A6
```

## 🔧 Features Implemented

### 1. Real-time Shipping Calculation (`/api/shipping/canada-post`)
- Integrates with Canada Post Rating API
- Calculates accurate shipping costs based on:
  - Origin and destination postal codes
  - Package weight and dimensions
  - Service type (Regular, Expedited, etc.)
- Automatic fallback to manual calculation if API fails

### 2. Enhanced Checkout Component
- Real-time shipping calculation as user enters address
- Loading states during calculation
- Weight-based pricing
- Postal code validation

### 3. Shipping Options Component
- Display multiple shipping options to customers
- Service comparison (Regular vs Expedited)
- Transit time display
- Price comparison

### 4. Product Weight Support
- Added `weight` field to Product and CartItem types
- Default weight of 500g if not specified
- Automatic weight calculation for cart totals

## 🛠 How It Works

### 1. User Experience Flow
1. Customer enters shipping address
2. System automatically calculates shipping when postal code is entered
3. Multiple shipping options displayed (if available)
4. Customer selects preferred shipping method
5. Final price includes accurate shipping cost

### 2. API Integration Flow
```
Frontend → /api/shipping/canada-post → Canada Post API → Response → Frontend
```

### 3. Fallback System
If Canada Post API fails:
- Automatically uses manual calculation
- Based on destination country/province
- Weight-based pricing
- Transparent to user

## 📦 Product Setup

### Adding Weight to Products
In your Strapi admin or product data, add a `weight` field (in grams):

```javascript
{
  "title": "Example Product",
  "price": 29.99,
  "weight": 500, // 500 grams
  // ... other fields
}
```

### Default Weights
If no weight is specified, the system uses:
- Default: 500g per item
- Minimum: 100g (Canada Post requirement)

## 🔍 Testing

### 1. Test with Mock Data
The API includes fallback calculations that work without Canada Post credentials.

### 2. Test with Canada Post Sandbox
Canada Post provides a sandbox environment for testing.

### 3. Common Test Cases
- Domestic shipping (within Canada)
- US shipping
- International shipping
- Different package weights
- Invalid postal codes

## 🚨 Error Handling

### 1. API Failures
- Automatic fallback to manual calculation
- User-friendly error messages
- Logging for debugging

### 2. Invalid Addresses
- Validation before API calls
- Clear error messages
- Graceful degradation

## 📊 Monitoring

### 1. API Usage
Monitor your Canada Post API usage in their developer portal.

### 2. Error Tracking
Check server logs for shipping calculation errors.

### 3. Performance
- API calls are cached where possible
- Loading states prevent user confusion

## 🔄 Customization

### 1. Adding New Shipping Services
Modify the API route to include additional service codes:
```javascript
const serviceCodes = ['DOM.RP', 'DOM.EP', 'DOM.XP']; // Regular, Expedited, Xpresspost
```

### 2. Custom Pricing Rules
Add business logic in the fallback calculation function.

### 3. UI Customization
Modify `ShippingOptions.tsx` to match your design system.

## 📚 References

- [Canada Post Rating API Documentation](https://www.canadapost.ca/cpo/mc/business/productsservices/developers/services/rating/default.jsf)
- [Service Codes Reference](https://www.canadapost.ca/cpo/mc/business/productsservices/developers/services/rating/ratingapi.jsf)
- [Postal Code Validation](https://www.canadapost.ca/cpo/mc/personal/postalcode/fpc.jsf)

## 🆘 Troubleshooting

### Common Issues

1. **"Canada Post credentials not configured"**
   - Check your `.env.local` file
   - Ensure variables are properly named
   - Restart your development server

2. **"Invalid postal code"**
   - Validate postal code format (A1A 1A1 for Canada)
   - Check for typos
   - Ensure destination country matches postal code format

3. **"No shipping rates returned"**
   - Check package weight (minimum 100g)
   - Verify origin postal code
   - Check service availability for destination

4. **API Rate Limits**
   - Canada Post has usage limits
   - Implement caching for repeated requests
   - Use fallback calculations during high traffic

### Getting Help
- Check Canada Post Developer Portal documentation
- Review server logs for detailed error messages
- Test with different postal codes and weights
