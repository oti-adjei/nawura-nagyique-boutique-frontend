// components/DayOfTheDeal.tsx
import { getStrapiMedia } from '@/lib/utils'; // Import getStrapiMedia
import { DisplayProduct, toDisplayProduct, type Product } from '@/types/product'; // Adjust import path
import Image from 'next/image';
import Link from 'next/link';

// Define Props interface accepting an array of Product objects
interface DayOfTheDealProps {
  deals: Product[]; // Now expecting the raw 'Product' type from Strapi
}

const DayOfTheDeal = ({ deals }: DayOfTheDealProps) => {
  // Check if there are any deals to display
  if (!deals || deals.length === 0) {
    return null; // Or render a placeholder message
  }

  // Convert raw Product data to DisplayProduct format
  const displayDeals: DisplayProduct[] = deals.map(deal => toDisplayProduct(deal));

  return (
    <section className="py-10 px-4 md:px-10 text-center">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Deal of the Day</h2>
      <p className="mb-8 text-sm text-gray-600">Don’t miss out on exclusive daily offers!</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 justify-center">
        {displayDeals.map((deal) => ( // Use the transformed 'displayDeals'
          <Link key={deal.id} href={`/shop/${deal.slug}`}>
            <div className="bg-white shadow rounded-lg overflow-hidden text-left group transition hover:shadow-lg">
               <div className="relative w-full aspect-square bg-gray-100">
                  {deal.imageUrl ? ( // Use deal.imageUrl (already processed by toDisplayProduct)
                      <Image
                        src={getStrapiMedia(deal.imageUrl)} // Apply getStrapiMedia here
                        alt={deal.name || 'Deal product'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, (max-width: 1280px) 22vw, 15vw"
                      />
                  ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No Image</div>
                  )}
               </div>
               <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 truncate group-hover:text-pink-600">{deal.name}</h3>
                  <div className="mt-1 flex items-baseline gap-1.5">
                      <p className="text-base font-semibold text-pink-600">${deal.price.toFixed(2)}</p>
                      {deal.originalPrice && (
                          <p className="text-xs text-gray-400 line-through">${deal.originalPrice.toFixed(2)}</p>
                      )}
                  </div>
               </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DayOfTheDeal;