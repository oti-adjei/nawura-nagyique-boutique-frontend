
// types/index.ts (or define near ProductCard if only used there)
// export interface Product {
//     id: string | number;
//     name: string; // Use 'name' consistently in your data objects
//     price: number;
//     imageUrl: string;
//     category?: string;
//     rating?: number; // Make optional if not always present
//     reviewCount?: number; // Make optional
//     originalPrice?: number;
//     colors?: string[];
//     sizes?: (string | number)[];
//     thumbnails?: string[];
//     description?: string;
//     outOfStock?: boolean; // Include this field
//     slug:string
//   }
  
//   export interface RelatedProduct extends Omit<Product, 'colors' | 'sizes' | 'thumbnails' | 'description' | 'reviewCount'> {
//     category: string;
//     // We might still have rating/originalPrice in data, just won't display them in the card
//   }

  // ---------- Dependent Types ----------
export interface Color {
  id: number;
  name: string;
  hexCode?: string;
}

export interface Size {
  id: number;
  name: string | number;
}

export interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

export interface ProductImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}


export interface StrapiImageFormat {
  url: string;
  width?: number;
  height?: number;
}

export interface StrapiImage {
  id: number;
  url: string;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
}

  //  ---------- Raw Product from API ----------
export interface ProductVariant {
  id: number;
  color: string;
  size: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: number;
  documentId: string;
  title: string;
  description: string;
  price: number;
  weight?: number; // Weight in grams for shipping calculation
  availableColors?: string[]; // Now just strings from variants
  tags?: string[]; // Optional: if you want to display categories
  category?: string;
  sizes?: string[]; // Now just strings from variants
  variants?: ProductVariant[]; // Optional for backward compatibility
  stock?: number; // Total stock (computed from variants or direct value)
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  slug: string;
  images: ProductImage[];
  // imageUrl: StrapiImage[];
}

// ---------- UI Display Product ----------
export interface DisplayProduct {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  weight?: number; // Weight in grams for shipping calculation
  imageUrl: string; // Main image (can be first one or preferred size)
  allImages: string[]; // NEW: All image URLs (e.g., medium or original)
  category?: string;
  rating?: number;
  reviewCount?: number;
  colors: string[]; // Available colors from variants
  tags?: string[]; // Optional: if you want to display categories
  sizes: string[]; // Available sizes from variants
  thumbnails?: string[];
  description?: string;
  outOfStock?: boolean;
  slug: string;
  variants: {
    [key: string]: {
      stock: number;
      sku: string;
    };
  };
  totalStock: number;
}

// ---------- Related Product ----------
// export type RelatedProduct = Omit<
//   DisplayProduct,
//   'colors' | 'sizes' | 'thumbnails' | 'description' | 'reviewCount'
// > & {
//   category: string;
// };

// ---------- Mapping Helper ----------
export function toDisplayProduct(product: Product): DisplayProduct {
  const getImageUrl = (img?: ProductImage) => // Make img optional
    img?.formats?.medium?.url ?? img?.url ?? ''; // Add empty string fallback

  const getThumbnailUrl = (img?: ProductImage) => // Make img optional
    img?.formats?.thumbnail?.url ?? img?.url ?? ''; // Add empty string fallback

  const images = product.images ?? [];

  // Determine the main image URL safely
  const mainImageUrl = images.length > 0 ? getImageUrl(images[0]) : '';

  // Create variant map for easy lookup with fallback for old data structure
  const variantMap = (product.variants ?? []).reduce((acc, variant) => {
    const key = `${variant.color}-${variant.size}`;
    acc[key] = {
      stock: variant.stock,
      sku: variant.sku
    };
    return acc;
  }, {} as DisplayProduct['variants']);

  // Calculate total stock from variants or use the product stock field for backward compatibility
  const totalStock = product.variants 
    ? product.variants.reduce((total, variant) => total + variant.stock, 0)
    : (product.stock ?? 0);

  return {
    id: product.id,
    name: product.title,
    price: product.price,
    imageUrl: mainImageUrl, // first image as main
    allImages: product.images?.map(getImageUrl) ?? [],
    thumbnails: product.images?.map(getThumbnailUrl) ?? [],
    slug: product.slug,
    outOfStock: totalStock <= 0,
    description: product.description,
    colors: product.availableColors ?? [],
    sizes: product.sizes ?? [],
    category: product.category,
    tags: product.tags,
    variants: variantMap,
    totalStock
  };
}

// Helper functions for variant operations
export function getVariantStock(product: DisplayProduct, color: string, size: string): number {
  return product.variants[`${color}-${size}`]?.stock ?? 0;
}

export function isVariantAvailable(product: DisplayProduct, color: string, size: string): boolean {
  return getVariantStock(product, color, size) > 0;
}

export function getVariantSku(product: DisplayProduct, color: string, size: string): string | undefined {
  return product.variants[`${color}-${size}`]?.sku;
}

// Get all available colors for a specific size
export function getAvailableColorsForSize(product: DisplayProduct, size: string): string[] {
  return product.colors.filter(color => isVariantAvailable(product, color, size));
}

// Get all available sizes for a specific color
export function getAvailableSizesForColor(product: DisplayProduct, color: string): string[] {
  return product.sizes.filter(size => isVariantAvailable(product, color, size));
}

// ---------- Optional: Type Guard ----------
// export function isDisplayProduct(obj: any): obj is DisplayProduct {
//   return (
//     obj &&
//     typeof obj.id !== 'undefined' &&
//     typeof obj.name === 'string' &&
//     typeof obj.price === 'number' &&
//     typeof obj.slug === 'string'
//   );
// }

export function generateSKU(
  productName: string,
  color: string,
  size: string
): string {
  // Convert product name to uppercase acronym
  const nameAcronym = productName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();

  // Convert color to uppercase, take first 3 letters
  const colorCode = color.slice(0, 3).toUpperCase();

  // Size code (if numeric, pad with zeros)
  const sizeCode = isNaN(Number(size)) 
    ? size.slice(0, 2).toUpperCase() 
    : size.padStart(2, '0');

  return `${nameAcronym}-${colorCode}-${sizeCode}`;
}

export function isDisplayProduct(obj: unknown): obj is DisplayProduct {
  // First, check if obj is an object and not null
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  // Cast to an intermediate type to allow property access for checks
  // This is safe because we're only reading properties for type narrowing
  const potentialProduct = obj as Partial<DisplayProduct>;

  return (
    typeof potentialProduct.id !== 'undefined' &&
    (typeof potentialProduct.id === 'number' || typeof potentialProduct.id === 'string') &&
    typeof potentialProduct.name === 'string' &&
    typeof potentialProduct.price === 'number' &&
    typeof potentialProduct.imageUrl === 'string' && // Add check for imageUrl, as it's required
    Array.isArray(potentialProduct.allImages) && // Add check for allImages
    typeof potentialProduct.slug === 'string'
    // You might want to add more checks here for required properties
  );
}