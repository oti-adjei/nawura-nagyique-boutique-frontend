import type {
  DealProduct,
  // LegacyContent,
  PromotionalBanner,
  Collection,
  Feature,
  Category, // Assuming Category is defined
  // HeroContent // Assuming HeroContent is defined
} from '@/types/api'; // Adjust path as needed

import type { Product, ProductImage } from '@/types/product';
import fetchStrapi from './utils';




export async function getHomepageContent(): Promise<any> {
  try {
    const data = await fetchStrapi('homepage?populate[Hero][populate]=imageUrl&populate[Overview][populate]=image&populate[seo_metadata][populate]&populate[products][populate]');
    console.log("API hitting about is " + JSON.stringify(data));

    const attributes = data?.data; // Adjusted based on your previous response structure

    if (!attributes) {
      console.warn("Homepage content data received from Strapi is not in the expected format.");
      return null; // Or handle this case as needed
    }

    return data; // Return the entire data object since your content is directly under 'data'
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    throw error; // Re-throw the error for the calling component to handle
  }
}

export async function fetchAboutPage(): Promise<any> {
  try {
    const data = await fetchStrapi('about?populate=*');
    console.log("API hitting about is " + JSON.stringify(data));

    const attributes = data?.data; // Adjusted based on your previous response structure

    if (!attributes) {
      console.warn("Aboutpage content data received from Strapi is not in the expected format.");
      return null; // Or handle this case as needed
    }

    return data; // Return the entire data object since your content is directly under 'data'
  } catch (error) {
    console.error("Error fetching About Page content:", error);
    throw error; // Re-throw the error for the calling component to handle
  }

}



// export async function getHeroContent(): Promise<HeroContent> {
//   console.log("Fetching Hero Content...");
//   /*
//   // UNCOMMENT THIS BLOCK TO FETCH FROM STRAPI
//   if (!STRAPI_URL) throw new Error("Strapi URL not configured.");
//   const endpoint = `${STRAPI_URL}/hero-content?populate=image`; // Adjust field name if needed

//   try {
//       const res = await fetch(endpoint); // Add headers if auth needed
//       if (!res.ok) throw new Error(`Failed to fetch hero content: ${res.statusText}`);
//       const data = await res.json();
//       const attributes = data?.data?.attributes;

//       if (!attributes) throw new Error("Hero content data received from Strapi is not in expected format.");

//       return {
//           id: data.data.id,
//           title: attributes.title,
//           subtitle: attributes.subtitle,
//           imageUrl: attributes.image?.data?.attributes?.url || '/placeholder-hero.jpg', // Adjust image field name
//           callToActionText: attributes.callToActionText,
//           callToActionUrl: attributes.callToActionUrl,
//       };
//   } catch (error) {
//       console.error("Error fetching hero content:", error);
//       throw error; // Re-throw error or handle differently
//   }
//   */

//   // --- DELETE THIS DUMMY DATA RETURN WHEN USING STRAPI ---
//   return {
//     id: 1,
//     title: "Dummy Hero Title",
//     subtitle: "Dummy hero subtitle.",
//     imageUrl: "/hero-banner.jpg",
//     callToActionText: "Shop Now",
//     callToActionUrl: "/products"
//   };
// }


export async function getCategories(): Promise<Category[]> {
  console.log("Fetching Categories...");
  /*
  // UNCOMMENT THIS BLOCK TO FETCH FROM STRAPI
  if (!STRAPI_URL) throw new Error("Strapi URL not configured.");
  const endpoint = `${STRAPI_URL}/categories?populate=icon`;
 
  try {
    const res = await fetch(endpoint); // Add headers if auth needed
    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);
    const data = await res.json();
 
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Categories data received from Strapi is not in expected format.");
    }
 
    return data.data.map((category: any): Category => ({
      id: category.id,
      name: category.attributes.name,
      slug: category.attributes.slug,
      icon: category.attributes.icon?.data?.attributes?.url || '/placeholder-icon.png',
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; // Re-throw error or handle differently
  }
  */

  // --- DELETE THIS DUMMY DATA RETURN WHEN USING STRAPI ---
  return [
    { id: 1, name: "Clothing", slug: "clothing", icon: "/icons/clothing.svg" },
    { id: 2, name: "Accessories", slug: "accessories", icon: "/icons/accessories.svg" },
    { id: 3, name: "Shoes", slug: "shoes", icon: "/icons/shoes.svg" },
    { id: 4, name: "Bags", slug: "bags", icon: "/icons/bags.svg" },
    { id: 5, name: "Jewelry", slug: "jewelry", icon: "/icons/jewelry.svg" },
  ];
}


