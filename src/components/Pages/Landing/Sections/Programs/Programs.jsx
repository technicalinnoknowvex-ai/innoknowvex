import React from "react";
import programStyles from "./styles/program.module.scss";
import Sparkle from "@/components/Common/Icons/Sparkle";
import { landingPageData } from "@/data/landing";
import { Textfit } from "react-textfit";
import Link from "next/link";
const Programs = () => {
  const { heading, subheading, para } = landingPageData.programsSection;
  return (
    <div className={programStyles.sectionWrapper}>
      <div className={programStyles.sectionWrapper__innerContainer}>
        <section className={programStyles.topSection}>
          <div className={programStyles.topSection__headingContainer}>
            <div
              className={`${programStyles.gradientSpot} ${programStyles["gradientSpot--1"]}`}
            />
            <div className={programStyles.sparkleDiv}>
              <Sparkle />
            </div>

            <h2 className={programStyles.primaryHeading}>{heading}</h2>
            <h3 className={programStyles.secondaryHeading}>{subheading}</h3>
          </div>
          <div className={programStyles.topSection__paraContainer}>
            <Textfit
              className={programStyles.paraTextFit}
              mode="multi"
              forceSingleModeWidth={false}
            >
              {para}
            </Textfit>
          </div>
        </section>
        <div className={programStyles.middleSection}>
          <h1 className={programStyles.middleSection__middleHeading}>
            What <span>Programs</span>
            <br /> We'are Offering
          </h1>
        </div>
        <main className={programStyles.mainSection}>
          <section className={programStyles.mainSection__leftSection}></section>
          <section className={programStyles.mainSection__rightSection}>
            <div className={programStyles.programCardGrid}>
              <div className={programStyles.programTitleCell}>
                <h3>
                  Artificial
                  <br />
                  Intelligence
                </h3>
              </div>
              <div className={programStyles.programDescCell}>
                Dive into the world of Artificial Intelligence with a hands-on
                learning experience focused on machine learning, deep learning,
                and neural networks. Through interactive lessons, real-world
                projects, and expert guidance, you’ll move beyond theory into
                practical application. Whether you're starting out or
                upskilling, this course equips you for real-world challenges and
                success in an AI-driven future.
              </div>
              <div className={programStyles.programLinkBtnCell}>
                <Link
                  className={programStyles.programLinkBtnCell__link}
                  href={"#"}
                >
                  <Textfit
                    mode="single"
                    className={programStyles.buttonTextFitContainer}
                  >
                    Learn More
                  </Textfit>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Programs;
