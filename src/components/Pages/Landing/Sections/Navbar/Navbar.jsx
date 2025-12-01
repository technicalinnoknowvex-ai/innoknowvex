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
import useUserSession from "@/hooks/useUserSession";
import { Icon } from "@iconify/react";
import { signOut } from "@/actions/authActions";

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
      {
        label: "Artificial Intelligence (AI)",
        href: "/programs/artificial-intelligence",
      },
      { label: "Data Science", href: "/programs/data-science" },
      {
        label: "Advanced Data Science",
        href: "/programs/advanced-data-science",
      },
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
      {
        label: "Clinical Data Management",
        href: "/programs/clinical-data-management",
      },
      {
        label: "Clinical Trials & Research",
        href: "/programs/clinical-trials-and-research",
      },
    ],
  },
  {
    category: "Advanced Programs",
    items: [
      {
        label: "Advanced Web Development",
        href: "/programs/advanced-web-development",
      },
      {
        label: "Advanced Data Science",
        href: "/programs/advanced-data-science",
      },
    ],
  },
];

const powerPacksCategory = [
  {
    category: "Premium Packs",
    items: [
      { label: "Make Your Own Pack", href: "/choose-packs" },
      { label: "Golden Pass", href: "/golden-pass" },
      { label: "Tech Starter Pack", href: "/tech-starter-pack" },
    ],
  },
];

const navLinks = [
  { label: "Home", type: "section", href: "/", sectionId: "home" },
  {
    label: "About Us",
    type: "section",
    href: "about-us",
    sectionId: "about-us",
  },
  {
    label: "Programs",
    type: "dropdown",
    href: "",
    categories: programsCategory,
  },
  { label: "Blogs", type: "section", href: "#blogs", sectionId: "blogs" },
  {
    label: "Testimonials",
    type: "section",
    href: "#testimonials",
    sectionId: "testimonials",
  },
  {
    label: "Contact Us",
    type: "section",
    href: "#footer",
    sectionId: "footer",
  },
  {
    label: "Power Packs",
    type: "dropdown",
    href: "",
    categories: powerPacksCategory,
  },
  { label: "Cart", type: "section", href: "cart", sectionId: "cart" },
];

