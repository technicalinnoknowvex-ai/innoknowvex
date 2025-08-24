"use client";
import React, { useEffect, useRef } from "react";
import styles from "./styles/navbar.module.scss";
import CompanyLogo from "./CompanyLogo";
import { useNavColor } from "@/context/NavColorContext";
import gsap from "gsap";

const navLinks = [
  { label: "About Us", type: "link", href: "#" },
  { label: "Programs", type: "link", href: "#" },
  { label: "Blogs", type: "link", href: "#" },
  { label: "Testimonials", type: "link", href: "#" },
  { label: "Contact Us", type: "link", href: "#" },
];
const Navbar = () => {
  const { navColor } = useNavColor();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar__overlay}></div>
      <div className={styles.contentWrapper}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoContainer}>
            <CompanyLogo />
          </div>
        </div>
        <div className={styles.linksWrapper}>
          {navLinks.map((link, lIndex) => (
            <div key={lIndex} className={styles.linkBtn}>
              <div className={styles.underLine}></div>
              <p
                style={{
                  color: navColor,
                }}
              >
                {link.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
