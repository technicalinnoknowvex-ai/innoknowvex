"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "./styles/statsOverlay.module.scss";
import gsap from "gsap";
import { Users, Zap, Target, Star, ExternalLink } from "lucide-react";

const StatsOverlay = () => {
  const containerRef = useRef(null);
  const statsRef = useRef([]);
  const countersRef = useRef([]);
  const [isVisible, setIsVisible] = useState(false);
  const [displayNumbers, setDisplayNumbers] = useState(["5,000+", "1,200+", "20+", "4.8"]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const stats = statsRef.current;

    // Animate stats in sequence
    const tl = gsap.timeline();

    stats.forEach((stat, index) => {
      tl.to(
        stat,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.5)",
        },
        index * 0.15
      );
    });

    return () => {
      tl.kill();
    };
  }, [isVisible]);

  // Counter animation effect
  useEffect(() => {
    if (!isVisible) return;

    // Reset to 0 when animation starts
    setDisplayNumbers(["0", "0", "0", "0"]);

    const counters = [
      { target: 5000, suffix: "+", index: 0, delay: 0, duration: 5 },
      { target: 1200, suffix: "+", index: 1, delay: 0, duration: 5 },
      { target: 20, suffix: "+", index: 2, delay: 0, duration: 5 },
      { target: 4.8, suffix: "", index: 3, delay: 0, decimals: 1, duration: 5 },
    ];

    counters.forEach((counter) => {
      const counterObj = { value: 0 };

      gsap.to(counterObj, {
        value: counter.target,
        duration: counter.duration,
        delay: counter.delay,
        ease: "power2.out",
        onUpdate: function () {
          let displayValue;
          if (counter.decimals !== undefined) {
            displayValue = counterObj.value.toFixed(counter.decimals);
          } else {
            displayValue = Math.floor(counterObj.value).toLocaleString("en-US");
          }
          displayValue += counter.suffix;

          setDisplayNumbers((prev) => {
            const newDisplayNumbers = [...prev];
            newDisplayNumbers[counter.index] = displayValue;
            return newDisplayNumbers;
          });
        },
      });
    });
  }, [isVisible]);

  const stats = [
    {
      number: "5,000+",
      label: "Students Connected",
      icon: Users,
      color: "#ff6b35",
      position: "topLeft",
    },
    {
      number: "1,200+",
      label: "Projects Completed",
      icon: Zap,
      color: "#ff6b35",
      position: "topRight",
    },
    {
      number: "20+",
      label: "Projects",
      icon: Target,
      color: "#ff6b35",
      position: "bottomLeft",
    },
    {
      number: "4.8",
      label: "Average Rating",
      icon: Star,
      color: "#ff6b35",
      hasLink: true,
      linkUrl: "https://www.google.com/search?q=innoknowvex+reviews",
      position: "bottomRight",
    },
  ];

  const handleRatingClick = () => {
    window.open("https://www.google.com/search?q=innoknowvex+reviews", "_blank");
  };

  return (
    <div ref={containerRef} className={styles.statsOverlay}>
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            ref={(el) => {
              if (el) statsRef.current[index] = el;
            }}
            className={`${styles.statCard} ${styles[stat.position]} ${stat.hasLink ? styles.withLink : ""}`}
            onClick={stat.hasLink ? handleRatingClick : undefined}
          >
            <div className={styles.iconWrapper}>
              <IconComponent size={20} color={stat.color} strokeWidth={2.5} />
              {stat.hasLink && (
                <ExternalLink size={12} className={styles.linkIcon} />
              )}
            </div>
            <div className={styles.statNumber}>{displayNumbers[index]}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverlay;
