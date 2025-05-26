// components/toasts/AddToCartToast.tsx
"use client";

import { useState, useEffect, Fragment } from 'react';
import type { CartAdditionItem } from '@/types/cart'; // Use the specific type
import Image from 'next/image';

import { CiCircleCheck } from 'react-icons/ci';
import { HiMiniXMark } from "react-icons/hi2";
import Link from 'next/link';
import { Transition } from '@headlessui/react';

interface AddToCartToastProps {
  item: CartAdditionItem | null; // Item to display, or null to hide
  onClose: () => void; // Function to call when toast should close (e.g., set item state to null)
  duration?: number; // Auto-close duration in milliseconds
  viewCartHref?: string;
  checkoutHref?: string;
}

const AddToCartToast: React.FC<AddToCartToastProps> = ({
  item,
  onClose,
  duration = 5000, // Auto-close after 5 seconds by default
  viewCartHref = '/cart',
  checkoutHref = '/checkout'
}) => {
  const [show, setShow] = useState(false);

  // Effect to show the toast when 'item' changes
  useEffect(() => {
    if (item) {
      setShow(true);
      // Set a timer to auto-close
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      // Clear timer if component unmounts or item changes before duration ends
      return () => clearTimeout(timer);
    } else {
      setShow(false); // Hide if item becomes null
    }
  }, [item, duration]); // Dependency array includes item and duration

  const handleClose = () => {
    setShow(false);
    // Call the parent's onClose after the transition ends (or slightly before)
    // Using a timeout ensures the parent state updates after visual closing starts
    setTimeout(() => {
        onClose();
    }, 300); // Match transition duration
  };

  // Don't render anything if there's no item
  if (!item) return null;

 

  return (
    // Fixed positioning container
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-start justify-end p-4 pt-20 sm:p-6 z-50" // Adjust padding/margins as needed (pt-20 assumes header height)
    >
      {/* Transition for appearing/disappearing */}
      <Transition
        show={show}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-x-full opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="transform ease-in duration-300 transition"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="translate-x-full opacity-0"
      >
        {/* Actual Toast Content */}
        <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between pb-2 mb-3">
              <div className="flex items-center gap-2">
                <CiCircleCheck className="w-5 h-5 text-green-600 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Added to cart
                </p>
              </div>
              <div className="ml-3 flex flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  onClick={handleClose}
                  aria-label="Close"
                >
                  <HiMiniXMark className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex gap-4">
              {/* Image */}
              <div className="relative w-16 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
              </div>

              {/* Details */}
              <div className="flex-grow text-sm">
                <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">{item.name}</p>
                <p className="text-gray-700 dark:text-gray-200 mb-1">£{item.price.toFixed(2)}</p>
                {item.color && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Color: {item.color}</p>
                )}
                {item.size && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Size: {item.size}</p>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href={viewCartHref} passHref legacyBehavior>
                  <a
                    onClick={handleClose} // Close toast when navigating
                    className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                      View cart
                  </a>
              </Link>
              <Link href={checkoutHref} passHref legacyBehavior>
                <a
                    onClick={handleClose} // Close toast when navigating
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-800 dark:bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 dark:hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                    Checkout
                </a>
              </Link>
            </div>
          </div>
        </div>
      </Transition>
      
    </div>
  );
};

export default AddToCartToast;