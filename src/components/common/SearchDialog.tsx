// components/SearchDialog.tsx

"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid';

// --- CHANGE START: Import your actual types and functions ---
import { Product } from '@/types/product'; // Adjust path if necessary
import { getProducts } from '@/lib/api'; // Adjust path to your api functions
import { getStrapiMedia } from '@/lib/utils'; // Adjust path to your utils
// --- CHANGE END ---

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- CHANGE START: Add state for products, loading, and errors ---
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // --- CHANGE END ---

  // --- CHANGE START: Fetch all products on component mount ---
  useEffect(() => {
    // Only fetch if the dialog is opened for the first time
    if (isOpen && allProducts.length === 0) {
      const loadProducts = async () => {
        try {
          setIsLoading(true);
          // NOTE: Your getProducts function returns the direct array of products
          const productsData = await getProducts();
          if (productsData) {
            setAllProducts(productsData);
          } else {
            throw new Error("No products returned from API.");
          }
        } catch (err) {
          console.error("Search Dialog Error:", err);
          setError("Could not load products. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };
      loadProducts();
    }
  }, [isOpen, allProducts.length]);
  // --- CHANGE END ---

  // Handle filtering logic
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }
    // Filter from the fetched `allProducts` state
    const filtered = allProducts.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filtered);
  }, [searchTerm, allProducts]);


  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Reset search term when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (isLoading) {
      return <div className="p-6 text-center text-sm text-gray-500">Loading products...</div>;
    }

    if (error) {
      return <div className="p-6 text-center text-sm text-red-500">{error}</div>;
    }

    if (searchTerm && results.length > 0) {
      return (
        <ul className="divide-y divide-gray-100 p-2">
          {results.map((product) => {
            // --- CHANGE START: Use your Product interface fields ---
            const imageUrl = getStrapiMedia(product.images?.[0]?.url);
            const altText = product.images?.[0]?.alternativeText || product.title;

            return (
              <li key={product.id}>
                <Link
                  href={`/shop/${product.slug}`} // Assuming your product page URL is /shop/[slug]
                  onClick={onClose}
                  className="flex items-center space-x-4 rounded-md p-3 hover:bg-gray-100"
                >
                  <Image
                    src={imageUrl || '/placeholder-product.jpg'} // Fallback image
                    alt={altText}
                    width={48}
                    height={48}
                    className="h-12 w-12 flex-none rounded-md object-cover bg-gray-200"
                  />
                  <div className="flex-auto">
                    <p className="font-semibold text-gray-800">{product.title}</p>
                    <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              </li>
            );
            // --- CHANGE END ---
          })}
        </ul>
      );
    }

    if (searchTerm && results.length === 0) {
      return (
        <div className="p-6 text-center text-sm text-gray-500">
          <p>No results found for &ldquo{searchTerm}&ldquo</p>
        </div>
      );
    }

    return (
      <div className="p-6 text-center text-sm text-gray-500">
        <p>Start typing to find amazing products.</p>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-lg transform rounded-lg bg-white shadow-2xl transition-all">
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            className="h-12 w-full border-0 bg-transparent focus:outline-none pl-11 pr-4 text-gray-800 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={onClose} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="max-h-[70vh] overflow-y-auto border-t border-gray-200">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}