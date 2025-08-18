'use client'
import styles from './styles/DescriptionSection.module.scss'

export default function DescriptionSection({ course }) {
  return (
    <div className={styles.descriptionContainer}>
      <div className={styles.imageWrapper}>
        <img
          src={course.image}
          alt={course.title}
          className={styles.courseImage}
        />
      </div>
      <h2>Program Overview</h2>
      <section>
        <p>{course.overview}</p>
        <div className={styles.buttons}>
          <button className={styles.startnow}>Start Course Now</button>
          <button className={styles.Brochure}>Brochure</button>
        </div>
      </section>
    </div>
  )
}