"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/navbar.module.scss";
import CompanyLogo from "./CompanyLogo";
import { useNavColor } from "@/context/NavColorContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Hamburger from "@/components/Common/Icons/Hamburger";
import Sparkle from "@/components/Common/Icons/Sparkle";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

gsap.registerPlugin(useGSAP);

const programsCategory = [
  {
    category: "Technology & Programming",
    items: [
      { label: "Web Development", href: "/programs/web-development" },
      { label: "Python Programming", href: "/programs/python-programming" },
      { label: "JAVA", href: "/programs/java" },
      { label: "JAVA + DSA", href: "/programs/java-dsa" },
      { label: "C & C++", href: "/programs/c-cpp" },
      { label: "Data Structures & Algorithms", href: "/programs/dsa" },
      { label: "MERN Stack Development", href: "/programs/mern-stack" },
      { label: "Android Development", href: "/programs/android-development" },
    ],
  },
  {
    category: "AI & Data Science",
    items: [
      { label: "Machine Learning", href: "/programs/machine-learning" },
      { label: "Artificial Intelligence (AI)", href: "/programs/artificial-intelligence" },
      { label: "Data Science", href: "/programs/data-science" },
      { label: "Advanced Data Science", href: "/programs/advanced-data-science" },
    ],
  },
  {
    category: "Cloud & Security",
    items: [
      { label: "Cloud Computing", href: "/programs/cloud-computing" },
      { label: "Cyber Security", href: "/programs/cyber-security" },
    ],
  },
  {
    category: "Hardware & Engineering",
    items: [
      { label: "VLSI", href: "/programs/vlsi" },
      { label: "Nanotechnology", href: "/programs/nanotechnology" },
      { label: "Embedded Systems", href: "/programs/embedded-systems" },
      { label: "Internet of Things (IoT)", href: "/programs/iot" },
      { label: "Hybrid Electric Vehicles (HEV)", href: "/programs/hev" },
      { label: "AutoCAD", href: "/programs/autocad" },
      { label: "Automobile Design", href: "/programs/automobile-design" },
    ],
  },
  {
    category: "Business & Management",
    items: [
      { label: "Business & Management", href: "/programs/business-management" },
      { label: "Business Analytics", href: "/programs/business-analytics" },
      { label: "Digital Marketing", href: "/programs/digital-marketing" },
      { label: "Finance", href: "/programs/finance" },
      { label: "Stock Trading", href: "/programs/stock-trading" },
      { label: "Human Resources", href: "/programs/human-resources" },
      { label: "Corporate Law", href: "/programs/corporate-law" },
    ],
  },
  {
    category: "Design & Creative",
    items: [
      { label: "UI/UX Design", href: "/programs/ui-ux-design" },
      { label: "Fashion Designing", href: "/programs/fashion-designing" },
    ],
  },
  {
    category: "Healthcare & Sciences",
    items: [
      { label: "Psychology", href: "/programs/psychology" },
      { label: "Medical Coding", href: "/programs/medical-coding" },
      { label: "Clinical Data Management", href: "/programs/clinical-data-management" },
      { label: "Clinical Trials & Research", href: "/programs/clinical-trials-and-research" },
    ],
  },
  {
    category: "Advanced Programs",
    items: [
      { label: "Advanced Web Development", href: "/programs/advanced-web-development" },
      { label: "Advanced Data Science", href: "/programs/advanced-data-science" },
    ],
  },
];

const navLinks = [
  { label: "Home", type: "section", href: "/", sectionId: "home" },
  { label: "About Us", type: "section", href: "about-us", sectionId: "about-us" },
  {
    label: "Programs",
    type: "dropdown",
    href: "",
    categories: programsCategory
  },
  { label: "Blogs", type: "section", href: "#blogs", sectionId: "blogs" },
  { label: "Testimonials", type: "section", href: "#testimonials", sectionId: "testimonials" },
  { label: "Contact Us", type: "section", href: "#footer", sectionId: "footer" },
  { label: "Power Packs", type: "section", href: "choose-packs", sectionId: "choose-packs" },
  { label: "Cart", type: "section", href: "cart", sectionId: "cart" },
];

