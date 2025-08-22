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
import WhyChooseUs from "./Sections/WhyChooseUs/WhyChooseUs";
import OurPartners from "./Sections/OurPartners/OurPartners";
import Testimonials from "./Sections/Testimonials/Testimonials";
import FAQ from "./Sections/FAQ/FAQ";
import Footer from "./Sections/Footer/Footer";

// gsap.registerPlugin(ScrollTrigger, useGSAP);

const LandingPage = () => {
  const scrollContainerRef = useRef(null);

  // useGSAP(
  //   () => {
  //     if (scrollContainerRef.current) {
  //       const lenis = new Lenis({
  //         wrapper: scrollContainerRef.current,
  //         duration: 2,
  //         easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  //         smoothWheel: true,
  //         syncTouch: true,
  //       });

  //       lenis.on("scroll", ScrollTrigger.update);

  //       const raf = (time) => {
  //         lenis.raf(time);
  //         requestAnimationFrame(raf);
  //       };
  //       requestAnimationFrame(raf);

  //       // Cleanup function - useGSAP automatically handles this
  //       return () => lenis.destroy();
  //     }
  //   },
  //   { scope: scrollContainerRef }
  // ); // Optional: scope to container

  return (
    <div className={landingStyles.landing}>
      <Hero scrollContainerRef={scrollContainerRef} />
      <AboutUs scrollContainerRef={scrollContainerRef} />
      <Programs scrollContainerRef={scrollContainerRef} />
      <WhyChooseUs scrollContainerRef={scrollContainerRef} />
      <OurPartners scrollContainerRef={scrollContainerRef} />
      <Testimonials scrollContainerRef={scrollContainerRef} />
      <FAQ scrollContainerRef={scrollContainerRef} />
      <Footer />
    </div>
  );
};

export default LandingPage;