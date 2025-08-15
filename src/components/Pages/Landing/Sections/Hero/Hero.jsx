"use client";
import React from "react";
import heroStyles from "./styles/hero.module.scss";
import Marquee from "./Marquee/Marquee";
import { Textfit } from "react-textfit";
import Sparkle from "@/components/Common/Icons/Sparkle";
import CircularText from "./RotatingRing/CircularText";
import { MouseParallax, ScrollParallax } from "react-just-parallax";

const Hero = ({ scrollContainerRef }) => {
  return (
    <section className={heroStyles.hero}>
      <div className={heroStyles.heroTextWrapper}>
        <div className={heroStyles.gradientSpot}></div>

        <Textfit mode="multi" className={heroStyles.textFitContainer}>
          <h1 className={heroStyles.textFitContainer__heroText}>
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
            <MouseParallax isAbsolutelyPositioned strength={0.02} zIndex={2}>
              <div className={heroStyles.sparkleOne}>
                <Sparkle />
              </div>
            </MouseParallax>
          </ScrollParallax>

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