const Navbar = () => {
  const { navColor } = useNavColor();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const profileMenuRef = useRef(null);
  const profileBadgeRef = useRef(null);
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

  const { session, isSessionLoading } = useUserSession();
  
  // Debug session data
  useEffect(() => {
    if (session && !isSessionLoading) {
      console.log('🔍 NAVBAR SESSION DATA:', session);
      console.log('🔍 Session keys:', Object.keys(session));
      console.log('🔍 User ID:', session.user_id);
      console.log('🔍 Role:', session.role);
      console.log('🔍 Full session object:', JSON.stringify(session, null, 2));
    }
  }, [session, isSessionLoading]);

  // Enhanced user role detection
  const getUserRole = () => {
    if (!session) return null;
    
    // Check multiple possible role fields
    const role = session.role || session.user_role || session.userType || session.type;
    console.log('🔍 Detected role:', role);
    return role;
  };

  const getUserId = () => {
    if (!session) return null;
    
    // Check multiple possible ID fields
    const userId = session.user_id || session.id || session.userId || session.admin_id;
    console.log('🔍 Detected user ID:', userId);
    return userId;
  };

  const isAdmin = getUserRole() === 'admin';
  const userId = getUserId();

  console.log('🔍 Final values - isAdmin:', isAdmin, 'userId:', userId);

  const handleSignInClick = () => {
    router.push("/auth/student/sign-in");
  };

  const getUserInitials = (fullname) => {
    if (!fullname) return "U";
    const names = fullname.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getProfileLink = () => {
    if (!userId) {
      console.warn('❌ No user ID found in session');
      return isAdmin ? '/admin/dashboard' : '/student/profile';
    }

    if (isAdmin) {
      const adminLink = `/admin/${userId}/dashboard`;
      console.log('🔗 Admin profile link:', adminLink);
      return adminLink;
    } else {
      const studentLink = `/student/${userId}/dashboard`;
      console.log('🔗 Student profile link:', studentLink);
      return studentLink;
    }
  };

  const handleDropdownToggle = (label) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const resetScrollLock = () => {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
  };

  const applyScrollLock = () => {
    document.body.style.overflow = "hidden";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
  };

  const removeScrollLock = () => {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        profileBadgeRef.current &&
        !profileBadgeRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  useEffect(() => {
    if (profileMenuRef.current) {
      if (showProfileMenu) {
        gsap.to(profileMenuRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          pointerEvents: "auto",
        });
      } else {
        gsap.to(profileMenuRef.current, {
          autoAlpha: 0,
          y: -10,
          duration: 0.2,
          ease: "power2.in",
          pointerEvents: "none",
        });
      }
    }
  }, [showProfileMenu]);

  useEffect(() => {
    if (isOpen) {
      applyScrollLock();
    } else {
      removeScrollLock();
    }

    return () => {
      resetScrollLock();
    };
  }, [isOpen]);

  useEffect(() => {
    resetScrollLock();
    setActiveDropdown(null);
    setActiveCategory(null);
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleGlobalClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
        setActiveCategory(null);
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setActiveCategory(null);
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleGlobalClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Initialize dropdowns and sparkle animations (menu is now hidden by CSS)
  useGSAP(
    () => {
      // Initialize all dropdowns to hidden state
      Object.values(dropdownRefs.current).forEach((dropdown) => {
        if (dropdown) {
          gsap.set(dropdown, {
            autoAlpha: 0,
            y: -20,
            pointerEvents: "none",
          });
        }
      });

      // Initialize all category dropdowns to hidden state
      Object.values(categoryDropdownRefs.current).forEach(
        (categoryDropdown) => {
          if (categoryDropdown) {
            gsap.set(categoryDropdown, {
              autoAlpha: 0,
              x: 20,
              pointerEvents: "none",
            });
          }
        }
      );

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

  const showDropdown = (index) => {
    const dropdown = dropdownRefs.current[index];
    if (dropdown) {
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
      dropdownTimers.current[index] = setTimeout(() => {
        setActiveDropdown(null);
        setActiveCategory(null);

        gsap.to(dropdown, {
          autoAlpha: 0,
          y: -20,
          duration: 0.2,
          ease: "power2.in",
          pointerEvents: "none",
        });

        Object.values(categoryDropdownRefs.current).forEach(
          (categoryDropdown) => {
            if (categoryDropdown) {
              gsap.to(categoryDropdown, {
                autoAlpha: 0,
                x: 20,
                duration: 0.2,
                ease: "power2.in",
                pointerEvents: "none",
              });
            }
          }
        );
      }, 150);
    }
  };

  const keepDropdownOpen = (index) => {
    if (dropdownTimers.current[index]) {
      clearTimeout(dropdownTimers.current[index]);
    }
  };

  const showCategoryDropdown = (categoryIndex) => {
    const categoryDropdown = categoryDropdownRefs.current[categoryIndex];

    if (categoryDropdown) {
      if (categoryTimers.current[categoryIndex]) {
        clearTimeout(categoryTimers.current[categoryIndex]);
      }

      Object.entries(categoryDropdownRefs.current).forEach(
        ([key, dropdown]) => {
          if (dropdown && parseInt(key) !== categoryIndex) {
            gsap.to(dropdown, {
              autoAlpha: 0,
              x: 20,
              duration: 0.2,
              ease: "power2.in",
              pointerEvents: "none",
            });
          }
        }
      );

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
    if (categoryTimers.current[categoryIndex]) {
      clearTimeout(categoryTimers.current[categoryIndex]);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigation = (link) => {
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

    setIsOpen(false);
    setActiveDropdown(null);
    setActiveCategory(null);

    Object.values(dropdownTimers.current).forEach((timer) => {
      if (timer) clearTimeout(timer);
    });
    Object.values(categoryTimers.current).forEach((timer) => {
      if (timer) clearTimeout(timer);
    });

    resetScrollLock();

    if (link.type === "section" && link.href.startsWith("#")) {
      if (pathname !== "/") {
        router.push("/");

        const checkHomePageLoad = () => {
          if (window.location.pathname === "/") {
            setTimeout(() => {
              const sectionId = link.href.substring(1);
              const element = document.getElementById(sectionId);

              if (element) {
                const navbarHeight = 70;
                const elementPosition =
                  element.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navbarHeight - 20;

                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                });
              }
            }, 300);
          } else {
            setTimeout(checkHomePageLoad, 100);
          }
        };

        setTimeout(checkHomePageLoad, 100);
      } else {
        setTimeout(() => {
          const sectionId = link.href.substring(1);
          const element = document.getElementById(sectionId);

          if (element) {
            const navbarHeight = 70;
            const elementPosition =
              element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navbarHeight - 20;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    } else {
      scrollToTop();

      setTimeout(() => {
        router.push(link.href);
      }, 100);
    }
  };

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

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setShowProfileMenu(false);

    try {
      const { success } = await signOut();
      if (success) {
        // router.refresh();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
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
                      className={`${styles.linkBtn} ${
                        pathname === link.href ? styles.activeLink : ""
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
                            <div
                              key={cIndex}
                              className={styles.categoryWrapper}
                            >
                              {link.label === "Power Packs" ? (
                                <>
                                  <div className={styles.programsPanelTitle}>
                                    {category.category}
                                  </div>
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
                                        <span className={styles.programIcon}>
                                          →
                                        </span>
                                        {item.label}
                                      </Link>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div
                                    className={`${styles.dropdownCategory} ${
                                      activeCategory === cIndex
                                        ? styles.activeCategoryItem
                                        : ""
                                    }`}
                                    onMouseEnter={() =>
                                      showCategoryDropdown(cIndex)
                                    }
                                    onMouseLeave={() =>
                                      hideCategoryDropdown(cIndex)
                                    }
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

                                  <div
                                    className={styles.categoryDropdown}
                                    ref={(el) =>
                                      (categoryDropdownRefs.current[cIndex] =
                                        el)
                                    }
                                    onMouseEnter={() =>
                                      keepCategoryDropdownOpen(cIndex)
                                    }
                                    onMouseLeave={() =>
                                      hideCategoryDropdown(cIndex)
                                    }
                                  >
                                    <div
                                      className={styles.categoryDropdownContent}
                                    >
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
                                            <span
                                              className={styles.programIcon}
                                            >
                                              →
                                            </span>
                                            {item.label}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </React.Fragment>
            ))}
            {/* SIGN IN BUTTON - Only show when user is NOT logged in */}
{!isSessionLoading && !session && (
  <div className={styles.signInWrapper}>
    <button
      className={styles.signInButton}
      onClick={handleSignInClick}
    >
      <span>Sign In</span>
      <Icon icon="lucide:log-in" width="16" height="16" />
    </button>
  </div>
)}

            {/* User Profile Badge */}
            {!isSessionLoading && session && (
              <div className={styles.profileBadgeWrapper}>
                <div
                  ref={profileBadgeRef}
                  className={styles.profileBadge}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setShowProfileMenu(!showProfileMenu);
                    }
                  }}
                >
                  <span className={styles.profileInitials}>
                    {getUserInitials(session.fullname)}
                  </span>
                </div>

                {/* Profile Dropdown Menu */}
                <div
                  ref={profileMenuRef}
                  className={styles.profileMenu}
                  style={{ opacity: 0, visibility: "hidden" }}
                >
                  <div className={styles.profileMenuHeader}>
                    <div className={styles.profileMenuInitials}>
                      <span>{getUserInitials(session.fullname)}</span>
                    </div>
                    <div className={styles.profileMenuInfo}>
                      <p className={styles.profileMenuName}>
                        {session.fullname}
                      </p>
                      <p className={styles.profileMenuEmail}>{session.email}</p>
                      <p className={styles.profileMenuRole}>
                        {isAdmin ? 'Admin' : 'Student'}
                      </p>
                    </div>
                  </div>
                  <div className={styles.profileMenuDivider}></div>
                  <Link
                    href={getProfileLink()}
                    className={styles.profileMenuItem}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Icon icon="lucide:user" width="18" height="18" />
                    {isAdmin ? 'Admin Dashboard' : 'Profile'}
                  </Link>
                  <button
                    className={styles.profileMenuItem}
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                  >
                    {isSigningOut ? (
                      <div className={styles.loadingSpinner}>
                        <Icon
                          icon="lucide:loader-2"
                          width="18"
                          height="18"
                          className={styles.spinning}
                        />
                      </div>
                    ) : (
                      <Icon icon="lucide:log-out" width="18" height="18" />
                    )}
                    {isSigningOut ? "Signing out..." : "Logout"}
                  </button>
                </div>
              </div>
            )}

            <button className={styles.toggleButton}>
              <Hamburger isOpen={isOpen} setIsOpen={setIsOpen} />
            </button>
          </div>
        </div>
      </nav>

      {/* mobile navigation */}

      <div className={styles.menu} ref={menuRef}>
        <ul className={styles.navList}>
          {navLinks.map((link, index) => {
            const isDropdown = link.type === "dropdown";
            const isActive = activeDropdown === link.label;

            return (
              <li
                key={index}
                className={`${styles.navItem} ${
                  isDropdown ? styles.dropdown : ""
                } ${isActive ? styles.activeDropdown : ""}`}
              >
                {isDropdown ? (
                  <button
                    className={styles.navLink}
                    onClick={() =>
                      setActiveDropdown(isActive ? null : link.label)
                    }
                  >
                    <span>{link.label}</span>
                    <svg
                      className={`${styles.dropdownArrow} ${
                        isActive ? styles.rotateArrow : ""
                      }`}
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                    >
                      <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={styles.navLink}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}

                {isDropdown && isActive && (
                  <ul className={styles.dropdownMenu}>
                    {link.categories.map((category, cIndex) => (
                      <li key={cIndex} className={styles.categoryBlock}>
                        <p className={styles.categoryTitle}>
                          {category.category}
                        </p>
                        <ul className={styles.subMenu}>
                          {category.items.map((item, iIndex) => (
                            <li key={iIndex}>
                              <Link
                                href={item.href}
                                className={styles.dropdownLink}
                                onClick={() => setIsOpen(false)}
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              
            );
          })}
          {/* Mobile Profile Link */}
          {!isSessionLoading && session && (
            <li className={styles.navItem}>
              <Link
                href={getProfileLink()}
                className={styles.navLink}
                onClick={() => setIsOpen(false)}
              >
                {isAdmin ? 'Admin Dashboard' : 'Profile'}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;