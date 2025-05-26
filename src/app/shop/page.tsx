// "use client"

import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { getProducts } from '@/lib/api';

export default async function ShopPage() {
  const productRes = await getProducts(); // Fetch from Strapi

  //   const products = productRes.map((item: any) => ({
  //   id: item.id,
  //   name: item.title,
  //   price: item.price,
  //   imageUrl: item.imageUrl ? item.imageUrl : '/placeholder.jpg',
  //   outOfStock: item.stock <= 0,
  //   slug: item.slug,
  // }));
    const products = productRes.data.map((item: any) => ({
    id: item.id,
    name: item.title,
    price: item.price,
    imageUrl: item.images?.[0]?.formats?.small?.url || item.images?.[0]?.url || '/placeholder.jpg',
    outOfStock: item.stock <= 0,
    slug: item.slug,
  }));

  return (
    <main className="w-full overflow-x-hidden bg-white dark:bg-gray-200 ">
      <div className="px-4 md:px-12">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 my-6">
          Home {'>'} <span className="text-black font-medium">Shop</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['Clothing', 'Purses', 'Handbags', 'Bracelets', 'Shirts', 'Necklace'].map((filter) => (
            <button
              key={filter}
              className="border px-4 py-2 rounded hover:bg-black hover:text-white transition"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product: any) => (
            <Link key={product.id} href={`/shop/${product.slug}`}>
              {/* <Link key={product.id} href={`/product/${product.slug}`}> */}
              <ProductCard
                product={product}
              />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
