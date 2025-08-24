import React, { useRef } from "react";
import styles from "./styles/whyChooseUs.module.scss";
import Sparkle from "@/components/Common/Icons/Sparkle";
import { Textfit } from "react-textfit";
import { landingPageData } from "@/data/landing";
import { useSectionObserver } from "@/hooks/useSectionObserver";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const WhyChooseUs = ({ scrollContainerRef }) => {
  const sectionRef = useRef(null);
  const sparkleRef = useRef(null);
  const { heading, subheading, para, reasons } =
    landingPageData.whyChooseUsSection;

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
          <div className={styles.sectionDescriptionWrapper}>
            <div className={styles.descDiv}>
              <p>{para}</p>
            </div>
          </div>
        </section>
        <section className={styles.contentSection}>
          <div className={styles.cardsGrid}>
            {reasons.map((reason, index) => (
              <div key={index} className={styles.reasonCard}>
                <div className={styles.reasonCard__titleCell}>
                  <div className={styles.titleSparkleDiv}>
                    <Sparkle color={"#9C7F16"} />
                  </div>
                  <p>{reason.title}</p>
                  <p>{reason.subTitle}</p>
                </div>
                <div className={styles.reasonCard__descriptionCell}>
                  {/* <Textfit mode="multi" className={styles.reasonDescTextFit}>
                    {reason.description}
                  </Textfit> */}

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
