import { getProducts } from '@/lib/api';
import FilteredProductDisplay from '@/components/shop/FIlteredDisplay';
import Link from 'next/link';

export default async function ShopPage() {

  const productRes = await getProducts(); // Fetch from Strapi

  return (
    <main className="w-full overflow-x-hidden bg-white ">
      <div className="px-5 md:px-12 lg:px-[130px]">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mt-6">
         <Link href="/" className="underline">Home</Link>  {'>>'} <span className="text-black font-medium">Shop</span>
        </div>
        <FilteredProductDisplay initialProducts={productRes} />
      </div>
    </main>
  );
}
