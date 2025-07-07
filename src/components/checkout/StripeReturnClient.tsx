'use client'; // This directive stays here

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CircularProgress, Box, Typography, Paper, Button } from '@mui/material';
import Link from 'next/link';
import { useCartStore } from '@/store/cart/useCart';

// Rename the function to something descriptive, e.g., StripeReturnClient
export default function StripeReturnClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

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