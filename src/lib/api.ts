import type {
  // LegacyContent,
  PromotionalBanner,
  Collection,
  Feature,
  Category, // Assuming Category is defined
  // HeroContent // Assuming HeroContent is defined
} from '@/types/api'; // Adjust path as needed

import type { Product, } from '@/types/product';
import fetchStrapi from './utils';
import qs from 'qs';




export async function getHomepageContent() {
  try {
    const data = await fetchStrapi('homepage?populate[Hero][populate]=imageUrl&populate[Overview][populate]=image&populate[seo_metadata][populate]&populate[products][populate]');
    //console.log("API hitting is " + JSON.stringify(data));

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

export async function fetchAboutPage(){
  try {
    const data = await fetchStrapi('about?populate[History][populate]=images');
    //console.log("API hitting about is " + JSON.stringify(data));

    const attributes = data?.data; // Adjusted based on your previous response structure

    if (!attributes) {
      console.warn("Aboutpage content data received from Strapi is not in the expected format.");
      return null; // Or handle this case as needed
    }

    return attributes; // Return the entire data object since your content is directly under 'data'
  } catch (error) {
    console.error("Error fetching About Page content:", error);
    throw error; // Re-throw the error for the calling component to handle
  }

}


export async function getCategories(): Promise<Category[]> {
  //console.log("Fetching Categories...");
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
  //console.log("Fetching New Arrivals...");

  try {
    const data = await fetchStrapi('products?populate=*&sort=publishedAt:desc&pagination[limit]=5');
    //console.log("API hitting is " + JSON.stringify(data));

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

export async function getDeals() {
  try {
    const data = await fetchStrapi('products?filters[isFeatured][$eq]=true&populate=*');
    //console.log("API hitting is " + JSON.stringify(data));

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
  //console.log("Fetching Promotional Banner...");
  return {
    image: '/uploads/Background_2ffd65f716.png',
    title: 'Latest Exclusive Summer Collection',
    cta: 'Explore Summer',
  };
}


export async function getCollections(): Promise<Collection[]> {
  //console.log("Fetching Collections...");
  return [
    { id: 301, title: "Women’s Collection", image: '/uploads/women_fe7af95179.png' },
    { id: 302, title: "Kid’s Collection", image: '/uploads/13_jpg_17583051ec.png' },
    { id: 303, title: "Men’s Collection", image: '/uploads/14_jpg_2b11ba2eca.png' },
  ];
}


export async function getFeatures(): Promise<Feature[]> {
  //console.log("Fetching Features...");
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
    //console.log("API hitting is " + JSON.stringify(data));

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


// --- Your Fetch Function ---
export async function getProductBySlug(slug: string): Promise<Product | null> {
  //console.log(`Attempting to fetch product for slug: ${slug} (USING DUMMY DATA)`);


  try {
    const data = await fetchStrapi(`products/${slug}?populate=*`);
    //console.log("API hitting is " + JSON.stringify(data));

    const attributes = data?.data; // Adjusted based on your previous response structure

    if (!attributes) {
      console.warn("Product content data received from Strapi is not in the expected format.");
      return null; // Or handle this case as needed
    }

    //console.log("API slug  is " + JSON.stringify(attributes));

    return attributes; // Return the entire data object since your content is directly under 'data'
  } catch (error) {
    console.error("Error fetching Product content:", error);
    throw error; // Re-throw the error for the calling component to handle
  }
}



export async function getRelatedProducts(
  currentProductId: string | number,
  limit: number = 5 // Default limit for related items
) {
  //console.log(`Fetching related products for ID: ${currentProductId} (USING DUMMY DATA)`);
  try {
    // First, get the reference product with its category
    const referenceProduct = await fetchStrapi(`products/${currentProductId}?populate=*`);
    //console.log("Reference Product: ", referenceProduct);
    const categoryId = await referenceProduct.data.category.id;
    const tagIds= referenceProduct.data.tags.data ?  await referenceProduct.data.tags.data.map((tag: { id: unknown
      ; }) => tag.id): [];
    //console.log("Tag Ids: ", tagIds)


    // Then, find other products with the same category and tags
    const query = qs.stringify({
      filters: {
        id: {
          $ne: currentProductId
        },
        category: {
          id: {
            $eq: categoryId
          }
        },
        tags: {
          id: {
            $in: tagIds
          }
        }
      },
      populate: '*'
    }, {
      encodeValuesOnly: true
    });

    const data = await fetchStrapi(`products?${query}`);
    // const data = await fetch(`http://localhost:1337/api/products?${query}&populate=*`);
    //console.log("API hitting is " + JSON.stringify(data));

    const attributes = data?.data; // Adjusted based on your previous response structure

    if (!attributes) {
      console.warn("Homepage content data received from Strapi is not in the expected format.");
      return null; // Or handle this case as needed
    }
    // Return only the first 'limit' items
    return attributes.slice(0, limit); // Return the first 'limit' items

    return attributes; // Return the entire data object since your content is directly under 'data'

  } catch (error) {
    console.error("Error fetching Product/Shop content:", error);
    throw error; // Re-throw the error for the calling component to handle
  }


  // --- RETURN DUMMY DATA (DELETE/COMMENT OUT WHEN API IS READY) ---
  await new Promise(resolve => setTimeout(resolve, 60)); // Simulate delay


}