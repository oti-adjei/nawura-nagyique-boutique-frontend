// src/app/shop/[slug]/page.tsx
import { notFound } from 'next/navigation';
import ProductDisplay from '@/components/shop/product/ProductDisplay';
import RelatedProducts from '@/components/shop/product/RelatedProducts';
import { getProductBySlug } from '@/lib/api';
import { toDisplayProduct } from '@/types/product';

export default async function ProductPage(
  props: {
    params: Promise<{ slug: string }>;
    // searchParams?: Promise<Record<string, string | string[] | undefined>>;
  }
) {
  const { slug } = await props.params;
  // If you use searchParams:
  // const search = await props.searchParams;

  const product = await getProductBySlug(slug);
  if (!product) notFound();
  console.log('product', product);

  const displayProduct = toDisplayProduct(product);
  console.log('displayProduct', displayProduct);
  return (
    <main className="bg-white">
      <ProductDisplay productData={displayProduct} />
      <RelatedProducts currentProductId={product.id} />
    </main>
  );
}

