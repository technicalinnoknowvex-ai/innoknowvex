import React, { useRef } from "react";
import Sparkle from "@/components/Common/Icons/Sparkle";
import styles from "./styles/ourPartners.module.scss";
import { landingPageData } from "@/data/landing";
import Marquee from "./Marquee/Marquee";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const OurPartners = ({ className = "" }) => {
  const { heading, subheading, brands, hiringPartners } =
    landingPageData.ourPartnerSection;
  const sectionRef = useRef(null);
  const sparkleRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const marquee1Ref = useRef(null);
  const marquee2Ref = useRef(null);

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

      // Heading + subheading + marquees
      gsap.set(headingRef.current, { clipPath: "inset(0 0 100% 0)", opacity: 1 });
      gsap.set(subheadingRef.current, { y: 20, opacity: 0 });
      gsap.set([marquee1Ref.current, marquee2Ref.current], { y: 40, opacity: 0 });

      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });

      contentTl
        .to(headingRef.current, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power3.out" })
        .to(subheadingRef.current, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.35")
        .to(marquee1Ref.current, { y: 0, opacity: 1, duration: 0.65, ease: "power2.out" }, "-=0.3")
        .to(marquee2Ref.current, { y: 0, opacity: 1, duration: 0.65, ease: "power2.out" }, "-=0.45");
    },
    { scope: sectionRef }
  );

  return (
    <section className={`${styles.sectionWrapper} ${className}`} ref={sectionRef}>
      <div className={styles.sectionWrapper__innerContainer}>
        <section className={styles.mainHeaderSection}>
          <div className={styles.sectionHeadingWrapper}>
            <div
              className={`${styles.gradientSpot} ${styles["gradientSpot--1"]}`}
            />

            <h2 ref={headingRef} className={`${styles.sectionHeadingWrapper__primaryHeading} gradientHeading`}>
              <div className={styles.sparkleDiv}>
                <div ref={sparkleRef}>
                  <Sparkle />
                </div>
              </div>
              {heading}
            </h2>
            <h3 ref={subheadingRef} className={styles.sectionHeadingWrapper__secondaryHeading}>
              {subheading}
            </h3>
          </div>
        </section>
        <section ref={marquee1Ref} className={styles.marqueeSection}>
          <Marquee items={brands} />
        </section>
        <p className={styles.hiringLabel}>HIRING PARTNERS</p>
        <section ref={marquee2Ref} className={styles.marqueeSection}>
          <Marquee items={hiringPartners} direction="right" />
        </section>
      </div>
    </section>
  );
};

export default OurPartners;
