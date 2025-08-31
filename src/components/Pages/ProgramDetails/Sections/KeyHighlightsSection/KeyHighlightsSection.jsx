import styles from "./styles/keyHighlightsSection.module.scss";

export default function KeyHighlightsSection({ program }) {
  return (
    <div className={styles.layout}>
      <div className={styles.ellipse}>
        <img
          src="/images/Ellipse4.svg"
          alt=""
          className={styles.ellipseImage}
        />
      </div>
      <div className={styles.headingContainer}>
        <img
          src="/images/SoftStar.svg"
          alt="Soft Star"
          className={styles.starOrange}
        />
        <div className={styles.headingText}>
          <h1>Key Highlights of our</h1>
          <h1 className={styles.programName}>{program.id}</h1>
          <h1>program</h1>
        </div>
      </div>

      <div className={styles.skillsContainer}>
        {program.skills &&
          program.skills.map((skill, index) => (
            <div key={index} className={styles.skillBox}>
              {skill}
            </div>
          ))}
      </div>
    </div>
  );
}
