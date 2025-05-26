// // app/components/RelatedProducts.jsx
// import Image from 'next/image';
// import Link from 'next/link';

// interface Product {
//     id: number;
//     title: string;
//     price: number;
//     image: string;
//     // Add other relevant product properties here
//    }
  
//    interface RelatedProductsProps {
//     products: Product[];
//    }

// const RelatedProducts = ({ products }: RelatedProductsProps) => {
//     return (
//         <div className="mt-8">
//             <h3 className="text-xl font-bold mb-4">You May Also Like</h3>
//             <div className="flex flex-wrap -mx-2">
//                 {products.map((product) => (
//                     <div key={product.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
//                         <Link href={`/product/${product.id}`} className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
//                             <Image
//                                 src={product.image} // Ensure product.image is a valid URL or path
//                                 alt={product.title}
//                                 width={300} // Adjust as needed
//                                 height={300} // Adjust as needed
//                                 className="rounded-lg mb-2"
//                             />
//                             <h4 className="text-lg font-semibold">{product.title}</h4>
//                             <p className="text-gray-600">${product.price}</p>
//                         </Link>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default RelatedProducts;

// components/RelatedProducts.tsx (Updated)
import { getRelatedProducts } from '@/lib/api';
import ProductCard from '../ProductCard';
import type { Product, RelatedProduct } from '@/types/product'; // Adjust path if needed

// Sample Data (Updated)
const sampleRelatedProducts: RelatedProduct[] = [
    { id: 'rp1', name: "Alpaca Wool Cropped Cardigan", category: "Knitwear", imageUrl: "/placeholder-related1.jpg", price: 248, rating: 0 /* not displayed */ },
    { id: 'rp2', name: "Alpaca Wool Cropped Cardigan", category: "Knitwear", imageUrl: "/placeholder-related2.jpg", price: 248, rating: 0 /* not displayed */ },
    { id: 'rp3', name: "Alpaca Wool Cropped Cardigan", category: "Knitwear", imageUrl: "/placeholder-related3.jpg", price: 248, rating: 0 /* not displayed */ },
    { id: 'rp4', name: "Alpaca Wool Cropped Cardigan", category: "Knitwear", imageUrl: "/placeholder-related4.jpg", price: 248, rating: 0 /* not displayed */ },
    // Add a 5th if you want 5 columns on largest screens
    // { id: 'rp5', name: "Alpaca Wool Cropped Cardigan", category: "Knitwear", imageUrl: "/placeholder-related1.jpg", price: 248, rating: 0 /* not displayed */ },
];

// --- Define Props Interface ---
interface RelatedProductsProps {
    currentProductId: string | number;
    // category?: string; // Optional: Add category if needed for fetching
  }

  export default  async function RelatedProducts({ currentProductId }: RelatedProductsProps) {
    // Fetch related products (will use dummy data for now)
  const relatedProducts: Product[] = await getRelatedProducts(currentProductId, 5); // Fetch 5 related items

  // Handle case with no related products
  if (!relatedProducts || relatedProducts.length === 0) {
    return null; // Don't render the section if there's nothing to show
  }

  return (
    <div className="py-12 lg:py-16 bg-white"> {/* Changed background to white */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8 lg:mb-10"> {/* Align left */}
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight sm:text-2xl">
            Product You May Also Like
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Don't wait. The time will never be just right.
          </p>
        </div>
        {/* Responsive Grid */}
        <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-2 md:grid-cols-4 lg:gap-x-6 xl:gap-x-8">
          {/* Adjust columns: 2 on mobile, 4 on medium+, keep gap reasonable */}
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};