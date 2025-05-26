// components/DayOfTheDeal.tsx
import type { DealProduct } from '@/types/api'; // Adjust import path
import Image from 'next/image'; // Using next/image is recommended

// Define Props interface accepting an array of Product objects
interface DayOfTheDealProps {
  deals: DealProduct[];
}

const DayOfTheDeal = ({ deals }: DayOfTheDealProps) => {
  // Check if there are any deals to display
  if (!deals || deals.length === 0) {
    return null; // Or render a placeholder message
  }

  return (
    <section className="py-10 px-4 md:px-10 text-center"> {/* Adjusted background color */}
      <h2 className="text-xl md:text-2xl font-bold mb-4">Deal of the Day</h2>
      <p className="mb-8 text-sm text-gray-600">Don’t miss out on exclusive daily offers!</p>
      {/* Use a grid for better layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 justify-center">
        {deals.map((deal) => (
          <div key={deal.id} className="bg-white shadow rounded-lg overflow-hidden text-left group transition hover:shadow-lg">
             <div className="relative w-full aspect-square bg-gray-100"> {/* Use aspect ratio for consistency */}
                {deal.imageUrl ? (
                    <Image
                      src={deal.imageUrl}
                      alt={deal.name || 'Deal product'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, (max-width: 1280px) 22vw, 15vw"
                    />
                    // Fallback if using standard img tag:
                    // <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
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
        ))}
      </div>
    </section>
  );
};

export default DayOfTheDeal;