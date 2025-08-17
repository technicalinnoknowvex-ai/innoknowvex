import React, { useRef } from "react";
import styles from "./styles/marquee.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Marquee = ({ items, direction = "left", duration = 5 }) => {
  const marqueeRef = useRef(null);
  const marqueeContentRef = useRef(null);

  useGSAP(() => {
    const marqueeContent = marqueeContentRef.current;
    const contentWidth = marqueeContent.offsetWidth;

    // Duplicate content for seamless looping
    marqueeContent.innerHTML += marqueeContent.innerHTML;

    if (direction === "left") {
      // Move left: 0 -> -contentWidth
      gsap.set(marqueeContent, { x: 0 });
      gsap.to(marqueeContent, {
        x: -contentWidth,
        duration,
        ease: "none",
        repeat: -1,
      });
    } else {
      // Move right: -contentWidth -> 0
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
    <div className={styles.marquee} ref={marqueeRef}>
      <div className={styles.marquee__strip}>
        <div
          ref={marqueeContentRef}
          style={{ display: "flex", alignItems: "center", height: "100%" }}
        >
          {items.map((Logo, index) => (
            <div key={index} className={styles.brandLogo}>
              <Logo />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
