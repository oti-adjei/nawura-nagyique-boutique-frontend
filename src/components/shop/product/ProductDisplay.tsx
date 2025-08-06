// components/shop/product/ProductDisplay.tsx
"use client";

import {  useCallback, useState } from 'react';

import { FaStar, FaRegStar, FaStarHalfAlt, FaRegHeart, FaShoppingCart, } from 'react-icons/fa';
// FaCcVisa, FaCcMastercard, FaCcAmex
import { IoIosArrowDown } from 'react-icons/io';
import type { DisplayProduct } from '@/types/product'; // Adjust path if needed
import type { CartAdditionItem } from '@/types/cart'; // Adjust path, add CartAdditionItem
import AddToCartToast from '@/components/cart/AddToCartToast';
import { CartItem, useCartStore } from '@/store/cart/useCart';
import { FaCcVisa, FaCcAmex, FaCcMastercard } from 'react-icons/fa6';
import ProductImageGallery from './ProductImageGallery';




// --- Define Props Interface ---
interface ProductDisplayProps {
  productData: DisplayProduct; // Expect the product data as a prop
}

export default function ProductDisplay({ productData }: ProductDisplayProps) {

  //console.log("ProductDisplay Props:", productData);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    return <div className="flex items-center">{stars}</div>;
  };

  const product = productData;
  //console.log("product in displaiy " + JSON.stringify(product))
  const [selectedSize, setSelectedSize] = useState<string | number>(product.sizes?.[0] ?? '');
  const [quantity, setQuantity] = useState<number>(1);
  // const [currentImage, setCurrentImage] = useState<string>(product.imageUrl);

  const [toastItem, setToastItem] = useState<CartAdditionItem | null>(null);

  // const handleThumbnailClick = (thumbUrl: string) => {
  //   setCurrentImage(thumbUrl);
  // };

  const handleIncreaseQuantity = () => setQuantity((prev) => prev + 1);
  const handleDecreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // --- ADD THIS: handleAddToCart function ---
  const handleAddToCart = useCallback(() => {
    //console.log("handleAddToCart FIRED!");
    // Access the Zustand action
    // const { addToCart } = useCartStore.getState(); // Or use the hook if preferred for reactivity

    // Get the addItem action from your Zustand store
    // Using .getState() is common for actions that don't need to trigger re-renders in this component directly.
    // If your store setup returns actions from the hook itself, you might do:
    // const { addItem } = useCartStore(); and add addItem to dependencies.
    const addItemToCartStore = useCartStore.getState().addToCart; // Assuming your store has an 'addItem' action

    // Construct the CartItem object
    // It spreads all properties from 'product' (DisplayProduct)
    // and adds/overrides 'quantity' and 'selectedSize'.
    const cartItemToAdd: CartItem = {
      ...product, // Spreads all properties from DisplayProduct
      quantity: quantity,
      selectedSize: String(selectedSize), // Ensures selectedSize is a string, as per CartItem interface
    };

    // Call the Zustand action to add the item to the cart
    addItemToCartStore(cartItemToAdd);
    console.log(`Added to cart via Zustand:`, cartItemToAdd);

    // Prepare item data for the toast
    // Uses data from cartItemToAdd for consistency, but currentImage for visual
    const itemForToast: CartAdditionItem = {
      name: cartItemToAdd.name,
      price: cartItemToAdd.price,
      imageUrl: product.imageUrl, // Use the visually current image for the toast
      color: cartItemToAdd.colors?.[0], // Or selected color if you implement that
      size: cartItemToAdd.selectedSize, // This is now a string
      // quantity: cartItemToAdd.quantity, // Add if your toast displays quantity
    };

    // Show the toast
    setToastItem(itemForToast);

  }, [product, quantity, selectedSize, setToastItem]);



    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumbs Removed */}

        {/* Changed main flex direction for better mobile layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
        
        <ProductImageGallery
          productName={product.name}
          mainImage={product.imageUrl}
          allImages={product.allImages || []}
          thumbnails={product.thumbnails || []}
        />

          {/* Product Info */}
          <div className="lg:w-1/2 mt-4 lg:mt-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            {product.rating && product.rating > 0 && (
              <div className="mt-3 flex items-center gap-1">
                {/* Render stars (only called if rating is valid) */}
                {renderStars(product.rating)}

                {/* Render rating text */}
                <span className="ml-2 text-gray-600">
                  {product.rating.toFixed(1)}
                  {product.reviewCount && product.reviewCount > 0 && (
                    <span className="text-gray-500"> ({product.reviewCount} reviews)</span>
                  )}
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mt-6 flex items-center space-x-4">
              {typeof product.price === 'number' && (
                <span className="text-3xl font-bold">$ {product.price.toFixed(2)}</span>
              )}
              {product.originalPrice && typeof product.originalPrice === 'number' && (
                <span className="text-xl text-gray-400 line-through">$ {product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {/* Wishlist Button */}
            <div className="mt-6">
              <button className="flex items-center text-base font-medium text-gray-700 hover:text-red-500 transition-colors">
                <FaRegHeart className="mr-2 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                Add to Wish List
              </button>
            </div>


            {/* Separator */}
            <div className="mt-8 border-t border-gray-200 pt-8">

              {/* Color Selector */}
              <div>
                <h3 className="text-lg font-medium text-gray-700">Color: <span className="font-bold text-gray-900">{product.colors?.[0]}</span></h3>
                <div className="relative mt-2 border border-gray-300 rounded-md px-4 py-3 text-left cursor-pointer hover:border-gray-400 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 flex justify-between items-center text-gray-800 bg-white">
                  <span className="font-medium">{product.colors?.[0]}</span>
                  <IoIosArrowDown className="h-5 w-5 text-gray-500" aria-hidden="true" />
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-700">Size: <span className="font-bold text-gray-900">{selectedSize}</span></h3>

                {/* Adjusted grid columns for responsiveness */}
                <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        border rounded-md py-2.5 px-1 text-sm font-medium flex items-center justify-center transition-colors duration-150 focus:outline-none
                        ${selectedSize === size
                          // Updated Selected Style
                          ? 'bg-gray-900 border-gray-900 text-white'
                          : 'border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }
                    `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart Row */}
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity Selector */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center border border-gray-300 rounded-md bg-gray-100">
                      <button
                        onClick={handleDecreaseQuantity}
                        className="px-5 py-3 text-gray-700 hover:bg-gray-200 rounded-l-md focus:outline-none transition-colors text-lg font-medium"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-6 py-3 text-base font-medium text-gray-900 border-l border-r border-gray-300 min-w-[60px] text-center bg-white">
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncreaseQuantity}
                        className="px-5 py-3 text-gray-700 hover:bg-gray-200 rounded-r-md focus:outline-none transition-colors text-lg font-medium"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="cursor-pointer flex w-full sm:flex-1 items-center justify-center rounded-md border border-transparent bg-red-600 px-8 py-3.5 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    <FaShoppingCart className="mr-2 h-5 w-5" aria-hidden="true" />
                    Add to Cart
                  </button>
                </div>
              </div>


              {/* Shipping Info */}
              <div className="mt-8">
                <p className="text-base">
                  Enjoy <span className="font-bold text-gray-900">FREE express</span> & <span className="font-bold text-gray-900">Free Returns</span> on orders over £35!
                </p>
                <p className="mt-2 text-gray-600">
                  Kindly place your order by 6pm on December 22nd for expedited processing
                </p>
              </div>

              {/* Payment Methods */}
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Payment method</h4>
                <div className="flex items-center gap-4">
                  <div className="border border-gray-300 rounded p-2">
                    <FaCcVisa className="text-2xl" />
                  </div>
                  <div className="border border-gray-300 rounded p-2">
                    <FaCcMastercard className="text-2xl" />
                  </div>
                  <div className="border border-gray-300 rounded p-2">
                    <FaCcAmex className="text-2xl" />
                  </div>
                  <a href="#" className="ml-auto text-base font-medium text-gray-700 hover:text-gray-900 underline">
                    Learn more
                  </a>
                </div>
              </div>
              
            </div> {/* End Separator */}
          </div>
        </div>
        {/* --- ADD THIS: Render the Toast Component --- */}
        {/* Its fixed positioning means placement in JSX doesn't alter its screen position */}
        <AddToCartToast
          item={toastItem}
          onClose={() => setToastItem(null)}
        />
      </div>
    );
  };