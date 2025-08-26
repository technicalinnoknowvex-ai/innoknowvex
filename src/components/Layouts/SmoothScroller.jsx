"use client";
import React from "react";
import styles from "./styles/smoothScroller.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useScroll } from "@/context/ScrollContext";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

const SmoothScroller = ({ children }) => {
  const { scrollContainerRef, scrollerRef } = useScroll();

  useGSAP(
    () => {
      // Create ScrollSmoother instance
      const smoother = ScrollSmoother.create({
        wrapper: scrollContainerRef.current,
        content: scrollerRef.current,
        smooth: 3, // Duration in seconds for scroll animation
        effects: true, // Enable data-speed and data-lag effects
        smoothTouch: 0.1, // Smooth scrolling on touch devices
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
