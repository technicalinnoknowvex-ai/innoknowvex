import styles from "./styles/keyHighlightsSection.module.scss";
import { 
  Code2, Database, Zap, BarChart3, Smartphone, Cloud,
  Cpu, Shield, Layers, GitBranch, Palette, Workflow,
  Terminal, Settings, Brain, Lightbulb, Sparkles
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
  "testing": Shield,
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

export default function KeyHighlightsSection({ program }) {
  return (
    <div className={styles.layout}>
      <div className={styles.headingContainer}>
        <div className={styles.badge}>✨ Key Highlights</div>
        <h2 className={styles.heading}>Core Skills You'll Master</h2>
        <p className={styles.subheading}>Industry-ready tools and technologies</p>
      </div>

      <div className={styles.skillsContainer}>
        {program.skills &&
          program.skills.map((skill, index) => (
            <div 
              key={index} 
              className={styles.skillBadge}
              style={{ "--badge-index": index }}
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
