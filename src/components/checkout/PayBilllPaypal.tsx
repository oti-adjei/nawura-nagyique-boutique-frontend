// 'use client'
// components/PayBill.tsx
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, CircularProgress, Box, IconButton, Button } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { API_ROUTES } from '@/lib/constants';
import CloseIcon from '@mui/icons-material/Close';


// 1. IMPORT your Zustand store hook
import { useCartStore } from '@/store/cart/useCart';

// Initialize Stripe outside of the component to avoid re-creating on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaypalPayBillProps {
    open: boolean;
    onClose: () => void;
}

export const PaypalPayBill = ({ open, onClose, }: PaypalPayBillProps) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // 3. GET the cart items directly from the Zustand store.
    const cartItems = useCartStore((state) => state.items);

    useEffect(() => {
        // Only fetch the secret if the dialog is open and we don't have one already.
        if (open && !clientSecret && cartItems.length > 0) {
            setLoading(true);
            fetch(API_ROUTES.STRIPE_CHECKOUT_SESSION, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: cartItems }), // Send the amount to the backend
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Received data from API:", data);
                    if (data.clientSecret) {
                        setClientSecret(data.clientSecret);
                    }
                    // Handle potential errors from your API here
                })
                .catch((error) => {
                    console.error("Failed to fetch client secret:", error);
                    // Optionally, close the dialog or show an error message
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [open, clientSecret, cartItems, onClose]); // Rerun if the dialog opens

    const handleCloseDialog = () => {
        // Reset clientSecret when dialog closes so a new one is fetched next time
        setClientSecret(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth
            disableEscapeKeyDown // Prevents closing with the Escape key
            BackdropProps={{
                invisible: true, // You can set this to true if you don't want the backdrop to be visible
                onClick: () => { } // An empty function prevents closing on backdrop click
            }}>
            <DialogTitle sx={{ m: 0, p: 2 }}> {/* Added some padding for better spacing */}
                Complete Your Payment

                <IconButton
                    aria-label="close"
                    onClick={handleCloseDialog}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

            </DialogTitle>
            <DialogContent className='my-4 py-12 xl:max-w-screen-xl'>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
                {clientSecret && (
                    <EmbeddedCheckoutProvider
                        stripe={stripePromise}
                        options={{ clientSecret }}
                    >
                        <EmbeddedCheckout className="max-h-[80dvh]" />
                    </EmbeddedCheckoutProvider>
                )}
                {/* Close Button at the bottom of content */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button variant="outlined" onClick={handleCloseDialog}>
                        Close
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};