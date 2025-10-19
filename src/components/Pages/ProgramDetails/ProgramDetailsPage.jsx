"use client";
import Footer from "../Landing/Sections/Footer/Footer";
import CardsSection from "./Sections/CardsSection/CardsSection";
import CertificationSection from "./Sections/CertificationSection/CertificationSection";
import CurriculumSection from "./Sections/CurriculumSection/CurriculumSection";
import DescriptionSection from "./Sections/DescriptionSection/DescriptionSection";
import KeyHighlightsSection from "./Sections/KeyHighlightsSection/KeyHighlightsSection";
import PlansSection from "./Sections/PlansSection/PlansSection";
import WhyLearnSection from "./Sections/WhyLearnSection/WhyLearnSection";
import TestimonialSection from "../Landing/Sections/Testimonials/Testimonials";

import styles from "./styles/programDetails.module.scss";

export default function ProgramDetailsPage({ program }) {
  if (!program) {
    return (
      <div className={styles.courseContainer}>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          Program not found
        </div>
      </div>
    );
  }

  return (
    <div className={styles.courseContainer}>
      <DescriptionSection program={program} />
      <KeyHighlightsSection program={program} />
      <CurriculumSection program={program} />
      <WhyLearnSection />
      <CardsSection />
      <CertificationSection program={program} />
      <PlansSection />
      <TestimonialSection />
      <Footer />
    </div>
  );
}