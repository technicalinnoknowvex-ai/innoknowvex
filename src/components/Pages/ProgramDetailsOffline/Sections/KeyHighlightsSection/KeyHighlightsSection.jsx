import styles from "./styles/keyHighlightsSection.module.scss";
import { useEffect, useRef } from "react";
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
  const skillCount = program?.skills?.length || 0;

  useEffect(() => {
    if (isOffline && containerRef.current) {
      containerRef.current.classList.add(styles.animateIn);
      containerRef.current.querySelector(`.${styles.skillsContainer}`)?.classList.add(styles.animateSkills);
    }
  }, [isOffline, program]);

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
            >
              <span className={styles.skillIcon}>
                {getIconForSkill(skill)}
              </span>
              <span className={styles.skillText}>{skill}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

