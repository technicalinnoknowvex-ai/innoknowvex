"use client";
import React, { useEffect, useRef } from "react";
import styles from "./styles/program.module.scss";
import { landingPageData } from "@/data/landing";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScroll } from "@/context/ScrollContext";
import { useSectionObserver } from "@/hooks/useSectionObserver";

const Programs = () => {
  const { programs } = landingPageData.programsSection;
  const { scrollContainerRef } = useScroll();
  const programSectionRef = useRef();

  useSectionObserver(programSectionRef, {
    color: "white",
    threshold: 0.9,
    rootMargin: "20px 0px 0px 0px",
  });

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
        // markers: { startColor: "salmon", endColor: "salmon" },
      });

      // Image Animation
      const projectTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: programSectionRef.current,
          scroller: scrollContainerRef.current,
          start: "top 0px",
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

  return (
    <div className={styles.sectionWrapper} ref={programSectionRef}>
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
                objectFit="cover"
                fill
                alt="program-image"
                objectPosition="left"
              />
              <div className={styles.contentWrapper}>
                <div className={styles.titleContainer}>
                  <h1>{program.title}</h1>
                  <h1>{program.subTitle}</h1>
                </div>
                <p>{program.description}</p>

                <Link href={program.link} className={styles.link}>
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
