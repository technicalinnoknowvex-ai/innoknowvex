"use client";
import React, { useRef } from "react";
import styles from "./styles/marquee.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Marquee = ({ items, direction = "left", duration = 50 }) => {
  const marqueeContentRef = useRef(null);
  const containerRef = useRef(null);

  useGSAP(() => {
    const marqueeContent = marqueeContentRef.current;
    if (!marqueeContent || items.length === 0) return;

    // Wait for next frame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      const contentWidth = marqueeContent.offsetWidth / 2;

      // Kill any existing animations on this element
      gsap.killTweensOf(marqueeContent);

      if (direction === "left") {
        gsap.set(marqueeContent, { x: 0 });
        gsap.to(marqueeContent, {
          x: -contentWidth,
          duration,
          ease: "none",
          repeat: -1,
        });
      } else {
        gsap.set(marqueeContent, { x: -contentWidth });
        gsap.to(marqueeContent, {
          x: 0,
          duration,
          ease: "none",
          repeat: -1,
        });
      }
    });
  }, { dependencies: [items, direction, duration], scope: containerRef });

  if (items.length === 0) return null;

  return (
    <div className={styles.marquee} ref={containerRef}>
      <div className={styles.marquee__strip}>
        <div
          ref={marqueeContentRef}
          style={{ display: "flex", alignItems: "center", height: "100%" }}
        >
          {/* Render items twice for seamless looping */}
          {items.map((item, index) => (
            <div key={`first-${index}`} className={styles.brandLogo}>
              {item}
            </div>
          ))}
          {items.map((item, index) => (
            <div key={`second-${index}`} className={styles.brandLogo}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;