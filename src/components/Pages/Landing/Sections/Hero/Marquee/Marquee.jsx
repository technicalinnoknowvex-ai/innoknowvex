import React, { useRef, useEffect } from "react";
import styles from "./styles/marquee.module.scss";
import Sparkle from "@/components/Common/Icons/Sparkle";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const stripTextArr = [
  
  "Web Design",
  "Cyber Security",
  "Artificial Agency",
  "Data Science",
  "Business Analytics",
  "Digital Marketing",
  "Machine Learning",
  "Artificial Intelligence",
  "Cloud Computing",
  "Embedded Systems",
  "Android Development",
  "Finance",
  "Stock Trading",
  "Human Resources",
  "UI/UX",
  "Fashion Designing",
];

const Marquee = () => {
  const marqueeRef = useRef(null);
  const marqueeContentRef = useRef(null);
  const sparkleRefs = useRef([]);

  useGSAP(() => {
    // Marquee animation
    const marqueeContent = marqueeContentRef.current;
    const contentWidth = marqueeContent.offsetWidth;

    // Duplicate content for seamless looping
    marqueeContent.innerHTML += marqueeContent.innerHTML;

    gsap.to(marqueeContent, {
      x: -contentWidth,
      duration: 20,
      ease: "none",
      repeat: -1,
    });

    // Sparkle animations
    sparkleRefs.current.forEach((sparkle, index) => {
      gsap.to(sparkle, {
        rotation: 360,
        duration: 5 + Math.random() * 5,
        repeat: -1,
        ease: "none",
        delay: index * 0.1,
      });

      gsap.to(sparkle, {
        scale: 1.2,
        duration: 1 + Math.random() * 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: index * 0.2,
      });
    });
  }, []);

  return (
    <div className={styles.marquee} ref={marqueeRef}>
      <div
        className={`${styles.marquee__strip} ${styles["marquee__strip--secondary"]}`}
      ></div>
      <div
        className={`${styles.marquee__strip} ${styles["marquee__strip--primary"]}`}
      >
        <div
          ref={marqueeContentRef}
          style={{ display: "flex", alignItems: "center" }}
        >
          {stripTextArr.map((text, index) => (
            <React.Fragment key={`${text}-${index}`}>
              <span className={styles.marquee__text}>{text}</span>
              <span
                className={styles.marquee__icon}
                ref={(el) => (sparkleRefs.current[index] = el)}
              >
                <Sparkle color={"white"} />
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
