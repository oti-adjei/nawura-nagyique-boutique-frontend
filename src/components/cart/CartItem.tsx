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

  // Pass both id and size to distinguish items
  // const handleIncrease = () => increaseQty(item.id, item.size);
  // const handleDecrease = () => decreaseQty(item.id, item.size);
  // const handleRemove = () => removeItem(item.id, item.size);
  const handleIncrease = () => increaseQty( (getIdAsNumber(item.id)));
  const handleDecrease = () => decreaseQty(getIdAsNumber(item.id));
  const handleRemove = () => removeItem(getIdAsNumber(item.id));


  return (
    <div className="flex flex-col md:grid md:grid-cols-6 gap-4 items-center border-b pb-4">
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
        <div className="text-sm font-medium">{item.name}</div>
      </div>

      {/* Size */}
      <div className="w-full md:text-start">{item.selectedSize}</div>

      {/* Quantity */}
      <div className="flex items-center gap-2 w-full md:justify-start">
        <button
          onClick={handleDecrease}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={handleIncrease}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          +
        </button>
      </div>

      {/* Total */}
      <div className="font-semibold w-full md:text-start">
        {(item.price * item.quantity).toFixed(2)} €
      </div>

      {/* Delete / Action */}
      <div className="w-full flex justify-end md:justify-start">
        <button
          className="text-red-500 hover:underline"
          onClick={handleRemove}
        >
          Remove Item
        </button>
      </div>
    </div>
  );
}