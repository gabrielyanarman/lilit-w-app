"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sample gallery images - replace with actual images
  const galleryImages = [
    { src: "/images/g1.jpg", alt: "Couple photo 1" },
    { src: "/images/g2.jpg", alt: "Couple photo 2" },
    { src: "/images/g3.jpg", alt: "Couple photo 3" },
    { src: "/images/g4.jpg", alt: "Couple photo 4" },
    { src: "/images/g5.jpg", alt: "Couple photo 5" },
    { src: "/images/g6.jpg", alt: "Couple photo 6" },
  ];

  // Auto-scrolling effect with infinite loop
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Pixels per frame - adjust for faster/slower scrolling

    // Calculate the width of a single set of images
    // This will be used to reset the scroll position for the infinite loop
    const calculateSetWidth = () => {
      if (!scrollContainer || !scrollContainer.firstElementChild) return 0;

      // Get the width of the first set of images (before duplication)
      const imageWidth = 300; // Width of each image
      const imageGap = 16; // Gap between images (4px gap * 4 sides)
      const totalImagesWidth = galleryImages.length * (imageWidth + imageGap);

      return totalImagesWidth;
    };

    const singleSetWidth = calculateSetWidth();

    const scroll = () => {
      if (!scrollContainer || singleSetWidth === 0) return;

      // Increment scroll position
      scrollPosition += scrollSpeed;

      // If we've scrolled past the first set of images, reset to the beginning
      // This creates the infinite loop effect
      if (scrollPosition >= singleSetWidth) {
        scrollPosition = 0;
        scrollContainer.scrollLeft = 0;
      }

      // Apply the scroll position
      scrollContainer.scrollLeft = scrollPosition;

      // Continue animation
      animationId = requestAnimationFrame(scroll);
    };

    // Start the animation
    animationId = requestAnimationFrame(scroll);

    // Pause scrolling when hovering
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationId);
    };

    const handleMouseLeave = () => {
      // Resume scrolling
      animationId = requestAnimationFrame(scroll);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    // Clean up
    return () => {
      cancelAnimationFrame(animationId);
      if (scrollContainer) {
        scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
        scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [galleryImages.length]);

  return (
    <section className="py-24 w-full">
      <div className="text-center mb-8">
        <Separator className="mx-auto w-24 mb-12" />
      </div>

      {/* Horizontal scrolling gallery with duplicated images for infinite loop */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex gap-4 px-4 pb-4">
          {/* Original set of images */}
          {galleryImages.map((image, index) => (
            <div
              key={`original-${index}`}
              className="relative flex-none w-[300px] h-[400px] rounded-sm overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(image.src)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}

          {/* Duplicated set of images for seamless looping */}
          {galleryImages.map((image, index) => (
            <div
              key={`duplicate-${index}`}
              className="relative flex-none w-[300px] h-[400px] rounded-sm overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(image.src)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image viewer modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Gallery image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
