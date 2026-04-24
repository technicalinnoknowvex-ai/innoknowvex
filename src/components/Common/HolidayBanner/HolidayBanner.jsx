"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "./styles/holidayBanner.module.scss";
import CompanyLogo from "@/components/Pages/Landing/Sections/Navbar/CompanyLogo";

// Rotating attention-grabbing messages focused on holidays
const BANNER_MESSAGES = [
  {
    badge: "🎉 HOLIDAY BREAK",
    text: "Your holidays are here! Don't waste them scrolling — master",
    highlight: "DSA with Java",
    suffix: "and return to campus ahead of everyone"
  },
  {
    badge: "🌟 HOLIDAY GRIND",
    text: "While others rest, winners level up! Learn",
    highlight: "DSA with Java",
    suffix: "during holidays and crush your next interview"
  },
  {
    badge: "⏳ VACATION COUNTDOWN",
    text: "Make your holidays count! Complete your",
    highlight: "DSA Mastery Program",
    suffix: "before the semester begins"
  },
  {
    badge: "🏆 HOLIDAY ADVANTAGE",
    text: "Get a holiday head start! Master",
    highlight: "Java DSA",
    suffix: "now and become the top performer when college reopens"
  }
];

export default function HolidayBanner({ initialVisible = true }) {
  const barRef = useRef(null);
  const [messageIndex, setMessageIndex] = useState(0);

  const targetHref = useMemo(() => "/programs/java-dsa", []);
  const currentMessage = useMemo(() => BANNER_MESSAGES[messageIndex], [messageIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % BANNER_MESSAGES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const setOffset = (px) => {
      document.documentElement.style.setProperty("--promo-bar-offset", `${px}px`);
    };

    const el = barRef.current;
    if (!el) {
      setOffset(0);
      return undefined;
    }

    const update = () => setOffset(Math.ceil(el.getBoundingClientRect().height));
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);



  return (
    <div ref={barRef} className={styles.bar} role="region" aria-label="Announcement">
      <div className={styles.inner}>
        <div className={styles.logoWrapper}>
          <CompanyLogo />
        </div>
        <div className={styles.left}>
          <span className={styles.pulse} aria-hidden />
          <span className={styles.badge}>{currentMessage.badge}</span>
          <p className={styles.text}>
            {currentMessage.text}{" "}
            <strong className={styles.course}>{currentMessage.highlight}</strong>
            {currentMessage.suffix && (
              <span className={styles.suffix}>{currentMessage.suffix}</span>
            )}
          </p>
        </div>

        <div className={styles.right}>
          <Link className={styles.cta} href={targetHref}>
            Enroll Today
            <span className={styles.ctaArrow} aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

