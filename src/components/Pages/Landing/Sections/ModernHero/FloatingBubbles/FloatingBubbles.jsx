"use client";
import React, { useRef, useEffect } from "react";
import styles from "./styles/floatingBubbles.module.scss";
import gsap from "gsap";

const FloatingBubbles = () => {
  const containerRef = useRef(null);
  const bubblesRef = useRef([]);

  useEffect(() => {
    const bubbles = bubblesRef.current;

    // Create floating animation for each bubble
    bubbles.forEach((bubble, index) => {
      const duration = 6 + Math.random() * 4;
      const startX = Math.random() * 100 - 50;
      const startY = Math.random() * 100 - 50;
      const endX = Math.random() * 100 - 50;
      const endY = Math.random() * 100 - 50;

      // Initial position
      gsap.set(bubble, {
        x: startX,
        y: startY,
      });

      // Animate floating motion
      gsap.to(bubble, {
        x: endX,
        y: endY,
        duration: duration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Optional: Add rotation
      gsap.to(bubble, {
        rotation: 360,
        duration: duration * 2,
        ease: "none",
        repeat: -1,
      });
    });

    return () => {
      bubbles.forEach((bubble) => {
        if (bubble) {
          gsap.killTweensOf(bubble);
        }
      });
    };
  }, []);

  // Generate multiple floating bubbles with different sizes and positions
  const bubbleData = [
    {
      id: 1,
      size: 200,
      top: "10%",
      left: "-5%",
      color: "rgba(255, 107, 53, 0.08)",
    },
    {
      id: 2,
      size: 150,
      top: "60%",
      left: "85%",
      color: "rgba(255, 107, 53, 0.06)",
    },
    {
      id: 3,
      size: 180,
      top: "50%",
      left: "-10%",
      color: "rgba(255, 107, 53, 0.05)",
    },
    {
      id: 4,
      size: 120,
      top: "20%",
      left: "75%",
      color: "rgba(255, 107, 53, 0.07)",
    },
    {
      id: 5,
      size: 160,
      top: "70%",
      left: "10%",
      color: "rgba(255, 107, 53, 0.06)",
    },
    {
      id: 6,
      size: 140,
      top: "30%",
      left: "50%",
      color: "rgba(255, 107, 53, 0.08)",
    },
  ];

  return (
    <div ref={containerRef} className={styles.bubblesContainer}>
      {bubbleData.map((bubble, index) => (
        <div
          key={bubble.id}
          ref={(el) => {
            if (el) bubblesRef.current[index] = el;
          }}
          className={styles.bubble}
          style={{
            width: bubble.size,
            height: bubble.size,
            top: bubble.top,
            left: bubble.left,
            background: bubble.color,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingBubbles;
