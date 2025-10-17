import React, { useEffect, useState, useRef } from 'react';
import Sparkle from "@/components/Common/Icons/Sparkle";
import styles from "./styles/testimonials.module.scss";
import Marquee from "./Marquee/Marquee";
import Image from "next/image";
import QuoteIcon from "./Marquee/QuoteIcon";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getTestimonials } from "@/app/api/testimonials/testimonials";

const TestimonialCard = ({ testimonial }) => (
  <div className={styles.testimonialCard}>
    <div className={styles.testimonialCard__contentContainer}>
      <div className={styles.iconDiv}><QuoteIcon /></div>
      <p className={styles.testimonialText}>{testimonial.testimonial}</p>
    </div>
    <div className={styles.testimonialCard__userInfoGrid}>
      <div className={styles.avatarCell}>
        <Image
          src={testimonial.avatar}
          alt="avatar"
          fill
          style={{objectFit: "cover", objectPosition: "center"}}
        />
      </div>
      <div className={styles.nameCell}><p>{testimonial.name}</p></div>
      <div className={styles.professionCell}><p>{testimonial.profession}</p></div>
    </div>
  </div>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const sectionRef = useRef(null);
  const sparkleRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTestimonials();
      setTestimonials(data);
    };
    fetchData();
  }, []);

  useGSAP(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    timeline
      .fromTo(sparkleRef.current, { scale: 0, opacity: 0, rotation: -360 }, { scale: 1.2, opacity: 1, rotation: 0, duration: 0.5, ease: "power2.out" })
      .to(sparkleRef.current, { scale: 1, duration: 0.3, ease: "power2.out" })
      .to(sparkleRef.current, { rotation: 360, duration: 0.8, ease: "power1.inOut" }, "<0.1");
  }, { scope: sectionRef });

  const topCards = testimonials.filter(t => t.position === 'top').map((t, i) => <TestimonialCard key={`top-${t.id}`} testimonial={t} />);
  const bottomCards = testimonials.filter(t => t.position === 'bottom').map((t, i) => <TestimonialCard key={`bottom-${t.id}`} testimonial={t} />);

  return (
    <section className={styles.sectionWrapper} ref={sectionRef} id="testimonials">
      <div className={styles.sectionWrapper__innerContainer}>
        <section className={styles.mainHeaderSection}>
          <div className={styles.sectionHeadingWrapper}>
            <div className={`${styles.gradientSpot} ${styles["gradientSpot--1"]}`}></div>
            <h2 className={styles.sectionHeadingWrapper__primaryHeading}>
              <div className={styles.sparkleDiv}><div ref={sparkleRef}><Sparkle /></div></div>
              Testimonials
            </h2>
            <h3 className={styles.sectionHeadingWrapper__secondaryHeading}>
              Don't Just Take our word for it
            </h3>
          </div>
        </section>
       <section className={styles.marqueeSection}>
  <Marquee items={topCards} direction="right" duration={50} />
</section>
<section className={styles.marqueeSection}>
  <Marquee items={bottomCards} direction="left" duration={50} />
</section>

      </div>
    </section>
  );
};

export default Testimonials;
