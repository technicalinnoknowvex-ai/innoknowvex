import Sparkle from "@/components/Common/Icons/Sparkle";
import styles from "./styles/testimonials.module.scss";
import { landingPageData } from "@/data/landing";
import React, { useRef } from "react";
import Marquee from "./Marquee/Marquee";
import Image from "next/image";
import QuoteIcon from "./Marquee/QuoteIcon";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className={styles.testimonialCard}>
      <div className={styles.testimonialCard__contentContainer}>
        <div className={styles.iconDiv}>
          <QuoteIcon />
        </div>
        <p className={styles.testimonialText}>{testimonial.testimonial}</p>
      </div>
      <div className={styles.testimonialCard__userInfoGrid}>
        <div className={styles.avatarCell}>
          <Image
            src={testimonial.avatar}
            alt="avatar"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <div className={styles.nameCell}>
          <p>{testimonial.name}</p>
        </div>
        <div className={styles.professionCell}>
          <p>{testimonial.profession}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const { heading, subheading, rowTop, rowBottom } =
    landingPageData.testimonialsSection;

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

  const topCards = rowTop.map((testimonial, index) => (
    <TestimonialCard key={`top-${index}`} testimonial={testimonial} />
  ));

  const bottomCards = rowBottom.map((testimonial, index) => (
    <TestimonialCard key={`bottom-${index}`} testimonial={testimonial} />
  ));
  return (
    <section
      className={styles.sectionWrapper}
      ref={sectionRef}
      id="testimonials"
    >
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
          <Marquee items={topCards} direction="right" />
        </section>
        <section className={styles.marqueeSection}>
          <Marquee items={bottomCards} />
        </section>
      </div>
    </section>
  );
};

export default Testimonials;
