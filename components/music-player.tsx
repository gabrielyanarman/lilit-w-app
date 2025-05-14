"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [manuallyTurnedOff, setManuallyTurnedOff] = useState(false);
  const [firstInteractionComplete, setFirstInteractionComplete] =
    useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Detect iOS devices - improved detection
  useEffect(() => {
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
      /iPhone|iPad|iPod/.test(navigator.platform);

    setIsIOS(ios);
    console.log("iOS detected:", ios);
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
      if (isIOS) {
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

  // Toggle play/pause with manual tracking - improved for iOS
  const togglePlay = async (e: React.MouseEvent | React.TouchEvent) => {
    // Stop propagation to prevent other handlers from firing
    e.stopPropagation();

    if (!audioRef.current) return;

    console.log("Toggle play clicked, current state:", isPlaying);

    if (isPlaying) {
      pauseAudio();
      setManuallyTurnedOff(true);
    } else {
      // For iOS, we need to ensure we're in a user gesture context
      if (isIOS) {
        try {
          // Direct attempt within user gesture
          await audioRef.current.play();
          setIsPlaying(true);
          setManuallyTurnedOff(false);
        } catch (iosError) {
          console.error("iOS toggle play failed:", iosError);
        }
      } else {
        await playAudio();
        setManuallyTurnedOff(false);
      }
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={togglePlay}
      onTouchStart={isIOS ? togglePlay : undefined}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors cursor-pointer active:bg-gray-200"
      aria-label={isPlaying ? "Mute music" : "Play music"}
      disabled={!isLoaded}
      style={{
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation", // Improve touch handling
      }}
    >
      {isPlaying ? (
        <Volume2 className="h-6 w-6 text-stone-800" />
      ) : (
        <VolumeX className="h-6 w-6 text-stone-800" />
      )}
    </button>
  );
}
