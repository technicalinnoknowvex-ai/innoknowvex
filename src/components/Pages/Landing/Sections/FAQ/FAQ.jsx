"use client";
import React, { useState, useRef } from "react";
import styles from "./styles/faq.module.scss";
import { landingPageData } from "@/data/landing";
import Sparkle from "@/components/Common/Icons/Sparkle";
import { useSectionObserver } from "@/hooks/useSectionObserver";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
const FAQ = () => {
  const sectionRef = useRef();
  const { heading, subheading, para, faqs } = landingPageData.faqSection;
  const [activeFaq, setActiveFaq] = useState(0);
  const answerRefs = useRef([]);
  const handleFaqClick = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

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
        <section className={styles.leftSection}>
          <div className={styles.sectionHeadingContainer}>
            <div
              className={`${styles.gradientSpot} ${styles["gradientSpot--1"]}`}
            />
            <div className={styles.sparkleDiv}>
              <div ref={sparkleRef}>
                <Sparkle />
              </div>
            </div>

            <h2 className={styles.sectionHeadingContainer__primaryHeading}>
              {heading}
            </h2>
            <h3 className={styles.sectionHeadingContainer__secondaryHeading}>
              {subheading}
            </h3>
          </div>
          <div className={styles.paraContainer}>
            <p>{para}</p>
          </div>
        </section>
        <section className={styles.rightSection}>
          {faqs.map((faq, fIndex) => (
            <div
              key={fIndex}
              className={`${styles.faqWrapper} ${
                activeFaq === fIndex && styles["faqWrapper--active"]
              }`}
              onClick={() => handleFaqClick(fIndex)}
            >
              <div className={styles.questionWrapper}>
                <div className={styles.iconContainer}>
                  <div className={styles.iconDiv}>
                    <Sparkle
                      color={activeFaq === fIndex ? "#FF6432" : "#9C7F16"}
                    />
                  </div>
                </div>
                <div className={styles.questionDiv}>
                  <p style={{ color: activeFaq === fIndex && "#FF6432" }}>
                    {faq.question}
                  </p>
                </div>
              </div>
              <div
                ref={(el) => (answerRefs.current[fIndex] = el)}
                className={`${styles.answerWrapper} ${
                  activeFaq === fIndex && styles["answerWrapper--active"]
                }`}
                style={{
                  maxHeight:
                    activeFaq === fIndex
                      ? `${answerRefs.current[fIndex]?.scrollHeight}px`
                      : "0px",
                }}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </section>
  );
};

export default FAQ;
