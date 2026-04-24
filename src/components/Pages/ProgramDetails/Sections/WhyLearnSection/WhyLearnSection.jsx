"use client";
import styles from "./styles/whyLearnSection.module.scss";
import { Briefcase, FileText, Linkedin, Sparkles } from "lucide-react";

export default function WhyLearnSection() {
  const reasons = [
    {
      id: "01",
      title: "Industry-focused learning",
      description:
        "Go beyond theory with real projects, case studies, and tools used by top teams.",
      icon: Sparkles,
    },
    {
      id: "02",
      title: "Internships & live exposure",
      description:
        "Work on real-time problems and internships that make your resume stand out.",
      icon: Briefcase,
    },
    {
      id: "03",
      title: "Career-ready support",
      description:
        "From resume to mock interviews, we help you move confidently into your first role.",
      icon: FileText,
    },
    {
      id: "04",
      title: "Personal branding",
      description:
        "Optimize LinkedIn and your portfolio so recruiters find you, not the other way around.",
      icon: Linkedin,
    },
  ];

  return (
    <section className={styles.whyLearnSection}>
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

        <div className={styles.headerRow}>
          <div>
            <h1>
              Why learn from <span>InnoKnowvex</span>?
            </h1>
            <p>
              Not just another course — a complete launchpad for your tech
              career.
            </p>
          </div>
          <div className={styles.badge}>
            <span className={styles.badgePill}>Career-first</span>
            <span className={styles.badgeText}>
              Training · Mentorship · Placement
            </span>
          </div>
        </div>

        <div className={styles.featuresGrid}>
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <article
                key={reason.id}
                className={styles.featureCard}
                style={{ "--delay": `${idx * 0.08}s` }}
              >
                <div className={styles.featureNumber}>{reason.id}</div>
                <div className={styles.featureContent}>
                  <div className={styles.iconCircle}>
                    <Icon size={20} />
                  </div>
                  <h3>{reason.title}</h3>
                  <p>{reason.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
