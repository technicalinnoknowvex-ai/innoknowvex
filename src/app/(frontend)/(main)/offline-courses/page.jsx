import React from "react";
import Link from "next/link";
import styles from "./styles/offlineCourseListing.module.scss";

const OfflineCoursesPage = async () => {
  const offlineCourses = [
    {
      id: "offline-web-development",
      title: "Full Stack Web Development",
      slug: "offline-web-development",
      description:
        "Master modern web development with hands-on training in frontend, backend, and databases.",
      icon: "💻",
      color: "#22d3ee",
      lightColor: "rgba(34, 211, 238, 0.18)",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.pageShell}>
        <section className={styles.heroSection}>
          <div className={styles.heroBackground}>
            <div className={styles.blob1} />
            <div className={styles.blob2} />
            <div className={styles.blob3} />
          </div>
          <div className={styles.heroContent}>
            <div className={styles.badgeRow}>In-person · Mentor-led</div>
            <div className={styles.decorationTop} />
            <h1 className={styles.heroTitle}>
              <span className={styles.titleHighlight}>Experience Learning</span>
              <span className={styles.titleLine2}>Like Never Before</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Transform your skills with immersive offline training—clear paths,
              real projects, and outcomes that stand out.
            </p>
            <div className={styles.decorationBottom} />
            <div className={styles.scrollHint}>
              Explore programs below <span aria-hidden />
            </div>
          </div>
        </section>

        <section className={styles.coursesSection} aria-labelledby="offline-programs-heading">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Programs</span>
            <h2 id="offline-programs-heading">Our offline tracks</h2>
            <p>One focused path—built for depth, clarity, and career impact.</p>
          </div>

          <div className={styles.coursesGrid}>
            {offlineCourses.map((course, index) => (
              <Link key={course.id} href={`/offline-courses/${course.slug}`}>
                <div
                  className={styles.courseCard}
                  style={{
                    "--course-color": course.color,
                    "--course-light": course.lightColor,
                    "--delay": `${index * 0.1}s`,
                  }}
                >
                  <div className={styles.cardBackground} />
                  <div className={styles.iconContainer}>
                    <span className={styles.icon}>{course.icon}</span>
                  </div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.ctaLabel}>View syllabus &amp; enroll</span>
                    <span className={styles.arrowIcon}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.featuresSection} aria-labelledby="why-offline-heading">
          <h2 id="why-offline-heading">Why students choose offline with us</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👥</div>
              <h3>Expert mentors</h3>
              <p>Learn directly from industry professionals with years of shipping experience.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Hands-on training</h3>
              <p>Projects and scenarios modeled on what teams actually build.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏆</div>
              <h3>Certification</h3>
              <p>Credentials that reflect what you can demonstrate—not just attendance.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💼</div>
              <h3>Career support</h3>
              <p>Guidance on portfolio, interviews, and next steps after the program.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OfflineCoursesPage;
