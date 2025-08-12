"use client";
import React from "react";
import styles from "./styles/cursor.module.scss";
import { useCursor } from "../../../context/useCursor";
import gsap from "gsap";

import { useGSAP } from "@gsap/react";
const Cursor = () => {
  const { cursorRef, cursorTailRef, cursorContent } = useCursor();

  const { contextSafe } = useGSAP(() => {
    const mouseMove = contextSafe((e) => {
      const cursorPosition = {
        left: e.clientX,
        top: e.clientY,
      };

      gsap.to(cursorRef?.current, {
        left: cursorPosition.left,
        top: cursorPosition.top,
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.to(cursorTailRef?.current, {
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
      <div className={styles.cursor} ref={cursorRef} />
      <div className={styles.cursorTail} ref={cursorTailRef}>
        <div className={styles.cursorContentDiv}>{cursorContent}</div>
      </div>
    </>
  );
};

export default Cursor;
