// // components/checkout/StripeCheckoutForm.tsx
// "use client";

// import { useState, FormEvent, forwardRef, useImperativeHandle } from 'react'; // Added forwardRef, useImperativeHandle
// import {
//   PaymentElement,
//   LinkAuthenticationElement,
//   useStripe,
//   useElements,
// } from '@stripe/react-stripe-js';
// import { StripePaymentElementOptions, PaymentIntent } from '@stripe/stripe-js';
// import { useCartStore } from '@/store/cart/useCart';

// // Define the shape of the ref handle
// export interface StripeCheckoutFormHandle {
//   triggerSubmit: () => Promise<{ success: boolean; error?: string; paymentIntentStatus?: string }>;
// }

// interface StripeCheckoutFormProps {
//   // You can pass billingDetails here if needed for stripe.confirmPayment
//   // billingDetails?: { ... }
// }

// // Use forwardRef to pass the ref to the component
// const StripeCheckoutForm = forwardRef<StripeCheckoutFormHandle, StripeCheckoutFormProps>((props, ref) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const { clearCart } = useCartStore();

//   const [email, setEmail] = useState(''); // For LinkAuthenticationElement
//   const [message, setMessage] = useState<string | null>(null); // For internal messages/errors within the element
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Expose a function to the parent component via ref
//   useImperativeHandle(ref, () => ({
//     triggerSubmit: async () => {
//       if (!stripe || !elements) {
//         setMessage("Stripe.js has not loaded yet.");
//         return { success: false, error: "Stripe.js has not loaded yet." };
//       }

//       setIsProcessing(true);
//       setMessage(null);

//       const result = await stripe.confirmPayment({
//         elements,
//         confirmParams: {
//           return_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`, // Stripe handles redirect on success
//         },
//         redirect: 'if_required', // Important: Stripe handles redirect ONLY if necessary (e.g. 3DS)
//                                  // or if payment succeeds immediately.
//                                  // Allows us to handle success/error messages locally if no redirect happens.
//       });

//       setIsProcessing(false);

//       if (result.error) {
//         if (result.error.type === "card_error" || result.error.type === "validation_error") {
//           setMessage(result.error.message || "An unexpected error occurred with your card.");
//         } else {
//           setMessage(result.error.message || "An unexpected error occurred. Please try again.");
//         }
//         console.error("Stripe payment confirmation error:", result.error);

//         // --- MODIFIED PART ---
//         // Safely access paymentIntent status if paymentIntent exists
//         let paymentIntentStatus: string | undefined = undefined;
//         if (result.paymentIntent) { // Check if paymentIntent is present on the result
//             // If it is, then we can try to access its status
//             // We still use optional chaining for status as a precaution,
//             // or you could assert `result.paymentIntent as PaymentIntent` here too if confident.
//             paymentIntentStatus = (result.paymentIntent as PaymentIntent)?.status;
//         }
//         return { success: false, error: result.error.message || "Stripe payment failed.", paymentIntentStatus: paymentIntentStatus };
//       }

//       // If no error, and redirect: 'if_required' was used:
//       if (result.paymentIntent) {
//         const pi = result.paymentIntent as PaymentIntent;
//         if (pi.status === 'succeeded') {
//           setMessage("Payment Succeeded! Redirecting...");
//           clearCart();
//           // Stripe will redirect to return_url because status is succeeded
//           return { success: true, paymentIntentStatus: pi.status };
//         } else if (pi.status === 'processing') {
//           setMessage("Payment is processing...");
//            // Stripe might redirect or might not, depending on the payment method.
//           return { success: true, paymentIntentStatus: pi.status }; // Technically not "failed" yet
//         } else if (pi.status === 'requires_payment_method' || pi.status === 'requires_action' || pi.status === 'requires_confirmation'){
//             setMessage(`Payment requires further action (${pi.status}). Please follow prompts.`);
//             // Stripe Elements will typically handle displaying these prompts (e.g., 3DS modal)
//             // No redirect will happen yet from Stripe.js in this case.
//             return {success: false, error: `Payment requires further action (${pi.status})`, paymentIntentStatus: pi.status }
//         } else {
//             setMessage(`Payment status: ${pi.status}.`);
//             return { success: false, error: `Payment status: ${pi.status}`, paymentIntentStatus: pi.status };
//         }
//       }
//       // If we reach here without a paymentIntent (should be rare if no error and redirect: 'if_required')
//       return { success: false, error: "Stripe payment processing did not complete as expected." };
//     }
//   }));

//   const paymentElementOptions: StripePaymentElementOptions = {
//     layout: "tabs",
//   };

//   return (
//     // No <form> tag needed here, as submission is triggered externally
//     <div className="space-y-6">
//       <LinkAuthenticationElement
//         id="link-authentication-element"
//         onChange={(e) => setEmail(e.value.email)}
//         className="mb-4"
//       />
//       <PaymentElement id="payment-element" options={paymentElementOptions} />

//       {/* No "Pay Now" button here. It's handled by the parent. */}

//       {message && (
//         <div
//           id="stripe-payment-message" // Unique ID
//           className={`mt-4 p-3 rounded-md text-sm ${
//             message.includes('Succeeded') || message.includes('processing')
//               ? 'bg-green-100 text-green-700'
//               : 'bg-red-100 text-red-700'
//           }`}
//         >
//           {message}
//         </div>
//       )}
//     </div>
//   );
// });

// StripeCheckoutForm.displayName = 'StripeCheckoutForm'; // Good practice for forwardRef

// export default StripeCheckoutForm;


// components/checkout/StripeCheckoutForm.tsx
"use client";

