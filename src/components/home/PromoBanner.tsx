// components/PromoBanner.tsx
import { getStrapiMedia } from '@/lib/utils';
import type { PromotionalBanner } from '@/types/api'; // Adjust import path
import Image from 'next/image';

// Define Props interface accepting the PromotionalBanner object
interface PromoBannerProps {
  promoBanner: PromotionalBanner;
}

const PromoBanner = ({ promoBanner }: PromoBannerProps) => {
  // Destructure properties from the promoBanner object
  const { title, cta, image } = promoBanner;

  return (
    // Option 1: Text Overlay on Background Image
    <section className="py-10 px-4 md:px-10 relative h-[50dvh] text-white text-center my-6">
      {image && (
        <Image
          src={getStrapiMedia(image)}
          alt={title || 'Promotional banner background'}
          fill
          className="px-4 md:px-10 object-cover opacity-90 z-0" // Adjust opacity as needed
        />
      )}
      <div className="relative z-10 w-full h-full pr-6 flex flex-col items-end justify-center"> {/* Content needs relative positioning */}
        <h3 className="text-lg md:text-2xl font-semibold mb-4">{title}</h3>
        {/* Using a button as the API doesn't specify a link URL */}
        <button className="mt-2 px-6 py-2.5 bg-primary rounded text-white font-medium transition">
          {cta}
        </button>
      </div>
    </section>

    // Option 2: Simple Text Banner (like original, ignoring the image)
    /*
    <section className="bg-black text-white py-6 px-4 md:px-10 text-center my-6">
      <h3 className="text-lg md:text-xl mb-2">{title}</h3>
      <button className="inline-block mt-2 px-4 py-2 bg-pink-500 rounded text-white hover:bg-pink-600">
        {cta}
      </button>
    </section>
    */
  );
};

export default PromoBanner;