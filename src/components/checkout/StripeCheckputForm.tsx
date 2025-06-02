"use client";

import { useState, FormEvent } from 'react';
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { StripePaymentElementOptions, PaymentIntent } from '@stripe/stripe-js'; // Removed StripeError as it's implicitly handled
import { useCartStore } from '@/store/cart/useCart';
import { Button } from '@headlessui/react';

export default function StripeCheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCartStore();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage("Stripe.js has not loaded yet. Please wait a moment and try again.");
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      },
    });

    setIsProcessing(false);

    if (result.error) {
      // An error occurred.
      if (result.error.type === "card_error" || result.error.type === "validation_error") {
        setMessage(result.error.message || "An unexpected error occurred with your card.");
      } else {
        setMessage(result.error.message || "An unexpected error occurred. Please try again.");
      }
      console.error("Stripe payment confirmation error:", result.error);

    } else {
      // No client-side error from confirmPayment itself (result.error is undefined).
      // We check if 'paymentIntent' property exists and is truthy.
      if ('paymentIntent' in result && result.paymentIntent) {
        // Explicitly assert the type of result.paymentIntent to PaymentIntent
        const pi = result.paymentIntent as PaymentIntent;

        // Now, TypeScript should fully trust that 'pi' is of type PaymentIntent
        // and allow access to 'pi.status' and other properties.

        if (pi.status === 'succeeded') {
          setMessage("Payment Succeeded! You will be redirected.");
          clearCart();
        } else if (pi.status === 'processing') {
          setMessage("Payment is processing. We'll update you soon. You may be redirected.");
        } else if (pi.status === 'requires_action' || pi.status === 'requires_confirmation') {
          setMessage("Further action is required to complete your payment. Please follow the instructions on the payment form.");
        } else {
          setMessage(`Payment status: ${pi.status}. You may be redirected or need to follow further instructions.`);
        }
        console.log("PaymentIntent details (no immediate error):", pi);
      } else {
        // This case should be rare if result.error is undefined
        setMessage("Payment confirmed, but essential payment details (PaymentIntent) are missing. Please check your Stripe dashboard or contact support.");
        console.error("Logical error: result.error is undefined, but 'paymentIntent' property is missing or falsy on result.", result);
      }
    }
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={(e) => setEmail(e.value.email)}
        className="mb-4"
      />
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-150 disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
      {message && (
        <div
          id="payment-message"
          className={`mt-4 p-3 rounded-md text-sm ${
            message.includes('Succeeded') || message.includes('processing')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}