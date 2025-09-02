import styles from "./styles/certificationSection.module.scss";
import Image from "next/image";

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
        <Image width={600} height={400}  src={program.internship} alt="SampleInternshipCertificate" />
        <Image width={600} height={400} src={program.training} alt="SampleTrainingCertificate" />
      </div>
    </div>
  );
}
