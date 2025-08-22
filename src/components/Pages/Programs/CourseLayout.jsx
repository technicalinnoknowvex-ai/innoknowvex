'use client'

import DescriptionSection from './PageDescription'
import WhyLearnSection from './WhyLearn'
import CardsSection from './Cards'
import PlansSection from './PlanSection'
import styles from './styles/CourseLayout.module.scss'

export default function CourseLayout({ course }) {
  return (
    <div className={styles.courseContainer}>
      <DescriptionSection course={course} />
      <WhyLearnSection />
      <CardsSection />
      <PlansSection />
    </div>
  )
}