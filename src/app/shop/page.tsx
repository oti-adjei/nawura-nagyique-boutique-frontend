// "use client"

import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { getProducts } from '@/lib/api';
import FilterOptions from '@/components/shop/FilterOption';
import FilteredProductDisplay from '@/components/shop/FIlteredDisplay';

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
  const products = productRes.map((item: any) => ({
    id: item.id,
    name: item.title,
    price: item.price,
    description: item.description,
    category: item.category,
    tags: item.tags,
    imageUrl: item.images?.[0]?.formats?.small?.url || item.images?.[0]?.url || '/placeholder.jpg',
    outOfStock: item.stock <= 0,
    slug: item.slug,
  }));

  return (
    <main className="w-full overflow-x-hidden bg-white ">
      <div className="px-5 md:px-12 lg:px-[130px]">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mt-6">
          Home {'>'} <span className="text-black font-medium">Shop</span>
        </div>

        {/* Filters */}
        {/* <div className="flex flex-wrap gap-2 mb-8">
          {['Clothing', 'Purses', 'Handbags', 'Bracelets', 'Shirts', 'Necklace'].map((filter) => (
            <button
              key={filter}
              className="border px-4 py-2 rounded border-black text-black hover:bg-[#A40A3C] hover:border-[#A40A3C] hover:text-white transition"
            >
              {filter}
            </button>
          ))}
        </div> */}
        {/* <FilterOptions />

        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-4">
          {products.map((product: any) => (
            <Link key={product.id} href={`/shop/${product.slug}`}>
          
              <ProductCard
                product={product}
              />
            </Link>
          ))}
        </div> */}
        <FilteredProductDisplay initialProducts={productRes} />
      </div>
    </main>
  );
}
