// hooks/useGSAPInit.js
"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const useGSAPInit = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Register ScrollTrigger plugin
      gsap.registerPlugin(ScrollTrigger);

      // Optional: Configure global settings
      ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: true,
      });

      // Debounce function to prevent excessive refresh calls
      let resizeTimeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 250); // Wait 250ms after resize ends
      };

      window.addEventListener("resize", handleResize);
      window.addEventListener("load", () => ScrollTrigger.refresh());

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("load", () => ScrollTrigger.refresh());
        clearTimeout(resizeTimeout);
      };
    }
  }, []);
};
