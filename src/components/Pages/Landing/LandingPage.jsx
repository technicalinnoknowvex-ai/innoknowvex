'use client'
import React, { useEffect, useRef } from "react";
import landingStyles from "./styles/landing.module.scss";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";


// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LandingPage = () => {
  const starRef = useRef(null);

  useEffect(() => {
    // Ensure we're in the browser environment
    if (starRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          scrub: 1,
          pin: true,
          trigger: starRef.current,
          start: "50% 50%",
          endTrigger: starRef.current,
          end: "bottom 50%",
        },
      });

      tl.to(starRef.current, {
        rotateZ: 900,
      });

      // Cleanup function
      return () => {
        tl.kill();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }
  }, []);

  return (
    <div className={landingStyles.landing}>
      

      <div ref={starRef} className={landingStyles.starContainer}>
        <Image
          src="/images/SoftStar.svg"
          width={95.5}
          height={105}
          alt="Soft Star"
        />
      </div>

      <p className={landingStyles.landing__text}>
        Transforming Aspirations
        <br />
        into <br />
        Achievements
        <br />

        <Image
          src="/images/SoftStar.svg"
          width={95.5}
          height={105}
          alt="Soft Star"
        />
      </p>
      
    </div>
  );
};

export default LandingPage;