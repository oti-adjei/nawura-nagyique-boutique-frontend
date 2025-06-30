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
  const { name, price, imageUrl, outOfStock, description, sizes, originalPrice } = product;
  const [selectedSize, setSelectedSize] = useState('');
  const addToCart = useCartStore((state) => state.addToCart);

  

  const handleAddToCart = () => {
    if (!selectedSize) return alert('Please select a size before adding to cart');
    addToCart({ ...product, selectedSize, quantity: 1 });
  };

  return (
    <div className="relative h-[480px] group rounded-xl overflow-hidden shadow-[0 1px 3px 0 rgb(0 0 0 / 0.75)] hover:shadow-sm transition-all bg-white-300">
      {outOfStock && (
        <span className="absolute top-3 left-3 z-10 bg-primary/30 text-white text-caption font-bold px-2 py-1 rounded-full shadow">
          OUT OF STOCK
        </span>
      )}

      <div className="absolute top-3 right-3 z-10">
        <LikeButton />
      </div>

      <div className="relative w-full overflow-hidden" style={{ height: '65%' }}>
        <Image
          src={getStrapiMedia(imageUrl)}
          alt={name || 'Product Image'}
          fill
          className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:rounded-lg"
        />
      </div>

      {/* --- CHANGE 5: Matched padding and min-height for consistent card dimensions --- */}
      <div className="p-3 min-h-[120px] flex flex-col justify-between ">
        {/* The unique content of New Arrivals is preserved below */}
        <div className="flex-grow min-h-[100px]">
         

          {/* Added group-hover effect to the title to match the other section */}
          <p className="mt-1 text-sm font-medium text-gray-900 line-clamp-2 leading-snug group-hover:text-primary">
            {product.name}
          </p>

          <p className="text-gray-500 mb-1 line-clamp-1">{description}</p>

          {/* Star Rating */}
          <div className="mt-2 flex items-center gap-1 text-sm">
            <div className="flex items-center gap-0.5 text-yellow-400">
              <span>★</span><span>★</span><span>★</span><span className="text-gray-300">★</span><span className="text-gray-300">★</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</p>
          {product.originalPrice && (
            <p className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>
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
    </div>
  );
}

