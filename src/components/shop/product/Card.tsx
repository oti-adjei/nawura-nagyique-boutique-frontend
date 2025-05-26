// components/ProductCard.tsx (Updated)
import Image from 'next/image';
import { FaRegHeart } from 'react-icons/fa';
import type { RelatedProduct } from '@/types/product'; // Adjust path if needed

interface ProductCardProps {
  product: RelatedProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group border border-gray-200/80 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <div className="relative aspect-[3/4] bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          // Adjust sizes based on typical grid layout
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
        />
        <button
          aria-label="Add to Wishlist"
          className="absolute top-2.5 right-2.5 bg-white rounded-full p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <FaRegHeart size={18} />
        </button>
      </div>
      <div className="p-3 text-center">
         {/* Category is implied in name here, or you can add it if data has it */}
         {/* <p className="text-xs text-gray-500 uppercase">{product.category}</p> */}
        <h3 className="text-sm font-medium text-gray-800 truncate group-hover:text-red-600 transition-colors duration-200 mt-1">
          {product.name}
        </h3>
        {/* Removed Stars and Original Price */}
        <div className="mt-2">
          <span className="text-base font-semibold text-gray-900">
            ${product.price.toFixed(0)} {/* Display price without decimals as per design */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;