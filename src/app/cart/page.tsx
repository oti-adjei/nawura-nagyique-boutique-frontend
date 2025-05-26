'use client';

import Header from "@/components/common/Header";
import { CartItemm } from "../../components/cart/CartItem";
import { CartSummary } from "../../components/cart/CartSummary";
import Footer from "@/components/common/Footer";
import { useCartStore } from "@/store/cart/useCart";


export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.getTotal());

  return (
    <>
      <Header />
      <section className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <p>Your cart is empty.</p>
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
      <Footer />
    </>
  );
}


// export default function CartPage() {
//     // For now, we fake the cart items
//     const cartItems = [
//         {
//             id: 1,
//             name: "Grey Acid Wash Wide Leg Jogger",
//             price: 41,
//             size: "M",
//             quantity: 3,
//             imageUrl: "/images/product-1.png",
//             colors: ["#2D3748", "#CBD5E0", "#A0AEC0", "#F6E05E"],
//         },
//         {
//             id: 2,
//             name: "Grey Acid Wash Wide Leg Jogger",
//             price: 41,
//             size: "M",
//             quantity: 3,
//             imageUrl: "/images/product-1.png",
//             colors: ["#2D3748", "#CBD5E0", "#A0AEC0", "#F6E05E"],
//         },
//     ];

//     const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

//     return (
//         <>
//             <Header />
//             <section className="container mx-auto py-10">
//                 <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

//                 <div className="hidden md:grid grid-cols-6 text-gray-500 text-sm font-medium mb-4">
//                     <div className="col-span-2">Product</div>
//                     <div>Size</div>
//                     <div>Quantity</div>
//                     <div>Total</div>
//                     <div>Action</div>
//                 </div>

//                 <div className="space-y-6">
//                     {cartItems.map(item => (
//                         <CartItem key={item.id} item={item} />
//                     ))}
//                 </div>

//                 <CartSummary total={total} />
//             </section>
//             <Footer />
//         </>
//     );
// }
