"use client";
import React from "react";
import heroStyles from "./styles/hero.module.scss";
import Marquee from "./Marquee/Marquee";
import { Textfit } from "react-textfit";
import Sparkle from "@/components/Common/Icons/Sparkle";
import CircularText from "./RotatingRing/CircularText";
import { MouseParallax, ScrollParallax } from "react-just-parallax";
import { useCursor } from "@/context/useCursor";

const Hero = ({ scrollContainerRef }) => {
  const { resetCursor, transformCursor } = useCursor();

  return (
    <section className={heroStyles.hero}>
      <div className={heroStyles.heroTextWrapper}>
        <div className={heroStyles.gradientSpot}></div>
        <Textfit
          mode="multi"
          forceSingleModeWidth={true}
          className={heroStyles.textFit}
          onMouseEnter={() =>
            transformCursor({
              dot: {
                backgroundColor: "white",
                scale: 20,
                opacity: 0.2,
              },
              ring: {
                opacity: 0,
                scale: 0.5,
              },
            })
          }
          onMouseLeave={() => resetCursor()}
        >
          <ScrollParallax
            scrollContainerRef={scrollContainerRef}
            isAbsolutelyPositioned
          >
            <MouseParallax isAbsolutelyPositioned strength={0.02} zIndex={2}>
              <div className={heroStyles.sparkleOne}>
                <Sparkle />
              </div>
            </MouseParallax>
          </ScrollParallax>

          <h1 className={heroStyles.textFit__heroText}>
            Transforming
            <br />
            Aspirations
            <br />
            into
            <br />
            Achievements
          </h1>
          <ScrollParallax
            scrollContainerRef={scrollContainerRef}
            isAbsolutelyPositioned
          >
            <MouseParallax isAbsolutelyPositioned strength={0.03} zIndex={2}>
              <div className={heroStyles.sparkleTwo}>
                <Sparkle />
              </div>
            </MouseParallax>
          </ScrollParallax>
        </Textfit>
      </div>
      <div className={heroStyles.scrollWheelWrapper}>
        <CircularText text={"SCROLL TO EXPLORE • SCROLL TO EXPLORE • "} />
      </div>
      <Marquee />
    </section>
  );
};

export default Hero;