export async function getNewArrivals(): Promise<Product[]> {
  console.log("Fetching New Arrivals...");

   try {
    const data = await fetchStrapi('products?populate=*&sort=publishedAt:desc&pagination[limit]=5');
    console.log("API hitting about is " + JSON.stringify(data));

    const attributes = data?.data; // Adjusted based on your previous response structure

    if (!attributes) {
      console.warn("Homepage content data received from Strapi is not in the expected format.");
      return []; // Or handle this case as needed
    }

    return attributes; // Return the entire data object since your content is directly under 'data'
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    throw error; // Re-throw the error for the calling component to handle
  }

  
}


// export async function getLegacyContent(): Promise<LegacyContent> {
//   console.log("Fetching Legacy Content...");
//   /*
//   // UNCOMMENT THIS BLOCK TO FETCH FROM STRAPI
//   if (!STRAPI_URL) throw new Error("Strapi URL not configured.");
//   const endpoint = `${STRAPI_URL}/legacy-content?populate=image`;

//   try {
//     const res = await fetch(endpoint); // Add headers if auth needed
//     if (!res.ok) throw new Error(`Failed to fetch legacy content: ${res.statusText}`);
//     const data = await res.json();
//     const attributes = data?.data?.attributes;

//     if (!attributes) throw new Error("Legacy content data received from Strapi is not in expected format.");

//     return {
//       title: attributes.title,
//       description: attributes.description,
//       cta: attributes.cta,
//       image: attributes.image?.data?.attributes?.url || '/placeholder-legacy.jpg',
//     };
//   } catch (error) {
//     console.error("Error fetching legacy content:", error);
//     throw error; // Re-throw error or handle differently
//   }
//   */

//   // --- DELETE THIS DUMMY DATA RETURN WHEN USING STRAPI ---
//   // return {
//   //   // image: '/legacy.jpg',
//   //   title: 'A Legacy of Light',
//   //   description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, animi!',
//   //   cta: 'Shop Legacy Now',
//   // };
// }


export async function getDeals() {
   try {
   const data = await fetchStrapi('products?filters[isFeatured][$eq]=true&populate=*');
    console.log("API hitting about is " + JSON.stringify(data));

    const attributes = data?.data; // Adjusted based on your previous response structure

    if (!attributes) {
      console.warn("Homepage content data received from Strapi is not in the expected format.");
      return null; // Or handle this case as needed
    }

    return attributes; // Return the entire data object since your content is directly under 'data'

  } catch (error) {
    console.error("Error fetching Product/Shop content:", error);
    throw error; // Re-throw the error for the calling component to handle
  }
}


export async function getPromotionalBanner(): Promise<PromotionalBanner> {
  console.log("Fetching Promotional Banner...");
  /*
  // UNCOMMENT THIS BLOCK TO FETCH FROM STRAPI
  if (!STRAPI_URL) throw new Error("Strapi URL not configured.");
  const endpoint = `${STRAPI_URL}/promo-banner?populate=image`;
 
  try {
    const res = await fetch(endpoint); // Add headers if auth needed
    if (!res.ok) throw new Error(`Failed to fetch promo banner: ${res.statusText}`);
    const data = await res.json();
    const attributes = data?.data?.attributes;
 
    if (!attributes) throw new Error("Promo banner data received from Strapi is not in expected format.");
 
    return {
      title: attributes.title,
      cta: attributes.cta,
      image: attributes.image?.data?.attributes?.url || '/placeholder-promo.jpg',
    };
  } catch (error) {
    console.error("Error fetching promotional banner:", error);
    throw error; // Re-throw error or handle differently
  }
  */

  // --- DELETE THIS DUMMY DATA RETURN WHEN USING STRAPI ---
  return {
    image: '/promo-banner.jpg',
    title: 'Latest Exclusive Summer Collection',
    cta: 'Explore Summer',
  };
}


