// components/shop/product/ProductImageGallery.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { getStrapiMedia } from '@/lib/utils';

// Lightbox Imports
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

// Plugin Imports
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

// --- FIX: You MUST import the CSS for the Thumbnails plugin ---
import "yet-another-react-lightbox/plugins/thumbnails.css";


interface ProductImageGalleryProps {
  productName: string;
  mainImage: string;
  allImages?: string[]; // Optional: if you want to display all images
  thumbnails: string[];
}

export default function ProductImageGallery({ productName, mainImage, allImages, thumbnails }: ProductImageGalleryProps) {

  console.log("ProductImageGallery Props:", {
    productName,
    mainImage,
    allImages,
    thumbnails
  });
  const [currentImage, setCurrentImage] = useState(allImages?.[0] || mainImage);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const handleThumbnailClick = (thumbUrl: string) => {
    //find the index of this thumbmail and set its allImages as the current image
    // If allImages is provided, find the corresponding image
   if (allImages && allImages.length > 0) {
      const thumbIndex = thumbnails.findIndex((img) => img === thumbUrl);
      if (thumbIndex !== -1 && thumbIndex < allImages.length) {
        console.log(`Setting current image to: ${allImages[thumbIndex]}`);
        setCurrentImage(allImages[thumbIndex]);
      } else {
        // Fallback: If for some reason the thumbnail isn't found or index is out of bounds,
        // or if allImages isn't used, just use the thumbnail URL as the main image.
        // This assumes thumbnails are also full-size or acceptable for main display.
        setCurrentImage(thumbUrl);
      }
    } else {
      // If allImages prop is not provided, we just use the thumbnail URL itself as the main image.
      setCurrentImage(thumbUrl);
    }
  };

  const lightboxSlides = thumbnails.map((thumb) => ({
    src: getStrapiMedia(thumb),
    alt: productName,
    width: 2000,
    height: 2667,
  }));

  return (
    <div className="lg:w-1/2 flex flex-col gap-4">

      {/* Main Image */}
      <div className="relative w-full rounded-lg overflow-hidden shadow-sm aspect-square">
        <Image
          src={getStrapiMedia(currentImage)}
          alt={productName}
          fill
          className="object-contain cursor-pointer"
          priority
          // --- FIX: Add a precise 'sizes' prop to prevent blurriness ---
          sizes="(max-width: 1024px) 80vw, 45vw"
          onClick={() => {
            const currentIndex = thumbnails.findIndex((thumb) => thumb === currentImage);
            setLightboxIndex(currentIndex > -1 ? currentIndex : 0);
          }}
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 justify-center lg:justify-start">
        {thumbnails.map((thumb, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(thumb)}
            className={`relative w-16 h-20 sm:w-[70px] sm:h-[93px] rounded-md overflow-hidden border-2 ${currentImage === thumb ? 'border-gray-800' : 'border-transparent'} hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all`}
          >
            <Image
              src={getStrapiMedia(thumb)}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* The Lightbox Component */}
      <Lightbox
        // --- FIX: Register the Thumbnails and Zoom plugins here ---
        plugins={[Thumbnails, Zoom]}

        // Control the lightbox state
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={lightboxSlides}

        // Use the render prop to optimize images within the lightbox
        render={{
          slide: ({ slide, rect }) => (
            <Image
              src={slide.src}
              alt={slide.alt || ""}
              fill
              className="object-contain"
              // --- FIX: Add the 'sizes' prop here for crisp lightbox images ---
              sizes="100vw"
            />
          ),
        }}
      />
    </div>
  );
}