const Navbar = () => {
  const { navColor } = useNavColor();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const menuRef = useRef(null);
  const containerRef = useRef(null);
  const sparkleRefs = useRef([]);
  const dropdownRefs = useRef({});
  const categoryDropdownRefs = useRef({});
  const dropdownTimers = useRef({});
  const categoryTimers = useRef({});
  const scrollPosition = useRef(0);
  const router = useRouter();
  const pathname = usePathname();

  // Utility function to reset scroll lock
  const resetScrollLock = () => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
  };

  // Utility function to apply scroll lock
  const applyScrollLock = () => {
    scrollPosition.current = window.pageYOffset;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition.current}px`;
    document.body.style.width = '100%';
  };

  // Utility function to remove scroll lock and restore position
  const removeScrollLock = () => {
    const currentScrollPosition = scrollPosition.current;
    resetScrollLock();
    window.scrollTo(0, currentScrollPosition);
  };

  // Only apply scroll lock for mobile menu, not dropdowns
  useEffect(() => {
    if (isOpen) {
      applyScrollLock();
    } else {
      removeScrollLock();
    }

    // Cleanup on component unmount
    return () => {
      resetScrollLock();
    };
  }, [isOpen]);

  // Reset states when pathname changes
  useEffect(() => {
    resetScrollLock();
    setActiveDropdown(null);
    setActiveCategory(null);
    setIsOpen(false);
  }, [pathname]);

  // Global click handler to close dropdowns when clicking outside
  useEffect(() => {
    const handleGlobalClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setActiveCategory(null);
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setActiveCategory(null);
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

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

      // Initialize all dropdowns to hidden state
      Object.values(dropdownRefs.current).forEach(dropdown => {
        if (dropdown) {
          gsap.set(dropdown, {
            autoAlpha: 0,
            y: -20,
            pointerEvents: "none",
          });
        }
      });

      // Initialize all category dropdowns to hidden state
      Object.values(categoryDropdownRefs.current).forEach(categoryDropdown => {
        if (categoryDropdown) {
          gsap.set(categoryDropdown, {
            autoAlpha: 0,
            x: 20,
            pointerEvents: "none",
          });
        }
      });

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

  // Handle dropdown animations
  const showDropdown = (index) => {
    const dropdown = dropdownRefs.current[index];
    if (dropdown) {
      // Clear any existing timer
      if (dropdownTimers.current[index]) {
        clearTimeout(dropdownTimers.current[index]);
      }

      setActiveDropdown(index);
      gsap.to(dropdown, {
        autoAlpha: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
        pointerEvents: "auto",
      });
    }
  };

  const hideDropdown = (index) => {
    const dropdown = dropdownRefs.current[index];
    if (dropdown) {
      // Add a small delay before hiding
      dropdownTimers.current[index] = setTimeout(() => {
        setActiveDropdown(null);
        setActiveCategory(null); // Reset category when hiding dropdown

        gsap.to(dropdown, {
          autoAlpha: 0,
          y: -20,
          duration: 0.2,
          ease: "power2.in",
          pointerEvents: "none",
        });

        // Hide all category dropdowns
        Object.values(categoryDropdownRefs.current).forEach(categoryDropdown => {
          if (categoryDropdown) {
            gsap.to(categoryDropdown, {
              autoAlpha: 0,
              x: 20,
              duration: 0.2,
              ease: "power2.in",
              pointerEvents: "none",
            });
          }
        });
      }, 150);
    }
  };

  const keepDropdownOpen = (index) => {
    // Clear the hide timer when mouse enters dropdown
    if (dropdownTimers.current[index]) {
      clearTimeout(dropdownTimers.current[index]);
    }
  };

  // Handle category dropdown animations
  const showCategoryDropdown = (categoryIndex) => {
    const categoryDropdown = categoryDropdownRefs.current[categoryIndex];

    if (categoryDropdown) {
      // Clear any existing timer
      if (categoryTimers.current[categoryIndex]) {
        clearTimeout(categoryTimers.current[categoryIndex]);
      }

      // Hide other category dropdowns first
      Object.entries(categoryDropdownRefs.current).forEach(([key, dropdown]) => {
        if (dropdown && parseInt(key) !== categoryIndex) {
          gsap.to(dropdown, {
            autoAlpha: 0,
            x: 20,
            duration: 0.2,
            ease: "power2.in",
            pointerEvents: "none",
          });
        }
      });

      setActiveCategory(categoryIndex);
      gsap.to(categoryDropdown, {
        autoAlpha: 1,
        x: 0,
        duration: 0.3,
        ease: "power2.out",
        pointerEvents: "auto",
      });
    }
  };

  const hideCategoryDropdown = (categoryIndex) => {
    const categoryDropdown = categoryDropdownRefs.current[categoryIndex];
    if (categoryDropdown) {
      // Add a small delay before hiding
      categoryTimers.current[categoryIndex] = setTimeout(() => {
        if (activeCategory === categoryIndex) {
          setActiveCategory(null);
          gsap.to(categoryDropdown, {
            autoAlpha: 0,
            x: 20,
            duration: 0.2,
            ease: "power2.in",
            pointerEvents: "none",
          });
        }
      }, 100);
    }
  };

  const keepCategoryDropdownOpen = (categoryIndex) => {
    // Clear the hide timer when mouse enters category dropdown
    if (categoryTimers.current[categoryIndex]) {
      clearTimeout(categoryTimers.current[categoryIndex]);
    }
  };

  // Handle navigation - IMPROVED VERSION
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
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

    // Force cleanup of all states
    setIsOpen(false);
    setActiveDropdown(null);
    setActiveCategory(null);

    // Clear all timers
    Object.values(dropdownTimers.current).forEach(timer => {
      if (timer) clearTimeout(timer);
    });
    Object.values(categoryTimers.current).forEach(timer => {
      if (timer) clearTimeout(timer);
    });

    // Ensure scroll is unlocked
    resetScrollLock();

    // Handle section links (like #blogs, #testimonials)
    if (link.type === "section" && link.href.startsWith("#")) {
      // Check if we're not on the home page
      if (pathname !== '/') {
        // Navigate to home page first, then scroll to section
        router.push('/');
        
        // Wait for navigation to complete, then scroll
        const checkHomePageLoad = () => {
          if (window.location.pathname === '/') {
            setTimeout(() => {
              const sectionId = link.href.substring(1);
              const element = document.getElementById(sectionId);
              
              if (element) {
                // Calculate offset for fixed navbar
                const navbarHeight = 70; // Your navbar height
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navbarHeight - 20; // Extra 20px for spacing
                
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
              }
            }, 300); // Wait a bit longer for page to fully load
          } else {
            // Keep checking if navigation hasn't completed
            setTimeout(checkHomePageLoad, 100);
          }
        };
        
        // Start checking after a small delay
        setTimeout(checkHomePageLoad, 100);
      } else {
        // We're already on the home page, just scroll to the section
        setTimeout(() => {
          const sectionId = link.href.substring(1);
          const element = document.getElementById(sectionId);
          
          if (element) {
            // Calculate offset for fixed navbar
            const navbarHeight = 70; // Your navbar height
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navbarHeight - 20; // Extra 20px for spacing
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100); // Small delay to ensure cleanup is complete
      }
    } else {
      // For regular page navigation - scroll to top first, then navigate
      scrollToTop();
      
      // Add small delay before navigation to allow scroll to start
      setTimeout(() => {
        router.push(link.href);
      }, 100);
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

                {link.type === "page" || link.type === "section" ? (
                  <div
                    className={styles.linkBtn}
                    onMouseEnter={() => handleLinkHover(lIndex, true)}
                    onMouseLeave={() => handleLinkHover(lIndex, false)}
                    onClick={() => handleNavigation(link)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleNavigation(link);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.underLine}></div>
                    <p style={{ color: navColor }}>{link.label}</p>
                  </div>
                ) : link.type === "dropdown" ? (
                  <div className={styles.dropdownWrapper}>
                    <div
                      className={`${styles.linkBtn} ${pathname === link.href ? styles.activeLink : ""
                        }`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleNavigation(link);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => {
                        handleLinkHover(lIndex, true);
                        showDropdown(lIndex);
                      }}
                      onMouseLeave={() => {
                        handleLinkHover(lIndex, false);
                        hideDropdown(lIndex);
                      }}
                    >
                      <div className={styles.underLine}></div>
                      <p style={{ color: navColor }}>{link.label}</p>
                      <svg
                        width="12"
                        height="8"
                        viewBox="0 0 12 8"
                        fill="none"
                        style={{ marginLeft: "8px", marginTop: "5px" }}
                      >
                        <path
                          d="M1 1.5L6 6.5L11 1.5"
                          stroke={navColor}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div
                      className={styles.dropdown}
                      ref={(el) => (dropdownRefs.current[lIndex] = el)}
                      onMouseEnter={() => keepDropdownOpen(lIndex)}
                      onMouseLeave={() => hideDropdown(lIndex)}
                    >
                      <div className={styles.dropdownContent}>
                        <div className={styles.categoriesList}>
                          {link.categories.map((category, cIndex) => (
                            <div key={cIndex} className={styles.categoryWrapper}>
                              <div
                                className={`${styles.dropdownCategory} ${activeCategory === cIndex ? styles.activeCategoryItem : ""
                                  }`}
                                onMouseEnter={() => showCategoryDropdown(cIndex)}
                                onMouseLeave={() => hideCategoryDropdown(cIndex)}
                              >
                                <h4 className={styles.categoryTitle}>
                                  {category.category}
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    className={styles.categoryArrow}
                                  >
                                    <path
                                      d="M4 2L8 6L4 10"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </h4>
                              </div>

                              {/* Category programs dropdown */}
                              <div
                                className={styles.categoryDropdown}
                                ref={(el) => (categoryDropdownRefs.current[cIndex] = el)}
                                onMouseEnter={() => keepCategoryDropdownOpen(cIndex)}
                                onMouseLeave={() => hideCategoryDropdown(cIndex)}
                              >
                                <div className={styles.categoryDropdownContent}>
                                  <h5 className={styles.programsPanelTitle}>
                                    {category.category}
                                  </h5>
                                  <div className={styles.programsList}>
                                    {category.items.map((item, iIndex) => (
                                      <Link
                                        key={iIndex}
                                        href={item.href}
                                        className={styles.dropdownItem}
                                        onClick={() => {
                                          setActiveDropdown(null);
                                          setActiveCategory(null);
                                          resetScrollLock();
                                        }}
                                      >
                                        <span className={styles.programIcon}>→</span>
                                        {item.label}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
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