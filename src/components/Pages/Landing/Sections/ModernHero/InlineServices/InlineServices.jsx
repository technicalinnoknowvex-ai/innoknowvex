"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles/inlineServices.module.scss";
import { Briefcase, BookOpen, Lightbulb, Target } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const InlineServices = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const services = useMemo(
    () => [
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
    ],
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPrefersReducedMotion(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  useGSAP(
    () => {
      const cards = cardsRef.current.filter(Boolean);
      if (!cards.length) return;

      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.set(cards, { opacity: 0, y: 16, scale: 0.985 });
      gsap.set(cards.map((c) => c.querySelector(`.${styles.iconSmall}`)), {
        scale: 0.9,
        rotate: -6,
        opacity: 0,
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.08 }, 0);
      tl.to(
        cards.map((c) => c.querySelector(`.${styles.iconSmall}`)),
        { opacity: 1, scale: 1, rotate: 0, duration: 0.45, stagger: 0.08, ease: "back.out(1.8)" },
        0.05
      );
    },
    { dependencies: [prefersReducedMotion], scope: sectionRef }
  );

  const animateHover = (el, isEnter) => {
    if (!el || prefersReducedMotion) return;
    gsap.to(el, {
      y: isEnter ? -6 : 0,
      scale: isEnter ? 1.01 : 1,
      duration: isEnter ? 0.22 : 0.35,
      ease: isEnter ? "power2.out" : "elastic.out(1, 0.65)",
      overwrite: "auto",
    });
  };

  return (
    <div ref={sectionRef} className={styles.inlineServicesContainer}>
      <div className={styles.servicesGrid}>
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className={`${styles.serviceCard} ${hoveredCard === service.id ? styles.hovered : ""
                }`}
              onMouseEnter={() => {
                setHoveredCard(service.id);
                animateHover(cardsRef.current[index], true);
              }}
              onMouseLeave={() => {
                setHoveredCard(null);
                animateHover(cardsRef.current[index], false);
              }}
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