import { useState, FormEvent, forwardRef, useImperativeHandle } from 'react';
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
// Import StripeError for better type handling if needed, though PaymentIntent covers a lot
import { StripePaymentElementOptions, PaymentIntent, StripeError } from '@stripe/stripe-js';
import { useCartStore } from '@/store/cart/useCart';

// Define the shape of the ref handle
export interface StripeCheckoutFormHandle {
  triggerSubmit: () => Promise<{ success: boolean; error?: string; paymentIntentStatus?: string }>;
}

interface StripeCheckoutFormProps {
  // You can pass billingDetails here if needed for stripe.confirmPayment
  // billingDetails?: { ... }
}

// Use forwardRef to pass the ref to the component
const StripeCheckoutForm = forwardRef<StripeCheckoutFormHandle, StripeCheckoutFormProps>((props, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCartStore();

  const [email, setEmail] = useState(''); // For LinkAuthenticationElement
  const [message, setMessage] = useState<string | null>(null); // For internal messages/errors within the element
  const [isProcessing, setIsProcessing] = useState(false);

  // Expose a function to the parent component via ref
  useImperativeHandle(ref, () => ({
    triggerSubmit: async () => {
      if (!stripe || !elements) {
        setMessage("Stripe.js has not loaded yet.");
        return { success: false, error: "Stripe.js has not loaded yet." };
      }

      setIsProcessing(true);
      setMessage(null);

      // --- CRITICAL CHANGE HERE: Destructure `error` and `paymentIntent` directly ---
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
        },
        redirect: 'if_required',
      });
      // --- END CRITICAL CHANGE ---


      setIsProcessing(false);

      // if (error) { // If an error object is present
      //   const errorMessage = error.message || "An unexpected error occurred.";
      //   if (error.type === "card_error" || error.type === "validation_error") {
      //     setMessage(error.message || "An unexpected error occurred with your card.");
      //   } else {
      //     setMessage(errorMessage);
      //   }
      //   console.error("Stripe payment confirmation error:", error);

      //   // Safely access paymentIntent status if it happens to be available on the error object
      //   // (though direct 'paymentIntent' is preferred if it's returned as part of the overall result).
      //   // `error.paymentIntent` is generally deprecated, so rely on the destructured `paymentIntent` variable.
      //   let paymentIntentStatus: string | undefined = paymentIntent?.status; // This will now correctly be typed

      //   return { success: false, error: errorMessage, paymentIntentStatus: paymentIntentStatus };
      // }

      if (error) { // If an error object is present
        const errorMessage = error.message || "An unexpected error occurred.";
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "An unexpected error occurred with your card.");
        } else {
          setMessage(errorMessage);
        }
        console.error("Stripe payment confirmation error:", error);

        // --- MODIFIED LINE: Safely access status ONLY if paymentIntent is actually defined ---
        // In the error case, `paymentIntent` returned from `confirmPayment` is typically `undefined`.
        // So, this will likely be `undefined` unless Stripe returns a very specific type of error
        // where a partial paymentIntent object is still present (rare for `confirmPayment`).
        // const paymentIntentStatus: string | undefined = paymentIntent ? paymentIntent.status : undefined;

        return { success: false, error: errorMessage, };
        // return { success: false, error: errorMessage, paymentIntentStatus: paymentIntentStatus };
      }

      // If we reach here, it means `error` was null/undefined,
      // which implies `paymentIntent` should be present (or an immediate redirect happened).
      // Stripe.js confirms the payment and handles the redirect.
      // If `redirect: 'if_required'` and no redirect, `paymentIntent` will be available.
      if (paymentIntent) { // This `paymentIntent` is now correctly typed as `PaymentIntent`
        const pi = paymentIntent; // No need for `as PaymentIntent` here, it's already typed
        if (pi.status === 'succeeded') {
          setMessage("Payment Succeeded! Redirecting...");
          clearCart();
          // Stripe will redirect to return_url because status is succeeded
          return { success: true, paymentIntentStatus: pi.status };
        } else if (pi.status === 'processing') {
          setMessage("Payment is processing...");
           // Stripe might redirect or might not, depending on the payment method.
          return { success: true, paymentIntentStatus: pi.status }; // Technically not "failed" yet
        } else if (pi.status === 'requires_payment_method' || pi.status === 'requires_action' || pi.status === 'requires_confirmation'){
            setMessage(`Payment requires further action (${pi.status}). Please follow prompts.`);
            // Stripe Elements will typically handle displaying these prompts (e.g., 3DS modal)
            // No redirect will happen yet from Stripe.js in this case.
            return {success: false, error: `Payment requires further action (${pi.status})`, paymentIntentStatus: pi.status }
        } else {
            setMessage(`Payment status: ${pi.status}.`);
            return { success: false, error: `Payment status: ${pi.status}`, paymentIntentStatus: pi.status };
        }
      }
      // This case should ideally not be reached if `error` is null and `redirect: 'if_required'`
      // but is a good fallback for unexpected scenarios (e.g., a very unusual Stripe response).
      return { success: false, error: "Stripe payment processing did not complete as expected (no error, no paymentIntent)." };
    }
  }));

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
  };

  return (
    // No <form> tag needed here, as submission is triggered externally
    <div className="space-y-6">
      <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={(e) => setEmail(e.value.email)}
        className="mb-4"
      />
      <PaymentElement id="payment-element" options={paymentElementOptions} />

      {/* No "Pay Now" button here. It's handled by the parent. */}

      {message && (
        <div
          id="stripe-payment-message" // Unique ID
          className={`mt-4 p-3 rounded-md text-sm ${
            message.includes('Succeeded') || message.includes('processing')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
});

StripeCheckoutForm.displayName = 'StripeCheckoutForm'; // Good practice for forwardRef

export default StripeCheckoutForm;