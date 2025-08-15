import React from "react";
import aboutUsStyles from "./styles/aboutUs.module.scss";
import { Textfit } from "react-textfit";
const AboutUs = () => {
  return (
    <section className={aboutUsStyles.sectionWrapper}>
      <div className={aboutUsStyles.sectionWrapper__innerContainer}>
        <section className={aboutUsStyles.leftSection}>
          <div className={aboutUsStyles.headingContainer}>
            <h2 className={aboutUsStyles.headingContainer__primaryHeading}>
              About Us.
            </h2>
            <h3 className={aboutUsStyles.headingContainer__secondaryHeading}>
              GET TO KNOW US BETTER
            </h3>
          </div>
          <Textfit
            mode="multi"
            forceSingleModeWidth={false}
            className={aboutUsStyles.paraContainer}
          >
            <p className={aboutUsStyles.paraContainer__paraText}>
              Innoknowvex is a cutting-edge EdTech platform designed to
              seamlessly connect students with internships, professional
              training, career development, and expert mentorship. Our mission
              is to bridge the gap between academic education and industry
              requirements by providing students with access to
              industry-relevant programs hands-on training, and specialized
              mentorship. Through a structured, expert-driven approach, we
              empower aspiring professionals with the practical skills and
              industry insights necessary to excel in their chosen fields.
            </p>
          </Textfit>
          <div className={aboutUsStyles.actionBtnContainer}>
            <button className={aboutUsStyles.callToActionBtn}>
              <Textfit
                mode="single"
                className={aboutUsStyles.buttonTextFitContainer}
              >
                Know More
              </Textfit>
            </button>
          </div>
        </section>
        <section className={aboutUsStyles.rightSection}></section>
      </div>
    </section>
  );
};

export default AboutUs;
