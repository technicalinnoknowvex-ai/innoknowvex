import React from "react";
import landingStyles from "./styles/landing.module.scss";
import Hero from "./Sections/Hero/Hero";
import AboutUs from "./Sections/AboutUs/AboutUs";

const LandingPage = () => {
  return (
    <div className={landingStyles.landing}>
      <Hero />
      <AboutUs />
    </div>
  );
};

export default LandingPage;
