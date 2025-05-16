"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [firstInteractionComplete, setFirstInteractionComplete] =
    useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessingClick, setIsProcessingClick] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const audio = new Audio("/music/bgmusic.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = "auto";
    audioRef.current = audio;

    const handleCanPlayThrough = () => {
      setIsLoaded(true);
      console.log("Audio loaded and ready to play");
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.pause();
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (firstInteractionComplete) return;

    const handleFirstInteraction = async () => {
      if (!audioRef.current) return;

      try {
        await audioRef.current.play();
        console.log("Audio auto-played on first interaction");
        setIsPlaying(true);
        setFirstInteractionComplete(true);
      } catch (err) {
        console.error("Autoplay failed:", err);
      }

      interactionEvents.forEach((event) =>
        document.removeEventListener(event, handleFirstInteraction)
      );
    };

    const interactionEvents = ["pointerdown", "click"];

    interactionEvents.forEach((event) =>
      document.addEventListener(event, handleFirstInteraction, {
        passive: true,
      })
    );

    return () => {
      interactionEvents.forEach((event) =>
        document.removeEventListener(event, handleFirstInteraction)
      );
    };
  }, [firstInteractionComplete]);

  const playAudio = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Play failed:", error);
    }
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.pause();
      setIsPlaying(false);
    } catch (error) {
      console.error("Pause failed:", error);
    }
  };

  const handleButtonInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessingClick) return;
    setIsProcessingClick(true);

    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }

    clickTimeoutRef.current = setTimeout(() => {
      setIsProcessingClick(false);
    }, 300);
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleButtonInteraction}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors cursor-pointer active:bg-gray-200"
      aria-label={isPlaying ? "Pause music" : "Play music"}
      disabled={!isLoaded || isProcessingClick}
      style={{
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      }}
    >
      {isPlaying ? (
        <Pause className="h-6 w-6 text-stone-800" />
      ) : (
        <Play className="h-6 w-6 text-stone-800" />
      )}
    </button>
  );
}
