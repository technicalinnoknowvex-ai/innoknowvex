"use client";
import React, { useEffect, useRef } from "react";
import landingStyles from "./styles/hero.module.scss";
import CircularText from "../../UI/CircularText.jsx";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Strip from "@/components/Pages/Hero/Strip/Strip";
import Arrow from "@/components/Pages/Hero/Arrow/Arrow";

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

      gsap.to(starLeftRef.current, {
        rotateZ: 720,
        duration: 2,
        scrollTrigger: {
          trigger: starLeftRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        }
      });

      gsap.to(starRightRef.current, {
        rotateZ: 720,
        duration: 2,
        scrollTrigger: {
          trigger: starRightRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        }
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
    <>
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

        <div className={landingStyles.landing__text}>
          <div>Transforming</div> 
          <div>Aspirations</div>
          
          <div>into</div>
         
          <div>Achievements</div>
        </div>


        {/* Circular Text at Bottom */}
        <div
          ref={circularTextRef}
          className={landingStyles.circularTextContainer}
        >
          <CircularText
            text=" SCROLL TO EXPLORE SCROLL TO EXPLORE SCROLL TO EXPLORE"
            onHover="speedUp"
            spinDuration={20}
            className="custom-class"
          />
        </div>

      </div>

      <div>
        <Strip />
      </div>
    </>
  );
};

export default LandingPage;