"use client";
import { useRef, useEffect } from "react";
import styles from "./styles/cardSection.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CardsSection() {
    const cardRef = useRef()



  return (
    <div className={styles.cardsContainer}>
      {/* Left section with Career Boost content */}
      <div className={styles.leftSection}>
        <div className={styles.careerBoostContent}>
          <h1 className={styles.careerBoostTitle}>Career Boost</h1>
          <p className={styles.careerBoostDescription}>
            Unlock Your Potential With Dedicated Support That Prepares You For
            Real-World Success!
          </p>
        </div>
      </div>

      {/* Cards section */}
      <div className={styles.cardsSection}>
        <img
          src="/images/Ellipse4.svg"
          alt=" ellipse"
          className={styles.ellipse}
        />

        <div className={styles.cardsGrid}>
          {/* First row */}
          <div ref={cardRef} className={`${styles.card} ${styles.softSkillsCard}`}>
            <div className={styles.cardHeader}>
              <img
                className={styles.starImage}
                src="/images/SoftStar3.svg"
                width={20}
                height={20}
                alt="Soft Star"
              />
              <h3>SOFT SKILLS</h3>
            </div>
            <p>Enhance your communications and interpersonal skills.</p>
          </div>

          <div  className={styles.card}>
            <div className={styles.cardHeader}>
              <img
                className={styles.starImage}
                src="/images/SoftStar3.svg"
                width={40}
                height={40}
                alt="Soft Star"
              />
              <h3>MOCK INTERVIEWS</h3>
            </div>
            <p>Prepare for interviews with realistic practice sessions.</p>
          </div>

          <div  className={styles.card}>
            <div className={styles.cardHeader}>
              <img
                className={styles.starImage}
                src="/images/SoftStar3.svg"
                width={20}
                height={20}
                alt="Soft Star"
              />
              <h3>PORTFOLIO BUILDING</h3>
            </div>
            <p>Create a standout portfolio that showcases your skills.</p>
          </div>

          {/* Second row */}
          <div  className={styles.card}>
            <div className={styles.cardHeader}>
              <img
                className={styles.starImage}
                src="/images/SoftStar3.svg"
                width={20}
                height={20}
                alt="Soft Star"
              />
              <h3>RESUME BUILDING</h3>
            </div>
            <p>Build a professional resume that highlights your strengths.</p>
          </div>

          <div  className={styles.card}>
            <div className={styles.cardHeader}>
              <img
                className={styles.starImage}
                src="/images/SoftStar3.svg"
                width={40}
                height={40}
                alt="Soft Star"
              />
              <h3>MOCK TESTS</h3>
            </div>
            <p>Boost confidence with realistic, test-style practice.</p>
          </div>

          <div  className={styles.card}>
            <div className={styles.cardHeader}>
              <img
                className={styles.starImage}
                src="/images/SoftStar3.svg"
                width={40}
                height={40}
                alt="Soft Star"
              />
              <h3>INTERVIEW GUIDANCE</h3>
            </div>
            <p>Ace your interview with targeted guidance and support.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
