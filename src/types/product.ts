
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
  provider_metadata: any;
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
export interface Product {
  id: number;
  documentId: string;
  title: string;
  description: string;
  price: number;
  availableColors?: Color[];
  sizes?: Size[];
  stock: number;
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
  imageUrl: string; // Main image (can be first one or preferred size)
  allImages: string[]; // NEW: All image URLs (e.g., medium or original)
  category?: string;
  rating?: number;
  reviewCount?: number;
  colors?: string[];
  sizes?: (string | number)[];
  thumbnails?: string[];
  description?: string;
  outOfStock?: boolean;
  slug: string;
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

  return {
    id: product.id,
    name: product.title,
    price: product.price,
    imageUrl: mainImageUrl, // first image as main
    allImages: product.images?.map(getImageUrl) ?? [],
    thumbnails: product.images?.map(getThumbnailUrl) ?? [],
    slug: product.slug,
    outOfStock: product.stock <= 0,
    description: product.description,
    colors: product.availableColors?.map((c) => c.name),
    sizes: product.sizes?.map((s) => s.name),
  };
}

// ---------- Optional: Type Guard ----------
export function isDisplayProduct(obj: any): obj is DisplayProduct {
  return (
    obj &&
    typeof obj.id !== 'undefined' &&
    typeof obj.name === 'string' &&
    typeof obj.price === 'number' &&
    typeof obj.slug === 'string'
  );
}