"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import CursorContext from "./CursorContext";

export const CursorProvider = ({ children }) => {
  const cursorRingRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [cursorContent, setCursorContent] = useState(null);

  const handleMouseEnter = (onMouseEnterCallback, options = {}) => {
    if (cursorRingRef.current && cursorDotRef.current) {
      gsap.to(cursorRingRef.current, {
        duration: 0.2,
        ease: "power1.inOut",
        ...options.ring,
      });

      gsap.to(cursorDotRef.current, {
        duration: 0.2,
        ease: "power1.inOut",
        backgroundColor: options.tailColor || "#FF6432",
        ...options.dot,
      });
    }

    if (onMouseEnterCallback) {
      onMouseEnterCallback();
    }
  };

  const handleMouseLeave = (onMouseLeaveCallback) => {
    if (cursorRingRef.current && cursorDotRef.current) {
      gsap.to(cursorRingRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: "power1.inOut",
      });

      gsap.to(cursorDotRef.current, {
        scale: 1,
        opacity: 1,
        backgroundColor: "#FF6432",
        duration: 0.2,
        ease: "power1.inOut",
      });
    }

    if (onMouseLeaveCallback) {
      onMouseLeaveCallback();
    }
  };

  const value = {
    cursorRingRef,
    cursorDotRef,
    handleMouseEnter,
    handleMouseLeave,
    setCursorContent,
    cursorContent,
  };

  return (
    <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
  );
};
