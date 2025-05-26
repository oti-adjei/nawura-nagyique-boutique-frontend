// src/lib/api.ts

  export async function getHeroContent() {
    // Actual format 
    /** const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/hero?populate=*`);
    const data = await res.json();
  
    if (data && data.data) {
      const hero = data.data.attributes;
      return {
        title: hero.title,
        subtitle: hero.subtitle,
        imageUrl: hero.image?.data?.attributes?.url || '/placeholder.png',
        callToActionText: hero.callToActionText,
        callToActionUrl: hero.callToActionUrl,
      };
    }
  
    return null; **/
  
    // Dummy data for development or when the API is unavailable
    return {
      title: "Welcome to Our Awesome Store!",
      subtitle: "Discover unique and high-quality products you'll love.",
      imageUrl: "/hero.jpeg", // Replace with your actual placeholder image path
      callToActionText: "Shop Now",
      callToActionUrl: "/products",
    };
  }
  
  export async function getCategories() {
    return Array.from({ length: 6 }).map((_, i) => ({
      name: `Category ${i + 1}`,
      icon: '/icons/icon-placeholder.png',
    }));
  }

  export async function getCategoriesWithIcons() {
    // Actual format for fetching categories with icons from Strapi
    /** const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/categories?populate=icon`);
    const data = await res.json();
  
    return data.data.map((category: any) => ({
      id: category.id,
      name: category.attributes.name,
      slug: category.attributes.slug,
      icon: category.attributes.icon?.data?.attributes?.url || '/placeholder-icon.png', // Assuming an 'icon' relation
    })); **/
  
    // Dummy data for categories with icons
    return [
      { id: 1, name: "Clothing", slug: "clothing", icon: "/icons/clothing.svg" },
      { id: 2, name: "Accessories", slug: "accessories", icon: "/icons/accessories.svg" },
      { id: 3, name: "Shoes", slug: "shoes", icon: "/icons/shoes.svg" },
      { id: 4, name: "Bags", slug: "bags", icon: "/icons/bags.svg" },
      { id: 5, name: "Jewelry", slug: "jewelry", icon: "/icons/jewelry.svg" },
    ];
  }
  
  export async function getNewArrivals() {
    return Array.from({ length: 12 }).map((_, i) => ({
      image: `/products/new-${(i % 4) + 1}.jpg`,
      title: `Men's Wear Printed Shirt`,
      price: 87.0,
      originalPrice: 100.0,
    }));
  }
  
  export async function getLegacyContent() {
    return {
      image: '/legacy.jpg',
      title: 'A Legacy of Light',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, animi!',
      cta: 'Shop Now',
    };
  }
  
  export async function getDeals() {
    return Array.from({ length: 6 }).map((_, i) => ({
      image: `/products/deal-${(i % 3) + 1}.jpg`,
      title: `Men's Wear Printed Shirt`,
      price: 87.0,
      originalPrice: 100.0,
    }));
  }
  
  export async function getPromotionalBanner() {
    return {
      image: '/promo-banner.jpg',
      title: 'Latest Exclusive Summer Collection',
      cta: 'Shop Now',
    };
  }
  
  export async function getCollections() {
    return [
      { title: "Women’s Collection", image: '/collections/women.jpg' },
      { title: "Kid’s Collection", image: '/collections/kids.jpg' },
      { title: "Men’s Collection", image: '/collections/men.jpg' },
    ];
  }
  
  export async function getFeatures() {
    return [
      { title: 'Free Shipping', icon: '/icons/free-shipping.png' },
      { title: '24x7 Support', icon: '/icons/support.png' },
      { title: '30 Days Return', icon: '/icons/return.png' },
      { title: 'Payment Secure', icon: '/icons/secure.png' },
    ];
  }
  
  // lib/api.ts
export async function getProducts() {
  // actual format 
  /** const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/products?populate=*`);
  const data = await res.json();

   return data.data.map((product: any) => ({
    id: product.id,
    name: product.attributes.title,
    price: product.attributes.price,
    imageUrl: product.attributes.image?.data?.attributes?.url || '/placeholder.png',
    inStock: product.attributes.inStock,
  })); **/

  return [
    {
      "id": 1,
      "name": "Alpaca Wool Cropped Cardigan",
      "price": 248,
      "imageUrl": "/shop1.png",
      "inStock": false
    },
    {
      "id": 2,
      "name": "Leather Handbag",
      "price": 120,
      "imageUrl": "/shop1.png",
      "inStock": true
    },
    {
      "id": 3,
      "name": "Organic Cotton T-Shirt",
      "price": 35,
      "imageUrl": "/shop1.png",
      "inStock": true
    },
    {
      "id": 4,
      "name": "Sustainable Denim Jeans",
      "price": 180,
      "imageUrl": "/shop1.png",
      "inStock": true
    },
    {
      "id": 5,
      "name": "Sterling Silver Earrings",
      "price": 65,
      "imageUrl": "/shop1.png",
      "inStock": true
    },
    {
      "id": 6,
      "name": "Linen Blend Scarf",
      "price": 45,
      "imageUrl": "/shop1.png",
      "inStock": true
    },
    {
      "id": 7,
      "name": "Recycled Polyester Backpack",
      "price": 95,
      "imageUrl": "/shop1.png",
      "inStock": true
    },
    {
      "id": 8,
      "name": "Cashmere Knit Sweater",
      "price": 280,
      "imageUrl": "/shop1.png",
      "inStock": true
    },
    {
      "id": 9,
      "name": "Block Heel Leather Boots",
      "price": 150,
      "imageUrl": "/shop1.png",
      "inStock": true
    },
    {
      "id": 10,
      "name": "Wide Brim Straw Hat",
      "price": 55,
      "imageUrl": "/shop1.png",
      "inStock": true
    },
    {
      "id": 11,
      "name": "Wide Brim Straw Hat",
      "price": 55,
      "imageUrl": "/shop1.png",
      "inStock": true
    }
  ]
}
