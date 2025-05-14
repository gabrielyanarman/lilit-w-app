"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio("/music/bgmusic.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    // Set up event listeners
    const handleCanPlayThrough = () => {
      setIsLoaded(true);
    };

    audio.addEventListener("canplaythrough", handleCanPlayThrough);

    // Add play/pause event listeners to update UI state
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    // Clean up
    return () => {
      audio.pause();
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  // Toggle play/pause
  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  return (
    <button
      onClick={togglePlay}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors cursor-pointer"
      aria-label={isPlaying ? "Mute music" : "Play music"}
      disabled={!isLoaded}
    >
      {isPlaying ? (
        <Volume2 className="h-6 w-6 text-stone-800" />
      ) : (
        <VolumeX className="h-6 w-6 text-stone-800" />
      )}
    </button>
  );
}
