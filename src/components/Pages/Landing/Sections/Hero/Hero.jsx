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
    </section>
  );
};

export default Hero;
