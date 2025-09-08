import styles from "./styles/certificationSection.module.scss";
import Image from "next/image";

export default function CertificationSection({ program }) {
  return (
    <div className={styles.layout}>
      <div className={styles.ellipse}>
        <Image src="/images/Ellipse4.svg" alt="" className={styles.ellipse} />
      </div>

      <div className={styles.starImg}>
        <Image
          src="/images/SoftStar.svg"
          alt="Soft Star"
          className={styles.starOrange}
        />
        <p> Certificate</p>
      </div>
      <h1>Prove What You've Achieved</h1>

      <div className={styles.images}>
        <Image
          src={program.internship}
          alt="Sample Internship Certificate"
          width={600} 
          height={400} 
        />

        <Image
          src={program.training}
          alt="Sample Training Certificate"
          width={600}
          height={400}
        />
      </div>
    </div>
  );
}
