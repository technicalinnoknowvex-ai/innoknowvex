"use client";
import React, { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import CursorContext from "./CursorContext";

export const CursorProvider = ({ children }) => {
  const cursorRingRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [cursorContent, setCursorContent] = useState(null);

  // Default cursor state based on your CSS styles
  const defaultCursorState = {
    dot: {
      backgroundColor: "#FF6432", // From your variables.$brand-primary
      opacity: 1,
      scale: 1,
      width: 15, // From your CSS: width: 15px
      height: 15, // aspect-ratio: 1/1
    },
    ring: {
      opacity: 1,
      scale: 1,
      width: 30, // From your CSS: width: 30px
      height: 30, // aspect-ratio: 1/1
      border: "1.5px solid #9c7f16a7", // From your CSS
    },
  };

  // Reset cursor to default state (CSS styles)
  const resetCursor = useCallback(
    (onCompleteCallback = null) => {
      if (cursorRingRef.current && cursorDotRef.current) {
        gsap.to(cursorRingRef.current, {
          opacity: defaultCursorState.ring.opacity,
          scale: defaultCursorState.ring.scale,
          width: defaultCursorState.ring.width,
          height: defaultCursorState.ring.height,
          border: defaultCursorState.ring.border,
          duration: 0.3,
          ease: "power2.out",
          onComplete: onCompleteCallback,
        });

        gsap.to(cursorDotRef.current, {
          opacity: defaultCursorState.dot.opacity,
          scale: defaultCursorState.dot.scale,
          width: defaultCursorState.dot.width,
          height: defaultCursorState.dot.height,
          backgroundColor: defaultCursorState.dot.backgroundColor,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    [defaultCursorState]
  );

  // Transform cursor with custom options
  const transformCursor = useCallback(
    (options = {}, onCompleteCallback = null) => {
      if (cursorRingRef.current && cursorDotRef.current) {
        const ringOptions = {
          duration: 0.3,
          ease: "power2.out",
          ...options.ring,
        };

        const dotOptions = {
          duration: 0.3,
          ease: "power2.out",
          backgroundColor:
            options.tailColor || defaultCursorState.dot.backgroundColor,
          ...options.dot,
        };

        if (onCompleteCallback) {
          ringOptions.onComplete = onCompleteCallback;
        }

        gsap.to(cursorRingRef.current, ringOptions);
        gsap.to(cursorDotRef.current, dotOptions);
      }
    },
    [defaultCursorState.dot.backgroundColor]
  );

  // Handle mouse enter (for backward compatibility)
  const handleMouseEnter = useCallback(
    (onMouseEnterCallback, options = {}) => {
      transformCursor(options, onMouseEnterCallback);
    },
    [transformCursor]
  );

  // Handle mouse leave (for backward compatibility)
  const handleMouseLeave = useCallback(
    (onMouseLeaveCallback) => {
      resetCursor(onMouseLeaveCallback);
    },
    [resetCursor]
  );

  const value = {
    cursorRingRef,
    cursorDotRef,
    handleMouseEnter,
    handleMouseLeave,
    resetCursor,
    transformCursor,
    setCursorContent,
    cursorContent,
  };

  return (
    <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
  );
};
