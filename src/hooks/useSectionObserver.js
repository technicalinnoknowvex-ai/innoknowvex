"use client";
import { useRef } from "react";
import { useNavColor } from "@/context/NavColorContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugin outside component
gsap.registerPlugin(ScrollTrigger);

export const useSectionObserver = (sectionRef, options = {}) => {
  const {
    color = "#262c35",
    sectionId,
    triggerDistance = "top center",
    revertOnLeave = true,
  } = options;

  const { updateNavColor } = useNavColor();
  const defaultColor = "#262c35";

  useGSAP(() => {
    if (!sectionRef.current) return;

    const element = sectionRef.current;

    // Create ScrollTrigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: triggerDistance,
      end: "bottom top",
      onEnter: () => {
        console.log(`Entered section: ${sectionId}`);
        updateNavColor(color);
      },
      onEnterBack: () => {
        console.log(`Entered back section: ${sectionId}`);
        updateNavColor(color);
      },
      onLeave: () => {
        if (revertOnLeave) {
          console.log(`Left section: ${sectionId}`);
          updateNavColor(defaultColor);
        }
      },
      onLeaveBack: () => {
        if (revertOnLeave) {
          console.log(`Left back section: ${sectionId}`);
          updateNavColor(defaultColor);
        }
      },
    });

    // Cleanup function
    return () => {
      scrollTrigger.kill();
    };
  }, [sectionRef, color, sectionId, triggerDistance, revertOnLeave]);
};
