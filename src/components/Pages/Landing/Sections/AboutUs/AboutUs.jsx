import React, { useRef } from "react";
import aboutUsStyles from "./styles/aboutUs.module.scss";
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
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const buttonRef = useRef(null);

  useGSAP(
    () => {
      // Animate sparkle when section comes into view
      const sparkleTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 40%",
          toggleActions: "play none none reverse",
        },
      });

      sparkleTl
        .fromTo(
          sparkleRef.current,
          {
            scale: 0,
            opacity: 0,
            rotation: -360,
          },
          {
            scale: 1.2,
            opacity: 1,
            rotation: 0,
            duration: 0.5,
            ease: "power2.out",
          }
        )
        .to(sparkleRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
        .to(sparkleRef.current, {
          rotation: 360,
          duration: 0.8,
          ease: "power1.inOut",
        });

      // Sequential animations triggered by heading when section is 50% in view
      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          end: "bottom 20%", // Added end point for better reverse control
          toggleActions: "play none none reverse",
        },
      });

      // Set initial states
      gsap.set([headingRef.current, paraRef.current, buttonRef.current], {
        y: 50,
        opacity: 0,
      });

      // Sequential animations - all elements animate together for better reverse
      contentTl
        .to(headingRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        })
        .to(
          paraRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5" // Overlap more with heading for better reverse
        )
        .to(
          buttonRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5" // Overlap more with paragraph for better reverse
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      className={aboutUsStyles.sectionWrapper}
      ref={sectionRef}
      id="about-us"
    >
      <div className={aboutUsStyles.sectionWrapper__innerContainer}>
        <section className={aboutUsStyles.leftSection}>
          <div
            className={aboutUsStyles.sectionHeadingContainer}
            ref={headingRef}
          >
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
          <div className={aboutUsStyles.paraContainer} ref={paraRef}>
            <p className={aboutUsStyles.paraContainer__paraText}>{para}</p>
          </div>
          <div className={aboutUsStyles.linkContainer} ref={buttonRef}>
            <Link
              href="/about-us"
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
              Know More
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
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={75}
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell2}></div>
            <div className={aboutUsStyles.cell3}>
              <Image
                src={images[1]}
                alt="cell_2_img"
                fill
                sizes="(max-width: 768px) 30vw, 15vw"
                quality={75}
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell4}>
              <Image
                src={images[2]}
                alt="cell_3_img"
                fill
                sizes="(max-width: 768px) 40vw, 20vw"
                quality={75}
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell5}></div>
            <div className={aboutUsStyles.cell6}></div>
            <div className={aboutUsStyles.cell7}>
              <Image
                src={images[3]}
                alt="cell_4_img"
                fill
                sizes="(max-width: 768px) 35vw, 18vw"
                quality={75}
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell8}></div>
            <div className={aboutUsStyles.cell9}>
              <Image
                src={images[4]}
                alt="cell_5_img"
                fill
                sizes="(max-width: 768px) 45vw, 22vw"
                quality={75}
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