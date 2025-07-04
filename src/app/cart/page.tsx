'use client';

import { CartItemm } from "../../components/cart/CartItem";
import { CartSummary } from "../../components/cart/CartSummary";
import { useCartStore } from "@/store/cart/useCart";


export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.getTotal());

  return (
    <>
      <section className=" bg-white container mx-auto py-10">
        <h1 className="text-2xl text-black font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <p className="text-black">Your cart is empty.</p>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-6 text-gray-500 text-sm font-medium mb-4">
              <div className="col-span-2">Product</div>
              <div>Size</div>
              <div>Quantity</div>
              <div>Total</div>
              <div>Action</div>
            </div>

            <div className="space-y-6">
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

