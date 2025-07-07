'use client'; // This directive is essential and stays here

import Link from 'next/link';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cart/useCart';

// Rename the component to be more specific
export default function SuccessClient() {
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();

  const paymentIntentId = searchParams.get('payment_intent');

  useEffect(() => {
    // Logic to clear cart after successful payment
    if (paymentIntentId) {
        clearCart();
    }
  }, [paymentIntentId, clearCart]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <svg className="w-20 h-20 text-green-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase. Your order is being processed.
        {paymentIntentId && <span className="block mt-2">Order Reference: {paymentIntentId}</span>}
      </p>
      <Link href="/shop" className="bg-blue-600 text-white font-semibold py-3 px-6 rounded hover:bg-blue-700 transition duration-150">
          Continue Shopping
      </Link>
    </div>
  );
}