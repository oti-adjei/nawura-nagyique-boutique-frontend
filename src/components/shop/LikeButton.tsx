// components/LikeButton.tsx
'use client';

import { Heart } from 'lucide-react';

export default function LikeButton() {
  // You could add state here to track if the user has liked the product
  return (
    <button className="p-2 hover:text-red-500 transition">
      <Heart size={20} />
    </button>
  );
}