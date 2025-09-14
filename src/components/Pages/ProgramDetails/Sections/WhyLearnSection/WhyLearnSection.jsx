"use client";
import styles from "./styles/whyLearnSection.module.scss";
import Image from "next/image";

export default function WhyLearnSection() {
  return (
    <div className={styles.whyLearnSection}>
      <Image
        src="/images/Ellipse4.svg"
        alt="ellipse"
        width={60} 
        height={60} 
        className={styles.ellipse1}
      />

      <div className={styles.LearnForm}>
        <Image src="/images/SoftStar.svg" 
        width={60} 
        height={60} 
        alt="SoftStar" />
        <h1>
          Why Learn from <br /> InnoKnowvex
        </h1>
        <p>WE HAVE NOT ONE, BUT THREE REASONS</p>

        {/* Features Section */}
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>01</div>
            <div className={styles.featureContent}>
              <h3> Industry-Focused Training</h3>
              <p>
               We don’t just teach theory — we equip you with practical, in-demand skills through hands-on projects and real-world scenarios.
              </p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>02</div>
            <div className={styles.featureContent}>
              <h3>Internship Opportunities</h3>
              <p>
               Gain direct industry exposure with structured internships that help you apply what you’ve learned and build your professional portfolio.
              </p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>03</div>
            <div className={styles.featureContent}>
              <h3> Career-Ready Support.</h3>
              <p>
               From resume building to LinkedIn optimization and mentorship, we prepare you to step into your career with confidence and clarity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
