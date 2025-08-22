"use client";
import React, { useRef } from "react";
import landingStyles from "./styles/landing.module.scss";
import Hero from "./Sections/Hero/Hero";
import AboutUs from "./Sections/AboutUs/AboutUs";
import Navbar from "./Sections/Navbar/Navbar";
import Lenis from "lenis";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Programs from "./Sections/Programs/Programs";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LandingPage = () => {
  const scrollContainerRef = useRef(null);

  useGSAP(
    () => {
      if (scrollContainerRef.current) {
        const lenis = new Lenis({
          wrapper: scrollContainerRef.current,
          duration: 2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          syncTouch: true,
        });

        lenis.on("scroll", ScrollTrigger.update);

        const raf = (time) => {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);

        // Cleanup function - useGSAP automatically handles this
        return () => lenis.destroy();
      }
    },
    { scope: scrollContainerRef }
  ); // Optional: scope to container

  return (
    <div className={landingStyles.landing} ref={scrollContainerRef}>
      <Navbar />
      <Hero scrollContainerRef={scrollContainerRef} />
      <AboutUs scrollContainerRef={scrollContainerRef} />
      <Programs scrollContainerRef={scrollContainerRef} />
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          style={{
            width: "100%",
            height: "100vh",
          }}
        />
      ))}
    </div>
  );
};

export default LandingPage;