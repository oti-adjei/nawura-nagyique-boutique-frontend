// app/page.tsx (or your specific product page route)
import ProductDisplay from '@/components/shop/product/ProductDisplay'; // Adjust path if needed
import RelatedProducts from '@/components/shop/product/RelatedProducts'; // Adjust path if needed
import Footer from '@/components/common/Footer';
// import Header from '@/components/ui/Header';
import { getProductBySlug } from '@/lib/api';
import { Product, toDisplayProduct } from '@/types/product';
import { notFound } from 'next/navigation';



interface ProductPageParams {
    params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageParams) {
     // --- FIX: Await params before accessing slug ---
       const resolvedParams = await params;
    const { slug } = resolvedParams;
    const product: Product | null = await getProductBySlug(slug);
    console.log(" the product in Product Page is " + JSON.stringify(product, null, 2));

    // Handle case where product is not found (important for real API later)
    if (!product) {
        notFound(); // Or render a specific "Not Found" component
    }
    const DP=toDisplayProduct(product);
    console.log(" the converted Product to display is " + JSON.stringify(DP));

    return (
        <main className="bg-white">
            {/* <Header /> */}
            <ProductDisplay productData={DP} />
            {/* RelatedProducts might need separate logic or dummy data too */}
            <RelatedProducts currentProductId={product.id} />
            {/* <Footer /> */}
        </main>
    );
}
