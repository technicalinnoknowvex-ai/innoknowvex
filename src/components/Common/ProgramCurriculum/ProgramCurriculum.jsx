"use client";

import React, { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { curriculumModules, getCurriculumForProgram } from "@/data/curriculum";
import styles from "./styles/programCurriculum.module.scss";

export default function ProgramCurriculum({ program, isOffline = false }) {
  const [activeModule, setActiveModule] = useState(0);
  const [hoveredModule, setHoveredModule] = useState(null);
  const detailsRef = useRef(null);
  const containerRef = useRef(null);

  const programCurriculum =
    program?.curriculum?.length > 0
      ? program.curriculum
      : getCurriculumForProgram(program);

  const activeModuleData =
    programCurriculum[hoveredModule !== null ? hoveredModule : activeModule];

  useGSAP(() => {
    if (detailsRef.current) {
      gsap.fromTo(
        detailsRef.current,
        {
          opacity: 0,
          x: 40,
          scale: 0.98,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.2)",
        }
      );
    }
  }, [activeModuleData]);

  useGSAP(() => {
    if (containerRef.current) {
      const modules = containerRef.current.querySelectorAll(
        `.${styles.moduleCard}`
      );

      gsap.fromTo(
        modules,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power2.out",
        }
      );
    }
  }, []);

  return (
    <section
      className={`${styles.programCurriculumSection} ${
        isOffline ? styles.offlineSection : ""
      }`}
    >
      <div className={`${styles.container} ${isOffline ? styles.offlineContainer : ""}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Curriculum</h2>
          <p className={styles.subtitle}>{program?.title || "Program Curriculum"}</p>
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.modulesGrid} ref={containerRef}>
            {programCurriculum.map((module, index) => (
              <div
                key={module.id ?? index}
                className={`${styles.moduleCard} ${
                  activeModule === index || hoveredModule === index
                    ? styles.active
                    : ""
                }`}
                onMouseEnter={() => setHoveredModule(index)}
                onMouseLeave={() => setHoveredModule(null)}
                onClick={() => setActiveModule(index)}
              >
                <div className={styles.cardInner}>
                  <div className={styles.moduleNumber}>
                    {String(module.id ?? index + 1).padStart(2, "0")}
                  </div>
                  <h3 className={styles.cardTitle}>{module.title}</h3>
                  <p className={styles.topicCount}>
                    {module.topics?.length ?? 0} topics
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.detailsPanel} ref={detailsRef}>
            {activeModuleData && (
              <div className={styles.detailsContent}>
                <div className={styles.moduleHeader}>
                  <div className={styles.badgeContainer}>
                    <span className={styles.badge}>
                      Module {activeModuleData.id ?? hoveredModule ?? activeModule + 1}
                    </span>
                  </div>
                  <h2 className={styles.moduleTitle}>{activeModuleData.title}</h2>
                </div>

                <div className={styles.topicsWrapper}>
                  <h3 className={styles.sectionHeading}>Topics Covered</h3>
                  <ul className={styles.topicsList}>
                    {activeModuleData.topics?.map((topic, idx) => (
                      <li
                        key={idx}
                        className={styles.topicItem}
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <span className={styles.checkmark}>✓</span>
                        <span className={styles.topicName}>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
