"use client";
import React, { useState, useRef } from "react";
import styles from "./styles/curriculumSection.module.scss";
import Sparkle from "@/components/Common/Icons/Sparkle";
import Image from "next/image";

export default function CurriculumSection({ program }) {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const answerRefs = useRef([]);

  const handleQuestionClick = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  // Check if program has curriculum data
  if (!program.curriculum || program.curriculum.length === 0) {
    return (
      <section className={styles.sectionWrapper}>
        <div className={styles.sectionWrapper__innerContainer}>
          <h2 className={styles.sectionHeading}>Curriculum</h2>
          <p>No curriculum data available for this program.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.sectionWrapper__innerContainer}>
        {/* Heading with Star */}
        <div className={styles.headingContainer}>
          
          <svg
            width="50"
            height="50"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.starOrange}
          >
            <path
              d="M98.4051 17.0205C98.6998 14.3265 102.3 14.3265 102.595 17.0205L105.065 39.6212C108.254 68.8048 129.445 91.8138 156.323 95.2766L177.139 97.9582C179.62 98.2782 179.62 102.187 177.139 102.507L156.323 105.189C129.445 108.652 108.254 131.661 105.065 160.844L102.595 183.445C102.3 186.139 98.6998 186.139 98.4051 183.445L95.9353 160.844C92.7461 131.661 71.5546 108.652 44.6763 105.189L23.8609 102.507C21.3797 102.187 21.3797 98.2782 23.8609 97.9582L44.6763 95.2766C71.5546 91.8138 92.7461 68.8048 95.9353 39.6212L98.4051 17.0205Z"
              fill="#FF6432"
            />
          </svg>

          <h2 className={styles.sectionHeading}>Curriculum Overview</h2>
        </div>

        <div className={styles.curriculumContainer}>
          {program.curriculum.map((item, index) => (
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
                  <p
                    style={{
                      color: activeQuestion === index ? "#FF6432" : "#9C7F16",
                    }}
                  >
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
