"use client";
import styles from "./styles/upcomingBatchSection.module.scss";

const batchInfo = [
  { label: "Next batch", value: "May 5, 2026", pill: "Filling fast" },
  { label: "Seats available", value: "30 seats" },
  { label: "Timing", value: "9 AM - 1 PM" },
  { label: "Duration", value: "3 months" },
];

export default function UpcomingBatchSection({ isOffline }) {
  return (
    <section
      className={`${styles.sectionWrapper} ${isOffline ? styles.offlineStyle : ""}`}
    >
      <div className={styles.inner}>
        <span className={styles.eyebrow}>Batch Details</span>
        <h2>Upcoming batches</h2>
        <div className={styles.grid}>
          {batchInfo.map((item) => (
            <div key={item.label} className={styles.card}>
              <p className={styles.cardLabel}>{item.label}</p>
              <p className={styles.cardValue}>{item.value}</p>
              {item.pill ? <span className={styles.pill}>{item.pill}</span> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
