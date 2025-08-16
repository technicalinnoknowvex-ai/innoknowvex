"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import CursorContext from "./CursorContext";

export const CursorProvider = ({ children }) => {
  const cursorRef = useRef(null);
  const cursorTailRef = useRef(null);
  const [cursorContent, setCursorContent] = useState(null);

  const handleMouseEnter = (onMouseEnterCallback) => {
    if (cursorRef.current && cursorTailRef.current) {
      gsap.to(cursorRef.current, {
        scale: 1.5,
        opacity: 0.8,
        duration: 0.2,
        ease: "power1.inOut",
      });

      gsap.to(cursorTailRef.current, {
        scale: 10,
        opacity: 0.5,
        duration: 0.2,
        ease: "power1.inOut",
      });
    }

    if (onMouseEnterCallback) {
      onMouseEnterCallback();
    }
  };

  const handleMouseLeave = (onMouseLeaveCallback) => {
    if (cursorRef.current && cursorTailRef.current) {
      gsap.to(cursorRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: "power1.inOut",
      });

      gsap.to(cursorTailRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: "power1.inOut",
      });
    }

    if (onMouseLeaveCallback) {
      onMouseLeaveCallback();
    }
  };

  const value = {
    cursorRef,
    cursorTailRef,
    handleMouseEnter,
    handleMouseLeave,
    setCursorContent,
    cursorContent,
  };

  return (
    <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
  );
};
