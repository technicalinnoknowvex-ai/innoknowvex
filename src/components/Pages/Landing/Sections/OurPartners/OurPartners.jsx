import React from "react";
import Sparkle from "@/components/Common/Icons/Sparkle";
import styles from "./styles/ourPartners.module.scss";
import { landingPageData } from "@/data/landing";
import Marquee from "./Marquee/Marquee";

const OurPartners = () => {
  const { heading, subheading, brands, hiringPartners } =
    landingPageData.ourPartnerSection;

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
          <Marquee items={brands} />
        </section>
        <h1>HIRING PARTNERS</h1>
        <section className={styles.marqueeSection}>
          <Marquee items={hiringPartners} direction="right" />
        </section>
      </div>
    </section>
  );
};

export default OurPartners;
