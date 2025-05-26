import type {
  DealProduct,
  // LegacyContent,
  PromotionalBanner,
  Collection,
  Feature,
  Category, // Assuming Category is defined
  // HeroContent // Assuming HeroContent is defined
} from '@/types/api'; // Adjust path as needed

import type { Product } from '@/types/product';
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
  /*
  // UNCOMMENT THIS BLOCK TO FETCH FROM STRAPI
  if (!STRAPI_URL) throw new Error("Strapi URL not configured.");
  const endpoint = `${STRAPI_URL}/products?sort=createdAt:desc&pagination[limit]=12&populate=image`;
 
  try {
    const res = await fetch(endpoint); // Add headers if auth needed
    if (!res.ok) throw new Error(`Failed to fetch new arrivals: ${res.statusText}`);
    const data = await res.json();
 
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("New Arrivals data received from Strapi is not in expected format.");
    }
 
    return data.data.map((item: any): Product => ({
      id: item.id,
      title: item.attributes.title,
      price: item.attributes.price,
      originalPrice: item.attributes.originalPrice,
      image: item.attributes.image?.data?.attributes?.url || `/placeholder-product.jpg`,
    }));
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw error; // Re-throw error or handle differently
  }
  */

  // --- DELETE THIS DUMMY DATA RETURN WHEN USING STRAPI ---
  // return Array.from({ length: 12 }).map((_, i) => ({
  //     id: i + 100, // Assign dummy IDs
  //     image: `/products/new-${(i % 4) + 1}.jpg`,
  //     title: `New Arrival Product ${i + 1}`,
  //     price: 87.0 + i,
  //     originalPrice: 100.0 + i,
  // }));

  return [
    { id: 101, imageUrl: '/products/new-1.jpg', name: 'Stylish Printed Shirt', price: 87.0, originalPrice: 100.0, slug: '/tee' },
    { id: 102, imageUrl: '/products/new-2.jpg', name: 'Comfort Fit Jeans', price: 95.0, originalPrice: 120.0, slug: '/tee' },
    { id: 103, imageUrl: '/products/new-3.jpg', name: 'Casual Summer Dress', price: 75.5, originalPrice: 90.0, slug: '/tee' },
    { id: 104, imageUrl: '/products/new-4.jpg', name: 'Leather Crossbody Bag', price: 110.0, slug: '/tee' }, // No originalPrice example
    { id: 105, imageUrl: '/products/new-1.jpg', name: 'Graphic Tee Unisex', price: 45.0, originalPrice: 55.0, slug: '/tee' },
    { id: 106, imageUrl: '/products/new-2.jpg', name: 'Running Sneakers', price: 130.0, originalPrice: 150.0, slug: '/tee' },
    // Add more explicit items if needed, up to 12 for the example
  ];
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


