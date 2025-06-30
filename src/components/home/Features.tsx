import React from 'react'; // Don't forget to import React
import Image from 'next/image';
import type { IconType } from 'react-icons'; // Assuming you use react-icons

interface Feature {
  id: number;
  title: string;
  icon: string | IconType;
}

import { FaShippingFast, FaLifeRing, FaUndo, FaLock } from 'react-icons/fa';

const staticFeaturesData: Feature[] = [
  { id: 401, title: 'Free Shipping', icon: FaShippingFast },
  { id: 402, title: '24x7 Support', icon: FaLifeRing },
  { id: 403, title: '30 Days Return', icon: FaUndo },
  { id: 404, title: 'Payment Secure', icon: FaLock },
];

const Features = () => {
  const features = staticFeaturesData;

  return (
    <section className="py-10 px-4 md:px-10 bg-gray-50 my-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {features.map((feature) => {
          const IconComponent = feature.icon; // This line is key for React Icons

          return (
            <div key={feature.id} className="p-4">
              <div className="relative mx-auto w-12 h-12 mb-3 flex items-center justify-center">
                {typeof IconComponent === 'string' ? (
                  // It's a string (image path)
                  <Image
                    src={IconComponent}
                    alt={feature.title || 'Feature icon'}
                    fill
                    className="object-contain"
                  />
                ) : (
                  // It's a React component (like a react-icon)
                  <IconComponent className="w-8 h-8" /> // Adjust size and color as needed
                )}
              </div>
              <h5 className="text-sm md:text-base font-semibold mb-1">{feature.title}</h5>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;