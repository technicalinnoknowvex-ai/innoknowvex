"use client";
import React, { useRef } from "react";
import styles from "./styles/program.module.scss";
import { landingPageData } from "@/data/landing";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useNavColor } from "@/context/NavColorContext";
import DoubleSparkle from "@/components/Common/Icons/DoubleSparkle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Programs = () => {
  const { updateNavColor } = useNavColor();
  const { programs } = landingPageData.programsSection;
  const programSectionRef = useRef(null);
  const programRefs = useRef([]);

  const addToRefs = (el, refArray) => {
    if (el && !refArray.current.includes(el)) {
      refArray.current.push(el);
    }
  };

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: programSectionRef.current,
        start: "top 100px",
        end: "bottom -150%",
        onEnter: () => {
          // console.log("Programs section entered - navbar should be white");
          updateNavColor("white");
        },
        onEnterBack: () => {
          // console.log(
          //   "Programs section entered from below - navbar should be white"
          // );
          updateNavColor("white");
        },
        onLeave: () => {
          // console.log(
          //   "Programs section left downward - navbar back to default"
          // );
          updateNavColor("#262c35");
        },
        onLeaveBack: () => {
          // console.log("Programs section left upward - navbar back to default");
          updateNavColor("#262c35");
        },
      });

      ScrollTrigger.create({
        trigger: programSectionRef.current,
        start: "top 0px",
        end: "bottom -50%",
        scrub: true,
        pin: true,
      });

      // Image Animation Timeline
      const projectTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: programSectionRef.current,
          start: "top 0px",
          end: "bottom -50%",
          scrub: 2,
        },
      });

      if (programRefs.current[0]) {
        gsap.set(programRefs.current[0], {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        });
      }

      programRefs.current.forEach((project, index) => {
        if (index !== 0) {
          projectTimeline.to(project, {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            ease: "power2.inOut",
            duration: 1,
          });
        }
      });

      gsap.fromTo(
        programRefs.current,
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: programSectionRef.current,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: programSectionRef }
  );

  return (
    <div
      className={styles.sectionWrapper}
      ref={programSectionRef}
      id="programs"
    >
      <div className={styles.sectionInnerWrapper}>
        {programs.map((program, programIndex) => (
          <div
            key={program.title}
            ref={(el) => addToRefs(el, programRefs)}
            className={styles.clipContentWrapper}
            style={{
              clipPath:
                programIndex === 0
                  ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                  : "polygon(0 0, 100% 0, 100% 0, 0 0)",
            }}
          >
            <div className={styles.container}>
              <div className={styles.container__overLay}></div>
              <Image
                src={program.image}
                fill
                alt="program-image"
                style={{
                  objectFit: "cover",
                  objectPosition: "left",
                }}
              />
              <div className={styles.contentWrapper}>
                <div className={styles.sectionHeaderWrapper}>
                  <div className={styles.sparkleDiv}>
                    <DoubleSparkle color={"white"} />
                  </div>
                  <h1>
                    What <span>Programs</span>
                    <br />
                    We're Offering
                  </h1>
                </div>
                <div className={styles.titleContainer}>
                  <h2>{program.title}</h2>
                  <h2>{program.subTitle}</h2>
                </div>
                <p>{program.description}</p>

                <Link
                  href={`/programs/${program.slug}`}
                  className={styles.link}
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Programs;
