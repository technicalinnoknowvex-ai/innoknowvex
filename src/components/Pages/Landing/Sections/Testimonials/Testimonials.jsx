import Sparkle from "@/components/Common/Icons/Sparkle";
import styles from "./styles/testimonials.module.scss";
import { landingPageData } from "@/data/landing";
import React from "react";
import Marquee from "./Marquee/Marquee";
import Image from "next/image";
import QuoteIcon from "./Marquee/QuoteIcon";

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

  const topCards = rowTop.map((testimonial, index) => (
    <TestimonialCard key={`top-${index}`} testimonial={testimonial} />
  ));

  const bottomCards = rowBottom.map((testimonial, index) => (
    <TestimonialCard key={`bottom-${index}`} testimonial={testimonial} />
  ));
  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.sectionWrapper__innerContainer}>
        <section className={styles.mainHeaderSection}>
          <div className={styles.sectionHeadingWrapper}>
            <div
              className={`${styles.gradientSpot} ${styles["gradientSpot--1"]}`}
            />

            <h2 className={styles.sectionHeadingWrapper__primaryHeading}>
              <div className={styles.sparkleDiv}>
                <Sparkle />
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
