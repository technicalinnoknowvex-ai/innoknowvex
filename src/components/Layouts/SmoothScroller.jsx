"use client";
import React from "react";
import styles from "./styles/smoothScroller.module.scss";
import Lenis from "lenis";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScroll } from "@/context/ScrollContext";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SmoothScroller = ({ children }) => {
  const { scrollContainerRef } = useScroll();

  useGSAP(
    () => {
      if (scrollContainerRef.current) {
        const lenis = new Lenis({
          wrapper: scrollContainerRef.current,
          duration: 2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          syncTouch: true,
        });

        lenis.on("scroll", ScrollTrigger.update);

        const raf = (time) => {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);

        return () => lenis.destroy();
      }
    },
    { scope: scrollContainerRef }
  );

  return (
    <div className={styles.scrollWrapper} ref={scrollContainerRef}>
      {children}
    </div>
  );
};

export default SmoothScroller;
