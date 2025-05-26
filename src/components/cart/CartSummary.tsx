"use client";

import { useRouter } from "next/navigation";

interface CartSummaryProps {
  total: number;
}

export function CartSummary({ total }: CartSummaryProps) {
  const router = useRouter();

  return (
    <div className="mt-8 flex flex-col items-center sm:items-end">
      <div className="w-full sm:w-1/2 bg-gray-100 p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <button onClick={() => router.push('/shop')} className="text-gray-600 hover:underline">
            &lt;&lt; Go back to shopping
          </button>

          <div className="flex items-center gap-4">
            <span className="text-xl font-bold">{total.toFixed(2)} €</span>
            <button
              onClick={() => router.push('/checkout')}
              className="bg-primary text-white px-6 py-3 rounded"
            >
              Check Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
