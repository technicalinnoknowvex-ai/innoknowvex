"use client";
import styles from "./styles/cardSection.module.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";

export default function CardsSection({ isOffline, courseTitle, courseName }) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  const [hoveredToolIndex, setHoveredToolIndex] = useState(null);
  const cardsGridRef = useRef(null);
  const arcRef = useRef(null);
  const [arcSize, setArcSize] = useState({ width: 0, height: 0 });
  const roadmapTools = useMemo(() => {
    const normalized = `${courseName || ""} ${courseTitle || ""}`.toLowerCase();

    if (normalized.includes("machine-learning")) {
      return [
        {
          title: "Python",
          icon: "logos:python",
          blurb: "Write ML pipelines, scripts, and model experimentation notebooks.",
        },
        {
          title: "NumPy & Pandas",
          icon: "logos:numpy",
          blurb: "Handle arrays, data cleaning, and feature engineering workflows.",
        },
        {
          title: "Scikit-Learn",
          icon: "simple-icons:scikitlearn",
          blurb: "Train classical ML models for regression and classification tasks.",
        },
        {
          title: "Jupyter Notebook",
          icon: "logos:jupyter",
          blurb: "Iterate quickly with visual analysis, notes, and reproducible runs.",
        },
        {
          title: "SQL",
          icon: "vscode-icons:file-type-sql",
          blurb: "Query and prepare structured datasets from relational databases.",
        },
        {
          title: "Git & GitHub",
          icon: "logos:git-icon",
          blurb: "Version your experiments and collaborate on model projects.",
        },
      ];
    }

    if (normalized.includes("artificial-intelligence")) {
      return [
        {
          title: "Python",
          icon: "logos:python",
          blurb: "Build AI workflows, model code, and data-processing scripts.",
        },
        {
          title: "TensorFlow",
          icon: "logos:tensorflow",
          blurb: "Develop and train deep learning models for AI applications.",
        },
        {
          title: "PyTorch",
          icon: "logos:pytorch-icon",
          blurb: "Prototype neural networks and advanced AI architectures quickly.",
        },
        {
          title: "NLP Toolkit",
          icon: "logos:hugging-face-icon",
          blurb: "Work with language models, tokenizers, and text intelligence tasks.",
        },
        {
          title: "Computer Vision",
          icon: "logos:opencv",
          blurb: "Build image-processing and visual recognition model pipelines.",
        },
        {
          title: "MLOps Basics",
          icon: "logos:docker-icon",
          blurb: "Package and deploy AI models to production-like environments.",
        },
      ];
    }

    if (normalized.includes("data-science")) {
      return [
        {
          title: "Python",
          icon: "logos:python",
          blurb: "Perform end-to-end analysis, modeling, and automation tasks.",
        },
        {
          title: "Pandas",
          icon: "logos:pandas-icon",
          blurb: "Clean, transform, and analyze large tabular datasets efficiently.",
        },
        {
          title: "Power BI",
          icon: "logos:microsoft-power-bi",
          blurb: "Create business dashboards and actionable visual analytics reports.",
        },
        {
          title: "Tableau",
          icon: "logos:tableau-icon",
          blurb: "Build interactive visual stories for decision-making insights.",
        },
        {
          title: "SQL",
          icon: "vscode-icons:file-type-sql",
          blurb: "Extract and aggregate data from structured data sources.",
        },
        {
          title: "Statistics",
          icon: "mdi:sigma",
          blurb: "Apply probability and statistical testing for better conclusions.",
        },
      ];
    }

    return [
      {
        title: "VS Code & DevTools",
        icon: "logos:visual-studio-code",
        blurb: "Set up a productive coding environment and debug in the browser.",
      },
      {
        title: "Git & GitHub",
        icon: "logos:git-icon",
        blurb: "Track changes, work in branches, and collaborate using pull requests.",
      },
      {
        title: "Frontend Stack",
        icon: "vscode-icons:file-type-html",
        blurb: "Build responsive UIs using HTML, CSS, and JavaScript/React.",
      },
      {
        title: "Databases",
        icon: "logos:mysql",
        blurb: "Model tables, write queries, and connect apps to relational databases.",
      },
      {
        title: "Backend APIs",
        icon: "logos:nodejs-icon",
        blurb: "Create secure REST APIs with Node.js and connect them to the frontend.",
      },
      {
        title: "Deployment",
        icon: "logos:docker-icon",
        blurb: "Containerize projects and ship them to production-like environments.",
      },
    ];
  }, [courseName, courseTitle]);

  useEffect(() => {
    if (isOffline) {
      setShouldAnimate(true);
      if (cardsGridRef.current) {
        const cards = cardsGridRef.current.querySelectorAll(`.${styles.card}`);
        cards.forEach((card, index) => {
          card.style.setProperty("--delay", `${index * 0.1}s`);
        });
      }
    }
  }, [isOffline]);

  useEffect(() => {
    if (!arcRef.current) return;

    const el = arcRef.current;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setArcSize({
        width: Math.max(0, rect.width),
        height: Math.max(0, rect.height),
      });
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!isOffline || hoveredToolIndex !== null) return undefined;

    const timer = setInterval(() => {
      setActiveToolIndex((prev) => (prev + 1) % roadmapTools.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isOffline, hoveredToolIndex, roadmapTools.length]);

  const arcPositions = useMemo(() => {
    const count = roadmapTools.length;
    if (!arcSize.width || count === 0) return [];

    // Reference-like layout for 6 tools: 4 around the arc, 2 centered at the bottom.
    if (count === 6) {
      const w = arcSize.width;
      const h = arcSize.height || 360;

      // Place nodes directly ON the curved track (a semicircle).
      // Circle is centered near the bottom of the wrap so the arc matches the CSS track.
      const cx = w / 2;
      const cy = h - 8;
      const r = Math.max(160, Math.min(w / 2 - 12, h - 26));

      // Angles across the top semicircle (left → right), with two nodes near the bottom center.
      // Wider spacing so icons don't feel crowded
      // Extra spacing between nodes
      const anglesDeg = [208, 232, 256, 282, 306, 330];

      return anglesDeg.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);
        return { left: x, top: y, deg };
      });
    }

    // Responsive semicircle geometry
    const w = arcSize.width;
    const padding = Math.max(18, Math.min(36, w * 0.045));
    const r = Math.max(120, Math.min(320, w / 2 - padding));
    const centerX = w / 2;
    // Keep the arc low so labels fit above
    const centerY = r + padding;

    // Angles along the top semicircle (left → right)
    const startDeg = 205;
    const endDeg = -25;
    const step = count === 1 ? 0 : (startDeg - endDeg) / (count - 1);

    return roadmapTools.map((_, idx) => {
      const deg = startDeg - step * idx;
      const rad = (deg * Math.PI) / 180;
      const x = centerX + r * Math.cos(rad);
      const y = centerY + r * Math.sin(rad);
      return { left: x, top: y, deg };
    });
  }, [arcSize.width, arcSize.height, roadmapTools]);

  const focusedToolIndex = hoveredToolIndex ?? activeToolIndex;
  const focusedPos = arcPositions[focusedToolIndex];
  const lineStartX = arcSize.width / 2;
  // Start slightly lower so the arrow doesn't appear behind the center title.
  const lineStartY = arcSize.height * 0.72;
  const lineEndX = focusedPos?.left ?? lineStartX;
  const lineEndY = focusedPos?.top ?? lineStartY;
  const deltaX = lineEndX - lineStartX;
  const deltaY = lineEndY - lineStartY;
  const lineLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const lineAngleDeg = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
  // Keep a clear gap so the arrowhead doesn't overlap the tool icon.
  const arrowInset = 65;
  const arrowLineLength = Math.max(0, lineLength - arrowInset);

  return (
    <div className={`${styles.cardsContainer} ${isOffline ? styles.offlineStyle : ""}`}>
      <div className={styles.leftSection}>
        <div className={styles.careerBoostContent}>
          <h1 className={styles.careerBoostTitle}>Tools You Will Learn</h1>
          <p className={styles.careerBoostDescription}>Core tools used in real development teams.</p>
        </div>
      </div>

      <div className={styles.cardsSection}>
        <svg
          width="800"
          height="800"
          viewBox="0 0 767 767"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.ellipse}
        >
          <g filter="url(#filter0_f_37_12)">
            <circle
              cx="383.5"
              cy="383.5"
              r="138.5"
              fill="#FA9805"
              fillOpacity="0.74"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_37_12"
              x="0.566696"
              y="0.566696"
              width="765.867"
              height="765.867"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="122.217"
                result="effect1_foregroundBlur_37_12"
              />
            </filter>
          </defs>
        </svg>

          <div className={styles.arcWrap} ref={arcRef}>
            <div className={styles.arcTrack} aria-hidden />
            <div className={styles.arcCenterTitle}>
              <div className={styles.arcCourseName}>
                {courseTitle || "Offline Program"}
              </div>
            </div>
            {isOffline && (
              <div
                className={styles.activeConnector}
                style={{
                  left: `${lineStartX}px`,
                  top: `${lineStartY}px`,
                  width: `${arrowLineLength}px`,
                  transform: `rotate(${lineAngleDeg}deg)`,
                }}
                aria-hidden
              />
            )}
            <div className={styles.arcNodes} ref={cardsGridRef}>
              {roadmapTools.map((tool, index) => {
                const pos = arcPositions[index];
                const isActive = focusedToolIndex === index;
                return (
                  <div
                    key={tool.title}
                    className={`${styles.iconItem} ${
                      shouldAnimate && isOffline ? styles.animateCard : ""
                    } ${isActive ? styles.activeTool : ""}`}
                    style={{
                      "--delay": `${index * 0.08}s`,
                      left: pos ? `${pos.left}px` : undefined,
                      top: pos ? `${pos.top}px` : undefined,
                    }}
                    onMouseEnter={() => setHoveredToolIndex(index)}
                    onMouseLeave={() => setHoveredToolIndex(null)}
                  >
                    <div className={styles.nodeMeta}>
                      <div className={styles.stepNum}>
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className={styles.nodeTitle}>{tool.title}</div>
                    </div>
                    <div className={styles.iconCircle}>
                      <Icon icon={tool.icon} width="44" height="44" />
                    </div>
                    <div className={styles.toolBlurb}>
                      <span>{tool.blurb}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
      </div>
    </div>
  );
}
