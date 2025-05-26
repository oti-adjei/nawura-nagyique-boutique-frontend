import type { Feature } from '@/types/api'; // Adjust import path (uses id, title, icon)
import Image from 'next/image';

// Define Props interface accepting an array of Feature objects
interface FeaturesProps {
  features: Feature[];
}

const Features = ({ features }: FeaturesProps) => {
  // Check if there are any features to display
  if (!features || features.length === 0) {
    return null; // Or render a placeholder
  }

  return (
    <section className="py-10 px-4 md:px-10 bg-gray-50 my-6">
      {/* Optional: Add a title if desired */}
      {/* <h2 className="text-xl font-bold text-center mb-8">Why Choose Us?</h2> */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {features.map((feature) => (
          // Use feature.id for the key
          <div key={feature.id} className="p-4">
            {feature.icon ? (
              <div className="relative mx-auto w-12 h-12 mb-3"> {/* Added relative positioning */}
                <Image
                  src={feature.icon}
                  alt={feature.title || 'Feature icon'}
                  fill // Use fill for better control within the container
                  className="object-contain" // Keep object-contain for icons
                />
                {/* Fallback if using standard img tag: */}
                {/* <img src={feature.icon} alt={feature.title} className="mx-auto w-12 h-12 mb-2" /> */}
              </div>
            ) : (
              <div className="mx-auto w-12 h-12 mb-3 bg-gray-200 rounded-full"></div> // Placeholder
            )}
            <h3 className="text-sm md:text-base font-semibold mb-1">{feature.title}</h3>
            {/* Description is not included in the API type we defined earlier */}
            {/* <p className="text-xs text-gray-600">{feature.description}</p> */}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;