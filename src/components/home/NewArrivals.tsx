// components/NewArrivals.tsx
import { getStrapiMedia } from '@/lib/utils';
import { DisplayProduct, toDisplayProduct, type Product } from '@/types/product'; // Adjust import path
import Image from 'next/image';
import Link from 'next/link';

// Define Props interface accepting an array of Product objects
interface NewArrivalsProps {
  currentArrivals: Product[]; // Use 'newArrivals' prop name for clarity
}

const NewArrivals =  ({ currentArrivals }: NewArrivalsProps) => {
  // Check if there are any products
  const DisplayArrivals: DisplayProduct[] =  currentArrivals.map(currentArrival =>toDisplayProduct(currentArrival));

  return (
    <section className="py-10 px-4 md:px-10">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-center md:text-left">New Arrivals</h2>
      {/* Adjust grid columns for responsiveness */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {DisplayArrivals.map((product) => (
          // Use product.id for the key
          <Link key={product.id} href={`/shop/${product.slug}`}>
          <div key={product.id} className="border border-gray-200 rounded-md overflow-hidden shadow-sm group hover:shadow-md transition text-left">
            <div className="relative w-full aspect-square bg-gray-100"> {/* Aspect ratio for consistency */}
              {product.imageUrl ? (
                <Image
                  src={getStrapiMedia(product.imageUrl)}
                  alt={product.name || 'New arrival product'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                   sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, (max-width: 1280px) 18vw, 15vw"
                />
                 // Fallback if using standard img tag:
                 // <img src={product.image} alt={product.title} className="w-full h-auto object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No Image</div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-800 truncate">{product.name}</h3>
              <div className="mt-1 flex items-baseline gap-1.5">
                {/* Format price correctly (it's a number) */}
                <p className="text-base font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                {product.originalPrice && (
                  <p className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>
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