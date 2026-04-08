import CompanyLogo from "@/components/Pages/Landing/Sections/Navbar/CompanyLogo";
import styles from "../../styles/routeLoading.module.scss";

export default function ProgramDetailsLoading() {
  return (
    <div className={styles.loadingScreen} role="status" aria-live="polite" aria-busy="true">
      <div className={styles.loaderWrap}>
        <span className={styles.ring} aria-hidden />
        <div className={styles.logoWrap}>
          <CompanyLogo />
        </div>
      </div>
      <p className={styles.loadingText}>Opening program details...</p>
    </div>
  );
}
