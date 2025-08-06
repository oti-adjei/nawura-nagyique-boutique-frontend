"use client";
import { CartItem, useCartStore } from "@/store/cart/useCart";
import Image from "next/image";
import { getStrapiMedia } from '@/lib/utils';

// interface CartItemProps {
//   item: {
//     id: number;
//     name: string;
//     price: number;
//     selectedSize: string;
//     quantity: number;
//     imageUrl: string;
//     colors: string[];
//   };
// }

interface CartItemProps {
  item: CartItem; // Expecting a prop named 'item' of type CartItem
}

export function CartItemm({ item }: CartItemProps) {
  const getIdAsNumber = (id: string | number): number => {
    if (typeof id === 'string') {
      const parsedId = Number(id);
      return isNaN(parsedId) ? -1 : parsedId; // Handle cases where the string is not a valid number
    }
    return id; // It's already a number
  };

  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const removeItem = useCartStore((state) => state.removeFromCart);

  const handleIncrease = () => increaseQty(getIdAsNumber(item.id));
  const handleDecrease = () => decreaseQty(getIdAsNumber(item.id));
  const handleRemove = () => removeItem(getIdAsNumber(item.id));

  // Define available colors for the color selector (based on the image)
  const colors = [
    { id: 'green', class: 'bg-green-600' },
    { id: 'navy', class: 'bg-blue-900' },
    { id: 'brown', class: 'bg-amber-800' },
    { id: 'beige', class: 'bg-amber-100' },
  ];

  return (
    <div className="flex flex-col md:grid md:grid-cols-6 gap-4 items-center border-b pb-6">
      {/* Product Image + Name */}
      <div className="flex items-center gap-4 md:col-span-2 w-full">
        <div className="relative w-24 h-24">
          <Image
            src={getStrapiMedia(item.imageUrl)}
            alt={item.name}
            fill
            className="object-cover rounded"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-base font-medium">{item.name}</div>
          <div className="text-gray-700 text-sm">{item.price.toFixed(2)}€</div>
          <div className="mt-1">
            <div className="text-sm text-gray-600 mb-1">Color</div>
            <div className="flex gap-2">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className={`w-6 h-6 rounded-full ${color.class} border border-gray-200 cursor-pointer`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Size */}
      <div className="w-full md:text-center">
        <div className="inline-block border border-gray-300 px-4 py-2 rounded min-w-[64px] text-center">
          {item.selectedSize}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center w-full md:justify-center">
        <div className="flex items-center border border-gray-300 rounded">
          <button
            onClick={handleDecrease}
            className="px-3 py-1 border-r border-gray-300"
          >
            -
          </button>
          <span className="px-4">{item.quantity}</span>
          <button
            onClick={handleIncrease}
            className="px-3 py-1 border-l border-gray-300"
          >
            +
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="font-bold text-lg w-full md:text-center">
        £{(item.price * item.quantity).toFixed(2)}
      </div>

      {/* Delete / Action */}
      <div className="w-full flex justify-end md:justify-center">
        <button
          className="flex items-center text-gray-600 hover:text-gray-800"
          onClick={handleRemove}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove item
        </button>
      </div>
    </div>
  );
}