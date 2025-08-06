'use client';

import { CartItemm } from "../../components/cart/CartItem";
import { CartSummary } from "../../components/cart/CartSummary";
import { useCartStore } from "@/store/cart/useCart";
import Link from "next/link";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.getTotal());

  return (
    <>
      <section className="bg-white container mx-auto py-10">
        {/* Breadcrumb */}
        <div className="flex gap-2 mb-8 text-sm">
          <Link href="/">Home</Link>
          <span>&raquo;</span>
          <Link href="/shop">Shop</Link>
          <span>&raquo;</span>
          <span className="font-medium">Cart</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">Add some items to your cart before proceeding to checkout.</p>
            <a href="/shop" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Continue Shopping
            </a>
          </div>
        ) : (
          <>
            <div className="border-b border-gray-200 pb-2 hidden md:grid grid-cols-6 gap-4 items-center text-gray-700 font-medium mb-4">
              <div className="col-span-2">Product</div>
              <div className="md:text-center">Size</div>
              <div className="md:text-center">Quantity</div>
              <div className="md:text-center">Total</div>
              <div className="md:text-center">Action</div>
            </div>

            <div className="space-y-8">
              {items.map((item) => (
                <CartItemm key={item.id} item={item} />
              ))}
            </div>

            <CartSummary total={total} />
          </>
        )}
      </section>
    </>
  );
}

