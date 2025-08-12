import React from "react";
import heroStyles from "./styles/hero.module.scss";
const Hero = () => {
  return (
    <section className={heroStyles.heroWrapper}>
      <p className={heroStyles.heroWrapper__headingTop}>Testing font</p>
      <br />
      <p className={heroStyles.heroWrapper__headingMiddle}>A B C D E F</p>
      <br />
      <p className={heroStyles.heroWrapper__headingBottom}>a b c d e f</p>
      <p className={heroStyles.heroWrapper__para}>
        Innoknowvex is a cutting-edge EdTech platform designed to seamlessly
        connect students with internships, professional training, career
        development, and expert mentorship. Our mission is to bridge the gap
        between academic education and industry requirements by providing
        students with access to industry-relevant programs hands-on training,
        and specialized mentorship. Through a structured, expert-driven
        approach, we empower aspiring professionals with the practical skills
        and industry insights necessary to excel in their chosen fields.
      </p>
    </section>
  );
};

export default Hero;
