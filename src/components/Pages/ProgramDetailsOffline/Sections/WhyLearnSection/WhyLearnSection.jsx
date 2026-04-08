"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./styles/whyLearnSection.module.scss";
import { Briefcase, FileText, Linkedin, MessageSquare } from "lucide-react";

export default function WhyLearnSection({ isOffline }) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    setShouldAnimate(isOffline);
  }, [isOffline]);

  const reasons = [
    {
      id: "01",
      title: "Resume building",
      description:
        "Get a professional resume crafted with expert guidance.",
      icon: FileText,
    },
    {
      id: "02",
      title: "Mock interviews",
      description:
        "Face real interview simulations before the actual day.",
      icon: MessageSquare,
    },
    {
      id: "03",
      title: "Placement assistance",
      description:
        "100% placement support with our hiring partner network.",
      icon: Briefcase,
    },
    {
      id: "04",
      title: "LinkedIn optimization",
      description:
        "Build a profile that gets noticed by recruiters.",
      icon: Linkedin,
    },
  ];

  return (
    <div className={`${styles.whyLearnSection} ${isOffline ? styles.offlineStyle : ""}`} ref={sectionRef}>
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

      <div className={`${styles.LearnForm} ${shouldAnimate ? styles.animateContent : ""}`}>
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

        <h1>Why Learn from InnoKnowvex</h1>
        <p>We don't stop at teaching</p>

        <div className={styles.featuresGrid}>
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.id}
                className={`${styles.featureCard} ${
                  shouldAnimate ? styles.animateCard : ""
                }`}
                style={{ "--delay": `${idx * 0.12}s` }}
              >
                <div className={styles.featureNumber}>{reason.id}</div>
                <div className={styles.featureContent}>
                  <div className={styles.reasonIcon}>
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <h3>{reason.title}</h3>
                  <p>{reason.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
