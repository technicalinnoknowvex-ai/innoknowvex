"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/navbar.module.scss";
import CompanyLogo from "./CompanyLogo";
import { useNavColor } from "@/context/NavColorContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Hamburger from "@/components/Common/Icons/Hamburger";
import Sparkle from "@/components/Common/Icons/Sparkle";
import Link from "next/link";
import { useRouter } from "next/navigation";

gsap.registerPlugin(useGSAP, ScrollToPlugin);

const navLinks = [
  { label: "About Us", type: "section", href: "#about-us" },
  { label: "Programs", type: "section", href: "#programs" },
  { label: "Blogs", type: "page", href: "/blogs" },
  { label: "Testimonials", type: "section", href: "#testimonials" },
  { label: "Contact Us", type: "section", href: "#footer" },
];

const Navbar = () => {
  const { navColor } = useNavColor();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const menuRef = useRef(null);
  const containerRef = useRef(null);
  const sparkleRefs = useRef([]);
  const router = useRouter();

  // Initialize menu to hidden state and sparkle animations
  useGSAP(
    () => {
      if (menuRef.current) {
        gsap.set(menuRef.current, {
          y: "-100%",
          autoAlpha: 0,
          pointerEvents: "none",
        });
      }

      // Animate sparkles on navbar load
      gsap.fromTo(
        sparkleRefs.current,
        {
          scale: 0,
          rotation: -180,
          opacity: 0,
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.5,
        }
      );
    },
    { scope: containerRef }
  );

  // Animate menu based on isOpen state
  useEffect(() => {
    if (menuRef.current) {
      if (isOpen) {
        gsap.to(menuRef.current, {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.out",
          pointerEvents: "auto",
        });
      } else {
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

  // Handle navigation - both sections and pages
  const handleNavigation = (link) => {
    // Animate clicked sparkle
    const clickedIndex = navLinks.findIndex(
      (navLink) => navLink.href === link.href
    );
    if (sparkleRefs.current[clickedIndex]) {
      gsap.to(sparkleRefs.current[clickedIndex], {
        scale: 1.5,
        rotation: 360,
        duration: 0.4,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }

    // Close mobile menu if it's open
    if (isOpen) {
      setIsOpen(false);
    }

    if (link.type === "page") {
      // Navigate to page using Next.js router
      router.push(link.href);
    } else if (link.type === "section") {
      // Scroll to section
      handleScrollTo(link.href);
    }
  };

  // Handle smooth scroll to section with GSAP
  const handleScrollTo = (href) => {
    const elementId = href.replace("#", "");
    const element = document.getElementById(elementId);

    if (element) {
      // Get ScrollSmoother instance if available
      const smoother = ScrollSmoother.get();

      if (smoother) {
        smoother.scrollTo(element, true, "top 0px");
      } else {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: element,
            offsetY: 0,
          },
          ease: "power2.inOut",
        });
      }
    }
  };

  // Handle link hover animations
  const handleLinkHover = (index, isEnter) => {
    const sparkle = sparkleRefs.current[index];
    const linkBtn = sparkle?.parentElement?.nextElementSibling;

    if (isEnter) {
      gsap.to(sparkle, {
        scale: 1.2,
        rotation: 180,
        duration: 0.3,
        ease: "power2.out",
      });

      if (linkBtn) {
        gsap.to(linkBtn.querySelector("p"), {
          y: -2,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    } else {
      gsap.to(sparkle, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      if (linkBtn) {
        gsap.to(linkBtn.querySelector("p"), {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  };

  return (
    <div ref={containerRef}>
      <nav className={styles.navbar}>
        <div className={styles.navbar__overlay}></div>
        <div className={styles.contentWrapper}>
          <div className={styles.logoWrapper}>
            <Link href={"/"} className={styles.logoContainer}>
              <CompanyLogo />
            </Link>
          </div>
          <div className={styles.linksWrapper}>
            {navLinks.map((link, lIndex) => (
              <React.Fragment key={lIndex}>
                <div
                  className={styles.sparkleDiv}
                  ref={(el) => (sparkleRefs.current[lIndex] = el)}
                  onMouseEnter={() => handleLinkHover(lIndex, true)}
                  onMouseLeave={() => handleLinkHover(lIndex, false)}
                >
                  <Sparkle color={navColor} />
                </div>

                {/* Conditional rendering based on link type */}
                {link.type === "page" ? (
                  <Link
                    href={link.href}
                    className={styles.linkBtn}
                    onMouseEnter={() => handleLinkHover(lIndex, true)}
                    onMouseLeave={() => handleLinkHover(lIndex, false)}
                    onClick={() => handleNavigation(link)}
                  >
                    <div className={styles.underLine}></div>
                    <p style={{ color: navColor }}>{link.label}</p>
                  </Link>
                ) : (
                  <div
                    className={`${styles.linkBtn} ${
                      activeSection === link.href.replace("#", "")
                        ? styles.activeLink
                        : ""
                    }`}
                    onClick={() => handleNavigation(link)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleNavigation(link);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => handleLinkHover(lIndex, true)}
                    onMouseLeave={() => handleLinkHover(lIndex, false)}
                  >
                    <div className={styles.underLine}></div>
                    <p style={{ color: navColor }}>{link.label}</p>
                  </div>
                )}
              </React.Fragment>
            ))}
            <button className={styles.toggleButton}>
              <Hamburger isOpen={isOpen} setIsOpen={setIsOpen} />
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.menu} ref={menuRef}>
        <div className={styles.menuContent}></div>
      </div>
    </div>
  );
};

export default Navbar;
