"use client";

import React, { useMemo } from "react";
import styles from "./styles/announcements.module.scss";
import { landingPageData } from "@/data/landing";

const Announcements = () => {
  const offlineCourseNames = useMemo(() => {
    const imageUrls = landingPageData?.offlineProgramSection?.images ?? [];

    const normalizeName = (rawName) =>
      rawName
        .replace(/\.[a-zA-Z0-9]+$/, "")
        .replace(/^copy\s+of\s+/i, "") // Remove "Copy of " prefix
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (ch) => ch.toUpperCase());

    const names = imageUrls
      .map((url) => {
        const path = decodeURIComponent(url.split("?")[0] || "");
        const fileName = path.substring(path.lastIndexOf("/") + 1);
        return normalizeName(fileName);
      })
      .filter(Boolean);

    return Array.from(new Set(names));
  }, []);

  const tickerItems = useMemo(() => {
    const baseHeading =
      landingPageData?.offlineProgramSection?.heading || "Offline courses are now live";
    const baseSubHeading =
      landingPageData?.offlineProgramSection?.subHeading ||
      "Mentor-led learning with real projects";
    const imageCount = offlineCourseNames.length;
    const coursesLine =
      imageCount > 0
        ? `Offline courses: ${offlineCourseNames.join(" | ")}`
        : "Offline courses now available";

    return [
      "New: Offline programs open for enrollment",
      baseHeading,
      baseSubHeading,
      coursesLine,
      imageCount > 0 ? `${imageCount} offline courses currently active` : "Seats are filling fast for upcoming batches",
      "Visit Programs to explore online and offline tracks",
    ];
  }, [offlineCourseNames]);

  return (
    <section className={styles.tickerSection} aria-label="Announcements">
      <div className={styles.tickerInner}>
        <div className={styles.breakingPill}>Announcements</div>
        <div className={styles.tickerViewport}>
          <div className={styles.tickerTrack}>
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span key={`${item}-${index}`} className={styles.tickerItem}>
                {item.startsWith("Offline courses:") ? (
                  <>
                    <span className={styles.tickerPrefix}>Offline courses:</span>{" "}
                    <span className={styles.courseHighlight}>
                      {item.replace("Offline courses:", "").trim()}
                    </span>
                  </>
                ) : (
                  item
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Announcements;
