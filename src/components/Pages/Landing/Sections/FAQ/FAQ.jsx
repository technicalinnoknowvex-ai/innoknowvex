"use client";
import React, { useState, useRef } from "react";
import styles from "./styles/faq.module.scss";
import { landingPageData } from "@/data/landing";
import Sparkle from "@/components/Common/Icons/Sparkle";
import { useSectionObserver } from "@/hooks/useSectionObserver";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FAQ = () => {
  const sectionRef = useRef();
  const { heading, subheading, para, faqs } = landingPageData.faqSection;
  const [activeFaq, setActiveFaq] = useState(0);
  const answerRefs = useRef([]);

  // Refs for animations
  const sparkleRef = useRef(null);
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const faqRefs = useRef([]);

  const handleFaqClick = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
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
        .to(
          sparkleRef.current,
          {
            rotation: 360,
            duration: 0.8,
            ease: "power1.inOut",
          },
          "<0.1"
        );

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

      gsap.set(faqRefs.current, {
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
          faqRefs.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1, // Each FAQ animates 0.1s after the previous one
          },
          "-=0.5" // Overlap with paragraph for better reverse
        );
    },
    { scope: sectionRef }
  );

  return (
    <section className={styles.sectionWrapper} ref={sectionRef} id="faq">
      <div className={styles.sectionWrapper__innerContainer}>
        <section className={styles.leftSection}>
          <div className={styles.sectionHeadingContainer} ref={headingRef}>
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
          <div className={styles.paraContainer} ref={paraRef}>
            <p>{para}</p>
          </div>
        </section>
        <section className={styles.rightSection}>
          {faqs.map((faq, fIndex) => (
            <div
              key={fIndex}
              ref={(el) => (faqRefs.current[fIndex] = el)}
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
