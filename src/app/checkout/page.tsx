// app/checkout/page.tsx
import CheckoutClient from '@/components/checkout/CheckoutClient'; // Adjust path
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import type { CartItem } from '@/types/checkout'; // Adjust path
import Link from 'next/link';

// Simulate fetching cart data (replace with your actual logic)
async function getCartItems(): Promise<CartItem[]> {
    console.log("Fetching cart items for checkout...");
    // Replace with your actual cart fetching logic (e.g., from context, API, session)
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay
    return [
        { id: 'prod1', name: "DuoComfort Sofa Premium", quantity: 1, price: 20.00, imageUrl: '/placeholder-cart-item.jpg', description: '2 pieces' },
        { id: 'prod2', name: "DuoComfort Sofa Premium", quantity: 1, price: 20.00, imageUrl: '/placeholder-cart-item.jpg', description: '2 pieces' },
        { id: 'prod3', name: "DuoComfort Sofa Premium", quantity: 1, price: 5.00, imageUrl: '/placeholder-cart-item.jpg', description: '2 pieces' },
        // You might have multiple items with the same product ID aggregated,
        // or your cart logic might handle quantities differently.
        // Adjust dummy data to reflect your cart structure.
    ];
}

export default async function CheckoutPage() {
    const cartItems = await getCartItems();
    const shippingCost = 5.00; // Example shipping cost

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <Header/>
            <div className="container mx-auto px-4 py-8 lg:py-12">
                {/* Breadcrumbs - Simple static version */}
                <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                    <ol className="flex items-center space-x-1">
                        <li><Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200">Home</Link></li>
                        <li><span className="mx-1">&gt;&gt;</span></li>
                        <li><Link href="/shop" className="hover:text-gray-700 dark:hover:text-gray-200">Shop</Link></li>
                        <li><span className="mx-1">&gt;&gt;</span></li>
                        <li><Link href="/cart" className="hover:text-gray-700 dark:hover:text-gray-200">Cart</Link></li>
                        <li><span className="mx-1">&gt;&gt;</span></li>
                        <li className="text-pink-600 font-medium" aria-current="page">Check out</li>
                    </ol>
                </nav>

                {/* Pass server-fetched data to the Client Component */}
                <CheckoutClient initialCartItems={cartItems} initialShippingCost={shippingCost} />
            </div>
            <Footer/>
        </div>
    );
}