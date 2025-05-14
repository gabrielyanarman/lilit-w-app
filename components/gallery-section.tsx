"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Sample gallery images - replace with actual images
  const galleryImages = [
    { src: "/images/g1.jpg", alt: "Couple photo 1" },
    { src: "/images/g2.jpg", alt: "Couple photo 2" },
    { src: "/images/g3.jpg", alt: "Couple photo 3" },
    { src: "/images/g4.jpg", alt: "Couple photo 4" },
    { src: "/images/g5.jpg", alt: "Couple photo 5" },
    { src: "/images/g6.jpg", alt: "Couple photo 6" },
  ];

  // Detect device type and iOS
  useEffect(() => {
    const checkDevice = () => {
      const mobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobile);

      // Check specifically for iOS
      const ios =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      setIsIOS(ios);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  // Auto-scrolling effect with infinite loop
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = isMobile ? 0.3 : 0.5; // Slower on mobile

    // Calculate the width of a single set of images
    const calculateSetWidth = () => {
      if (!scrollContainer || !scrollContainer.firstElementChild) return 0;

      // Get the width of the first set of images
      const imageWidth = isMobile ? 250 : 300; // Smaller on mobile
      const imageGap = 16; // Gap between images
      const totalImagesWidth = galleryImages.length * (imageWidth + imageGap);

      return totalImagesWidth;
    };

    const singleSetWidth = calculateSetWidth();

    const scroll = () => {
      if (!scrollContainer || singleSetWidth === 0) return;

      // Increment scroll position
      scrollPosition += scrollSpeed;

      // If we've scrolled past the first set of images, reset to the beginning
      if (scrollPosition >= singleSetWidth) {
        scrollPosition = 0;
        scrollContainer.scrollLeft = 0;
      }

      // Apply the scroll position
      scrollContainer.scrollLeft = scrollPosition;

      // Continue animation
      animationRef.current = requestAnimationFrame(scroll);
    };

    // Start the animation with a slight delay for iOS
    const timeoutId = setTimeout(
      () => {
        animationRef.current = requestAnimationFrame(scroll);
      },
      isIOS ? 500 : 0
    ); // Delay for iOS

    // Pause scrolling when interacting
    const handlePause = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    const handleResume = () => {
      // Only resume if not already animating
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(scroll);
      }
    };

    // For desktop
    scrollContainer.addEventListener("mouseenter", handlePause);
    scrollContainer.addEventListener("mouseleave", handleResume);

    // For mobile
    scrollContainer.addEventListener("touchstart", handlePause, {
      passive: true,
    });
    scrollContainer.addEventListener("touchend", handleResume);

    // Clean up
    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (scrollContainer) {
        scrollContainer.removeEventListener("mouseenter", handlePause);
        scrollContainer.removeEventListener("mouseleave", handleResume);
        scrollContainer.removeEventListener("touchstart", handlePause);
        scrollContainer.removeEventListener("touchend", handleResume);
      }
    };
  }, [galleryImages.length, isMobile, isIOS]);

  // Open image modal
  const openImageModal = (src: string, index: number) => {
    setSelectedImage(src);
    setSelectedIndex(index);
  };

  // Navigate between images in modal
  const navigateImage = (direction: "next" | "prev") => {
    const newIndex =
      direction === "next"
        ? (selectedIndex + 1) % galleryImages.length
        : (selectedIndex - 1 + galleryImages.length) % galleryImages.length;

    setSelectedIndex(newIndex);
    setSelectedImage(galleryImages[newIndex].src);
  };

  return (
    <section className="py-12 md:py-24 w-full overflow-hidden">
      <div className="text-center mb-6 md:mb-8">
        <Separator className="mx-auto w-16 md:w-24 mb-8 md:mb-12" />
      </div>

      {/* Horizontal scrolling gallery with duplicated images for infinite loop */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide w-full"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch", // Improve scroll on iOS
        }}
      >
        <div className="flex gap-3 md:gap-4 px-4 pb-4">
          {/* Original set of images */}
          {galleryImages.map((image, index) => (
            <div
              key={`original-${index}`}
              className="relative flex-none w-[250px] md:w-[300px] h-[320px] md:h-[400px] rounded-sm overflow-hidden cursor-pointer"
              onClick={() => openImageModal(image.src, index)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 250px, 300px"
                className="object-cover"
                loading="eager" // Force eager loading for first images
                priority={index < 3} // Prioritize first 3 images
              />
            </div>
          ))}

          {/* Duplicated set of images for seamless looping */}
          {galleryImages.map((image, index) => (
            <div
              key={`duplicate-${index}`}
              className="relative flex-none w-[250px] md:w-[300px] h-[320px] md:h-[400px] rounded-sm overflow-hidden cursor-pointer"
              onClick={() => openImageModal(image.src, index)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 250px, 300px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image viewer modal - improved for mobile */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-2 md:p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button - larger target area on mobile */}
          <button
            className="absolute top-2 md:top-4 right-2 md:right-4 text-white p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          {/* Navigation buttons */}
          <button
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white p-2 md:p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("prev");
            }}
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          <button
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white p-2 md:p-3 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("next");
            }}
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          {/* Image container */}
          <div className="relative w-full h-[70vh] md:h-[80vh] max-w-3xl md:max-w-4xl">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt={`Gallery image ${selectedIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Image counter for mobile */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm">
            {selectedIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </section>
  );
}
