"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./scrollProgress.module.scss";

gsap.registerPlugin(ScrollTrigger);

const ScrollProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    if (!barRef.current) return;

    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => {
      if (t.vars.trigger === document.body) t.kill();
    });
  }, []);

  return <div ref={barRef} className={styles.progressBar} />;
};

export default ScrollProgress;
