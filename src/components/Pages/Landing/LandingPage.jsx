import React from "react";
import landingStyles from "./styles/landing.module.scss";
import Navbar from "../Navbar/Navbar";
const LandingPage = () => {
  return (
    <div className={landingStyles.landing}>
      <Navbar/>
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
