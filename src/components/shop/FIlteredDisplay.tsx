// components/shop/FilteredProductDisplay.tsx
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import { Product, toDisplayProduct } from '@/types/product';
import FilterOptions, { ActiveFilters, MainFilter, SubFilter } from './FilterOption';


interface FilteredProductDisplayProps {
  initialProducts: Product[]; // Products fetched from the server
}

export default function FilteredProductDisplay({ initialProducts }: FilteredProductDisplayProps) {
  // This state holds the filters that are ACTUALLY applied to the products
  const [appliedFilters, setAppliedFilters] = useState<ActiveFilters>({});

  console.log('ProductCard rendered with product:', initialProducts);

  // --- FILTERING LOGIC ---
  const filteredProducts = useMemo(() => {
    let currentProducts = initialProducts;

    // Iterate through the applied filters and filter the products
    Object.entries(appliedFilters).forEach(([mainFilterKey, subFilterValue]) => {
      const mainFilter = mainFilterKey as MainFilter; // Cast for type safety

      // Logic for 'Clothing', 'Shirts', 'Shoes', 'Hats' (with sub-filters)
      if (['Clothing', 'Shirts', 'Shoes', 'Hats'].includes(mainFilter)) {
        if (subFilterValue === 'All') {
          // If 'All' is selected for a main filter, just filter by the main category
          currentProducts = currentProducts.filter(
            product => product.category === mainFilter
          );
        } else {
          // If a specific sub-filter is selected, filter by main category AND sub-filter
          currentProducts = currentProducts.filter(
            product => product.category === mainFilter && product.category.includes(subFilterValue as SubFilter)
            // product => product.category === mainFilter && product.tags.includes(subFilterValue as SubFilter)
            // IMPORTANT: Adjust `product.tags.includes(subFilterValue)` if your product data structure
            // for men/women/kids is different. It might be another field or part of category.
            // For example, if your product category could be "Clothing-Men", you'd adjust this logic.
          );
        }
      }
      // Logic for 'Purses', 'Handbags', 'Bracelets', 'Necklace' (without sub-filters)
      else if (['Purses', 'Handbags', 'Bracelets', 'Necklace'].includes(mainFilter)) {
        currentProducts = currentProducts.filter(
          product => product.category === mainFilter
        );
      }
    });

    return currentProducts;
  }, [initialProducts, appliedFilters]); // Re-run when initialProducts or appliedFilters change


  // --- HANDLERS FOR FILTEROPTIONS ---

  const handleApplyFilters = (newFilters: ActiveFilters) => {
    setAppliedFilters(newFilters); // Update the state that controls product filtering
  };

  const handleClearAllFilters = () => {
    setAppliedFilters({}); // Clear all applied filters
  };

  return (
    <>
      {/* Pass the active filters and callbacks to FilterOptions */}
      <FilterOptions
        currentActiveFilters={appliedFilters}
        onApplyFilters={handleApplyFilters}
        onClearAllFilters={handleClearAllFilters}
      />

      {/* Products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link key={product.id} href={`/shop/${product.slug}`}>
              <ProductCard product={toDisplayProduct( product)} />
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">No products found matching your filters.</p>
        )}
      </div>
    </>
  );
}