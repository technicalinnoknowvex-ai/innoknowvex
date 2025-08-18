'use client'
import Navbar from '../Navbar/Navbar'
import DescriptionSection from './PageDescription'
import WhyLearnSection from './WhyLearn'
import CardsSection from './Cards'
import PlansSection from './PlanSection'
import styles from './styles/CourseLayout.module.scss'

export default function CourseLayout({ course }) {
  return (
    <div className={styles.courseContainer}>
      <Navbar />
      <DescriptionSection course={course} />
      <WhyLearnSection />
      <CardsSection />
      <PlansSection />
    </div>
  )
}