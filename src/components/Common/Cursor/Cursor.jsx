"use client";
import React from "react";
import styles from "./styles/cursor.module.scss";
import { useCursor } from "../../../hooks/useCursor";
import gsap from "gsap";

import { useGSAP } from "@gsap/react";
const Cursor = () => {
  const { cursorRingRef, cursorDotRef, cursorContent } = useCursor();

  const { contextSafe } = useGSAP(() => {
    const mouseMove = contextSafe((e) => {
      const cursorPosition = {
        left: e.clientX,
        top: e.clientY,
      };

      gsap.to(cursorRingRef?.current, {
        left: cursorPosition.left,
        top: cursorPosition.top,
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.to(cursorDotRef?.current, {
        left: cursorPosition.left,
        top: cursorPosition.top,
        duration: 0.9,
        ease: "power2.out",
      });
    });

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return (
    <>
      <div className={styles.cursorRing} ref={cursorRingRef} />
      <div className={styles.cursorDot} ref={cursorDotRef}>
        <div className={styles.cursorContentDiv}>{cursorContent}</div>
      </div>
    </>
  );
};

export default Cursor;
