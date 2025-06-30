// src/components/LocationDialog.tsx

"use client";

import { useEffect } from 'react';
import { useLocationStore, CountryData } from '@/store/location/useLocationStore';

interface LocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (country: CountryData) => void;
}

export default function LocationDialog({ isOpen, onClose, onSelect }: LocationDialogProps) {
  // --- CHANGE: Get data and actions directly from the store ---
  const { allCountries, isLoading, error, fetchCountries } = useLocationStore();

  // --- CHANGE: Trigger the fetch when the dialog is opened ---
  useEffect(() => {
    if (isOpen) {
      fetchCountries();
    }
  }, [isOpen, fetchCountries]);
  
  if (!isOpen) return null;

  const handleSelect = (country: CountryData) => {
    onSelect(country);
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
        {allCountries.map((country) => (
          <li key={country.code}>
            <button
              onClick={() => handleSelect(country)}
              className="flex w-full items-center space-x-4 rounded-md p-3 text-left hover:bg-gray-100"
            >
              <span className="text-2xl">{country.flag}</span>
              <div className="flex-auto">
                <p className="font-semibold text-gray-800">{country.name}</p>
                <p className="text-sm text-gray-500">Currency: {country.currency}</p>
              </div>
            </button>
          </li>
        ))}
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
        </div>
        <div className="max-h-[60vh] overflow-y-auto border-t border-b border-gray-200">
          {renderContent()}
        </div>
        <div className="p-4 bg-gray-50 rounded-b-lg">
          <button type="button" onClick={onClose} className="w-full rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}