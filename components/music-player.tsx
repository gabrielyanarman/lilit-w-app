"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [manuallyTurnedOff, setManuallyTurnedOff] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Detect iOS devices
  useEffect(() => {
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
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
    };
  }, []);

  // Listen for first user interaction to enable audio
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true);

        // Only auto-play if user hasn't manually turned off music
        if (!manuallyTurnedOff && audioRef.current && !isPlaying) {
          // Small delay to ensure interaction is registered
          setTimeout(() => {
            playAudio();
          }, 100);
        }
      }
    };

    // Add event listeners for user interactions
    const interactionEvents = ["click", "touchstart", "touchend"];

    interactionEvents.forEach((event) => {
      document.addEventListener(event, handleFirstInteraction, { once: false });
    });

    return () => {
      interactionEvents.forEach((event) => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, [isPlaying, manuallyTurnedOff, userInteracted]);

  // Play audio with iOS-specific handling
  const playAudio = async () => {
    if (!audioRef.current) return;

    try {
      // For iOS, we need to ensure the audio context is resumed
      if (isIOS) {
        // Используем другое имя, чтобы избежать конфликта
        const AudioCtx =
          window.AudioContext ||
          (
            window as Window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;

        if (AudioCtx) {
          const audioContext = new AudioCtx();
          await audioContext.resume();
        }
      }

      // Play the audio
      const playPromise = audioRef.current.play();

      // Modern browsers return a promise from play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started successfully");
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            // iOS often requires direct user interaction with the element
            if (isIOS) {
              console.log("iOS detected, may require direct interaction");
            }
          });
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

  // Toggle play/pause with manual tracking
  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      pauseAudio();
      setManuallyTurnedOff(true); // User manually turned off music
    } else {
      await playAudio();
      setManuallyTurnedOff(false); // User manually turned on music
    }
  };

  // Special handling for iOS touch events
  const handleIOSTouch = (e: React.TouchEvent) => {
    if (isIOS) {
      // Prevent default to avoid double-firing
      e.preventDefault();
      togglePlay();
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={togglePlay}
      onTouchEnd={isIOS ? handleIOSTouch : undefined}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors cursor-pointer active:bg-gray-200"
      aria-label={isPlaying ? "Mute music" : "Play music"}
      disabled={!isLoaded}
      style={{ WebkitTapHighlightColor: "transparent" }} // Remove tap highlight on iOS
    >
      {isPlaying ? (
        <Volume2 className="h-6 w-6 text-stone-800" />
      ) : (
        <VolumeX className="h-6 w-6 text-stone-800" />
      )}
    </button>
  );
}
