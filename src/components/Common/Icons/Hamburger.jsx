"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(MorphSVGPlugin);

const Hamburger = ({ isOpen, setIsOpen }) => {
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.set([topRef.current, bottomRef.current], {
        clearProps: "all",
      });
    },
    { scope: containerRef }
  );

  const toggleMenu = () => {
    if (!isOpen) {
      // Morph to X
      const timeline = gsap.timeline();

      timeline.to(topRef.current, {
        duration: 0.4,
        morphSVG: "M8.5 8.5L25.5 25.5", // Diagonal from top-left to bottom-right
        stroke: "white",
        ease: "power2.inOut",
      });

      timeline.to(
        bottomRef.current,
        {
          duration: 0.4,
          morphSVG: "M8.5 25.5L25.5 8.5", // Diagonal from bottom-left to top-right
          stroke: "white",
          ease: "power2.inOut",
        },
        "<"
      );
    } else {
      // Morph back to hamburger
      const timeline = gsap.timeline();

      timeline.to(topRef.current, {
        duration: 0.4,
        morphSVG: "M5.66663 11.333H28.3333",
        stroke: "black",
        ease: "power2.inOut",
      });

      timeline.to(
        bottomRef.current,
        {
          duration: 0.4,
          morphSVG: "M5.66663 22.6663H28.3333",
          stroke: "black",
          ease: "power2.inOut",
        },
        "<"
      );
    }

    setIsOpen(!isOpen);
  };

  return (
    <div ref={containerRef}>
      <svg
        style={{ width: "100%", cursor: "pointer" }}
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={toggleMenu}
      >
        {/* Morphing lines */}
        <path
          ref={topRef}
          d="M5.66663 11.333H28.3333"
          stroke="black"
          strokeWidth="2.83333"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        <path
          ref={bottomRef}
          d="M5.66663 22.6663H28.3333"
          stroke="black"
          strokeWidth="2.83333"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default Hamburger;
