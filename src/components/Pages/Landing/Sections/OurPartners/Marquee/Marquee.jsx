import React, { useRef } from "react";
import styles from "./styles/marquee.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Marquee = ({ items, direction = "left", duration = 30 }) => {
  const marqueeRef = useRef(null);
  const marqueeContentRef = useRef(null);
  const tweenRef = useRef(null);

  useGSAP(() => {
    const marqueeContent = marqueeContentRef.current;
    const contentWidth = marqueeContent.offsetWidth;

    // Duplicate content for seamless looping
    marqueeContent.innerHTML += marqueeContent.innerHTML;

    if (direction === "left") {
      gsap.set(marqueeContent, { x: 0 });
      tweenRef.current = gsap.to(marqueeContent, {
        x: -contentWidth,
        duration,
        ease: "none",
        repeat: -1,
      });
    } else {
      gsap.set(marqueeContent, { x: -contentWidth });
      tweenRef.current = gsap.to(marqueeContent, {
        x: 0,
        duration,
        ease: "none",
        repeat: -1,
      });
    }
  }, [items, direction, duration]);

  return (
    <div
      className={styles.marquee}
      ref={marqueeRef}
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.resume()}
    >
      <div className={styles.marquee__strip}>
        <div
          ref={marqueeContentRef}
          style={{ display: "flex", alignItems: "center", height: "150%" }}
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
