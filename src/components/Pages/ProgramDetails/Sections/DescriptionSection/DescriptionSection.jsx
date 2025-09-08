"use client";
import styles from "./styles/descriptionSection.module.scss";


export default function DescriptionSection({ program }) {
  const handleDownloadBrochure = () => {
    if (!program.brochure) {
      console.error("No brochure available for this program");
      return;
    }

    const link = document.createElement("a");
    link.href = program.brochure;

    link.download = `${program.id}-brochure.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
   const scrollToPlans = () => {
    const plansSection = document.getElementById("plans-section");
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.descriptionContainer}>
      <div className={styles.imageWrapper}>
        <Image
          src={program.image}
          alt={program.title}
          className={styles.courseImage}
        />
      </div>
      <h2>{program.title} Program Overview</h2>
      <section>
        <p>{program.overview}</p>
        <div className={styles.buttons}>
          <button className={styles.startnow} onClick={scrollToPlans}>
           Start Course Now</button>
          <button
            className={styles.Brochure}
            onClick={handleDownloadBrochure}
            disabled={!program.brochure}
          >
            {program.brochure ? "Download Brochure" : "Brochure Coming Soon"}
          </button>
        </div>
      </section>
    </div>
  );
}
