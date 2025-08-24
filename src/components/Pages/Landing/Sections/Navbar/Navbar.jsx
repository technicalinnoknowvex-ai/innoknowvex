"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/navbar.module.scss";
import CompanyLogo from "./CompanyLogo";
import { useNavColor } from "@/context/NavColorContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Hamburger from "@/components/Common/Icons/Hamburger";

gsap.registerPlugin(useGSAP);

const navLinks = [
  { label: "About Us", type: "link", href: "#" },
  { label: "Programs", type: "link", href: "#" },
  { label: "Blogs", type: "link", href: "#" },
  { label: "Testimonials", type: "link", href: "#" },
  { label: "Contact Us", type: "link", href: "#" },
];

const Navbar = () => {
  const { navColor } = useNavColor();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize menu to hidden state
  useGSAP(
    () => {
      if (menuRef.current) {
        gsap.set(menuRef.current, {
          y: "-100%",
          autoAlpha: 0,
          pointerEvents: "none",
        });
      }
    },
    { scope: containerRef }
  );

  // Animate menu based on isOpen state
  useEffect(() => {
    if (menuRef.current) {
      if (isOpen) {
        // Slide menu down
        gsap.to(menuRef.current, {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.out",
          pointerEvents: "auto",
        });
      } else {
        // Slide menu up
        gsap.to(menuRef.current, {
          y: "-100%",
          autoAlpha: 0,
          duration: 0.4,
          ease: "power2.in",
          pointerEvents: "none",
        });
      }
    }
  }, [isOpen]);

  return (
    <div ref={containerRef}>
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
                <p style={{ color: navColor }}>{link.label}</p>
              </div>
            ))}
            <button className={styles.toggleButton}>
              <Hamburger isOpen={isOpen} setIsOpen={setIsOpen} />
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.menu} ref={menuRef}></div>
    </div>
  );
};

export default Navbar;
