"use client";
import { motion, useReducedMotion } from "framer-motion";
import Footer from "../Landing/Sections/Footer/Footer";
import CardsSection from "./Sections/CardsSection/CardsSection";
import CertificationSection from "./Sections/CertificationSection/CertificationSection";
import CurriculumSection from "./Sections/CurriculumSection/CurriculumSection";
import DescriptionSection from "./Sections/DescriptionSection/DescriptionSection";
import KeyHighlightsSection from "./Sections/KeyHighlightsSection/KeyHighlightsSection";
import PlansSection from "./Sections/PlansSection/PlansSection";
import UpcomingBatchSection from "./Sections/UpcomingBatchSection/UpcomingBatchSection";
import WhyLearnSection from "./Sections/WhyLearnSection/WhyLearnSection";
import TestimonialSection from "../Landing/Sections/Testimonials/Testimonials";

import styles from "./styles/programDetailsOffline.module.scss";
import SmoothScroller from "@/components/Layouts/SmoothScroller";
import OurPartners from "../Landing/Sections/OurPartners/OurPartners";

export default function ProgramDetailsOfflinePage({ program, courseName }) {
  const reduceMotion = useReducedMotion();

  const SectionReveal = ({ children, idx }) => {
    if (reduceMotion) return children;

    return (
      <motion.div
        custom={idx}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: i * 0.03,
            },
          }),
        }}
      >
        {children}
      </motion.div>
    );
  };

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
    <SmoothScroller smooth={1.1} effects={false} smoothTouch={0.06}>
      <div className={styles.courseContainer}>
        <SectionReveal idx={0}>
          <DescriptionSection program={program} isOffline={true} />
        </SectionReveal>
        <SectionReveal idx={1}>
          <KeyHighlightsSection program={program} isOffline={true} />
        </SectionReveal>
        <SectionReveal idx={2}>
          <CurriculumSection program={program} isOffline={true} />
        </SectionReveal>
        <SectionReveal idx={3}>
          <WhyLearnSection isOffline={true} />
        </SectionReveal>
        <SectionReveal idx={4}>
          <UpcomingBatchSection isOffline={true} />
        </SectionReveal>
        <SectionReveal idx={5}>
          <CardsSection
            isOffline={true}
            courseTitle={program?.title}
            courseName={courseName}
          />
        </SectionReveal>
        <SectionReveal idx={6}>
          <CertificationSection program={program} isOffline={true} />
        </SectionReveal>
        <SectionReveal idx={7}>
          <PlansSection courseName={courseName} isOffline={true} />
        </SectionReveal>
        <SectionReveal idx={8}>
          <OurPartners className={styles.partnersCompact} />
        </SectionReveal>
        <SectionReveal idx={9}>
        <TestimonialSection className={styles.testimonialsCompact} />
        </SectionReveal>
        <Footer />
      </div>
    </SmoothScroller>
  );
}