export async function getCollections(): Promise<Collection[]> {
  console.log("Fetching Collections...");
  /*
  // UNCOMMENT THIS BLOCK TO FETCH FROM STRAPI
  if (!STRAPI_URL) throw new Error("Strapi URL not configured.");
  const endpoint = `${STRAPI_URL}/collections?populate=image`;
 
  try {
    const res = await fetch(endpoint); // Add headers if auth needed
    if (!res.ok) throw new Error(`Failed to fetch collections: ${res.statusText}`);
    const data = await res.json();
 
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Collections data received from Strapi is not in expected format.");
    }
 
    return data.data.map((item: any): Collection => ({
      id: item.id,
      title: item.attributes.title,
      image: item.attributes.image?.data?.attributes?.url || `/placeholder-collection.jpg`,
    }));
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error; // Re-throw error or handle differently
  }
  */

  // --- DELETE THIS DUMMY DATA RETURN WHEN USING STRAPI ---
  return [
    { id: 301, title: "Women’s Collection", image: '/uploads/women_fe7af95179.png' },
    { id: 302, title: "Kid’s Collection", image: '/collections/kids.jpg' },
    { id: 303, title: "Men’s Collection", image: '/collections/men.jpg' },
  ];
}


export async function getFeatures(): Promise<Feature[]> {
  console.log("Fetching Features...");
  /*
  // UNCOMMENT THIS BLOCK TO FETCH FROM STRAPI
  if (!STRAPI_URL) throw new Error("Strapi URL not configured.");
  const endpoint = `${STRAPI_URL}/features?populate=icon`;
 
  try {
    const res = await fetch(endpoint); // Add headers if auth needed
    if (!res.ok) throw new Error(`Failed to fetch features: ${res.statusText}`);
    const data = await res.json();
 
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Features data received from Strapi is not in expected format.");
    }
 
    return data.data.map((item: any): Feature => ({
      id: item.id,
      title: item.attributes.title,
      icon: item.attributes.icon?.data?.attributes?.url || `/placeholder-feature.png`,
    }));
  } catch (error) {
    console.error("Error fetching features:", error);
    throw error; // Re-throw error or handle differently
  }
  */

  // --- DELETE THIS DUMMY DATA RETURN WHEN USING STRAPI ---
  return [
    { id: 401, title: 'Free Shipping', icon: '/icons/free-shipping.png' },
    { id: 402, title: '24x7 Support', icon: '/icons/support.png' },
    { id: 403, title: '30 Days Return', icon: '/icons/return.png' },
    { id: 404, title: 'Payment Secure', icon: '/icons/secure.png' },
  ];
}

