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
            <h3 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h3>

            {/* Rating and Reviews */}
            {/* Assuming 'product' is available in your component's scope
                    and 'renderStars' is a function you have defined */}

            {/* Conditionally render the rating block */}
            {product.rating && product.rating > 0 && (
              <div className="mt-3 flex items-center gap-2">
                {/* Render stars (only called if rating is valid) */}
                {renderStars(product.rating)}

                {/* Render rating text */}
                <p className="text-sm text-gray-600">
                  {/* It's safe to use .toFixed now because product.rating is truthy */}
                  {product.rating.toFixed(1)}

                  {/* Also conditionally display review count if it exists and is positive */}
                  {product.reviewCount && product.reviewCount > 0 && (
                    ` (${product.reviewCount} reviews)` // Note the space added before parenthesis
                  )}
                  {/* Alternatively, if you want to show (0 reviews): */}
                  {/* ` (${product.reviewCount ?? 0} reviews)` */}
                </p>
              </div>
            )}

            {/* Price */}
            <div className="mt-4 flex items-baseline space-x-2">
              {typeof product.price === 'number' && (
                <p className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
              )}
              {product.originalPrice && typeof product.originalPrice === 'number' && (
                <p className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</p>
              )}
            </div>

            {/* Wishlist Button */}
            <button className="mt-4 flex items-center text-sm font-medium text-gray-600 hover:text-red-500">
              <FaRegHeart className="mr-1.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              Add to Wish List
            </button>


            {/* Separator */}
            <div className="mt-6 border-t border-gray-200 pt-6">

              {/* Color Selector */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">Color: <span className="font-normal text-gray-600">{product.colors?.[0]}</span></h3>
                <div className="relative mt-2 border border-gray-300 rounded-md px-3 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm flex justify-between items-center text-gray-600 bg-white">
                  <span>{product.colors?.[0]}</span>
                  <IoIosArrowDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size: <span className="font-normal text-gray-600">{selectedSize}</span></h3>
                </div>

                {/* Adjusted grid columns for responsiveness */}
                <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-6 xl:grid-cols-7">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        border rounded-md py-2 px-1 text-xs sm:text-sm font-medium flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                        ${selectedSize === size
                          // Updated Selected Style
                          ? 'bg-gray-800 border-gray-800 text-white hover:bg-gray-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }
                    `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart Row */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {/* Quantity Selector */}
                <div className="flex-shrink-0">
                  {/* <label htmlFor="quantity" className="sr-only">Quantity</label> */}
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={handleDecreaseQuantity}
                      className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700 border-l border-r border-gray-300 min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncreaseQuantity}
                      className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-r-md focus:outline-none focus:ring-1 focus:ring-gray-500"
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
                  className="cursor-pointer flex w-full sm:w-auto flex-1 items-center justify-center rounded-md border border-transparent bg-red-600 px-8 py-2.5 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >

                  <FaShoppingCart className="mr-2 h-5 w-5" aria-hidden="true" />
                  Add to Cart
                </button>
              </div>


              {/* Shipping Info */}
              <div className="mt-8 text-sm text-gray-500 bg-gray-50 p-4 rounded-md border border-gray-200">
                <p>Enjoy <span className="font-medium text-gray-700">FREE express & Free Returns</span> on orders over £35!</p>
                <p className="mt-1">Kindly place your order by 6pm on December 22nd for expedited processing.</p>
              </div>

              {/* Payment Methods */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900">Payment method</h4>
                <div className="mt-2 relative flex items-center space-x-3 sm:space-x-4">
                  {/* Using simple img tags for payment icons as svgs/react-icons might not match exactly */}
                  <FaCcVisa className="text-xl border border-gray-300 rounded m-0.5" />
                  <FaCcMastercard className="text-xl border border-gray-300 rounded m-0.5" />
                  <FaCcAmex className="text-xl border border-gray-300 rounded m-0.5" />
                  <a href="#" className="ml-auto text-sm font-medium text-red-600 hover:text-red-500 underline">
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