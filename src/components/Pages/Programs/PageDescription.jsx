'use client'
import styles from './styles/DescriptionSection.module.scss'
import Image from 'next/image';

export default function DescriptionSection({ course }) {
  const handleDownloadBrochure = () => {
    if (!course.brochure) {
      console.error('No brochure available for this course');
      return;
    }


    const link = document.createElement('a');
    link.href = course.brochure;


    link.download = `${course.id}-brochure.pdf`;


    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.descriptionContainer}>
      <div className={styles.imageWrapper}>
        {/* <img
          src={course.image}
          alt={course.title}
          className={styles.courseImage}
        /> */}
        <Image
          src={course.image}
          alt={course.title}
          width={600}
          height={400}
          className={styles.courseImage}
        />
      </div>
      <h2>Program Overview</h2>
      <section>
        <p>{course.overview}</p>
        <div className={styles.buttons}>
          <button className={styles.startnow}>Start Course Now</button>
          <button className={styles.Brochure} onClick={handleDownloadBrochure} disabled={!course.brochure}>
            {course.brochure ? 'Download Brochure' : 'Brochure Coming Soon'}
          </button>
        </div>
      </section>
    </div>
  )
}