// components/modals/ErrorModal.tsx
import { HiExclamationTriangle } from 'react-icons/hi2';
import { Dialog } from '@headlessui/react';
import { useRef } from 'react';

interface ErrorModalProps {
  title?: string;
  message?: string;
  closeText?: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  title = "An Error Occurred",
  message = "Something went wrong. Please try again later or contact support.",
  closeText = "Okay",
  onClose
}) => {
  const closeButtonRef = useRef(null);

  return (
    <div className="text-center">
      <HiExclamationTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-4" aria-hidden="true" />

      <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </Dialog.Title>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {message}
      </p>

      <button
        ref={closeButtonRef}
        type="button"
        className="w-full inline-flex justify-center rounded-md border border-transparent bg-pink-600 px-4 py-2.5 text-base font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 sm:text-sm dark:focus:ring-offset-gray-800"
        onClick={onClose}
      >
        {closeText}
      </button>
    </div>
  );
};

export default ErrorModal;