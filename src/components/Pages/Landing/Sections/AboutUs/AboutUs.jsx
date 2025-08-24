import React, { useRef } from "react";
import aboutUsStyles from "./styles/aboutUs.module.scss";
import { Textfit } from "react-textfit";
import { landingPageData } from "@/data/landing";
import Image from "next/image";
import Sparkle from "@/components/Common/Icons/Sparkle";
import Link from "next/link";
import { useCursor } from "@/hooks/useCursor";
import { useSectionObserver } from "@/hooks/useSectionObserver";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AboutUs = ({ scrollContainerRef }) => {
  const { heading, subheading, para, images } = landingPageData.aboutSection;
  const { resetCursor, transformCursor } = useCursor();
  const sectionRef = useRef(null);
  const sparkleRef = useRef(null);

  // Animate sparkle when section comes into view
  // Enhanced pop animation with bounce and scale
  useGSAP(
    () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      timeline
        .fromTo(
          sparkleRef.current,
          {
            scale: 0,
            opacity: 0,
            rotation: -360,
          },
          {
            scale: 1.2, // Overshoot for bounce effect
            opacity: 1,
            rotation: 0,
            duration: 0.5,
            ease: "power2.out",
          }
        )
        .to(sparkleRef.current, {
          scale: 1, // Settle to normal size
          duration: 0.3,
          ease: "power2.out",
        })
        .to(
          sparkleRef.current,
          {
            rotation: 360, // Final spin
            duration: 0.8,
            ease: "power1.inOut",
          },
          "<0.1"
        ); // Start slightly after scale animation
    },
    { scope: sectionRef }
  );

  return (
    <section className={aboutUsStyles.sectionWrapper} ref={sectionRef}>
      <div className={aboutUsStyles.sectionWrapper__innerContainer}>
        <section className={aboutUsStyles.leftSection}>
          <div className={aboutUsStyles.sectionHeadingContainer}>
            <div
              className={`${aboutUsStyles.gradientSpot} ${aboutUsStyles["gradientSpot--1"]}`}
            />
            <div className={aboutUsStyles.sparkleDiv}>
              <div ref={sparkleRef}>
                <Sparkle />
              </div>
            </div>

            <h2
              className={aboutUsStyles.sectionHeadingContainer__primaryHeading}
            >
              {heading}
            </h2>
            <h3
              className={
                aboutUsStyles.sectionHeadingContainer__secondaryHeading
              }
            >
              {subheading}
            </h3>
          </div>
          <div className={aboutUsStyles.paraContainer}>
            <p className={aboutUsStyles.paraContainer__paraText}>{para}</p>
          </div>
          <div className={aboutUsStyles.linkContainer}>
            <Link
              href={"#"}
              className={aboutUsStyles.linkContainer__link}
              onMouseEnter={() =>
                transformCursor({
                  dot: {
                    backgroundColor: "#ff6432",
                    scale: 10,
                    opacity: 0.5,
                  },
                  ring: {
                    opacity: 0,
                    scale: 0.5,
                  },
                })
              }
              onMouseLeave={() => resetCursor()}
            >
              <Textfit
                mode="single"
                className={aboutUsStyles.buttonTextFitContainer}
              >
                Know More
              </Textfit>
            </Link>
          </div>
        </section>
        <section className={aboutUsStyles.rightSection}>
          <div
            className={`${aboutUsStyles.gradientSpot} ${aboutUsStyles["gradientSpot--2"]}`}
          />
          <div className={aboutUsStyles.rightSection__collageGrid}>
            <div className={aboutUsStyles.cell1}>
              <Image
                src={images[0]}
                alt="cell_1_img"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell2}></div>
            <div className={aboutUsStyles.cell3}>
              <Image
                src={images[1]}
                alt="cell_1_img"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell4}>
              <Image
                src={images[2]}
                alt="cell_1_img"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell5}></div>
            <div className={aboutUsStyles.cell6}></div>
            <div className={aboutUsStyles.cell7}>
              <Image
                src={images[3]}
                alt="cell_1_img"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell8}></div>
            <div className={aboutUsStyles.cell9}>
              <Image
                src={images[4]}
                alt="cell_1_img"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell10}></div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AboutUs;
