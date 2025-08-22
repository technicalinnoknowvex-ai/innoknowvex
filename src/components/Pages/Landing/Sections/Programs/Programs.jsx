"use client";

import React, { useEffect, useRef } from "react";
import styles from "./styles/program.module.scss";
import { landingPageData } from "@/data/landing";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DoubleSparkle from "@/components/Common/Icons/DoubleSparkle";
import { useScroll } from "@/context/ScrollContext";
import Sparkle from "@/components/Common/Icons/Sparkle";

gsap.registerPlugin(ScrollTrigger);

const Programs = () => {
  const { scrollContainerRef } = useScroll();

  const programSectionRef = useRef(null);
  const programRefs = useRef([]);

  const { heading, subheading, para, programs } =
    landingPageData.programsSection;
  const programsList = programs.slice(0, 4);

  const addToRefs = (el, refArray) => {
    if (el && !refArray.current.includes(el)) {
      refArray.current.push(el);
    }
  };
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: programSectionRef.current,
        scroller: scrollContainerRef.current,
        start: "top 0px",
        end: "bottom -50%",
        scrub: true,
        pin: true,
        // pinSpacing: false,
        markers: true,
      });

      const projectTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: programSectionRef.current,
          scroller: scrollContainerRef.current,
          scroller: scrollContainerRef.current,
          start: "top 0px",
          end: "bottom -50%",
          scrub: 2,
          markers: true,
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

      ScrollTrigger.refresh();
    }, programSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={programSectionRef} className={styles.sectionWrapper}>
      <div className={styles.innerWrapper}>
        <div className={styles.mainHeaderWrapper}>
          <div className={styles.sectionHeadingWrapper}>
            <div
              className={`${styles.gradientSpot} ${styles["gradientSpot--1"]}`}
            />
            <div className={styles.sparkleDiv}>
              <Sparkle />
            </div>

            <h2 className={styles.sectionHeadingWrapper__primaryHeading}>
              {heading}
            </h2>
            <h3 className={styles.sectionHeadingWrapper__secondaryHeading}>
              {subheading}
            </h3>
          </div>
          <div className={styles.sectionDescriptionWrapper}>
            <div className={styles.descDiv}>
              <p>{para}</p>
            </div>
          </div>
        </div>
        <div className={styles.secondaryHeaderWrapper}>
          <h1>
            What <span>Programs</span>
            <br />
            We’re offering
          </h1>
        </div>

        <main className={styles.contentWrapper}>
          <div className={styles.contentWrapper__left}>
            <div className={styles.programImgContainer}>
              {programsList.map((program, programIndex) => (
                <div
                  ref={(el) => addToRefs(el, programRefs)}
                  style={{
                    clipPath:
                      programIndex === 0
                        ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                        : "polygon(0 0, 100% 0, 100% 0, 0 0)",
                  }}
                  key={program.title}
                  className={styles.outerDiv}
                >
                  <div className={styles.outerDiv__imageDiv}>
                    <Image src={program.image} fill alt="program-banner" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.contentWrapper__right}>
            <div className={styles.programInfoGrid}>
              <div className={styles.titleCell}>
                <div className={styles.sparkleDiv}>
                  <DoubleSparkle />
                </div>
                <h1>{programsList[0].title}</h1>
                <h1>{programsList[0].subTitle}</h1>
              </div>

              <div className={styles.descriptionCell}>
                <p>{programsList[0].description}</p>
              </div>

              <div className={styles.linkCell}>
                <Link href={"#"} className={styles.linkCell__link}>
                  <p>Learn More</p>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Programs;
