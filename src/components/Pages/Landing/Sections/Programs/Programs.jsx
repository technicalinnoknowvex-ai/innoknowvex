import React, { useEffect, useRef } from "react";
import programStyles from "./styles/program.module.scss";
import Sparkle from "@/components/Common/Icons/Sparkle";
import { landingPageData } from "@/data/landing";
import { Textfit } from "react-textfit";
import Link from "next/link";
import { useCursor } from "@/context/useCursor";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScroll } from "@/context/ScrollContext";
import Image from "next/image";

const Programs = () => {
  const { resetCursor, transformCursor } = useCursor();
  const { scrollContainerRef } = useScroll();

  const programSectionRef = useRef(null);
  const programRefs = useRef([]);

  const addToRefs = (el, refArray) => {
    if (el && !refArray.current.includes(el)) {
      refArray.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a single scroll trigger for pinning the section
      ScrollTrigger.create({
        trigger: programSectionRef.current,
        scroller: scrollContainerRef.current,
        start: "top 0px",
        end: "bottom -50%",
        scrub: true,
        pin: true,
        markers: { startColor: "salmon", endColor: "salmon" },
      });

      const projectTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: programSectionRef.current,
          scroller: scrollContainerRef.current,
          start: "0% 0px",
          end: "bottom -50%",
          scrub: 2,
        },
      });

      gsap.set(programRefs.current[0], {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      });

      programRefs.current.forEach((project, index) => {
        if (index !== 0) {
          projectTimeline.to(project, {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            ease: "power2.inOut",
            duration: 1,
          });
        }
      });

      // Refresh ScrollTrigger
      ScrollTrigger.refresh();
    }, programSectionRef);

    // Cleanup on unmount
    return () => ctx.revert();
  }, []);

  const { heading, subheading, para, programs } =
    landingPageData.programsSection;

  const programsList = programs.slice(0, 4);

  return (
    <section className={programStyles.sectionWrapper} ref={programSectionRef}>
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
            <div className={programStyles.descDiv}>
              <p>{para}</p>
            </div>
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
        <section className={programStyles.contentSection}>
          <div className={programStyles.contentSection__left}>
            {programsList.map((program, programIndex) => (
              <div
                key={program.title}
                className={programStyles.programImageContainer}
                ref={(el) => addToRefs(el, programRefs)}
                style={{
                  clipPath:
                    programIndex === 0
                      ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                      : "polygon(0 0, 100% 0, 100% 0, 0 0)",
                }}
              >
                <Image src={program.image} fill={true} alt={"program-banner"} />
              </div>
            ))}
          </div>
          <div className={programStyles.contentSection__right}>
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
                <p>
                  AI refers to the simulation of human intelligence in machines
                  that are programmed to think like humans and mimic their
                  actions. This encompasses the ability of machines to perform
                  tasks commonly associated with human cognition, such as
                  learning from experience, reasoning based on provided data,
                  and adapting to new inputs to solve complex problems. AI can
                  manifest in various forms, from basic rule-based systems to
                  advanced neural networks capable of processing vast amounts of
                  information and making decisions independently.
                </p>
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
          </div>
        </section>
      </div>
    </section>
  );
};

export default Programs;
