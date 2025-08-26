import React, { useRef } from "react";
import Sparkle from "@/components/Common/Icons/Sparkle";
import styles from "./styles/ourPartners.module.scss";
import { landingPageData } from "@/data/landing";
import Marquee from "./Marquee/Marquee";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const OurPartners = () => {
  const { heading, subheading, brands, hiringPartners } =
    landingPageData.ourPartnerSection;
  const sectionRef = useRef(null);
  const sparkleRef = useRef(null);
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
    <section className={styles.sectionWrapper} ref={sectionRef}>
      <div className={styles.sectionWrapper__innerContainer}>
        <section className={styles.mainHeaderSection}>
          <div className={styles.sectionHeadingWrapper}>
            <div
              className={`${styles.gradientSpot} ${styles["gradientSpot--1"]}`}
            />

            <h2 className={styles.sectionHeadingWrapper__primaryHeading}>
              <div className={styles.sparkleDiv}>
                <div ref={sparkleRef}>
                  <Sparkle />
                </div>
              </div>
              {heading}
            </h2>
            <h3 className={styles.sectionHeadingWrapper__secondaryHeading}>
              {subheading}
            </h3>
          </div>
        </section>
        <section className={styles.marqueeSection}>
          <Marquee items={brands} />
        </section>
        <h1>HIRING PARTNERS</h1>
        <section className={styles.marqueeSection}>
          <Marquee items={hiringPartners} direction="right" />
        </section>
      </div>
    </section>
  );
};

export default OurPartners;
