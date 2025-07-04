// components/NewArrivals.tsx
import { getStrapiMedia } from '@/lib/utils';
import { DisplayProduct, toDisplayProduct, type Product } from '@/types/product'; // Adjust import path
import Image from 'next/image';
import Link from 'next/link';

// Define Props interface accepting an array of Product objects
interface NewArrivalsProps {
  currentArrivals: Product[]; // Use 'newArrivals' prop name for clarity
}

const NewArrivals = ({ currentArrivals }: NewArrivalsProps) => {
  // Check if there are any products
  const DisplayArrivals: DisplayProduct[] = currentArrivals.map(currentArrival => toDisplayProduct(currentArrival));

  return (
    <section className="py-10 px-4 md:px-10">
      {/* --- CHANGE 1: Centered the title to match "Deal of the Day" --- */}
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-left">New Arrivals</h2>

      {/* --- CHANGE 2: Replaced flex-wrap with the grid system from your other component --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 justify-center">
        {DisplayArrivals.map((product) => (
          // --- CHANGE 3: Removed the manual width classes from the Link. The grid handles this now. ---
          <Link key={product.id} href={`/shop/${product.slug}`}>
            {/* --- CHANGE 4: Matched the card container styles, adding `group` for hover effects --- */}
            <div className="bg-white shadow rounded-lg overflow-hidden text-left group transition hover:shadow-lg">
              {/* Image (no structural changes needed here) */}
              <div className="relative w-full h-[270px] bg-gray-100">
                {product.imageUrl ? (
                  <Image
                    src={getStrapiMedia(product.imageUrl)}
                    alt={product.name || 'Product'}
                    fill
                    // Kept `object-cover` from New Arrivals, but added the `group-hover` effect
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, (max-width: 1280px) 22vw, 15vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                )}
              </div>

              {/* Info */}
              {/* --- CHANGE 5: Matched padding and min-height for consistent card dimensions --- */}
              <div className="p-3 min-h-[120px] flex flex-col justify-between  ">
                {/* The unique content of New Arrivals is preserved below */}
                <div className="flex-grow min-h-[100px]">
                  <p className="text-small text-main-text mb-1">Men&apos;s Wear</p>

                  {/* Added group-hover effect to the title to match the other section */}
                  <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug group-hover:text-primary">
                    {product.name}
                  </p>

                  {/* Star Rating */}
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <div className="flex items-center gap-0.5 text-yellow-400">
                      <span>★</span><span>★</span><span>★</span><span className="text-gray-300">★</span><span className="text-gray-300">★</span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</p>
                  {product.originalPrice && (
                    <p className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>
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

export default NewArrivals;