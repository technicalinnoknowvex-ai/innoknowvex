import React from "react";
import landingStyles from "./styles/landing.module.scss";
const LandingPage = () => {
  return (
    <div className={landingStyles.landing}>
      <p className={landingStyles.landing__text}>
        Learn What
        <br />
        Matters.
        <br />
        Master What
        <br />
        Counts.
      </p>
    </div>
  );
};

export default LandingPage;
