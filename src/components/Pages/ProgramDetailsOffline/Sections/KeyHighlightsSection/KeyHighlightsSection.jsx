import styles from "./styles/keyHighlightsSection.module.scss";
import { useEffect, useRef, useState } from "react";
import { getSkillDescription } from "@/data/skills";
import { 
  Code2, Database, Zap, BarChart3, Smartphone, Cloud,
  Cpu, Shield, Layers, GitBranch, Palette, Workflow,
  Terminal, Settings, Brain, Lightbulb,
  CheckCircle, Sparkles
} from "lucide-react";

// Icon mapping for skills
const iconMap = {
  "react": Code2,
  "node": Terminal,
  "database": Database,
  "javascript": Zap,
  "python": Code2,
  "api": Cloud,
  "analytics": BarChart3,
  "mobile": Smartphone,
  "web": Smartphone,
  "backend": Cpu,
  "frontend": Palette,
  "security": Shield,
  "testing": CheckCircle,
  "devops": Workflow,
  "design": Palette,
  "ai": Brain,
  "ml": Lightbulb,
  "cloud": Cloud,
  "docker": Layers,
  "git": GitBranch,
  "sql": Database,
  "rest": Cloud,
  "http": Cloud,
};

const getIconForSkill = (skill) => {
  const skillLower = skill.toLowerCase();
  for (const [key, IconComponent] of Object.entries(iconMap)) {
    if (skillLower.includes(key)) {
      return <IconComponent size={18} />;
    }
  }
  return <Sparkles size={18} />;
};

export default function KeyHighlightsSection({ program, isOffline }) {
  const containerRef = useRef(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const skillCount = program?.skills?.length || 0;

  // Detect mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOffline && containerRef.current) {
      containerRef.current.classList.add(styles.animateIn);
      containerRef.current.querySelector(`.${styles.skillsContainer}`)?.classList.add(styles.animateSkills);
    }
  }, [isOffline, program]);

  const updateTooltipPosition = (index, e) => {
    setHoveredSkill(index);
    if (containerRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const layoutRect = containerRef.current.getBoundingClientRect();
      
      setTooltipPos({
        top: rect.top - layoutRect.top - 15,
        left: rect.left - layoutRect.left + rect.width / 2,
      });
    }
  };

  const handleMouseEnter = (index, e) => {
    if (!isMobile) {
      updateTooltipPosition(index, e);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setHoveredSkill(null);
    }
  };

  const handleClick = (index, e) => {
    if (isMobile) {
      if (hoveredSkill === index) {
        // Close tooltip if clicking the same skill
        setHoveredSkill(null);
      } else {
        // Show tooltip for clicked skill
        updateTooltipPosition(index, e);
      }
    }
  };

  return (
    <div
      className={`${styles.layout} ${isOffline ? styles.offlineStyle : ""}`}
      ref={containerRef}
    >
      <div className={styles.headingContainer}>
        <div className={styles.headingText}>
          <span className={styles.sectionBadge}>Program highlights</span>
          <h2>
            Core Skills You'll Master in{" "}
            <span className={`${styles.programName} ${isOffline ? styles.offlineGradient : ""}`}>
              {program.id}
            </span>
          </h2>
          <p>Industry-ready tools and skills used by real development teams.</p>
        </div>
        <div className={styles.metaChip}>{skillCount} Core Skills</div>
      </div>

      <div className={`${styles.skillsContainer} ${isOffline ? styles.animateSkills : ""}`}>
        {program.skills &&
          program.skills.map((skill, index) => (
            <div
              key={index}
              className={`${styles.skillBox} ${isOffline ? styles.offlineSkillBox : ""}`}
              style={isOffline ? { "--delay": `${index * 0.05}s` } : { "--badge-index": index }}
              title={skill}
              onMouseEnter={(e) => handleMouseEnter(index, e)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => handleClick(index, e)}
            >
              <span className={styles.skillIcon}>
                {getIconForSkill(skill)}
              </span>
              <span className={styles.skillText}>{skill}</span>
            </div>
          ))}
      </div>

      {hoveredSkill !== null && program.skills && (
        <div
          className={`${styles.tooltip} ${isOffline ? styles.offlineTooltip : ""}`}
          style={{
            top: `${tooltipPos.top}px`,
            left: `${tooltipPos.left}px`,
          }}
        >
          <div className={styles.tooltipContent}>
            <p>{getSkillDescription(program.skills[hoveredSkill])}</p>
          </div>
        </div>
      )}
    </div>
  );
}

