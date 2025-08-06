import React from 'react'; // Don't forget to import React
import Image from 'next/image';
import type { IconType } from 'react-icons'; // Assuming you use react-icons

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string | IconType;
}

import { FaTruck, FaHeadset, FaExchangeAlt, FaShieldAlt } from 'react-icons/fa';

const staticFeaturesData: Feature[] = [
  { 
    id: 401, 
    title: 'Free Shipping', 
    description: 'Free shipping on all US order or order above $200',
    icon: FaTruck 
  },
  { 
    id: 402, 
    title: '24x7 Support', 
    description: 'Contact us 24 hours a day, 7 days a week',
    icon: FaHeadset 
  },
  { 
    id: 403, 
    title: '30 Days Return', 
    description: 'Simply return it within 30 days for an exchange',
    icon: FaExchangeAlt 
  },
  { 
    id: 404, 
    title: 'Payment Secure', 
    description: 'Contact us 24 hours a day, 7 days a week',
    icon: FaShieldAlt 
  },
];

const Features = () => {
  const features = staticFeaturesData;

  return (
    <section className="py-10 px-4 md:px-10 bg-white my-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {features.map((feature) => {
          const IconComponent = feature.icon; // This line is key for React Icons

          return (
            <div key={feature.id} className="p-6 border border-gray-100 rounded-md bg-white shadow-sm flex flex-col items-center text-center">
              <div className="relative mx-auto w-16 h-16 mb-4 flex items-center justify-center">
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
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    feature.id === 403 ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <IconComponent 
                      className={`w-8 h-8 ${
                        feature.id === 403 ? 'text-white' : 'text-green-500'
                      }`} 
                    />
                  </div>
                )}
              </div>
              <h5 className="text-base md:text-lg font-semibold mb-2">{feature.title}</h5>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;