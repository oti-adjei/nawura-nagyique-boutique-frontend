// // src/app/return/page.tsx
// "use client"; // <--- Add this directive at the very top

// import { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation'; // <--- Import useRouter and useSearchParams from next/navigation
// import { Box, Typography, CircularProgress } from '@mui/material';

// // This component is rendered inside the Stripe Checkout iframe.
// const ReturnPage = () => {
//   const [status, setStatus] = useState<string | null>(null);
//   const [customerEmail, setCustomerEmail] = useState<string | null>(null);
//   const router = useRouter();
//   const searchParams = useSearchParams(); // <--- Use useSearchParams to get query parameters

//   useEffect(() => {
//     // Get the session_id from the URL query string
//     const sessionId = searchParams.get('session_id'); // <--- Get session_id using searchParams.get()

//     if (typeof sessionId !== 'string') {
//       return;
//     }

//     // IMPORTANT: In a real application, you would make an API call here
//     // to your backend to securely retrieve the session status.
//     // The backend would then call `stripe.checkout.sessions.retrieve(sessionId)`
//     // to verify payment and prevent fraud.
//     //
//     // For this quickstart example, we'll just show a success message.
//     fetch(`/api/retrieve-checkout-session?session_id=${sessionId}`)
//       .then(res => res.json())
//       .then(data => {
//          setStatus(data.status);
//          setCustomerEmail(data.customer_email);
//       })
//       .catch(error => {
//         console.error("Error fetching checkout session:", error);
//         setStatus('error'); // Handle error state
//       });

//   }, [searchParams]); // <--- Depend on searchParams to re-run when query changes


//   if (status === 'complete') {
//     return (
//         <Box sx={{ p: 4, textAlign: 'center' }}>
//             <Typography variant="h5" gutterBottom>Payment Successful!</Typography>
//             <Typography>
//                 Thank you for your purchase. A confirmation email has been sent to {customerEmail}.
//             </Typography>
//         </Box>
//     );
//   }

//   if (status === 'open') {
//     // This can happen if the user clicks the back button.
//     // You might want to redirect them to the checkout page again.
//     // Example: router.push('/checkout');
//     return (
//         <Box sx={{ p: 4, textAlign: 'center' }}>
//            <Typography>Redirecting...</Typography>
//         </Box>
//     );
//   }

//   if (status === 'error') {
//     return (
//       <Box sx={{ p: 4, textAlign: 'center' }}>
//          <Typography variant="h5" color="error" gutterBottom>Payment Status Error</Typography>
//          <Typography>There was an issue retrieving your payment status. Please contact support if the problem persists.</Typography>
//       </Box>
//     );
//   }

//   // Show a loading state while we check the session status
//   return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
// };

// export default ReturnPage;

// app/return/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CircularProgress, Box, Typography, Paper, Button } from '@mui/material';
import Link from 'next/link';

// Import your Zustand cart store
import { useCartStore } from '@/store/cart/useCart';

export default function StripeReturnPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // Zustand action to clear the cart
  const clearCart = useCartStore((state) => state.clearCart);

  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'pending' | 'failed' | 'canceled' | 'expired'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Only proceed if we have a session ID and haven't already processed
    if (sessionId && paymentStatus === 'loading') {
      const verifyPayment = async () => {
        try {
          const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
          const data = await response.json();

          if (response.ok) {
            setPaymentStatus(data.status); // 'success', 'pending', 'failed', 'expired'
            if (data.status === 'success') {
              clearCart(); // Clear cart on successful payment
            }
          } else {
            // Handle HTTP errors from your API route
            setPaymentStatus('failed');
            setErrorMessage(data.error || 'Failed to verify payment with our system.');
          }
        } catch (error) {
          console.error("Error calling verify-payment API:", error);
          setPaymentStatus('failed');
          setErrorMessage('Could not connect to payment verification service. Please contact support.');
        }
      };

      verifyPayment();
    } else if (!sessionId) {
      // If no session ID is found in the URL
      setPaymentStatus('canceled');
      setErrorMessage('No payment session found. You may have canceled the checkout.');
    }
  }, [sessionId, paymentStatus, clearCart]); // Add clearCart to dependency array

  const renderContent = () => {
    switch (paymentStatus) {
      case 'loading':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>Verifying your payment...</Typography>
          </Box>
        );
      case 'success':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <Typography variant="h4" color="success.main" sx={{ mb: 2 }}>Payment Successful!</Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', mb: 3 }}>
              Thank you for your purchase. Your order has been placed successfully.
            </Typography>
            <Link href="/" passHref>
              <Button variant="contained" color="primary">
                Continue Shopping
              </Button>
            </Link>
          </Box>
        );
      case 'pending':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <Typography variant="h4" color="warning.main" sx={{ mb: 2 }}>Payment Pending</Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', mb: 3 }}>
              Your payment is currently being processed. You will receive a confirmation email shortly.
            </Typography>
            <Link href="/" passHref>
              <Button variant="contained" color="primary">
                Continue Shopping
              </Button>
            </Link>
          </Box>
        );
      case 'canceled':
      case 'failed':
      case 'expired':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <Typography variant="h4" color="error.main" sx={{ mb: 2 }}>
              {paymentStatus === 'canceled' ? 'Payment Canceled' : paymentStatus === 'expired' ? 'Payment Expired' : 'Payment Failed'}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
              {errorMessage || 'There was an issue processing your payment or you canceled the transaction.'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Please try again or contact support if the problem persists.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="/cart" passHref>
                <Button variant="outlined" color="primary">
                  Return to Cart
                </Button>
              </Link>
              <Link href="/" passHref>
                <Button variant="contained" color="primary">
                  Continue Shopping
                </Button>
              </Link>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      bgcolor: 'background.default',
    }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600, borderRadius: 2 }}>
        {renderContent()}
      </Paper>
    </Box>
  );
}