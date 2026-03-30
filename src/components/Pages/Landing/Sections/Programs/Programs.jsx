"use client";
import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/program.module.scss";
import { landingPageData } from "@/data/landing";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useNavColor } from "@/context/NavColorContext";
import Sparkle from "@/components/Common/Icons/Sparkle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Programs = () => {
  const { updateNavColor } = useNavColor();
  const { heading, subheading, para, programs } = landingPageData.programsSection;
  const [currentIndex, setCurrentIndex] = useState(0);
  const programSectionRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const sparkleRef = useRef(null);
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const cardsRef = useRef([]);
  const timerRef = useRef(null);

  // Auto-carousel effect
  useEffect(() => {
    const startCarousel = () => {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % programs.length);
      }, 6000);
    };

    startCarousel();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [programs.length]);

  // Animations
  useGSAP(
    () => {
      // Nav color on scroll
      ScrollTrigger.create({
        trigger: programSectionRef.current,
        start: "top 100px",
        onEnter: () => {
          updateNavColor("#262c35");
        },
        onEnterBack: () => {
          updateNavColor("#262c35");
        },
        onLeave: () => {
          updateNavColor("#262c35");
        },
        onLeaveBack: () => {
          updateNavColor("#262c35");
        },
      });

      // Sparkle animation
      const sparkleTl = gsap.timeline({
        scrollTrigger: {
          trigger: programSectionRef.current,
          start: "top 60%",
          end: "bottom 40%",
          toggleActions: "play none none reverse",
        },
      });

      sparkleTl
        .fromTo(
          sparkleRef.current,
          {
            scale: 0,
            opacity: 0,
            rotation: -360,
          },
          {
            scale: 1.2,
            opacity: 1,
            rotation: 0,
            duration: 0.5,
            ease: "power2.out",
          }
        )
        .to(sparkleRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
        .to(sparkleRef.current, {
          rotation: 360,
          duration: 0.8,
          ease: "power1.inOut",
        });

      // Content animation
      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: programSectionRef.current,
          start: "top 50%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.set([headingRef.current, paraRef.current, imageWrapperRef.current], {
        y: 50,
        opacity: 0,
      });

      gsap.set(cardsRef.current, {
        y: 50,
        opacity: 0,
      });

      contentTl
        .to(headingRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        })
        .to(
          paraRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(
          imageWrapperRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(
          cardsRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1,
          },
          "-=0.5"
        );
    },
    { scope: programSectionRef }
  );

  // Image carousel transition
  useGSAP(
    () => {
      if (imageWrapperRef.current) {
        gsap.to(imageWrapperRef.current, {
          opacity: 0.6,
          duration: 0.3,
          ease: "power2.inOut",
        });
        gsap.to(imageWrapperRef.current, {
          opacity: 1,
          duration: 0.5,
          delay: 0.3,
          ease: "power2.inOut",
        });
      }

      if (contentWrapperRef.current) {
        gsap.to(contentWrapperRef.current, {
          opacity: 0.6,
          duration: 0.3,
          ease: "power2.inOut",
        });
        gsap.to(contentWrapperRef.current, {
          opacity: 1,
          duration: 0.5,
          delay: 0.3,
          ease: "power2.inOut",
        });
      }
    },
    { dependencies: [currentIndex], scope: programSectionRef }
  );

  const currentProgram = programs[currentIndex];

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % programs.length);
    }, 6000);
  };

  return (
    <section className={styles.sectionWrapper} ref={programSectionRef} id="programs">
      <div className={styles.sectionInnerContainer}>
        {/* Header Section */}
        <div className={styles.mainHeaderSection}>
          <div className={styles.sectionHeadingWrapper}>
            <div className={styles.sparkleDiv} ref={sparkleRef}>
              <Sparkle />
            </div>
            <h1 className={styles.sectionHeadingWrapper__primaryHeading} ref={headingRef}>
              {heading}
              <span className={styles.highlight}> Programs</span>
              <br />
              We're Offering
            </h1>
            <h2 className={styles.sectionHeadingWrapper__secondaryHeading}>
              {subheading}
            </h2>
          </div>

          <div className={styles.sectionDescriptionWrapper}>
            <div className={styles.descDiv}>
              {/* <p className="para" ref={paraRef}>
                {para}
              </p> */}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={styles.contentSection}>
          {/* Left Side - Image */}
          <div className={styles.leftContent} ref={imageWrapperRef}>
            <div className={styles.imageContainer}>
              <Image
                src={currentProgram.image}
                alt={currentProgram.title}
                fill
                priority
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </div>
          </div>

          {/* Right Side - Info Cards */}
          <div className={styles.rightContent} ref={contentWrapperRef}>
            <div className={styles.infoWrapper}>
              {/* Course Name */}
              <h3 className={styles.courseName}>
                <span className={styles.orangeText}>{currentProgram.title}</span>
                {currentProgram.subTitle && (
                  <>
                    <br />
                    <span className={styles.blackText}>{currentProgram.subTitle}</span>
                  </>
                )}
              </h3>

              {/* Description */}
              <p className={styles.courseDescription}>
                {currentProgram.description}
              </p>

              {/* Info Cards */}
              <div className={styles.cardsGrid}>
                <div className={styles.infoCard} ref={(el) => {
                  if (el && !cardsRef.current.includes(el)) {
                    cardsRef.current.push(el);
                  }
                }}>
                  <div className={styles.cardLabel}>Average Salary</div>
                  <div className={styles.cardValue}>{currentProgram.salary}</div>
                </div>

                <div className={styles.infoCard} ref={(el) => {
                  if (el && !cardsRef.current.includes(el)) {
                    cardsRef.current.push(el);
                  }
                }}>
                  <div className={styles.cardLabel}>Career Opportunities</div>
                  <div className={styles.careerRolesList}>
                    {currentProgram.careerRoles.slice(0, 3).map((role, idx) => (
                      <div key={idx} className={styles.roleItem}>{role}</div>
                    ))}
                  </div>
                </div>

                <div className={styles.infoCard} ref={(el) => {
                  if (el && !cardsRef.current.includes(el)) {
                    cardsRef.current.push(el);
                  }
                }}>
                  <div className={styles.cardLabel}>Industry Importance</div>
                  <div className={styles.cardValue}>High</div>
                </div>
              </div>

              {/* Learn More Button */}
              <Link
                href={`/programs/${currentProgram.slug}`}
                className={styles.learnMoreBtn}
              >
                Learn More
              </Link>

              {/* Carousel Dots */}
              <div className={styles.carouselDots}>
                {programs.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${
                      currentIndex === index ? styles.activeDot : ""
                    }`}
                    onClick={() => handleDotClick(index)}
                    aria-label={`Program ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;
