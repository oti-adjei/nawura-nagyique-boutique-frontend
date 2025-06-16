// components/LegacySection.tsx
import type { LegacyContent } from '@/types/api'; // Adjust import path
import Image from 'next/image'; // Using next/image is recommended

// Define Props interface accepting the LegacyContent object
interface LegacySectionProps {
  legacyContent: LegacyContent;
}

const LegacySection = ({ legacyContent }: LegacySectionProps) => {
  // Destructure properties from the legacyContent object
  const { title, image, description, cta } = legacyContent;

  // console.log("image is image" + JSON.stringify(image))

  // Safely access image URL from Strapi
  const imageUrl = image?.url ? process.env.NEXT_PUBLIC_STRAPI_URL + image.url : null;

  return (
    <section className="w-full my-10 px-4">
      <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto gap-8">
        {/* Left: Image */}
        <div className="w-full md:w-1/2 h-[400px] md:h-[500px] relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title || 'Legacy background'}
              fill
              className="object-cover rounded-xl"
              priority
              objectFit='contain'
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-xl"></div>
          )}
        </div>

        {/* Right: Text */}
        <div className="w-full md:w-1/2 text-left">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-gray-600 mb-6 text-base md:text-lg leading-relaxed">
              {description}
            </p>
          )}
          <button className="px-6 py-3 bg-pink-700 text-white rounded hover:bg-pink-800 transition">
            {cta}
          </button>
        </div>
      </div>
    </section>

  );
};

export default LegacySection;