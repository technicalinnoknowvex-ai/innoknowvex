"use client";
import React, { useState, useRef } from "react";
import styles from './styles/Curriculum.module.scss';
import Sparkle from "@/components/Common/Icons/Sparkle";

export default function Curriculum({ course }) {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const answerRefs = useRef([]);
  
  const handleQuestionClick = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  // Check if course has curriculum data
  if (!course.curriculum || course.curriculum.length === 0) {
    return (
      <section className={styles.sectionWrapper}>
        <div className={styles.sectionWrapper__innerContainer}>
          <h2 className={styles.sectionHeading}>Curriculum</h2>
          <p>No curriculum data available for this course.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.sectionWrapper}>
      {/* Ellipse Background */}
      <div className={styles.ellipse}>
        <img src="/images/Ellipse4.svg" alt="" className={styles.ellipseImage} />
      </div>
      
      <div className={styles.sectionWrapper__innerContainer}>
        {/* Heading with Star */}
        <div className={styles.headingContainer}>
          <img 
            src="/images/SoftStar.svg"
            alt="Soft Star"
            className={styles.starOrange}
          />
          <h2 className={styles.sectionHeading}>Curriculum Overview</h2>
        </div>
        
        <div className={styles.curriculumContainer}>
          {course.curriculum.map((item, index) => (
            <div
              key={index}
              className={`${styles.curriculumItem} ${
                activeQuestion === index && styles["curriculumItem--active"]
              }`}
              onClick={() => handleQuestionClick(index)}
            >
              <div className={styles.questionWrapper}>
                <div className={styles.iconContainer}>
                  <div className={styles.iconDiv}>
                    <Sparkle
                      color={activeQuestion === index ? "#FF6432" : "#9C7F16"}
                    />
                  </div>
                </div>
                <div className={styles.questionDiv}>
                  <p style={{ color: activeQuestion === index ? "#FF6432" : "#9C7F16" }}>
                    {item.question}
                  </p>
                </div>
              </div>
              <div
                ref={(el) => (answerRefs.current[index] = el)}
                className={`${styles.answerWrapper} ${
                  activeQuestion === index && styles["answerWrapper--active"]
                }`}
                style={{
                  maxHeight:
                    activeQuestion === index
                      ? `${answerRefs.current[index]?.scrollHeight}px`
                      : "0px",
                }}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}