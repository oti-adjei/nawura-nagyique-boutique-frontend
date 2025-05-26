// components/ProductCard.tsx
'use client';

import Image from 'next/image';
// import { Heart } from 'lucide-react';
import LikeButton from './LikeButton';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cart/useCart';
import { useState } from 'react';
import { getStrapiMedia } from '@/lib/utils';

// Define props to accept a single 'product' object
interface ProductCardProps {
  product: Product;
}


export default function ProductCard({ product }: ProductCardProps) {
  const { name, price, imageUrl, outOfStock, description,sizes } = product;
   const [selectedSize, setSelectedSize] = useState('');
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    if (!selectedSize) return alert('Please select a size before adding to cart');
    addToCart({ ...product, selectedSize, quantity: 1 });
  };

  return (
    <div className="relative group border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all bg-white">
      {outOfStock && (
        <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          OUT OF STOCK
        </span>
      )}

      <div className="absolute top-3 right-3 z-10">
        <LikeButton />
      </div>

      <div className="relative w-full h-80 overflow-hidden">
        <Image
          src={getStrapiMedia(imageUrl)}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-md font-semibold text-gray-900">{name}</h3>
        {description && (
          <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        )}

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-black">${price}</p>
        </div>

        {/* {tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )} */}
      </div>

      {/* Size Selection */}
      {sizes && sizes.length > 0 && (
        <select
          className="mt-2 w-full border rounded px-2 py-1 text-sm"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
        >
          <option value="">Select Size</option>
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      )}

      {!outOfStock && (
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-gray-800"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}

// export default function ProductCard({ product }: ProductCardProps) {
//   // Destructure the needed properties *from* the product object inside the component
//   const { name, price, imageUrl, outOfStock } = product;
//   return (
//     <div className="relative group border p-2 rounded-lg shadow hover:shadow-md transition">
//       {outOfStock && (
//         <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
//           Out of Stock
//         </span>
//       )}
//       <div className="relative w-full h-64 aspect-[3/4]">
//         <Image
//           src={imageUrl}
//           alt={name}
//           fill
//           className="object-cover rounded"
//         />
//       </div>
//       <div className="flex justify-between items-start mt-3">
//         <div>
//           <h3 className="text-sm font-semibold">{name}</h3>
//           <p className="text-gray-700 font-bold mt-1">${price}</p>
//         </div>
//         <LikeButton/>
//         {/* <button className="p-2 hover:text-red-500 transition">
//           <Heart size={20} />
//         </button> */}
//       </div>
//     </div>
//   );
// }
