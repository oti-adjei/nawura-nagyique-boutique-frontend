import { Suspense } from 'react';
import SuccessClient from '../../components/checkout/SuccessClient'; // Import the client component we just created

// A simple loading fallback component
function Loading() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Loading Success Page...</h1>
        <p className="text-gray-600">Please wait a moment.</p>
    </div>
  );
}

// This is the new page - a Server Component. It has no 'use client'.
export default function SuccessPage() {
  return (
    <main>
      {/* 
        The Suspense boundary wraps the dynamic client component.
        This is what allows the build to succeed.
      */}
      <Suspense fallback={<Loading />}>
        <SuccessClient />
      </Suspense>
    </main>
  );
}