'use client'

import DescriptionSection from './PageDescription'
import WhyLearnSection from './WhyLearn'
import CardsSection from './Cards'
import PlansSection from './PlanSection'
import styles from './styles/CourseLayout.module.scss'
import Certification from './Certification'
import KeyHighlights from './KeyHighlights'

export default function CourseLayout({ course }) {
  return (
    <div className={styles.courseContainer}>
      {/* <DescriptionSection course={course} />
      <WhyLearnSection /> */}
      <KeyHighlights  course={course}/>
      {/* <CardsSection /> */}
      {/* <Certification  course={course} /> */}
      {/* <PlansSection /> */}
    </div>
  )
}