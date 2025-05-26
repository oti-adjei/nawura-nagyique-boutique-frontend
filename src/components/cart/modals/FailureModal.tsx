// components/modals/FailureModal.tsx
import { HiXCircle } from 'react-icons/hi';

import { Dialog } from '@headlessui/react';
import { useRef } from 'react';

interface FailureModalProps {
  title?: string;
  message: string; // Make message mandatory
  retryText?: string;
  cancelText?: string;
  onRetry?: () => void; // Retry might not always be applicable
  onClose: () => void; // Use onClose for cancelling/closing
}

const FailureModal: React.FC<FailureModalProps> = ({
  title = "Payment Failed",
  message,
  retryText = "Try Again",
  cancelText = "Close",
  onRetry,
  onClose
}) => {
  const closeButtonRef = useRef(null); // Focus the less destructive action

  return (
    <div className="text-center">
      <HiXCircle className="mx-auto h-16 w-16 text-red-500 mb-4" aria-hidden="true" />

      <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </Dialog.Title>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {message}
      </p>

      <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row-reverse gap-3">
        {onRetry && (
             <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent bg-pink-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 sm:text-sm dark:focus:ring-offset-gray-800"
                onClick={onRetry}
            >
                {retryText}
            </button>
        )}
        <button
          ref={closeButtonRef}
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm dark:focus:ring-offset-gray-800"
          onClick={onClose}
        >
          {cancelText}
        </button>
      </div>
    </div>
  );
};

export default FailureModal;