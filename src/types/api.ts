import { Product } from "./product";

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

// export interface DealProduct {
//   id: number; // Add ID
//   imageUrl: string;
//   name: string;
//   price: number;
//   originalPrice?: number; // Make optional if not always present
// }

export interface LegacyContent {
  image: { // Define the structure of the imageUrl object
    url: string;
  };
  title: string;
  description: string;
  cta: string;
}

export interface PromotionalBanner {
  image: string;
  title: string;
  cta: string;
}

export interface Collection {
  id: number; // Add ID
  title: string;
  image: string;
}

export interface Feature {
  id: number; // Add ID
  title: string;
  icon: string;
}

// You might also want a type for the Hero content
export interface HeroContent {
  id: number; // Assuming it has an ID
  title: string;
  subtitle: string;
  imageUrl: string; // Rename from image for clarity? Or keep as image?
  callToActionText: string;
  callToActionUrl: string;
}


//Homepage Interface
interface Color {
  name: string;
  hex: string;
}

interface Size {
  size: string;
  inStock: boolean;
}



interface SEOMetadata {
  id: number;
  title?: string;
  description?: string;
  email?: string;
}

interface HeroSectionData {
  id: number;
  title?: string;
  subtitle?: string;
  callToActionText?: string;
  callToActionUrl?: string;
}

interface OverviewSectionData {
  id: number;
  title?: string;
  description?: string;
  cta?: string;
  ctaUrl?: string;
}

interface HomepageData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  Hero?: HeroSectionData;
  Overview?: OverviewSectionData;
  seo_metadata?: SEOMetadata;
  products?: Product[];
  localizations?: []; // You might want to define a more specific type for localizations if needed
}

// interface PaginationMeta {
//   page: number;
//   pageSize: number;
//   pageCount: number;
//   total: number;
// }

// interface CommonStrapiMeta {
//   pagination?: PaginationMeta; // Optional pagination data
//   // Add other common meta fields if you encounter them
// }


interface HomepageResponse {
  data: HomepageData | null; // 'data' can be the HomepageData object or null if the entry doesn't exist
  meta: Record<string, never>; // 'meta' is an empty object in your example, but you can be more specific if needed
  //  meta: CommonStrapiMeta; 
}

export type {
  Color,
  Size,
  // Product,
  SEOMetadata,
  HeroSectionData,
  OverviewSectionData,
  HomepageData,
  HomepageResponse,
};