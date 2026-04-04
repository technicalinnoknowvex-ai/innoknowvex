"use client";
import styles from "./styles/whyLearnSection.module.scss";
import Image from "next/image";

export default function WhyLearnSection() {
  return (
    <div className={styles.whyLearnSection}>
      <svg
        width="767"
        height="767"
        viewBox="0 0 767 767"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.ellipse1}
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

      <div className={styles.LearnForm}>
        
        <svg
          width="60"
          height="60"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M98.4051 17.0205C98.6998 14.3265 102.3 14.3265 102.595 17.0205L105.065 39.6212C108.254 68.8048 129.445 91.8138 156.323 95.2766L177.139 97.9582C179.62 98.2782 179.62 102.187 177.139 102.507L156.323 105.189C129.445 108.652 108.254 131.661 105.065 160.844L102.595 183.445C102.3 186.139 98.6998 186.139 98.4051 183.445L95.9353 160.844C92.7461 131.661 71.5546 108.652 44.6763 105.189L23.8609 102.507C21.3797 102.187 21.3797 98.2782 23.8609 97.9582L44.6763 95.2766C71.5546 91.8138 92.7461 68.8048 95.9353 39.6212L98.4051 17.0205Z"
            fill="#FF6432"
          />
        </svg>

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
                We don’t just teach theory — we equip you with practical,
                in-demand skills through hands-on projects and real-world
                scenarios.
              </p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>02</div>
            <div className={styles.featureContent}>
              <h3>Internship Opportunities</h3>
              <p>
                Gain direct industry exposure with structured internships that
                help you apply what you’ve learned and build your professional
                portfolio.
              </p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>03</div>
            <div className={styles.featureContent}>
              <h3> Career-Ready Support.</h3>
              <p>
                From resume building to LinkedIn optimization and mentorship, we
                prepare you to step into your career with
                confidence and clarity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
