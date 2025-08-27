import styles from "./styles/certificationSection.module.scss";
export default function CertificationSection({ program }) {
  return (
    <div className={styles.layout}>
      <div className={styles.ellipse}>
        <img src="/images/Ellipse4.svg" alt="" className={styles.ellipse} />
      </div>

      <div className={styles.starImg}>
        <img
          src="/images/SoftStar.svg"
          alt="Soft Star"
          className={styles.starOrange}
        />
        <p> Certificate</p>
      </div>
      <h1>Prove What You've Achieved</h1>

      <div className={styles.images}>
        <img src={program.internship} alt="SampleInternshipCertificate" />
        <img src={program.training} alt="SampleTrainingCertificate" />
      </div>
    </div>
  );
}
