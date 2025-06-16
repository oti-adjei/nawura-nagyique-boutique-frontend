
import { getRelatedProducts } from '@/lib/api';
import ProductCard from '../ProductCard';
import { toDisplayProduct, type DisplayProduct, type Product } from '@/types/product'; // Adjust path if needed



// --- Define Props Interface ---
interface RelatedProductsProps {
    currentProductId: string | number;
    // category?: string; // Optional: Add category if needed for fetching
  }

  export default  async function RelatedProducts({ currentProductId }: RelatedProductsProps) {
    // Fetch related products (will use dummy data for now)
  const Products: Product[] = await getRelatedProducts(currentProductId, 5); // Fetch 5 related items

  const relatedProducts: DisplayProduct[]= Products.map(product => toDisplayProduct(product));


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