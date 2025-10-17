import React, { useRef, useEffect } from "react";
import styles from "./styles/marquee.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Marquee = ({ items, direction = "left", duration = 50 }) => {
  const marqueeContentRef = useRef(null);

  useGSAP(() => {
    const marqueeContent = marqueeContentRef.current;
    if (!marqueeContent) return;

    const contentWidth = marqueeContent.offsetWidth / 2; // Divide by 2 since we render items twice

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
  }, [items, direction, duration]);

  return (
    <div className={styles.marquee}>
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