"use client";

import { useRouter } from "next/navigation";

interface CartSummaryProps {
  total: number;
}

export function CartSummary({ total }: CartSummaryProps) {
  const router = useRouter();

  return (
    <div className="mt-10 flex flex-col md:flex-row md:justify-between items-center">
      <button 
        onClick={() => router.push('/shop')} 
        className="text-gray-700 hover:underline flex items-center gap-1 mb-4 md:mb-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Go back to shopping
      </button>

      <button
        onClick={() => router.push('/checkout')}
        className="bg-red-700 text-white px-8 py-3 hover:bg-red-800 transition duration-200"
      >
        Check Out
      </button>
    </div>
  );
}
