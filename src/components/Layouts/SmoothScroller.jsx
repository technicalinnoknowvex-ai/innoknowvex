"use client";
import React from "react";
import styles from "./styles/smoothScroller.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useScroll } from "@/context/ScrollContext";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

const SmoothScroller = ({
  children,
  smooth = 3,
  effects = true,
  smoothTouch = 0.1,
}) => {
  const { scrollContainerRef, scrollerRef } = useScroll();

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isMobileViewport = window.matchMedia("(max-width: 1024px)").matches;

      // Skip smoother on mobile/reduced-motion to avoid scroll lag.
      if (prefersReducedMotion || isMobileViewport) {
        return;
      }

      // Create ScrollSmoother instance
      const smoother = ScrollSmoother.create({
        wrapper: scrollContainerRef.current,
        content: scrollerRef.current,
        smooth, // Duration in seconds for scroll animation
        effects, // Enable data-speed and data-lag effects
        smoothTouch, // Smooth scrolling on touch devices
        normalizeScroll: true, // Normalize scroll across different devices
        ignoreMobileResize: true, // Ignore mobile resize events
      });

      return () => {
        smoother.kill();
      };
    },
    { scope: scrollContainerRef }
  );

  return (
    <div className={styles.scrollWrapper} ref={scrollContainerRef}>
      <div className={styles.scrollContent} ref={scrollerRef}>
        {children}
      </div>
    </div>
  );
};

export default SmoothScroller;
