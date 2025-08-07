'use client'
import React, { useEffect, useRef } from "react";
import landingStyles from "./styles/landing.module.scss";
import Navbar from "../Navbar/Navbar";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
const LandingPage = () => {
  const starRef = useRef(null);
  useEffect(() => {
    if (!starRef.current) {
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
    }
  }
    , []);
  return (
    <div className={landingStyles.landing}>
      <Navbar />

      <Image
        src="/images/Soft Star.svg"
        width={95.5}
        height={105}
        alt="Soft Star"
      />

      <p className={landingStyles.landing__text}>
        Transforming Aspirations
        <br />
        into <br />
        Achievements
        <br />
        <Image
          src="/images/Soft Star.svg"
          width={95.5}
          height={105}
          alt="Soft Star"
        />
      </p>
      </div>
  );
};

export default LandingPage;
