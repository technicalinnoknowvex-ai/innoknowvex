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

const CAROUSEL_INTERVAL = 6000;

// Card icon map — extend per your needs
const CARD_ICONS = {
  salary: "💰",
  career: "🚀",
  importance: "⚡",
};

const Programs = () => {
  const { updateNavColor } = useNavColor();
  const { heading, subheading, para, programs } = landingPageData.programsSection;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const programSectionRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const sparkleRef = useRef(null);
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const cardsRef = useRef([]);
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const hasInitializedRef = useRef(false);

  // ─── Carousel + progress bar ──────────────────────────────────────────────
  const startCarousel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    setProgress(0);
    const tick = 100;
    const steps = CAROUSEL_INTERVAL / tick;
    let step = 0;

    progressIntervalRef.current = setInterval(() => {
      step++;
      setProgress(Math.min((step / steps) * 100, 100));
    }, tick);

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % programs.length);
      step = 0;
      setProgress(0);
    }, CAROUSEL_INTERVAL);
  };

  useEffect(() => {
    startCarousel();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programs.length]);

  // ─── Scroll-trigger animations ────────────────────────────────────────────
  useGSAP(
    () => {
      // Nav colour
      ScrollTrigger.create({
        trigger: programSectionRef.current,
        start: "top 100px",
        onEnter: () => updateNavColor("#262c35"),
        onEnterBack: () => updateNavColor("#262c35"),
        onLeave: () => updateNavColor("#262c35"),
        onLeaveBack: () => updateNavColor("#262c35"),
      });

      // Sparkle spin-in
      gsap.timeline({
        scrollTrigger: {
          trigger: programSectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      })
        .fromTo(sparkleRef.current,
          { scale: 0, opacity: 0, rotation: -360 },
          { scale: 1.2, opacity: 1, rotation: 0, duration: 0.5, ease: "power2.out" }
        )
        .to(sparkleRef.current, { scale: 1, duration: 0.3, ease: "power2.out" })
        .to(sparkleRef.current, { rotation: 360, duration: 0.8, ease: "power1.inOut" });

      // Initial states
      gsap.set(headingRef.current, { clipPath: "inset(0 0 100% 0)", opacity: 1 });
      gsap.set(paraRef.current, { y: 30, opacity: 0 });
      gsap.set(imageWrapperRef.current, { x: -70, opacity: 0 });
      gsap.set(contentWrapperRef.current, { x: 55, opacity: 0 });
      gsap.set(cardsRef.current, { y: 24, opacity: 0, scale: 0.94 });

      // Entrance timeline
      gsap.timeline({
        scrollTrigger: {
          trigger: programSectionRef.current,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      })
        .to(headingRef.current, {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.75,
          ease: "power3.out",
        })
        .to(paraRef.current,
          { y: 0, opacity: 1, duration: 0.65, ease: "power2.out" },
          "-=0.4"
        )
        .to(imageWrapperRef.current,
          { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.45"
        )
        .to(contentWrapperRef.current,
          { x: 0, opacity: 1, duration: 0.72, ease: "power2.out" },
          "-=0.6"
        )
        .to(cardsRef.current, {
          y: 0, opacity: 1, scale: 1,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.09,
        }, "-=0.48");
    },
    { scope: programSectionRef }
  );

  // Parallax on image
  useGSAP(
    () => {
      if (!imageWrapperRef.current) return;
      gsap.to(imageWrapperRef.current, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: programSectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1.8,
        },
      });
    },
    { scope: programSectionRef }
  );

  // Carousel transition (skip initial mount)
  useGSAP(
    () => {
      if (!hasInitializedRef.current) {
        hasInitializedRef.current = true;
        return;
      }

      const tl = gsap.timeline();

      if (imageWrapperRef.current) {
        tl.fromTo(imageWrapperRef.current,
          { opacity: 0, scale: 0.95, x: -12 },
          { opacity: 1, scale: 1, x: 0, duration: 0.55, ease: "power2.out" },
          0
        );
      }

      if (contentWrapperRef.current) {
        tl.fromTo(contentWrapperRef.current,
          { opacity: 0, x: 28 },
          { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
          0.08
        );
      }
    },
    { dependencies: [currentIndex], scope: programSectionRef }
  );

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    startCarousel();
  };

  const currentProgram = programs[currentIndex];

  // Reset cardsRef on each render (cards are recreated per index change)
  cardsRef.current = [];

  return (
    <section className={styles.sectionWrapper} ref={programSectionRef} id="programs">
      <div className={styles.sectionInnerContainer}>

        {/* ── Header ── */}
        <div className={styles.mainHeaderSection}>

          {/* Pill label */}
          <div className={styles.sectionLabel}>
            <span className={styles.labelDot} />
            <span>Our Programs</span>
          </div>

          <div className={styles.sectionHeadingWrapper}>
            <div className={styles.sparkleDiv} ref={sparkleRef}>
              <Sparkle />
            </div>
            <h1
              className={styles.sectionHeadingWrapper__primaryHeading}
              ref={headingRef}
            >
              {heading}
              <span className={styles.highlight}> Programs</span>
              <br />
              We're Offering
            </h1>
            <h2 className={styles.sectionHeadingWrapper__secondaryHeading}>
              {subheading}
            </h2>
          </div>

          {para && (
            <div className={styles.sectionDescriptionWrapper}>
              <div className={styles.descDiv}>
                <p ref={paraRef}>{para}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Content Grid ── */}
        <div className={styles.contentSection}>

          {/* Left — Image */}
          <div className={styles.leftContent} ref={imageWrapperRef}>
            <div className={styles.imageBackdrop} aria-hidden />

            <div className={styles.imageContainer}>
              <Image
                src={currentProgram.image}
                alt={currentProgram.title}
                fill
                priority
                style={{ objectFit: "cover", objectPosition: "center" }}
              />


            </div>
          </div>

          {/* Right — Info */}
          <div className={styles.rightContent} ref={contentWrapperRef}>
            <div className={styles.infoWrapper}>

              {/* Program index counter */}
              <div className={styles.programMeta}>
                <span className={styles.programCounter}>
                  <span className={styles.counterCurrent}>
                    {String(currentIndex + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.counterTotal}> / {String(programs.length).padStart(2, "0")}</span>
                </span>
                <div className={styles.programDivider} />
              </div>

              {/* Course title */}
              <h3 key={currentIndex} className={styles.courseName}>
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
                {/* Salary Card */}
                <div
                  className={styles.infoCard}
                  ref={(el) => { if (el) cardsRef.current.push(el); }}
                >
                  <div className={styles.cardIconWrapper}>{CARD_ICONS.salary}</div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardLabel}>Avg. Salary</div>
                    <div className={styles.cardValue}>{currentProgram.salary}</div>
                  </div>
                </div>

                {/* Career Roles Card */}
                <div
                  className={styles.infoCard}
                  ref={(el) => { if (el) cardsRef.current.push(el); }}
                >
                  <div className={styles.cardIconWrapper}>{CARD_ICONS.career}</div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardLabel}>Career Paths</div>
                    <div className={styles.careerRolesList}>
                      {currentProgram.careerRoles.slice(0, 3).map((role, idx) => (
                        <div key={idx} className={styles.roleItem}>{role}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Importance Card */}
                <div
                  className={styles.infoCard}
                  ref={(el) => { if (el) cardsRef.current.push(el); }}
                >
                  <div className={styles.cardIconWrapper}>{CARD_ICONS.importance}</div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardLabel}>Industry Impact</div>
                    <div className={styles.cardValue}>High</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className={styles.actionRow}>
                <Link
                  href={`/programs/${currentProgram.slug}`}
                  className={styles.learnMoreBtn}
                >
                  Learn More
                  <span className={styles.btnArrow}>→</span>
                </Link>

                <Link href="/choose-packs" className={styles.viewAllBtn}>
                  View All Programs
                </Link>
              </div>

              {/* Carousel footer: dots + progress */}
              <div className={styles.carouselFooter}>
                <div className={styles.carouselDots}>
                  {programs.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ""}`}
                      onClick={() => handleDotClick(index)}
                      aria-label={`Go to program ${index + 1}`}
                    />
                  ))}
                </div>

                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Programs;