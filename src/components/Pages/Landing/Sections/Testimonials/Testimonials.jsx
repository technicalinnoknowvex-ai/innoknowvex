"use client";
import React, { useEffect, useState, useRef } from "react";
import Sparkle from "@/components/Common/Icons/Sparkle";
import styles from "./styles/testimonials.module.scss";
import Marquee from "./Marquee/Marquee";
import Image from "next/image";
import QuoteIcon from "./Marquee/QuoteIcon";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getTestimonials } from "@/app/(backend)/api/testimonials/testimonials";

const TestimonialCard = ({ testimonial }) => (
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

const Testimonials = ({ className = "" }) => {
  const [testimonials, setTestimonials] = useState([]);
  const sectionRef = useRef(null);
  const sparkleRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const marqueeRow1Ref = useRef(null);
  const marqueeRow2Ref = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTestimonials();
      setTestimonials(data);
    };
    fetchData();
  }, []);

  useGSAP(
    () => {
      const sparkleTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      sparkleTl
        .fromTo(
          sparkleRef.current,
          { scale: 0, opacity: 0, rotation: -360 },
          { scale: 1.2, opacity: 1, rotation: 0, duration: 0.5, ease: "power2.out" }
        )
        .to(sparkleRef.current, { scale: 1, duration: 0.3, ease: "power2.out" })
        .to(sparkleRef.current, { rotation: 360, duration: 0.8, ease: "power1.inOut" }, "<0.1");

      // Heading clip-path + subheading fade
      gsap.set(headingRef.current, { clipPath: "inset(0 0 100% 0)", opacity: 1 });
      gsap.set(subheadingRef.current, { y: 18, opacity: 0 });

      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.set([marqueeRow1Ref.current, marqueeRow2Ref.current], { y: 50, opacity: 0 });

      contentTl
        .to(headingRef.current, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power3.out" })
        .to(subheadingRef.current, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.35")
        .to(marqueeRow1Ref.current, { y: 0, opacity: 1, duration: 0.65, ease: "power2.out" }, "-=0.3")
        .to(marqueeRow2Ref.current, { y: 0, opacity: 1, duration: 0.65, ease: "power2.out" }, "-=0.45");
    },
    { scope: sectionRef }
  );

  const topCards = testimonials
    .filter((t) => t.position === "top")
    .map((t, i) => <TestimonialCard key={`top-${t.id}`} testimonial={t} />);
  const bottomCards = testimonials
    .filter((t) => t.position === "bottom")
    .map((t, i) => <TestimonialCard key={`bottom-${t.id}`} testimonial={t} />);

  return (
    <section
      className={`${styles.sectionWrapper} ${className}`}
      ref={sectionRef}
      id="testimonials"
    >
      <div className={styles.sectionWrapper__innerContainer}>
        <section className={styles.mainHeaderSection}>
          <div className={styles.sectionHeadingWrapper}>
            <div
              className={`${styles.gradientSpot} ${styles["gradientSpot--1"]}`}
            ></div>
            <h2 ref={headingRef} className={`${styles.sectionHeadingWrapper__primaryHeading} gradientHeading`}>
              <div className={styles.sparkleDiv}>
                <div ref={sparkleRef}>
                  <Sparkle />
                </div>
              </div>
              Testimonials
            </h2>
            <h3 ref={subheadingRef} className={styles.sectionHeadingWrapper__secondaryHeading}>
              Don't Just Take our word for it
            </h3>
          </div>
        </section>
        <section className={styles.marqueeSection} ref={marqueeRow1Ref}>
          <Marquee items={topCards} direction="right" duration={50} />
        </section>
        <section className={styles.marqueeSection} ref={marqueeRow2Ref}>
          <Marquee items={bottomCards} direction="left" duration={50} />
        </section>
      </div>
    </section>
  );
};

export default Testimonials;
