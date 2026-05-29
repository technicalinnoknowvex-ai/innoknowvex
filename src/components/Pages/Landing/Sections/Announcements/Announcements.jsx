"use client";

import React, { useMemo } from "react";
import styles from "./styles/announcements.module.scss";
import { landingPageData } from "@/data/landing";

const Announcements = () => {
  const offlineCourseNames = useMemo(() => {
    const imageUrls = landingPageData?.offlineTrainingSection?.images ?? [];

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
      landingPageData?.offlineTrainingSection?.heading || "Offline training are now live";
    const baseSubHeading =
      landingPageData?.offlineTrainingSection?.subHeading ||
      "Mentor-led learning with real projects";
    const imageCount = offlineCourseNames.length;
    const coursesLine =
      imageCount > 0
        ? `Offline Training: ${offlineCourseNames.join(" | ")}`
        : "Offline Training now available";

    return [
      "New: Offline Training open for enrollment",
      baseHeading,
      baseSubHeading,
      coursesLine,
      imageCount > 0 ? `${imageCount} offline Trainings currently active` : "Seats are filling fast for upcoming batches",
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
                {item.startsWith("Offline Training:") ? (
                  <>
                    {/* <span className={styles.tickerPrefix}>Offline Trainings-----:</span>{" "} */}
                    <span className={styles.courseHighlight}>
                      {item.replace("Offline Trainings:", "").trim()}
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
