"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Проверяем, что клик именно по video элементу, а не по controls
    if (target.tagName === "VIDEO") {
      const rect = target.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const videoHeight = rect.height;

      // Если клик в нижней части где controls, не делаем toggle
      // Controls обычно занимают последние ~50px
      if (clickY < videoHeight - 50) {
        togglePlay();
      }
    }
  };

  return (
    <section className="w-full flex items-center justify-center via-stone-500 py-4 md:py-8">
      <div className="w-full max-w-6xl px-4">
        <div
          className={`relative w-full via-stone-500 rounded-lg overflow-hidden shadow-2xl ${
            isMobile ? "aspect-[16/12]" : "aspect-video"
          }`}
          style={{
            minHeight: "300px",
          }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover cursor-pointer"
            src="/video/video.mp4"
            playsInline
            preload="metadata"
            muted={false}
            controls
            controlsList="nodownload"
            onClick={handleVideoClick}
          />
        </div>
      </div>
    </section>
  );
}
