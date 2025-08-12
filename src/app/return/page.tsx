'use client';

import { Suspense } from 'react';
import StripeReturnClient from '../../components/checkout/StripeReturnClient'; // Import the component we just made
import { Box, CircularProgress, Typography } from '@mui/material';

// This is a Server Component (no 'use client')
export default function ReturnPage() {
  return (
    <main>
      {/* 
        This Suspense boundary satisfies the Next.js build requirement.
        The fallback UI is what users see while the client component loads.
      */}
      <Suspense fallback={
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>Loading payment status...</Typography>
          </Box>
        </Box>
      }>
        <StripeReturnClient />
      </Suspense>
    </main>
  );
}