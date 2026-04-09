"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles/offlineHighlights.module.scss";
import { landingPageData } from "@/data/landing";
import Link from "next/link";

const normalizeName = (rawName) => {
  if (!rawName) return "";

  // Remove extension and common prefixes like "Copy of "
  const withoutExt = rawName.replace(/\.[a-zA-Z0-9]+$/, "");
  let cleaned = withoutExt
    .replace(/copy of/gi, "") // strip "Copy of" text
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Remove stray format words like "jpg", "jpeg", "png", "webp" if present
  cleaned = cleaned.replace(/\b(jpg|jpeg|png|webp)\b/gi, "").replace(/\s+/g, " ").trim();

  const titleCased = cleaned
    .toLowerCase()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

  // Custom mappings for nicer labels
  if (/^ai$/i.test(cleaned)) return "Artificial Intelligence";

  return titleCased;
};

const OfflineHighlights = () => {
  const offlineCourses = useMemo(() => {
    const images = landingPageData?.offlineProgramSection?.images ?? [];

    return images.slice(0, 4).map((src, index) => {
      const path = decodeURIComponent(src.split("?")[0] || "");
      const fileName = path.substring(path.lastIndexOf("/") + 1);
      const name = normalizeName(fileName);
      const lowerFile = fileName.toLowerCase();

      // Map landing image names -> existing `/offline-courses/[courseSlug]` routes.
      // (Your navbar already uses these slugs: artificial-intelligence, machine-learning, data-science, web-development.)
      let courseSlug = null;
      if (lowerFile.includes("aiml")) courseSlug = "machine-learning";
      else if (lowerFile.includes("ai")) courseSlug = "artificial-intelligence";
      else if (lowerFile.includes("data") && lowerFile.includes("science"))
        courseSlug = "data-science";
      else if (lowerFile.includes("fullstack") || lowerFile.includes("web"))
        courseSlug = "web-development";

      return {
        id: `${name || "Offline Course"}-${index}`,
        name: name || "Offline Course",
        image: src,
        courseSlug: courseSlug || "web-development",
      };
    });
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const hoverTimerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCardKeyDown = (event, index) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveIndex(index);
    }
  };

  const handleCardMouseEnter = (index) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }

    // Hover-intent delay prevents rapid card switching while cards overlap/move.
    hoverTimerRef.current = setTimeout(() => {
      setActiveIndex(index);
      hoverTimerRef.current = null;
    }, 260);
  };

  const handleCardMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  if (!offlineCourses.length) return null;

  return (
    <section className={styles.offlineSection} aria-labelledby="offline-heading">
      <div className={styles.inner}>
        <div className={styles.cardsColumn}>
          <div className={styles.cardsStack}>
            {offlineCourses.map((course, index) => {
              const isActive = index === activeIndex;
              const offset = index - activeIndex;

              const depth = Math.min(3, Math.abs(offset));
              const direction = offset === 0 ? 0 : offset > 0 ? 1 : -1;

              // Responsive offsets: smaller on mobile
              const baseOffsetX = isMobile ? 40 : 72;
              const depthOffsetX = isMobile ? 14 : 26;
              const baseOffsetY = isMobile ? 10 : 18;
              const depthOffsetY = isMobile ? 12 : 22;

              const translateX = isActive
                ? 0
                : direction * (baseOffsetX + depth * depthOffsetX);
              const translateY = isActive ? 0 : baseOffsetY + depth * depthOffsetY;
              const rotate = isActive ? 0 : direction * (3 + depth * 0.7);
              const scale = isActive ? 1 : 0.93 - depth * 0.02;
              const opacity = isActive ? 1 : 0.92 - depth * 0.1;
              const zIndex = 20 - depth;

              return (
                <div
                  key={course.id}
                  className={`${styles.courseCard} ${
                    isActive ? styles.courseCardActive : ""
                  }`}
                  style={{
                    transform: `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                  }}
                  onMouseEnter={() => handleCardMouseEnter(index)}
                  onMouseLeave={handleCardMouseLeave}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(e) => handleCardKeyDown(e, index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Preview ${course.name}`}
                >
                  <div className={styles.cardImageWrap}>
                    <img
                      src={course.image}
                      alt={course.name}
                      loading="lazy"
                      className={styles.cardImage}
                    />
                    <span className={styles.cardBadge}>Offline</span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardTopRow}>
                      <Link
                        href={`/offline-courses/${course.courseSlug}`}
                        className={styles.exploreMini}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Explore course: ${course.name}`}
                      >
                        Explore course
                      </Link>
                    </div>
                    <h3 className={styles.cardTitle}>{course.name}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Navigation Controls */}
          {isMobile && (
            <div className={styles.mobileNav}>
              <button
                className={styles.navBtn}
                onClick={() => setActiveIndex((prev) => (prev - 1 + offlineCourses.length) % offlineCourses.length)}
                aria-label="Previous course"
              >
                ← Prev
              </button>
              <div className={styles.navDots}>
                {offlineCourses.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Go to course ${index + 1}`}
                    aria-current={index === activeIndex ? "true" : "false"}
                  />
                ))}
              </div>
              <button
                className={styles.navBtn}
                onClick={() => setActiveIndex((prev) => (prev + 1) % offlineCourses.length)}
                aria-label="Next course"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        <div className={styles.textColumn}>
          <p className={styles.eyebrow}>What we’re offering · Offline</p>
          <h2 id="offline-heading" className={styles.heading}>
            Spotlight on{" "}
            <span className={styles.gradientAccent}>Offline Programs</span>
          </h2>
          <p className={styles.subcopy}>
            Explore our most in-demand offline programs with immersive
            classroom learning, mentor guidance, and placement-focused support.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OfflineHighlights;

