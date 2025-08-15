import React from "react";
import aboutUsStyles from "./styles/aboutUs.module.scss";
import { Textfit } from "react-textfit";
import { landingPageData } from "@/data/landing";
import Image from "next/image";
import Sparkle from "@/components/Common/Icons/Sparkle";
const AboutUs = ({ scrollContainerRef }) => {
  const { heading, subheading, para, images } = landingPageData.aboutSection;

  return (
    <section className={aboutUsStyles.sectionWrapper}>
      <div className={aboutUsStyles.sectionWrapper__innerContainer}>
        <section className={aboutUsStyles.leftSection}>
          <div className={aboutUsStyles.headingContainer}>
            <div
              className={`${aboutUsStyles.gradientSpot} ${aboutUsStyles["gradientSpot--1"]}`}
            />
            <div className={aboutUsStyles.sparkleDiv}>
              <Sparkle />
            </div>

            <h2 className={aboutUsStyles.headingContainer__primaryHeading}>
              {heading}
            </h2>
            <h3 className={aboutUsStyles.headingContainer__secondaryHeading}>
              {subheading}
            </h3>
          </div>
          <div className={aboutUsStyles.paraContainer}>
            <Textfit
              className={aboutUsStyles.paraContainer__paraTextFit}
              mode="multi"
              forceSingleModeWidth={false}
            >
              {para}
            </Textfit>
          </div>
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
        <section className={aboutUsStyles.rightSection}>
          <div
            className={`${aboutUsStyles.gradientSpot} ${aboutUsStyles["gradientSpot--2"]}`}
          />
          <div className={aboutUsStyles.rightSection__collageGrid}>
            <div className={aboutUsStyles.cell1}>
              <Image
                src={images[0]}
                alt="cell_1_img"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell2}></div>
            <div className={aboutUsStyles.cell3}>
              <Image
                src={images[1]}
                alt="cell_1_img"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell4}>
              <Image
                src={images[2]}
                alt="cell_1_img"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell5}></div>
            <div className={aboutUsStyles.cell6}></div>
            <div className={aboutUsStyles.cell7}>
              <Image
                src={images[3]}
                alt="cell_1_img"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell8}></div>
            <div className={aboutUsStyles.cell9}>
              <Image
                src={images[4]}
                alt="cell_1_img"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell10}></div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AboutUs;
