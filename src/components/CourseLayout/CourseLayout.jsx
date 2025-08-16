import Navbar from '../Pages/Navbar/Navbar'
import styles from './styles/CourseLayout.module.scss'
import Image from 'next/image';

export default function CourseLayout({ course }) {
  return (
    <div className={styles.courseContainer}>
      <Navbar />
      <div>
        <img
          src={course.image}
          alt={course.title}
          className={styles.courseImage}
        />
      </div>
      <h2 >Program Overview</h2>
      <section >
        <p>{course.overview}</p>
        <div className={styles.buttons}>
          <button className={styles.startnow}>Start Course Now</button>
          <button className={styles.Brochure}>Brochure</button>

        </div>

      </section>
      <img src='/images/Ellipse4.svg' alt='ellipse' className={styles.ellipse1} />

      <di className={styles.LearnForm}>
        {/* <Image
                    className={styles.SoftStar}
                     src="/images/SoftStar.svg"
                    width={60}
                    height={60}
                    alt="Soft Star"
                /> */}
        <img src="/images/SoftStar.svg"
          width={60}
          height={60} alt="SoftStar" />
        <h1>Why Learn from <br /> InnoKnowvex</h1>
        <p>WE HAVE NOT ONE, BUT THREE REASONS</p>


      </di>
    </div>
  )
}