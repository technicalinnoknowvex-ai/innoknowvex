"use client";

import styles from "./styles/descriptionSection.module.scss";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function DescriptionSection({ program, isOffline }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOffline && containerRef.current) {
      // Add animation classes for offline courses
      containerRef.current.classList.add(styles.animateContainer);
      if (imageRef.current) {
        imageRef.current.classList.add(styles.animateImage);
      }
      if (contentRef.current) {
        contentRef.current.classList.add(styles.animateContent);
      }
    }
  }, [isOffline]);

  const handleDownloadBrochure = () => {
    if (!program.brochure) {
      console.error("No brochure available for this program");
      return;
    }

    const link = document.createElement("a");
    link.href = program.brochure;
    link.download = `${program.id}-brochure.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToPlans = () => {
    const plansSection = document.getElementById("plans-section");
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stats = [
    { label: "10K+", sublabel: "Active Learners" },
    { label: "03", sublabel: "Months" },
    { label: "100%", sublabel: "Career Opportunities" },
    { label: "1 : 1", sublabel: "Mentorship" },
    { label: "On-Campus", sublabel: "Classroom Experience" },
  ];

  if (isOffline) {
    return (
      <div
        className={`${styles.descriptionContainer} ${styles.offlineStyle}`}
        ref={containerRef}
      >
        <div className={styles.offlineHero}>
          <Image
            width={1600}
            height={700}
            src={program.image}
            alt={program.title}
            className={styles.offlineHeroImage}
            ref={imageRef}
            priority
          />
          <div className={styles.offlineHeroScrim} />

          <div className={styles.offlineHeroContent} ref={contentRef}>
            <div className={styles.offlineHeroLeft}>
              <div className={styles.badge}>
                <span>✨ Exclusive Offline Program</span>
              </div>
              <h2>{program.title} Program Overview</h2>
              <p>{program.overview}</p>
              <div className={styles.buttons}>
                <button className={styles.startnow} onClick={scrollToPlans}>
                  <span className={styles.buttonText}>Start Course Now</span>
                  <span className={styles.buttonIcon}>→</span>
                </button>
                <button
                  className={styles.Brochure}
                  onClick={handleDownloadBrochure}
                  disabled={!program.brochure}
                >
                  <span className={styles.buttonText}>
                    {program.brochure
                      ? "Download Brochure"
                      : "Brochure Coming Soon"}
                  </span>
                  <span className={styles.buttonIcon}>📥</span>
                </button>
              </div>
            </div>

            <div className={styles.offlineHeroRight}>
              <div className={styles.statsGrid}>
                {stats.map((item, idx) => (
                  <div
                    key={item.label + item.sublabel}
                    className={styles.statCard}
                    style={{ "--delay": `${idx * 0.06}s` }}
                  >
                    <div className={styles.statLabel}>{item.label}</div>
                    <div className={styles.statSubLabel}>{item.sublabel}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.descriptionContainer} ${isOffline ? styles.offlineStyle : ""}`}
      ref={containerRef}
    >
      <div className={styles.decorativeElements}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.imageWrapper} ref={imageRef}>
          <div className={styles.imageGradient}></div>
          <Image
            width={600}
            height={400}
            src={program.image}
            alt={program.title}
            className={styles.courseImage}
            priority
          />
          <div className={styles.imageBorder}></div>
        </div>

        <div className={styles.textContent} ref={contentRef}>
          <div className={styles.badge}>
            <span>✨ Exclusive Offline Program</span>
          </div>
          <h2>{program.title} Program Overview</h2>
          <section>
            <p>{program.overview}</p>
            <div className={styles.buttons}>
              <button className={styles.startnow} onClick={scrollToPlans}>
                <span className={styles.buttonText}>Start Course Now</span>
                <span className={styles.buttonIcon}>→</span>
              </button>
              <button
                className={styles.Brochure}
                onClick={handleDownloadBrochure}
                disabled={!program.brochure}
              >
                <span className={styles.buttonText}>
                  {program.brochure ? "Download Brochure" : "Brochure Coming Soon"}
                </span>
                <span className={styles.buttonIcon}>📥</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
