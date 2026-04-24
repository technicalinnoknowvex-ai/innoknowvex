"use client";

import { useEffect, useState } from 'react';

/**
 * Custom hook to manage poster modal visibility with 10-second delay
 * @param {number} delayMs - Delay in milliseconds before showing the modal (default: 10000ms = 10 seconds)
 * @returns {object} - { showPoster, closePoster } for controlling the modal
 */
export const usePosterModal = (delayMs = 10000) => {
  const [showPoster, setShowPoster] = useState(false);

  useEffect(() => {
    // Set timer to show poster after specified delay
    const timer = setTimeout(() => {
      setShowPoster(true);
    }, delayMs);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [delayMs]);

  const closePoster = () => {
    setShowPoster(false);
  };

  return { showPoster, closePoster };
};
