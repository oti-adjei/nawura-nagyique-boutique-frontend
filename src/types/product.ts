
// types/index.ts (or define near ProductCard if only used there)
export interface Product {
    id: string | number;
    name: string; // Use 'name' consistently in your data objects
    price: number;
    imageUrl: string;
    category?: string;
    rating?: number; // Make optional if not always present
    reviewCount?: number; // Make optional
    originalPrice?: number;
    colors?: string[];
    sizes?: (string | number)[];
    thumbnails?: string[];
    description?: string;
    outOfStock?: boolean; // Include this field
    slug:string
  }
  
  export interface RelatedProduct extends Omit<Product, 'colors' | 'sizes' | 'thumbnails' | 'description' | 'reviewCount'> {
    category: string;
    // We might still have rating/originalPrice in data, just won't display them in the card
  }

  