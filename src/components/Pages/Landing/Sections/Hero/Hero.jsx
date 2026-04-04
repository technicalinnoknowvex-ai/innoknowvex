"use client";
import React, { useRef, useState, useEffect } from "react";
import heroStyles from "./styles/hero.module.scss";
import Marquee from "./Marquee/Marquee";
import CircularText from "./RotatingRing/CircularText";
import { useCursor } from "@/hooks/useCursor";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MouseParallax, ScrollParallax } from "react-just-parallax";
import Sparkle from "@/components/Common/Icons/Sparkle";

const Hero = ({ scrollContainerRef }) => {
  const { resetCursor, transformCursor } = useCursor();
  const heroRef = useRef(null);
  const h1Refs = useRef([]);
  const sparkleOneRef = useRef(null);
  const sparkleTwoRef = useRef(null);
  
  // iOS FIX 22: Detect iOS and disable parallax for performance
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS devices
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const iOSSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsIOS(iOS || iOSSafari);
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // REMOVED: h1 animation (was causing 2.5s LCP delay)
      // ONLY animate sparkles now
      
      // iOS FIX 23: Use optimized GSAP settings for iOS
      gsap.config({
        force3D: true, // Force GPU acceleration
        nullTargetWarn: false,
      });

      tl.to(
        [sparkleOneRef.current, sparkleTwoRef.current],
        {
          scale: 1,
          opacity: 1,
          duration: isIOS ? 0.3 : 0.5, // Faster animation on iOS
          ease: "back.out(1.7)",
          stagger: isIOS ? 0.1 : 0.2, // Reduced stagger on iOS
          // iOS FIX 24: Explicitly enable GPU acceleration
          force3D: true,
          transformOrigin: "center center",
        }
      );
    },
    { scope: heroRef, dependencies: [isIOS] }
  );

  // Store refs for each h1 (keeping for potential future use)
  const setH1Ref = (el, index) => {
    h1Refs.current[index] = el;
  };

  // iOS FIX 25: Wrapper component that conditionally applies parallax
  const ConditionalParallax = ({ children, type = "scroll" }) => {
    if (isIOS) {
      // On iOS, skip parallax wrapper entirely for performance
      return <>{children}</>;
    }
    
    // On other devices, use normal parallax
    if (type === "scroll") {
      return (
        <ScrollParallax
          scrollContainerRef={scrollContainerRef}
          isAbsolutelyPositioned
        >
          <MouseParallax isAbsolutelyPositioned strength={0.02} zIndex={2}>
            {children}
          </MouseParallax>
        </ScrollParallax>
      );
    }
    
    return (
      <ScrollParallax
        scrollContainerRef={scrollContainerRef}
        isAbsolutelyPositioned
      >
        <MouseParallax isAbsolutelyPositioned strength={0.03} zIndex={2}>
          {children}
        </MouseParallax>
      </ScrollParallax>
    );
  };

  return (
    <section className={heroStyles.hero} ref={heroRef}>
      <div className={heroStyles.heroTextWrapper}>
        <div className={heroStyles.gradientSpot}></div>
        <div className={heroStyles.textContainer}>
          <ConditionalParallax type="scroll">
            <div 
              className={heroStyles.sparkleOne}
              // iOS FIX 26: Add inline styles for iOS positioning
              style={isIOS ? { 
                transform: 'translate3d(-100%, -10%, 0)',
                willChange: 'transform' 
              } : {}}
            >
              <div
                ref={sparkleOneRef}
                style={{ 
                  transform: "scale(0) translateZ(0)", 
                  opacity: 0,
                  willChange: 'transform, opacity'
                }}
              >
                <Sparkle />
              </div>
            </div>
          </ConditionalParallax>
          
          {/* REMOVED: transform and opacity styles from h1 elements */}
          {/* Now they render immediately as LCP element */}
          <div className={heroStyles.textContainer__textDiv}>
            <h1 ref={(el) => setH1Ref(el, 0)}>
              Transforming
            </h1>
          </div>
          <div className={heroStyles.textContainer__textDiv}>
            <h1 ref={(el) => setH1Ref(el, 1)}>
              Aspirations
            </h1>
          </div>
          <div className={heroStyles.textContainer__textDiv}>
            <h1 ref={(el) => setH1Ref(el, 2)}>
              into
            </h1>
          </div>
          <div className={heroStyles.textContainer__textDiv}>
            <h1 ref={(el) => setH1Ref(el, 3)}>
              Achievements
            </h1>
          </div>
          
          <ConditionalParallax type="mouse">
            <div 
              className={heroStyles.sparkleTwo}
              // iOS FIX 27: Add inline styles for iOS positioning
              style={isIOS ? { 
                transform: 'translate3d(150%, 0, 0)',
                willChange: 'transform' 
              } : {}}
            >
              <div
                ref={sparkleTwoRef}
                style={{ 
                  transform: "scale(0) translateZ(0)", 
                  opacity: 0,
                  willChange: 'transform, opacity'
                }}
              >
                <Sparkle />
              </div>
            </div>
          </ConditionalParallax>
        </div>
      </div>
      <div className={heroStyles.scrollWheelWrapper}>
        <CircularText text={"SCROLL TO EXPLORE • SCROLL TO EXPLORE • "} />
      </div>
      <Marquee />
    </section>
  );
};

export default Hero;