"use client";
import styles from "./styles/whyLearnSection.module.scss";

export default function WhyLearnSection() {
  return (
    <div className={styles.whyLearnSection}>
      <img
        src="/images/Ellipse4.svg"
        alt="ellipse"
        className={styles.ellipse1}
      />

      <div className={styles.LearnForm}>
        <img src="/images/SoftStar.svg" width={60} height={60} alt="SoftStar" />
        <h1>
          Why Learn from <br /> InnoKnowvex
        </h1>
        <p>WE HAVE NOT ONE, BUT THREE REASONS</p>

        {/* Features Section */}
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>01</div>
            <div className={styles.featureContent}>
              <h3>Online Billing, Invoicing & Contracts.</h3>
              <p>
                Simple and secure control of your organization's financial and
                legal transactions. Send customized invoices and contracts.
              </p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>02</div>
            <div className={styles.featureContent}>
              <h3>Easy Scheduling & Attendance tracking.</h3>
              <p>
                Simple and secure control of your organization's financial and
                legal transactions. Send customized invoices and contracts.
              </p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureNumber}>03</div>
            <div className={styles.featureContent}>
              <h3>Customer Tracking.</h3>
              <p>
                Simple and secure control of your organization's financial and
                legal transactions. Send customized invoices and contracts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
