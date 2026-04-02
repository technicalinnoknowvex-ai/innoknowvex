"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import styles from "./styles/modernHero.module.scss";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePopupForm } from "@/context/PopupFormContext";
import NetworkAnimation from "./NetworkAnimation/NetworkAnimation";
import FloatingBubbles from "./FloatingBubbles/FloatingBubbles";
import StatsOverlay from "./StatsOverlay/StatsOverlay";
import InlineServices from "./InlineServices/InlineServices";

gsap.registerPlugin(ScrollTrigger);

const ModernHero = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const textWrapperRef = useRef(null);
  const networkRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { openEnquiryForm } = usePopupForm();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useGSAP(
    () => {
      if (!isLoaded) return;

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      // Fade in tagline
      tl.to(
        ".hero-tagline",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        0
      );

      // Fade in heading
      tl.to(
        ".hero-heading",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        0.2
      );

      // Fade in paragraph
      tl.to(
        ".hero-paragraph",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        0.4
      );

      // Fade in start now button
      tl.to(
        ".start-now-button",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        0.6
      );

      // Fade in journey line
      tl.to(
        ".journey-line",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        0.7
      );

      // Fade in network
      tl.to(
        ".network-section",
        {
          opacity: 1,
          scale: 1,
          duration: 1,
        },
        0.3
      );

      // Parallax effect on scroll
      gsap.to(".hero-content", {
        y: -50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom 50%",
          scrub: 1,
          markers: false,
        },
      });
    },
    { dependencies: [isLoaded], scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={styles.modernHero}>
      {/* Floating background bubbles */}
      <FloatingBubbles />

      {/* Main hero container */}
      <div className={styles.heroContainer}>
        {/* Left Content */}
        <div ref={contentRef} className={styles.heroContent}>
          <div ref={textWrapperRef} className={styles.textWrapper}>
            {/* Tagline */}


            {/* Main Heading */}
            <h1 className={`${styles.heading} hero-heading`}>
              <span className={styles.orangeText}>Hi Students,</span>
              {/* <span className={styles.blackText}>learning environment</span> */}
            </h1>

            {/* Description */}
            <p className={`${styles.description} hero-paragraph`}>
              At INNOKNOWVEX EDUTECH, we go beyond traditional learning to transform your 
              potential into real-world success. We equip you with industry-ready skills 
              through practical training, live projects, and expert mentorship.
              We don't just teach—we empower you to perform and confidently step into the professional world ahead of the competition.
            </p>

            {/* Highlighted Journey Line */}
            <p className={`${styles.journeyLine} journey-line`}>
              Your journey to a successful career starts here
            </p>

            {/* Start Now Button - Centered */}
            <div className={styles.buttonCenter}>
              <button
                onClick={openEnquiryForm}
                className={`${styles.startNowButton} start-now-button`}
              >
                Start Now →
              </button>
            </div>

            {/* Our Services Heading */}
            <h2 className={styles.servicesHeading}>Our Services</h2>

            {/* Inline Services */}
            <InlineServices />
          </div>
        </div>

        {/* Right Network Visualization */}
        <div className={`${styles.networkSection} network-section`}>
          <NetworkAnimation ref={networkRef} />
          <StatsOverlay />
        </div>
      </div>
    </section>
  );
};

export default ModernHero;
