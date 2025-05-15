"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [manuallyTurnedOff, setManuallyTurnedOff] = useState(false);
  const [firstInteractionComplete, setFirstInteractionComplete] =
    useState(false);
  const [isProcessingClick, setIsProcessingClick] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect iOS devices - improved detection
  useEffect(() => {
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
      /iPhone|iPad|iPod/.test(navigator.platform);
    const android = /Android/.test(navigator.userAgent);
    setIsAndroid(android);
    setIsIOS(ios);
  }, []);

  // Create and set up audio element
  useEffect(() => {
    // Create audio element
    const audio = new Audio("/music/bgmusic.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = "auto"; // Ensure preloading
    audioRef.current = audio;

    // Set up event listeners
    const handleCanPlayThrough = () => {
      setIsLoaded(true);
      console.log("Audio loaded and ready to play");
    };

    audio.addEventListener("canplaythrough", handleCanPlayThrough);

    // Add play/pause event listeners to update UI state
    const handlePlay = () => {
      console.log("Audio played");
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log("Audio paused");
      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    // Clean up
    return () => {
      audio.pause();
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);

      // Clear any pending timeouts
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  // Listen for first user interaction to enable audio - only once
  useEffect(() => {
    // Only set up the first interaction handler if we haven't had one yet
    if (firstInteractionComplete) return;

    const handleFirstInteraction = () => {
      if (!userInteracted) {
        console.log("First interaction detected");
        setUserInteracted(true);
        setFirstInteractionComplete(true);

        // Only auto-play if user hasn't manually turned off music
        if (!manuallyTurnedOff && audioRef.current && !isPlaying) {
          // Try to play immediately on first interaction
          playAudio();
        }
      }
    };

    // Add event listeners for user interactions
    const interactionEvents = ["click", "touchstart"];

    interactionEvents.forEach((event) => {
      document.addEventListener(event, handleFirstInteraction, { once: true });
    });

    return () => {
      interactionEvents.forEach((event) => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, [isPlaying, manuallyTurnedOff, userInteracted, firstInteractionComplete]);

  // Play audio with iOS-specific handling
  const playAudio = async () => {
    if (!audioRef.current) return;

    try {
      console.log("Attempting to play audio");

      // For iOS, we need a more direct approach
      if (isIOS || isAndroid) {
        try {
          // Direct play attempt for iOS
          await audioRef.current.play();
          console.log("iOS play successful");
          setIsPlaying(true);
        } catch (iosError) {
          console.error("iOS play failed:", iosError);

          // Fallback for iOS - try with user gesture
          const unlockAudio = () => {
            if (audioRef.current) {
              audioRef.current
                .play()
                .then(() => {
                  console.log("iOS play successful after user gesture");
                  setIsPlaying(true);
                  document.removeEventListener("touchend", unlockAudio);
                })
                .catch((err) => console.error("Still failed on iOS:", err));
            }
          };

          document.addEventListener("touchend", unlockAudio, { once: true });
        }
      } else {
        // Standard approach for other browsers
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Audio playback started successfully");
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Error playing audio:", error);
            });
        }
      }
    } catch (error) {
      console.error("Error in playAudio function:", error);
    }
  };

  // Pause audio
  const pauseAudio = () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.pause();
      setIsPlaying(false);
    } catch (error) {
      console.error("Error pausing audio:", error);
    }
  };

  // Unified handler for all click/touch events with debounce
  const handleButtonInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default behavior and stop propagation
    e.preventDefault();
    e.stopPropagation();

    // If we're already processing a click, ignore this one
    if (isProcessingClick) return;

    // Set processing flag to prevent multiple rapid clicks
    setIsProcessingClick(true);

    // Clear any existing timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    // Toggle audio state
    if (isPlaying) {
      pauseAudio();
      setManuallyTurnedOff(true);
    } else {
      playAudio();
      setManuallyTurnedOff(false);
    }

    // Set a timeout to allow new clicks after a short delay
    clickTimeoutRef.current = setTimeout(() => {
      setIsProcessingClick(false);
    }, 300); // 300ms debounce
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
        touchAction: "manipulation", // Improve touch handling
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