export async function getProducts() {

  try {
    const data = await fetchStrapi('products?populate=*');
    console.log("API hitting about is " + JSON.stringify(data));

    const attributes = data?.data; // Adjusted based on your previous response structure

    if (!attributes) {
      console.warn("Homepage content data received from Strapi is not in the expected format.");
      return null; // Or handle this case as needed
    }

    return attributes; // Return the entire data object since your content is directly under 'data'

  } catch (error) {
    console.error("Error fetching Product/Shop content:", error);
    throw error; // Re-throw the error for the calling component to handle
  }


  // actual format 
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/products?populate=*`);
  const data = await res.json();

  return data.data.map((product: any) => ({
    id: product.id,
    name: product.attributes.title,
    price: product.attributes.price,
    imageUrl: product.attributes.image?.data?.attributes?.url || '/placeholder.png',
    inStock: product.attributes.inStock,
  }));
}


// lib/data.ts (or wherever your fetch function lives)

// --- Define Dummy Data ---
// id: 'dummy-prod-123',
// const DUMMY_PRODUCT: Product = {
//   id: 123,
//   name: 'Dummy Grey Joggers (Offline)',
//   imageUrl: '/placeholder-jogger-main.jpg', // Use placeholders
//   thumbnails: [
//     '/placeholder-jogger-thumb1.jpg',
//     '/placeholder-jogger-thumb2.jpg',
//     '/placeholder-jogger-thumb3.jpg',
//   ],
//   rating: 4.2,
//   reviewCount: 99,
//   price: 199.99,
//   originalPrice: 250.00,
//   colors: ['Grey', 'Black'],
//   sizes: [6, 8, 10, 12, 14, 16],
//   description: "This is dummy data for viewing the product page layout while the API is unavailable.",
//   slug: '/tee'
//   // Add any other fields your ProductDisplay expects
// };

// --- Your Fetch Function ---
export async function getProductBySlug(slug: string): Promise<Product | null> {
  console.log(`Attempting to fetch product for slug: ${slug} (USING DUMMY DATA)`);


  try {
    const data = await fetchStrapi(`products/${slug}?populate=*`);
    // console.log("API hitting about is " + JSON.stringify(data));

    const attributes = data?.data; // Adjusted based on your previous response structure

    if (!attributes) {
      console.warn("Product content data received from Strapi is not in the expected format.");
      return null; // Or handle this case as needed
    }

    console.log("API slug  is " + JSON.stringify(attributes));

    return attributes; // Return the entire data object since your content is directly under 'data'
  } catch (error) {
    console.error("Error fetching Product content:", error);
    throw error; // Re-throw the error for the calling component to handle
  }
  /*
  // --- UNCOMMENT THIS WHEN API IS READY ---
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!STRAPI_URL) {
    console.error("Strapi URL not configured.");
    return null; // Or throw error
  }

  try {
    // Example Strapi endpoint - ADJUST AS NEEDED
    const endpoint = `${STRAPI_URL}/products?filters[slug][$eq]=${slug}&populate=image,thumbnails,colors,sizes`; // Adjust populate as needed
    const res = await fetch(endpoint); // Add auth headers if needed

    if (!res.ok) {
      console.error(`Failed to fetch product for slug ${slug}: ${res.statusText}`);
      return null; // Or throw error
    }

    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      console.warn(`No product found for slug: ${slug}`);
      return null; // Not found
    }

    // --- Map Strapi data to your Product type ---
    const item = data.data[0];
    const attributes = item.attributes;
    const product: Product = {
      id: item.id,
      name: attributes.name,
      price: attributes.price,
      originalPrice: attributes.originalPrice,
      description: attributes.description,
      // ... map other fields (images, colors, sizes carefully based on Strapi structure)
       imageUrl: attributes.image?.data?.attributes?.url || '/placeholder-product.jpg',
       thumbnails: attributes.thumbnails?.data?.map((img: any) => img.attributes?.url) || [],
       colors: attributes.colors?.map((c: any) => c.name) || [], // Example mapping
       sizes: attributes.sizes?.map((s: any) => s.value) || [], // Example mapping
       rating: attributes.rating, // Assuming these exist directly
       reviewCount: attributes.reviewCount,
    };
    return product;

  } catch (error) {
    console.error(`Error fetching product for slug ${slug}:`, error);
    return null; // Or throw error
  }
  */

  // --- RETURN DUMMY DATA (DELETE/COMMENT OUT WHEN API IS READY) ---
  // Simulate a small delay like a real fetch might have
  // await new Promise(resolve => setTimeout(resolve, 50));
  // return DUMMY_PRODUCT;
}



// --- Define a larger pool of potential related products (Dummy Data) ---
const createDummyProductImage = (
  id: number,
  url: string,
  name: string = 'product-image',
  width: number = 600,
  height: number = 800
): ProductImage => ({
  id: id,
  documentId: `doc-${id}`,
  name: name,
  alternativeText: null,
  caption: null,
  width: width,
  height: height,
  formats: {
    thumbnail: {
      name: `thumbnail-${name}`,
      hash: `thumb-hash-${id}`,
      ext: '.jpg',
      mime: 'image/jpeg',
      path: null,
      width: 150,
      height: 200,
      size: 10,
      sizeInBytes: 10240,
      url: `/thumbnails/${url.split('/').pop()}`,
    },
    small: {
      name: `small-${name}`,
      hash: `small-hash-${id}`,
      ext: '.jpg',
      mime: 'image/jpeg',
      path: null,
      width: 300,
      height: 400,
      size: 50,
      sizeInBytes: 51200,
      url: `/small/${url.split('/').pop()}`,
    },
  },
  hash: `full-hash-${id}`,
  ext: '.jpg',
  mime: 'image/jpeg',
  size: 200,
  url: url,
  previewUrl: null,
  provider: 'local',
  provider_metadata: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  publishedAt: new Date().toISOString(),
});


const DUMMY_ALL_PRODUCTS: Product[] = [
  {
    id: 101,
    documentId: 'prod-doc-101',
    title: 'Classic Blue Jeans',
    description: 'A timeless pair of blue jeans for everyday wear. Made from durable denim with a comfortable fit.',
    price: 75.00,
    availableColors: [{ id: 1, name: 'Blue', hexCode: '#0000FF' }],
    sizes: [{ id: 1, name: 30 }, { id: 2, name: 32 }, { id: 3, name: 34 }],
    stock: 120,
    isFeatured: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-05-20T14:30:00Z',
    publishedAt: '2024-01-15T10:00:00Z',
    locale: 'en',
    slug: 'classic-blue-jeans',
    images: [createDummyProductImage(1, '/products/jeans-1.jpg', 'Classic Blue Jeans')],
  },
  {
    id: 102,
    documentId: 'prod-doc-102',
    title: 'Summer Floral Dress',
    description: 'Light and airy floral dress, perfect for summer days. Features a flattering silhouette and vibrant print.',
    price: 90.00,
    availableColors: [{ id: 2, name: 'Floral', hexCode: '#FF69B4' }],
    sizes: [{ id: 4, name: 'S' }, { id: 5, name: 'M' }, { id: 6, name: 'L' }],
    stock: 80,
    isFeatured: true,
    createdAt: '2024-02-01T11:00:00Z',
    updatedAt: '2024-05-22T10:00:00Z',
    publishedAt: '2024-02-01T11:00:00Z',
    locale: 'en',
    slug: 'summer-floral-dress',
    images: [createDummyProductImage(2, '/products/dress-1.jpg', 'Summer Floral Dress')],
  },
  {
    id: 456,
    documentId: 'prod-doc-456',
    title: 'Grey Acid Wash Wide Leg Jogger',
    description: 'Comfortable and stylish wide-leg joggers with a unique acid wash finish. Ideal for casual wear or lounging.',
    price: 215.00,
    availableColors: [{ id: 3, name: 'Grey', hexCode: '#808080' }],
    sizes: [{ id: 7, name: 'XS' }, { id: 8, name: 'S' }, { id: 9, name: 'M' }],
    stock: 50,
    isFeatured: true,
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-06-05T16:00:00Z',
    publishedAt: '2024-03-10T09:00:00Z',
    locale: 'en',
    slug: 'grey-acid-wash-wide-leg-jogger',
    images: [createDummyProductImage(3, '/placeholder-jogger-main.jpg', 'Grey Acid Wash Jogger')],
  },
  {
    id: 201,
    documentId: 'prod-doc-201',
    title: 'Leather Biker Jacket',
    description: 'Edgy and durable leather biker jacket. A wardrobe staple that adds a cool touch to any outfit.',
    price: 350.00,
    availableColors: [{ id: 4, name: 'Black', hexCode: '#000000' }],
    sizes: [{ id: 10, name: 'S' }, { id: 11, name: 'M' }, { id: 12, name: 'L' }, { id: 13, name: 'XL' }],
    stock: 30,
    isFeatured: false,
    createdAt: '2024-04-01T13:00:00Z',
    updatedAt: '2024-05-18T09:00:00Z',
    publishedAt: '2024-04-01T13:00:00Z',
    locale: 'en',
    slug: 'leather-biker-jacket',
    images: [createDummyProductImage(4, '/products/jacket-1.jpg', 'Leather Biker Jacket')],
  },
  {
    id: 202,
    documentId: 'prod-doc-202',
    title: 'Plain White Tee',
    description: 'A comfortable and versatile plain white t-shirt. A must-have for any minimalist wardrobe.',
    price: 25.00,
    availableColors: [{ id: 5, name: 'White', hexCode: '#FFFFFF' }],
    sizes: [{ id: 14, name: 'XS' }, { id: 15, name: 'S' }, { id: 16, name: 'M' }, { id: 17, name: 'L' }, { id: 18, name: 'XL' }],
    stock: 500,
    isFeatured: false,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-06-01T11:00:00Z',
    publishedAt: '2024-01-05T08:00:00Z',
    locale: 'en',
    slug: 'plain-white-tee',
    images: [createDummyProductImage(5, '/products/tee-1.jpg', 'Plain White Tee')],
  },
  {
    id: 301,
    documentId: 'prod-doc-301',
    title: 'Running Sneakers V2',
    description: 'Advanced running sneakers designed for optimal performance and comfort. Perfect for athletes.',
    price: 140.00,
    availableColors: [{ id: 6, name: 'Black/Red', hexCode: '#000000' }, { id: 7, name: 'Blue/White', hexCode: '#0000FF' }],
    sizes: [{ id: 19, name: 7 }, { id: 20, name: 8 }, { id: 21, name: 9 }, { id: 22, name: 10 }],
    stock: 90,
    isFeatured: true,
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-05-25T15:00:00Z',
    publishedAt: '2024-02-15T10:00:00Z',
    locale: 'en',
    slug: 'running-sneakers-v2',
    images: [createDummyProductImage(6, '/products/sneaker-1.jpg', 'Running Sneakers V2')],
  },
  {
    id: 302,
    documentId: 'prod-doc-302',
    title: 'Stylish Ankle Boots',
    description: 'Chic and comfortable ankle boots, perfect for adding a touch of sophistication to any outfit.',
    price: 180.00,
    availableColors: [{ id: 8, name: 'Brown', hexCode: '#A52A2A' }],
    sizes: [{ id: 23, name: 6 }, { id: 24, name: 7 }, { id: 25, name: 8 }, { id: 26, name: 9 }],
    stock: 60,
    isFeatured: false,
    createdAt: '2024-03-20T14:00:00Z',
    updatedAt: '2024-05-30T10:00:00Z',
    publishedAt: '2024-03-20T14:00:00Z',
    locale: 'en',
    slug: 'stylish-ankle-boots',
    images: [createDummyProductImage(7, '/products/boots-1.jpg', 'Stylish Ankle Boots')],
  },
  {
    id: 501,
    documentId: 'prod-doc-501',
    title: 'Cozy Knit Cardigan',
    description: 'Soft and warm knit cardigan, ideal for layering during cooler months. A comfortable and stylish addition to your wardrobe.',
    price: 110.00,
    availableColors: [{ id: 9, name: 'Beige', hexCode: '#F5F5DC' }, { id: 10, name: 'Grey', hexCode: '#808080' }],
    sizes: [{ id: 27, name: 'S' }, { id: 28, name: 'M' }, { id: 29, name: 'L' }],
    stock: 70,
    isFeatured: true,
    createdAt: '2024-01-25T12:00:00Z',
    updatedAt: '2024-06-02T16:00:00Z',
    publishedAt: '2024-01-25T12:00:00Z',
    locale: 'en',
    slug: 'cozy-knit-cardigan',
    images: [createDummyProductImage(8, '/products/cardigan-1.jpg', 'Cozy Knit Cardigan')],
  },
];

// --- Function to get related products ---
// It should exclude the current product ID and limit the results
export async function getRelatedProducts(
  currentProductId: string | number,
  limit: number = 5 // Default limit for related items
): Promise<Product[]> {
  console.log(`Fetching related products for ID: ${currentProductId} (USING DUMMY DATA)`);

  /*
  // --- UNCOMMENT THIS WHEN API IS READY ---
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!STRAPI_URL) {
      console.error("Strapi URL not configured.");
      return []; // Return empty array on config error
  }

  try {
      // Example Strapi endpoint: Fetch products, filter out the current one, limit results.
      // You might add more complex filtering (e.g., by category) here.
      const endpoint = `${STRAPI_URL}/products?filters[id][$ne]=${currentProductId}&pagination[limit]=${limit}&populate=image`; // Adjust populate

      const res = await fetch(endpoint); // Add auth headers if needed
      if (!res.ok) {
          console.error(`Failed to fetch related products: ${res.statusText}`);
          return []; // Return empty on fetch error
      }
      const data = await res.json();

      if (!data.data || !Array.isArray(data.data)) {
          console.warn("Related products data received from Strapi is not in expected format.");
          return [];
      }

      // Map Strapi data to your Product type
      return data.data.map((item: any): Product => ({
          id: item.id,
          name: item.attributes.name || `Product ${item.id}`,
          price: item.attributes.price || 0,
          originalPrice: item.attributes.originalPrice,
          imageUrl: item.attributes.image?.data?.attributes?.url || '/placeholder-product.jpg',
          rating: item.attributes.rating, // Ensure these fields are fetched if needed by ProductCard
          reviewCount: item.attributes.reviewCount,
          // Add other fields needed by ProductCard
      }));

  } catch (error) {
      console.error(`Error fetching related products:`, error);
      return []; // Return empty on general error
  }
  */

  // --- RETURN DUMMY DATA (DELETE/COMMENT OUT WHEN API IS READY) ---
  await new Promise(resolve => setTimeout(resolve, 60)); // Simulate delay

  // Filter out the current product and return a slice
  const related = DUMMY_ALL_PRODUCTS.filter(p => p.id !== currentProductId);
  return related.slice(0, limit); // Return the first 'limit' items
}