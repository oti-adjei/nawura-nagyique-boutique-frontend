"use client"

import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ShopError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Shop page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-64 text-red-600">
      <h2 className="text-xl font-semibold">Something went wrong.</h2>
      <p className="mt-2">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Try again
      </button>
    </div>
  );
}
