import React from "react";
import styles from "./styles/navbar.module.scss";
import CompanyLogo from "./CompanyLogo";
const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar__overlay}></div>
      <div className={styles.contentWrapper}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoContainer}>
            <CompanyLogo />
          </div>
        </div>
        <div className={styles.linksWrapper}></div>
      </div>
    </nav>
  );
};

export default Navbar;
