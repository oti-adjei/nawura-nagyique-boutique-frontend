// src/components/LocationDialog.tsx

"use client";

import { useEffect, useState } from 'react';
import { useLocationStore, CountryData } from '@/store/location/useLocationStore';

interface LocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (country: CountryData) => void;
}

export default function LocationDialog({ isOpen, onClose, onSelect }: LocationDialogProps) {
  // --- CHANGE: Get data and actions directly from the store ---
  const { allCountries, isLoading, error, fetchCountries, country, isAutoDetected, resetToAutoDetect } = useLocationStore();
  const [searchTerm, setSearchTerm] = useState('');

  // --- CHANGE: Trigger the fetch when the dialog is opened ---
  useEffect(() => {
    if (isOpen) {
      fetchCountries();
      setSearchTerm(''); // Reset search when dialog opens
    }
  }, [isOpen, fetchCountries]);

  // Filter countries based on search term
  const filteredCountries = allCountries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (!isOpen) return null;

  const handleSelect = (country: CountryData) => {
    onSelect(country);
    onClose();
  };

  const handleReset = async () => {
    await resetToAutoDetect();
    onClose();
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <div className="p-6 text-center text-gray-500">Loading countries...</div>;
    }
    if (error) {
      return <div className="p-6 text-center text-red-500">{error}</div>;
    }
    return (
      <ul className="divide-y divide-gray-100 p-2">
        {filteredCountries.length === 0 ? (
          <li className="p-4 text-center text-gray-500">
            No countries found matching "{searchTerm}"
          </li>
        ) : (
          filteredCountries.map((countryItem) => (
            <li key={countryItem.code}>
              <button
                onClick={() => handleSelect(countryItem)}
                className="flex w-full items-center space-x-4 rounded-md p-3 text-left hover:bg-gray-100"
              >
                <span className="text-2xl">{countryItem.flag}</span>
                <div className="flex-auto">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">{countryItem.name}</p>
                    {isAutoDetected && countryItem.code === country.code && (
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                        Detected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Currency: {countryItem.currency}</p>
                </div>
              </button>
            </li>
          ))
        )}
      </ul>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog">
      <div className="fixed inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative w-full max-w-md transform rounded-lg bg-white shadow-2xl">
        <div className="p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900">Select Your Location</h3>
          <p className="mt-2 text-sm text-gray-500">
            This will help us customize your shopping experience.
          </p>
          {isAutoDetected && (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">
                📍 We detected you're in <strong>{country.name}</strong>. You can change this if needed.
              </p>
            </div>
          )}
        </div>
        
        {/* Search Input */}
        <div className="px-6 pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search countries or currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              autoFocus
            />
          </div>
        </div>
        
        <div className="max-h-[50vh] overflow-y-auto border-t border-b border-gray-200">
          {renderContent()}
        </div>
        <div className="p-4 bg-gray-50 rounded-b-lg">
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={handleReset}
              className="flex-1 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 border border-blue-200"
            >
              🔄 Auto-Detect
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Close
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 text-center">
            Auto-Detect will use your IP address to find your location
          </p>
        </div>
      </div>
    </div>
  );
}