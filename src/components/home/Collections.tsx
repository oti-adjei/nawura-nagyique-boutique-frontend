import { getStrapiMedia } from '@/lib/utils';
import type { Collection } from '@/types/api'; // Adjust import path (ensure this type has 'id')
import { Button } from '@mui/material';
import Image from 'next/image'; // Using next/image is recommended
import Link from 'next/link';

// Define Props interface accepting an array of Collection objects
interface CollectionsProps {
  collections: Collection[];
}

const Collections = ({ collections }: CollectionsProps) => (



  <section className="py-10 ">
    <h2 className="text-xl md:text-2xl font-bold mb-8 text-center">Shop by Collections</h2>
    {/* Adjust grid columns as needed */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-12 gap-4 md:gap-6">
      {collections.map((col) => (        // Use col.id for the key
        <div key={col.id} className="relative group aspect-[3/2] rounded overflow-hidden shadow-lg transition">
          {col.image ? (
            <Image
              src={getStrapiMedia(col.image)}
              alt={col.title || 'Collection image'}
              fill
              objectFit="cover"
              objectPosition="left top"
            // sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, 30vw"
            />
            // Fallback if using standard img tag:
            // <img src={col.image} alt={col.title} className="w-full h-full object-cover rounded" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
          )}

          <div className="absolute inset-0 bg-black/40 flex items-center justify-end pr-4 text-white text-lg font-semibold opacity-100 transition duration-300">
            <div className="flex flex-col items-end justify-end">
              <h3 className="font-bold">{col.title}</h3>
              <Link className="text-small mt-4 inline-block px-4 py-2 bg-primary text-white rounded" href={`/shop`}>
                {/* <Link className="absolute mt-4 inline-block px-6 py-2 bg-pink-600 text-white rounded" href={`/shop/{col.id}`}> */}
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Collections;