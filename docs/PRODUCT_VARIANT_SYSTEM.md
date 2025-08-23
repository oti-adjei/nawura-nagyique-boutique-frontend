# Product Variant System Documentation

## Overview
This document outlines the implementation of the product variant system in the Nawura Nagyique Boutique e-commerce platform. The system handles both variant-based products (with specific color/size combinations) and simple products (with general stock).

## File Structure

```
├── backend/
│   ├── src/api/product/
│   │   ├── content-types/product/
│   │   │   ├── schema.json           # Product schema definition
│   │   │   └── lifecycles.js         # Automatic stock calculations
│   │   └── components/variant/
│   │       └── schema.json           # Variant component definition
└── frontend/
    ├── src/
    │   ├── types/
    │   │   ├── product.ts            # Product type definitions
    │   │   └── cart.ts              # Cart type definitions
    │   ├── components/shop/product/
    │   │   └── ProductDisplay.tsx    # Product display component
    │   └── store/cart/
    │       └── useCart.ts           # Cart state management
```

## Data Structure

### 1. Backend Schema (Strapi)

#### Product Schema
```json
{
  "attributes": {
    "title": { "type": "string" },
    "price": { "type": "decimal" },
    "availableColors": {
      "type": "json",
      "description": "List of available color options"
    },
    "sizes": {
      "type": "json",
      "description": "List of available size options"
    },
    "variants": {
      "type": "component",
      "component": "product.variant",
      "repeatable": true
    },
    "stock": {
      "type": "integer",
      "description": "Total stock (computed from variants)"
    }
  }
}
```

#### Variant Component
```json
{
  "attributes": {
    "color": { "type": "string" },
    "size": { "type": "string" },
    "stock": { "type": "integer" },
    "sku": { "type": "string" }
  }
}
```

### 2. Frontend Types

#### Product Types (`types/product.ts`)
```typescript
export interface ProductVariant {
  id: number;
  color: string;
  size: string;
  stock: number;
  sku: string;
}

export interface DisplayProduct {
  id: number;
  name: string;
  price: number;
  colors: string[];
  sizes: string[];
  variants?: {
    [key: string]: {
      stock: number;
      sku: string;
    };
  };
  totalStock: number;
  // ... other display properties
}
```

## Key Components

### 1. Product Display Component

The `ProductDisplay.tsx` component handles:
- Color and size selection
- Stock validation
- Variant availability checks
- Add to cart functionality

Key features:
```typescript
// State management
const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);

// Availability checks
const isAvailable = product.variants
  ? isVariantAvailable(product, color, size)
  : product.totalStock > 0;

// Stock tracking
const selectedVariantStock = product.variants
  ? getVariantStock(product, selectedColor, selectedSize)
  : product.totalStock;
```

### 2. Helper Functions

```typescript
// Check variant availability
export function isVariantAvailable(
  product: DisplayProduct, 
  color: string, 
  size: string
): boolean {
  return getVariantStock(product, color, size) > 0;
}

// Get stock for specific variant
export function getVariantStock(
  product: DisplayProduct, 
  color: string, 
  size: string
): number {
  return product.variants?.[`${color}-${size}`]?.stock ?? 0;
}
```

## Cart Integration

### Cart Types (`types/cart.ts`)
```typescript
export interface CartItem extends DisplayProduct {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  variantSku?: string;
}
```

### Cart Store (`store/cart/useCart.ts`)
```typescript
interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  // ... other actions
}
```

## Workflow

1. **Product Creation**
   - Admin creates product in Strapi
   - Sets available colors and sizes
   - Creates variants with specific stock levels
   - System automatically calculates total stock

2. **Frontend Display**
   - Product loads with all available colors and sizes
   - User selects color → shows available sizes for that color
   - User selects size → shows available colors for that size
   - Stock level updates based on selected variant

3. **Add to Cart**
   - System validates variant availability
   - Checks stock level for specific variant
   - Adds item with variant information to cart
   - Updates cart state with variant details

## Backward Compatibility

The system handles both variant and non-variant products:

### Variant Products
- Uses specific stock levels per color/size
- Validates availability per variant
- Stores SKU information

### Non-Variant Products
- Uses total stock level
- All colors/sizes available if in stock
- No SKU tracking

## Testing Checklist

1. **Product Display**
   - [ ] Colors and sizes load correctly
   - [ ] Stock levels display accurately
   - [ ] Unavailable combinations are disabled

2. **Variant Selection**
   - [ ] Color selection updates available sizes
   - [ ] Size selection updates available colors
   - [ ] Stock level updates with selection

3. **Cart Operations**
   - [ ] Add to cart with variants
   - [ ] Add to cart without variants
   - [ ] Stock validation works
   - [ ] Cart displays variant information

## Best Practices

1. Always check `product.variants` before accessing variant-specific features
2. Use helper functions for variant operations
3. Provide fallbacks for non-variant products
4. Validate stock before cart operations
5. Keep UI consistent between variant and non-variant products

## Future Improvements

1. Add variant-specific pricing
2. Implement variant images
3. Add bulk variant creation
4. Add variant-specific discounts
5. Implement variant analytics