export async function getDeals(): Promise<DealProduct[]> {
  console.log("Fetching Deals...");
  /*
  // UNCOMMENT THIS BLOCK TO FETCH FROM STRAPI
  if (!STRAPI_URL) throw new Error("Strapi URL not configured.");
  const endpoint = `${STRAPI_URL}/products?filters[isDeal][$eq]=true&pagination[limit]=6&populate=image`;
 
  try {
    const res = await fetch(endpoint); // Add headers if auth needed
    if (!res.ok) throw new Error(`Failed to fetch deals: ${res.statusText}`);
    const data = await res.json();
 
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Deals data received from Strapi is not in expected format.");
    }
 
    return data.data.map((item: any): Product => ({
      id: item.id,
      title: item.attributes.title,
      price: item.attributes.price,
      originalPrice: item.attributes.originalPrice,
      image: item.attributes.image?.data?.attributes?.url || `/placeholder-deal.jpg`,
    }));
  } catch (error) {
    console.error("Error fetching deals:", error);
    throw error; // Re-throw error or handle differently
  }
  */

  // --- DELETE THIS DUMMY DATA RETURN WHEN USING STRAPI ---
  // return Array.from({ length: 6 }).map((_, i) => ({
  //     id: i + 200, // Assign dummy IDs
  //     image: `/products/deal-${(i % 3) + 1}.jpg`,
  //     title: `Amazing Deal ${i + 1}`,
  //     price: 50.0 + i,
  //     originalPrice: 90.0 + i,
  // }));

  return [
    { id: 201, imageUrl: '/products/deal-1.jpg', name: 'Deal Sneaker Max', price: 50.0, originalPrice: 90.0 },
    { id: 202, imageUrl: '/products/deal-2.jpg', name: 'Weekend Hoodie Deal', price: 55.0, originalPrice: 95.0 },
    { id: 203, imageUrl: '/products/deal-3.jpg', name: 'Watch Special Offer', price: 60.0, originalPrice: 100.0 },
    { id: 204, imageUrl: '/products/deal-1.jpg', name: 'Sunglasses Discount', price: 52.0, originalPrice: 88.0 },
    { id: 205, imageUrl: '/products/deal-2.jpg', name: 'Backpack Bargain', price: 58.0, originalPrice: 99.0 },
    { id: 206, imageUrl: '/products/deal-3.jpg', name: 'Limited Cap Sale', price: 48.0, originalPrice: 80.0 },
  ];
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
    { id: 301, title: "Women’s Collection", image: '/collections/women.jpg' },
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

    return data; // Return the entire data object since your content is directly under 'data'

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
const DUMMY_PRODUCT: Product = {
  id: 123,
  name: 'Dummy Grey Joggers (Offline)',
  imageUrl: '/placeholder-jogger-main.jpg', // Use placeholders
  thumbnails: [
    '/placeholder-jogger-thumb1.jpg',
    '/placeholder-jogger-thumb2.jpg',
    '/placeholder-jogger-thumb3.jpg',
  ],
  rating: 4.2,
  reviewCount: 99,
  price: 199.99,
  originalPrice: 250.00,
  colors: ['Grey', 'Black'],
  sizes: [6, 8, 10, 12, 14, 16],
  description: "This is dummy data for viewing the product page layout while the API is unavailable.",
  slug: '/tee'
  // Add any other fields your ProductDisplay expects
};

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

    return data; // Return the entire data object since your content is directly under 'data'
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
const DUMMY_ALL_PRODUCTS: Product[] = [
  // Add more diverse products here, including the ones used elsewhere if needed
  { id: 'prod101', name: 'Classic Blue Jeans', price: 75.00, imageUrl: '/products/jeans-1.jpg', rating: 4.6, reviewCount: 150, slug: '/tee' },
  { id: 'prod102', name: 'Summer Floral Dress', price: 90.00, imageUrl: '/products/dress-1.jpg', rating: 4.8, reviewCount: 88, slug: '/tee' },
  { id: 'prod456', name: 'Grey Acid Wash Wide Leg Jogger', price: 215.00, imageUrl: '/placeholder-jogger-main.jpg', rating: 4.5, reviewCount: 212, slug: '/tee' }, // Current product example
  { id: 'prod201', name: 'Leather Biker Jacket', price: 350.00, imageUrl: '/products/jacket-1.jpg', rating: 4.9, reviewCount: 210, slug: '/tee' },
  { id: 'prod202', name: 'Plain White Tee', price: 25.00, imageUrl: '/products/tee-1.jpg', rating: 4.3, reviewCount: 300, slug: '/tee' },
  { id: 'prod301', name: 'Running Sneakers V2', price: 140.00, imageUrl: '/products/sneaker-1.jpg', rating: 4.7, reviewCount: 180, slug: '/tee' },
  { id: 'prod302', name: 'Stylish Ankle Boots', price: 180.00, imageUrl: '/products/boots-1.jpg', rating: 4.5, reviewCount: 95, slug: '/tee' },
  { id: 'prod501', name: 'Cozy Knit Cardigan', price: 110.00, imageUrl: '/products/cardigan-1.jpg', rating: 4.6, reviewCount: 120, slug: '/tee' },
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