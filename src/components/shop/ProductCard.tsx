// components/ProductCard.tsx
'use client';

import Image from 'next/image';
// import { Heart } from 'lucide-react';
import LikeButton from './LikeButton';
import { DisplayProduct } from '@/types/product';
import { useCartStore } from '@/store/cart/useCart';
import { useState } from 'react';
import { getStrapiMedia } from '@/lib/utils';

// Define props to accept a single 'product' object
interface ProductCardProps {
  product: DisplayProduct;
}


export default function ProductCard({ product }: ProductCardProps) {
  const { name, price, imageUrl, outOfStock, description,sizes,originalPrice } = product;
   const [selectedSize, setSelectedSize] = useState('');
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    if (!selectedSize) return alert('Please select a size before adding to cart');
    addToCart({ ...product, selectedSize, quantity: 1 });
  };

  return (
    <div className="relative h-[450px] group rounded-xl overflow-hidden shadow-[0 1px 3px 0 rgb(0 0 0 / 0.75)] hover:shadow-sm transition-all bg-white-300">
      {outOfStock && (
        <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          OUT OF STOCK
        </span>
      )}

      <div className="absolute top-3 right-3 z-10">
        <LikeButton />
      </div>

      <div className="relative w-full overflow-hidden" style={{height: '70%' }}>
        <Image
          src={getStrapiMedia(imageUrl)}
          alt={name}
          fill
          className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:rounded-lg"
        />
      </div>

      {/* <div className="p-4 space-y-2">
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
        )} 
      </div> */}

      {/* --- CHANGE 5: Matched padding and min-height for consistent card dimensions --- */}
            <div className="p-3 flex flex-col justify-between">
              {/* The unique content of New Arrivals is preserved below */}
             

              {/* Added group-hover effect to the title to match the other section */}
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug group-hover:text-pink-600">
                {name}
              </h3>

               <p className="text-xs text-gray-500 mb-1 line-clamp-1">{description}</p>

              {/* Star Rating */}
              <div className="mt-2 flex items-center gap-1 text-sm">
                <div className="flex items-center gap-0.5 text-yellow-400">
                  <span>★</span><span>★</span><span>★</span><span className="text-gray-300">★</span><span className="text-gray-300">★</span>
                </div>
              </div>

              {/* Price */}
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-sm font-bold text-gray-900">${price.toFixed(2)}</p>
                {originalPrice && (
                  <p className="text-sm text-gray-400 line-through">${originalPrice.toFixed(2)}</p>
                )}
              </div>
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

      {/* {!outOfStock && (
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-gray-800"
        >
          Add to Cart
        </button>
      )} */}
    </div>
  );
}