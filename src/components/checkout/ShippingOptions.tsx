import React from 'react';
import { ShippingOption } from '@/hooks/useShippingCalculator';

interface ShippingOptionsProps {
  options: ShippingOption[];
  selectedOption: ShippingOption | null;
  onSelectOption: (option: ShippingOption) => void;
  isLoading: boolean;
  error: string | null;
}

const ShippingOptions: React.FC<ShippingOptionsProps> = ({
  options,
  selectedOption,
  onSelectOption,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Shipping Options</h3>
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Calculating shipping rates...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold mb-3">Shipping Options</h3>
        <div className="text-red-600 text-sm">
          <p>Unable to calculate shipping: {error}</p>
          <p className="mt-1">Standard shipping rates will apply.</p>
        </div>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-3">Shipping Options</h3>
        <p className="text-gray-600 text-sm">Please enter your complete address to see shipping options.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-3">Shipping Options</h3>
      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option.serviceCode}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedOption?.serviceCode === option.serviceCode
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectOption(option)}
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 border rounded-full mr-3 flex items-center justify-center ${
                selectedOption?.serviceCode === option.serviceCode
                  ? 'border-blue-500'
                  : 'border-gray-400'
              }`}>
                {selectedOption?.serviceCode === option.serviceCode && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{option.serviceName}</h4>
                    {option.transitTime && (
                      <p className="text-sm text-gray-600">{option.transitTime}</p>
                    )}
                    {option.description && (
                      <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">
                      ${option.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedOption && (
        <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
          <strong>Selected:</strong> {selectedOption.serviceName} - ${selectedOption.price.toFixed(2)}
          {selectedOption.transitTime && ` (${selectedOption.transitTime})`}
        </div>
      )}
    </div>
  );
};

export default ShippingOptions;
