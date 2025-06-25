"use client";

import type React from "react";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export function GallerySection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastScrollPosition = useRef(0);
  const scrollingPaused = useRef(false);

  // Sample gallery images - replace with actual images
  const galleryImages = [
    { src: "/images/c1.jpg", alt: "Couple photo 1" },
    { src: "/images/b2.JPG", alt: "Couple photo 2" },
    { src: "/images/c3.jpg", alt: "Couple photo 3" },
    { src: "/images/c4.jpg", alt: "Couple photo 4" },
    { src: "/images/b5.JPG", alt: "Couple photo 5" },
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

  // Auto-scrolling effect with infinite loop - improved speed and smoothness
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    // Increased scroll speed for better experience
    const scrollSpeed = 1; // Faster on both mobile and desktop

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

    // Main scroll animation function - improved for smoother scrolling
    const scroll = () => {
      if (!scrollContainer || singleSetWidth === 0) return;

      // Only update scroll position if not manually scrolling
      if (!scrollingPaused.current) {
        // Increment scroll position
        scrollPosition += scrollSpeed;

        // If we've scrolled past the first set of images, reset to the beginning
        if (scrollPosition >= singleSetWidth) {
          scrollPosition = 0;
          scrollContainer.scrollLeft = 0;
        }

        // Apply the scroll position with smooth interpolation
        scrollContainer.scrollLeft = scrollPosition;
      } else {
        // If user is manually scrolling, just update our tracking position
        scrollPosition = scrollContainer.scrollLeft;
      }

      // Always continue the animation regardless of user interaction
      animationRef.current = requestAnimationFrame(scroll);
    };

    // Start the animation
    const startAnimation = () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(scroll);
    };

    // Start with a slight delay for iOS
    const timeoutId = setTimeout(startAnimation, isIOS ? 300 : 0);

    // Handle user manual scrolling
    const handleScrollStart = () => {
      scrollingPaused.current = true;
      lastScrollPosition.current = scrollContainer.scrollLeft;
    };

    const handleScrollEnd = () => {
      // Shorter delay before resuming auto-scroll for better experience
      setTimeout(() => {
        scrollingPaused.current = false;
        // Update the scroll position to where the user left off
        scrollPosition = scrollContainer.scrollLeft;
      }, 300); // Reduced from 500ms to 300ms for faster response
    };

    // Add event listeners for manual scrolling
    scrollContainer.addEventListener("touchstart", handleScrollStart, {
      passive: true,
    });
    scrollContainer.addEventListener("touchend", handleScrollEnd, {
      passive: true,
    });
    scrollContainer.addEventListener("mousedown", handleScrollStart);
    scrollContainer.addEventListener("mouseup", handleScrollEnd);

    // Ensure animation continues even when scrolling the page
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startAnimation();
      } else if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Ensure animation continues when scrolling back to the gallery
    const handleScroll = () => {
      const rect = scrollContainer.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible && !animationRef.current) {
        startAnimation();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Clean up
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      scrollContainer.removeEventListener("touchstart", handleScrollStart);
      scrollContainer.removeEventListener("touchend", handleScrollEnd);
      scrollContainer.removeEventListener("mousedown", handleScrollStart);
      scrollContainer.removeEventListener("mouseup", handleScrollEnd);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [galleryImages.length, isMobile, isIOS]);

  // Prevent default click behavior to avoid stopping the animation
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <section className="w-full overflow-hidden">
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
          cursor: "grab",
        }}
        onClick={handleClick} // Prevent default click behavior
      >
        <div className="flex gap-3 md:gap-4 px-4 pb-4">
          {/* Original set of images */}
          {galleryImages.map((image, index) => (
            <div
              key={`original-${index}`}
              className="relative flex-none w-[250px] md:w-[300px] h-[320px] md:h-[400px] rounded-sm overflow-hidden"
              onClick={handleClick} // Prevent default click behavior
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 250px, 300px"
                className="object-cover"
                loading="eager" // Force eager loading for first images
                priority={index < 3} // Prioritize first 3 images
                draggable={false} // Prevent dragging images
              />
            </div>
          ))}

          {/* Duplicated set of images for seamless looping */}
          {galleryImages.map((image, index) => (
            <div
              key={`duplicate-${index}`}
              className="relative flex-none w-[250px] md:w-[300px] h-[320px] md:h-[400px] rounded-sm overflow-hidden"
              onClick={handleClick} // Prevent default click behavior
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 250px, 300px"
                className="object-cover"
                draggable={false} // Prevent dragging images
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
