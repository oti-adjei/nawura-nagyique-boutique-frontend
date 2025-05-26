// components/modals/SuccessModal.tsx
import { HiCheckCircle } from "react-icons/hi";
import { Dialog } from '@headlessui/react'; // For Dialog.Title if needed
import { useRef } from 'react';

interface SuccessModalProps {
  title?: string;
  message?: string;
  continueText?: string;
  onContinue: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  title = "Payment Successful",
  message = "Provider will be notified", // Or maybe "Your order has been placed!"
  continueText = "Continue",
  onContinue
}) => {
   const continueButtonRef = useRef(null); // Ref for initial focus

  return (
    <div className="text-center">
       <HiCheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" aria-hidden="true" />

       <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 dark:text-gray-100 mb-2">
         {title}
       </Dialog.Title>

       <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
         {message}
       </p>

       {/* Optional: Add Order ID or brief details here if needed */}
       {/* <p className="text-xs text-gray-400">Order ID: #123456789</p> */}

       <button
         ref={continueButtonRef} // Set ref for initial focus
         type="button"
         className="w-full inline-flex justify-center rounded-md border border-transparent bg-pink-600 px-4 py-2.5 text-base font-medium text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 sm:text-sm dark:focus:ring-offset-gray-800"
         onClick={onContinue}
       >
         {continueText}
       </button>
    </div>
  );
};

export default SuccessModal;