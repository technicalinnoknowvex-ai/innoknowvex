import React from "react";
import programStyles from "./styles/program.module.scss";
import Sparkle from "@/components/Common/Icons/Sparkle";
import { landingPageData } from "@/data/landing";
import { Textfit } from "react-textfit";
import Link from "next/link";
import { useCursor } from "@/context/useCursor";
const Programs = () => {
  const { resetCursor, transformCursor } = useCursor();

  const { heading, subheading, para } = landingPageData.programsSection;
  return (
    <section className={programStyles.sectionWrapper}>
      <div className={programStyles.sectionWrapper__innerContainer}>
        <section className={programStyles.mainHeaderSection}>
          <div className={programStyles.sectionHeadingWrapper}>
            <div
              className={`${programStyles.gradientSpot} ${programStyles["gradientSpot--1"]}`}
            />
            <div className={programStyles.sparkleDiv}>
              <Sparkle />
            </div>

            <h2 className={programStyles.sectionHeadingWrapper__primaryHeading}>
              {heading}
            </h2>
            <h3
              className={programStyles.sectionHeadingWrapper__secondaryHeading}
            >
              {subheading}
            </h3>
          </div>
          <div className={programStyles.sectionDescriptionWrapper}>
            <Textfit mode="multi" className={programStyles.descTextFit}>
              <p>{para}</p>
            </Textfit>
          </div>
        </section>

        <section className={programStyles.subHeaderSection}>
          <Textfit
            mode="multi"
            className={programStyles.subHeaderSection__textFit}
          >
            <h1>
              What <span>Programs</span>
              <br /> We'are Offering
            </h1>
          </Textfit>
        </section>
        <div className={programStyles.contentSection}>
          <section className={programStyles.leftSection}>
            <div className={programStyles.programImageContainer}></div>
          </section>
          <section className={programStyles.rightSection}>
            <div className={programStyles.programGrid}>
              <div className={programStyles.titleCell}>
                <div className={programStyles.sparkleDiv}>
                  <Sparkle />
                </div>
                <h3>
                  Artificial
                  <br />
                  Intelligence
                </h3>
              </div>
              <div className={programStyles.descriptionCell}>
                <Textfit
                  mode="multi"
                  className={programStyles.descriptionCell__descTextFit}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  AI refers to the simulation of human intelligence in machines
                  that are programmed to think like humans and mimic their
                  actions. This encompasses the ability of machines to perform
                  tasks commonly associated with human cognition, such as
                  learning from experience, reasoning based on provided data,
                  and adapting to new inputs to solve complex problems. AI can
                  manifest in various forms, from basic rule-based systems to
                  advanced neural networks capable of processing vast amounts of
                  information and making decisions independently.
                </Textfit>
              </div>
              <div className={programStyles.linkCell}>
                <Link
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
                  className={programStyles.linkCell__link}
                  href={"#"}
                >
                  <Textfit mode="single" className={programStyles.linkTextFit}>
                    Learn More
                  </Textfit>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default Programs;
