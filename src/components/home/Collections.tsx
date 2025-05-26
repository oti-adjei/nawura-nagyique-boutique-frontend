import type { Collection } from '@/types/api'; // Adjust import path (ensure this type has 'id')
import Image from 'next/image'; // Using next/image is recommended

// Define Props interface accepting an array of Collection objects
interface CollectionsProps {
  collections: Collection[];
}

const Collections = ({ collections }: CollectionsProps) => (
  <section className="py-10 px-4 md:px-10">
    <h2 className="text-xl md:text-2xl font-bold mb-8 text-center">Shop by Collections</h2>
    {/* Adjust grid columns as needed */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {collections.map((col) => (
        // Use col.id for the key
        <div key={col.id} className="relative group aspect-[4/3] rounded overflow-hidden shadow hover:shadow-lg transition">
          {col.image ? (
             <Image
                src={col.image}
                alt={col.title || 'Collection image'}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, 30vw"
              />
            // Fallback if using standard img tag:
            // <img src={col.image} alt={col.title} className="w-full h-full object-cover rounded" />
          ) : (
             <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
          )}

          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition duration-300">
            {col.title}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Collections;