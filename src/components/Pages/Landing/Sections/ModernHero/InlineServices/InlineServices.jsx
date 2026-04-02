"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "./styles/inlineServices.module.scss";
import { Briefcase, BookOpen, Lightbulb, Target } from "lucide-react";

const InlineServices = () => {
  const cardsRef = useRef([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const services = [
    {
      id: 1,
      icon: Briefcase,
      title: "Internships",
      shortDesc: "Real-world experience with top companies",
    },
    {
      id: 2,
      icon: BookOpen,
      title: "Training",
      shortDesc: "Skill development programs for growth",
    },
    {
      id: 3,
      icon: Target,
      title: "Career Guidance",
      shortDesc: "Expert guidance to land your dream job",
    },
    {
      id: 4,
      icon: Lightbulb,
      title: "Mentor Guidance",
      shortDesc: "One-on-one mentorship from experts",
    },
  ];

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }, []);

  return (
    <div className={styles.inlineServicesContainer}>
      <div className={styles.servicesGrid}>
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className={`${styles.serviceCard} ${
                hoveredCard === service.id ? styles.hovered : ""
              }`}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={styles.iconSmall}>
                <IconComponent size={28} />
              </div>
              <h4 className={styles.serviceTitle}>{service.title}</h4>
              <p className={styles.serviceDesc}>{service.shortDesc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InlineServices;
