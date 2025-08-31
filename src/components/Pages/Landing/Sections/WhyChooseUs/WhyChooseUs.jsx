import React, { useRef } from "react";
import styles from "./styles/whyChooseUs.module.scss";
import Sparkle from "@/components/Common/Icons/Sparkle";
import { Textfit } from "react-textfit";
import { landingPageData } from "@/data/landing";
import { useSectionObserver } from "@/hooks/useSectionObserver";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WhyChooseUs = ({ scrollContainerRef }) => {
  const sectionRef = useRef(null);
  const sparkleRef = useRef(null);
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const cardsRef = useRef([]);

  const { heading, subheading, para, reasons } =
    landingPageData.whyChooseUsSection;

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

      // Sequential animations triggered when section is 50% in view
      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Set initial states - all elements move 50px in Y direction
      gsap.set([headingRef.current, paraRef.current], {
        y: 50,
        opacity: 0,
      });

      gsap.set(cardsRef.current, {
        y: 50,
        opacity: 0,
      });

      // Sequential animations - heading triggers the sequence
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
          "-=0.5" // Overlap with heading for better reverse
        )
        .to(
          cardsRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1, // Cards animate one by one
          },
          "-=0.5" // Overlap with paragraph for better reverse
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      className={styles.sectionWrapper}
      ref={sectionRef}
      id="why-choose-us"
    >
      <div className={styles.sectionWrapper__innerContainer}>
        <section className={styles.mainHeaderSection}>
          <div className={styles.sectionHeadingWrapper} ref={headingRef}>
            <div
              className={`${styles.gradientSpot} ${styles["gradientSpot--1"]}`}
            />
            <div className={styles.sparkleDiv}>
              <div ref={sparkleRef}>
                <Sparkle />
              </div>
            </div>

            <h2 className={styles.sectionHeadingWrapper__primaryHeading}>
              {heading}
            </h2>
            <h3 className={styles.sectionHeadingWrapper__secondaryHeading}>
              {subheading}
            </h3>
          </div>
          <div className={styles.sectionDescriptionWrapper} ref={paraRef}>
            <div className={styles.descDiv}>
              <p>{para}</p>
            </div>
          </div>
        </section>

        <div className={styles.sparkle}>
          <Sparkle/>
        </div>

        <div className={styles.sparkle2}>
          <Sparkle/>
        </div>

        <section className={styles.contentSection}>
          <div className={styles.cardsGrid}>
            {reasons.map((reason, index) => (
              <div
                key={index}
                className={styles.reasonCard}
                ref={(el) => (cardsRef.current[index] = el)}
              >
                <div className={styles.reasonCard__titleCell}>
                  <div className={styles.titleSparkleDiv}>
                    <Sparkle color={"#9C7F16"} />
                  </div>
                  <p>{reason.title}</p>
                  <p>{reason.subTitle}</p>
                </div>
                <div className={styles.reasonCard__descriptionCell}>
                  <p>{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default WhyChooseUs;
