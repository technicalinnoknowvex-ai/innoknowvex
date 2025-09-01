"use client";
import React, { createContext, useContext, useRef } from "react";

const ScrollContext = createContext();

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
};

export const ScrollProvider = ({ children }) => {
  const scrollContainerRef = useRef(null);
  const scrollerRef = useRef(null);

  return (
    <ScrollContext.Provider value={{ scrollContainerRef, scrollerRef }}>
      {children}
    </ScrollContext.Provider>
  );
};
