import React from "react";
import aboutUsStyles from "./styles/aboutUs.module.scss";
import { Textfit } from "react-textfit";
import { landingPageData } from "@/data/landing";
import Image from "next/image";
import Sparkle from "@/components/Common/Icons/Sparkle";
import Link from "next/link";
import { useCursor } from "@/context/useCursor";
const AboutUs = ({ scrollContainerRef }) => {
  const { heading, subheading, para, images } = landingPageData.aboutSection;
  const { resetCursor, transformCursor } = useCursor();

  return (
    <section className={aboutUsStyles.sectionWrapper}>
      <div className={aboutUsStyles.sectionWrapper__innerContainer}>
        <section className={aboutUsStyles.leftSection}>
          <div className={aboutUsStyles.sectionHeadingContainer}>
            <div
              className={`${aboutUsStyles.gradientSpot} ${aboutUsStyles["gradientSpot--1"]}`}
            />
            <div className={aboutUsStyles.sparkleDiv}>
              <Sparkle />
            </div>

            <h2
              className={aboutUsStyles.sectionHeadingContainer__primaryHeading}
            >
              {heading}
            </h2>
            <h3
              className={
                aboutUsStyles.sectionHeadingContainer__secondaryHeading
              }
            >
              {subheading}
            </h3>
          </div>
          <div className={aboutUsStyles.paraContainer}>
            <p className={aboutUsStyles.paraContainer__paraText}>{para}</p>
          </div>
          <div className={aboutUsStyles.linkContainer}>
            <Link
              href={"#"}
              className={aboutUsStyles.linkContainer__link}
              onMouseEnter={() =>
                transformCursor({
                  dot: {
                    backgroundColor: "#ff6432",
                    scale: 10,
                    opacity: 0.5,
                  },
                  ring: {
                    opacity: 0,
                    scale: 0.5,
                  },
                })
              }
              onMouseLeave={() => resetCursor()}
            >
              <Textfit
                mode="single"
                className={aboutUsStyles.buttonTextFitContainer}
              >
                Know More
              </Textfit>
            </Link>
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
