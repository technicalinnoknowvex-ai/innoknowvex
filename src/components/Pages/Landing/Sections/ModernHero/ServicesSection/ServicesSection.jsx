"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "./styles/servicesSection.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Briefcase,
  BookOpen,
  CheckCircle,
  Target,
  Lightbulb,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const services = [
    {
      id: 1,
      icon: Briefcase,
      title: "Internships",
      description:
        "Gain real-world experience in your field. Work with top companies and build your professional network.",
    },
    {
      id: 2,
      icon: BookOpen,
      title: "Training",
      description:
        "Skill development programs for career growth. Master in-demand skills with expert instructors.",
    },
    {
      id: 3,
      icon: CheckCircle,
      title: "Placement Assistance",
      description:
        "Guidance and support to land your dream job. Our team helps from application to interview.",
    },
    {
      id: 4,
      icon: Target,
      title: "Placement Assistance",
      description:
        "Career guidance and support services. Navigate your path to success with expert mentoring.",
    },
    {
      id: 5,
      icon: Lightbulb,
      title: "Mentor Guidance",
      description:
        "Personalized mentorship from industry experts. Get one-on-one guidance for your growth.",
    },
  ];

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);

    // Scroll trigger animation
    cards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          markers: false,
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.1,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleCardHover = (id) => {
    setHoveredCard(id);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  return (
    <section ref={sectionRef} className={styles.servicesSection}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Our Services</h2>
      </div>

      {/* Services Grid */}
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
                hoveredCard === service.id ? styles.active : ""
              }`}
              onMouseEnter={() => handleCardHover(service.id)}
              onMouseLeave={handleCardLeave}
            >
              {/* Icon Container */}
              <div className={styles.iconContainer}>
                <IconComponent size={44} />
              </div>

              {/* Content */}
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDescription}>
                  {service.description}
                </p>
              </div>

              {/* Decorative line */}
              <div className={styles.decorativeLine} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesSection;
