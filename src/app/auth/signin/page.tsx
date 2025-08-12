import SignInForm from '@/components/auth/SignInForm';
import { Suspense } from 'react';
// We will create this component next

// This is the main page component. It's a Server Component.
// Its only job is to provide the Suspense boundary.
export default function SignInPage() {
  return (
    <Suspense fallback={<SignInPageSkeleton />}>
      <SignInForm />
    </Suspense>
  );
}


// A simple skeleton/fallback component to show while the main form loads.
// This improves the user experience and is a great pattern to use.
function SignInPageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-pulse">
        <div>
          <div className="mx-auto h-8 w-48 bg-gray-200 rounded" />
          <div className="mt-4 mx-auto h-4 w-64 bg-gray-200 rounded" />
        </div>
        <div className="mt-8 space-y-6">
          <div className="h-10 w-full bg-gray-200 rounded" />
          <div className="mt-6 h-12 w-full bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
}
