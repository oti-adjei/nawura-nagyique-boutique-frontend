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
    // <section className="relative w-full h-[400px] md:h-[500px] my-6">
    //   {/* Use next/image or fallback to img */}
    //   {imageUrl ? (
    //      <Image
    //         src={imageUrl}
    //         alt={title || 'Legacy background'}
    //         fill // Use fill to cover the container
    //         className="object-cover"
    //         priority // Consider adding priority if it's above the fold
    //       />
    //     // Fallback if using standard img tag:
    //     // <img src={image} alt={title} className="w-full h-full object-cover" />
    //   ) : (
    //     <div className="w-full h-full bg-gray-300"></div> // Placeholder if no image
    //   )}

    //   <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center text-white p-4">
    //     <div className="text-center max-w-xl">
    //       <h2 className="text-2xl md:text-4xl font-bold mb-4">{title}</h2>
    //       {/* Optionally display description if needed */}
    //       {description && (
    //         <p className="mb-6 text-base md:text-lg">{description}</p>
    //       )}
    //       {/* Use the cta text from the object */}
    //       <button className="px-5 py-2.5 bg-white text-black rounded font-medium hover:bg-gray-200 transition">
    //         {cta}
    //       </button>
    //     </div>
    //   </div>
    // </section>
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