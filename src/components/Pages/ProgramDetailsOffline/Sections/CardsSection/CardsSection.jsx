"use client";
import styles from "./styles/cardSection.module.scss";
import Image from "next/image";

export default function CardsSection() {
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
        <svg
          width="800"
          height="800"
          viewBox="0 0 767 767"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.ellipse}
        >
          <g filter="url(#filter0_f_37_12)">
            <circle
              cx="383.5"
              cy="383.5"
              r="138.5"
              fill="#FA9805"
              fillOpacity="0.74"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_37_12"
              x="0.566696"
              y="0.566696"
              width="765.867"
              height="765.867"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="122.217"
                result="effect1_foregroundBlur_37_12"
              />
            </filter>
          </defs>
        </svg>

        <div className={styles.cardsGrid}>
          {/* First row */}
          <div className={`${styles.card} ${styles.softSkillsCard}`}>
            <div className={styles.cardHeader}>
              <svg
                width="52"
                height="56"
                viewBox="0 0 52 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.starImage}
              >
                <path
                  d="M25.3195 0.652346C25.4152 -0.217449 26.5848 -0.217449 26.6805 0.652346L27.4828 7.94913C28.5188 17.3712 35.4026 24.7999 44.1337 25.9178L50.8954 26.7836C51.7015 26.8869 51.7015 28.1491 50.8954 28.2523L44.1337 29.1181C35.4026 30.2361 28.5188 37.6647 27.4828 47.0868L26.6805 54.3835C26.5848 55.2534 25.4152 55.2534 25.3195 54.3835L24.5172 47.0868C23.4812 37.6647 16.5974 30.2361 7.86619 29.1181L1.10451 28.2523C0.298497 28.1491 0.298497 26.8869 1.10451 26.7836L7.86619 25.9178C16.5974 24.7999 23.4812 17.3712 24.5172 7.94913L25.3195 0.652346Z"
                  fill="#9C7F16"
                />
              </svg>

              <h3>SOFT SKILLS</h3>
            </div>
            <p>Enhance your communications and interpersonal skills.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              
              <svg
                width="52"
                height="56"
                viewBox="0 0 52 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.starImage}
              >
                <path
                  d="M25.3195 0.652346C25.4152 -0.217449 26.5848 -0.217449 26.6805 0.652346L27.4828 7.94913C28.5188 17.3712 35.4026 24.7999 44.1337 25.9178L50.8954 26.7836C51.7015 26.8869 51.7015 28.1491 50.8954 28.2523L44.1337 29.1181C35.4026 30.2361 28.5188 37.6647 27.4828 47.0868L26.6805 54.3835C26.5848 55.2534 25.4152 55.2534 25.3195 54.3835L24.5172 47.0868C23.4812 37.6647 16.5974 30.2361 7.86619 29.1181L1.10451 28.2523C0.298497 28.1491 0.298497 26.8869 1.10451 26.7836L7.86619 25.9178C16.5974 24.7999 23.4812 17.3712 24.5172 7.94913L25.3195 0.652346Z"
                  fill="#9C7F16"
                />
              </svg>

              <h3>MOCK INTERVIEWS</h3>
            </div>
            <p>Prepare for interviews with realistic practice sessions.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <svg
                width="52"
                height="56"
                viewBox="0 0 52 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.starImage}
              >
                <path
                  d="M25.3195 0.652346C25.4152 -0.217449 26.5848 -0.217449 26.6805 0.652346L27.4828 7.94913C28.5188 17.3712 35.4026 24.7999 44.1337 25.9178L50.8954 26.7836C51.7015 26.8869 51.7015 28.1491 50.8954 28.2523L44.1337 29.1181C35.4026 30.2361 28.5188 37.6647 27.4828 47.0868L26.6805 54.3835C26.5848 55.2534 25.4152 55.2534 25.3195 54.3835L24.5172 47.0868C23.4812 37.6647 16.5974 30.2361 7.86619 29.1181L1.10451 28.2523C0.298497 28.1491 0.298497 26.8869 1.10451 26.7836L7.86619 25.9178C16.5974 24.7999 23.4812 17.3712 24.5172 7.94913L25.3195 0.652346Z"
                  fill="#9C7F16"
                />
              </svg>
              <h3>PORTFOLIO BUILDING</h3>
            </div>
            <p>Create a standout portfolio that showcases your skills.</p>
          </div>

          {/* Second row */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <svg
                width="52"
                height="56"
                viewBox="0 0 52 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.starImage}
              >
                <path
                  d="M25.3195 0.652346C25.4152 -0.217449 26.5848 -0.217449 26.6805 0.652346L27.4828 7.94913C28.5188 17.3712 35.4026 24.7999 44.1337 25.9178L50.8954 26.7836C51.7015 26.8869 51.7015 28.1491 50.8954 28.2523L44.1337 29.1181C35.4026 30.2361 28.5188 37.6647 27.4828 47.0868L26.6805 54.3835C26.5848 55.2534 25.4152 55.2534 25.3195 54.3835L24.5172 47.0868C23.4812 37.6647 16.5974 30.2361 7.86619 29.1181L1.10451 28.2523C0.298497 28.1491 0.298497 26.8869 1.10451 26.7836L7.86619 25.9178C16.5974 24.7999 23.4812 17.3712 24.5172 7.94913L25.3195 0.652346Z"
                  fill="#9C7F16"
                />
              </svg>
              <h3>RESUME BUILDING</h3>
            </div>
            <p>Build a professional resume that highlights your strengths.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <svg
                width="52"
                height="56"
                viewBox="0 0 52 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.starImage}
              >
                <path
                  d="M25.3195 0.652346C25.4152 -0.217449 26.5848 -0.217449 26.6805 0.652346L27.4828 7.94913C28.5188 17.3712 35.4026 24.7999 44.1337 25.9178L50.8954 26.7836C51.7015 26.8869 51.7015 28.1491 50.8954 28.2523L44.1337 29.1181C35.4026 30.2361 28.5188 37.6647 27.4828 47.0868L26.6805 54.3835C26.5848 55.2534 25.4152 55.2534 25.3195 54.3835L24.5172 47.0868C23.4812 37.6647 16.5974 30.2361 7.86619 29.1181L1.10451 28.2523C0.298497 28.1491 0.298497 26.8869 1.10451 26.7836L7.86619 25.9178C16.5974 24.7999 23.4812 17.3712 24.5172 7.94913L25.3195 0.652346Z"
                  fill="#9C7F16"
                />
              </svg>
              <h3>MOCK TESTS</h3>
            </div>
            <p>Boost confidence with realistic, test-style practice.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
             <svg
                width="52"
                height="56"
                viewBox="0 0 52 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.starImage}
              >
                <path
                  d="M25.3195 0.652346C25.4152 -0.217449 26.5848 -0.217449 26.6805 0.652346L27.4828 7.94913C28.5188 17.3712 35.4026 24.7999 44.1337 25.9178L50.8954 26.7836C51.7015 26.8869 51.7015 28.1491 50.8954 28.2523L44.1337 29.1181C35.4026 30.2361 28.5188 37.6647 27.4828 47.0868L26.6805 54.3835C26.5848 55.2534 25.4152 55.2534 25.3195 54.3835L24.5172 47.0868C23.4812 37.6647 16.5974 30.2361 7.86619 29.1181L1.10451 28.2523C0.298497 28.1491 0.298497 26.8869 1.10451 26.7836L7.86619 25.9178C16.5974 24.7999 23.4812 17.3712 24.5172 7.94913L25.3195 0.652346Z"
                  fill="#9C7F16"
                />
              </svg>
              <h3>INTERVIEW GUIDANCE</h3>
            </div>
            <p>Ace your interview with targeted guidance and support.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
