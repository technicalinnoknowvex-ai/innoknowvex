import React, { useEffect, useRef } from "react";
import styles from "./styles/whyChooseUs.module.scss";
import Sparkle from "@/components/Common/Icons/Sparkle";
import { Textfit } from "react-textfit";
import { landingPageData } from "@/data/landing";
import { useSectionObserver } from "@/hooks/useSectionObserver";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ScrollParallax } from "react-just-parallax";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WhyChooseUs = ({ scrollContainerRef }) => {
  const sectionRef = useRef(null);
  const sparkleRef = useRef(null);
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const cardsRef = useRef([]);

  const { heading, subheading, para, reasons } =
    landingPageData.whyChooseUsSection;

  const handleCardMouseMove = (e, cardEl) => {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    gsap.to(cardEl, {
      rotateY: dx * 14,
      rotateX: -dy * 14,
      transformPerspective: 700,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleCardMouseLeave = (cardEl) => {
    if (!cardEl) return;
    gsap.to(cardEl, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.55,
      ease: "elastic.out(1, 0.5)",
    });
  };

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

      // Heading: clip-path reveal from bottom
      gsap.set(headingRef.current, { clipPath: "inset(0 0 100% 0)", opacity: 1 });
      gsap.set(paraRef.current, { y: 30, opacity: 0 });

      // Cards: alternating left/right + up
      cardsRef.current.forEach((card, i) => {
        const dir = i % 3 === 0 ? -70 : i % 3 === 1 ? 0 : 70;
        gsap.set(card, { x: dir, y: 50, opacity: 0, scale: 0.92 });
      });

      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      contentTl
        .to(headingRef.current, {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.75,
          ease: "power3.out",
        })
        .to(
          paraRef.current,
          { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
          "-=0.4"
        )
        .to(
          cardsRef.current,
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.12,
          },
          "-=0.4"
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

            <h2 className={`${styles.sectionHeadingWrapper__primaryHeading} gradientHeading`}>
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

        <ScrollParallax strength={0.08}>
          <div className={styles.sparkle}>
            <Sparkle />
          </div>
        </ScrollParallax>

        <ScrollParallax strength={0.1}>
          <div className={styles.sparkle2}>
            <Sparkle />
          </div>
        </ScrollParallax>

        <section className={styles.contentSection}>
          <div className={styles.cardsGrid}>
            {reasons.map((reason, index) => (
              <div
                key={index}
                className={styles.reasonCard}
                ref={(el) => (cardsRef.current[index] = el)}
                onMouseMove={(e) => handleCardMouseMove(e, cardsRef.current[index])}
                onMouseLeave={() => handleCardMouseLeave(cardsRef.current[index])}
              >
                <div className={styles.reasonCard__titleCell}>
                  <div className={styles.titleSparkleDiv}>
                    <Sparkle color={"#9C7F16"} />
                  </div>
                  <div className={styles.titleContainer}>
                    <p className={styles.titleText}>{reason.title}</p>
                    <p className={styles.subTitleText}>{reason.subTitle}</p>
                  </div>
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
