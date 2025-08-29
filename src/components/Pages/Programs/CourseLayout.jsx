"use client";

import DescriptionSection from "./PageDescription";
import WhyLearnSection from "./WhyLearn";
import CardsSection from "./Cards";
import PlansSection from "./PlanSection";
import styles from "./styles/CourseLayout.module.scss";
import Certification from "./Certification";
import KeyHighlights from "./KeyHighlights";
import Curriculum from "./Curriculum";
import Testimonials from "../Landing/Sections/Testimonials/Testimonials";

export default function CourseLayout({ course }) {
  return (
    <div className={styles.courseContainer}>
      <DescriptionSection course={course} />
      <KeyHighlights course={course} />
      <Curriculum course={course} />
      <WhyLearnSection />
      <CardsSection />
      <Certification course={course} />
      <Testimonials/>
      <PlansSection />
    </div>
  );
}
