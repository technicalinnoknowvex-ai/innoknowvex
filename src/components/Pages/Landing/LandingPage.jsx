"use client";
import React, { useEffect, useRef } from "react";
import landingStyles from "./styles/landing.module.scss";
import CircularText from "../../UI/CircularText.jsx";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";


// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LandingPage = () => {
  const starLeftRef = useRef(null);
  const starRightRef = useRef(null);
  const circularTextRef = useRef(null);

  useEffect(() => {
    // Ensure we're in the browser environment
    if (starLeftRef.current && starRightRef.current) {
      // Faster animation for left star (2 full rotations)
      const tlLeft = gsap.timeline({
        scrollTrigger: {
          scrub: 0.5, // Faster scrub makes animation more responsive
          trigger: starLeftRef.current,
          start: "top 80%",
          end: "bottom 20%",
        },
      });

      tlLeft.to(starLeftRef.current, {
        rotateZ: 720, // Two full rotations (360 × 2)
        duration: 2, // Shorter duration makes it faster
      });

      // Faster animation for right star (2 full rotations in opposite direction)
      const tlRight = gsap.timeline({
        scrollTrigger: {
          scrub: 0.5,
          trigger: starRightRef.current,
          start: "top 80%",
          end: "bottom 20%",
        },
      });

      tlRight.to(starRightRef.current, {
        rotateZ: -720, // Two full rotations counter-clockwise
        duration: 2,
      });

      // Animation for circular text (position at bottom)
      gsap.to(circularTextRef.current, {
        y: 100, // Moves it down
        scrollTrigger: {
          trigger: circularTextRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      // Cleanup function
      return () => {
        tlLeft.kill();
        tlRight.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, []);

  return (
    <div className={landingStyles.landing}>
      {/* Left Star (Top) - Smaller size */}
      <div ref={starLeftRef} className={landingStyles.starContainerLeft}>
        <Image
          src="/images/SoftStar.svg"
          width={60} // Smaller size
          height={60}
          alt="Soft Star"
        />
      </div>

      {/* Right Star (Bottom) - Smaller size */}
      <div ref={starRightRef} className={landingStyles.starContainerRight}>
        <Image
          src="/images/SoftStar.svg"
          width={60} // Smaller size
          height={60}
          alt="Soft Star"
        />
      </div>

      <Image className={landingStyles.bg}
        src='/images/Ellipse4.svg'
        width={600}
        height={600}
        alt='bg-image'

      />

      <p className={landingStyles.landing__text}>
        Transforming <br />
        Aspirations
        <br />
        into
        <br />
        Achievements
      </p>


      {/* Circular Text at Bottom */}
      <div
        ref={circularTextRef}
        className={landingStyles.circularTextContainer}
      >
        <CircularText
          text="Scroll*To*Explore*"
          onHover="speedUp"
          spinDuration={20}
          className={landingStyles.circularText}
        />
      </div>
    </div>
  );
};

export default LandingPage;
