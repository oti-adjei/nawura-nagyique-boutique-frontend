// app/checkout/page.tsx
import CheckoutClient from '@/components/checkout/CheckoutClient'; // Adjust path
import Link from 'next/link';

export default async function CheckoutPage() {
    const shippingCost = 5.00; // Example shipping cost

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
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
                <CheckoutClient initialShippingCost={shippingCost} />
            </div>
        </div>
    );
}