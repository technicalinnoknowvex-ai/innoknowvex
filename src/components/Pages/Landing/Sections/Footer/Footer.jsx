"use client";
import React, { useRef } from "react";
import styles from "./styles/footer.module.scss";
import { useCursor } from "@/hooks/useCursor";
import InnoknowvexFooterEmblem from "./InnoknowvexFooterEmblem";
import { landingPageData } from "@/data/landing";
import Sparkle from "@/components/Common/Icons/Sparkle";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useSectionObserver } from "@/hooks/useSectionObserver";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavColor } from "@/context/NavColorContext";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScroll } from "@/context/ScrollContext";
import { usePopupForm } from "@/context/PopupFormContext";
gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const { openForm } = usePopupForm();
  const footerRef = useRef(null);
  const { resetCursor, transformCursor } = useCursor();
  const { updateNavColor } = useNavColor();

  const { heading, subheading, email, address, socialLinks, footerLinks } =
    landingPageData.footerSection;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 60px",
        end: "bottom bottom",
        onEnter: () => {
          updateNavColor("white");
        },
        onEnterBack: () => updateNavColor("white"),
        onLeave: () => updateNavColor("#262c35"),
        onLeaveBack: () => updateNavColor("#262c35"),
      });
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 60px",
        once: true,
        onEnter: () => openForm(),
      });
    },

    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      id="footer"
      className={styles.sectionWrapper}
      onMouseEnter={() =>
        transformCursor({
          dot: {
            backgroundColor: "white",
            scale: 2,
          },
          ring: {
            opacity: 0,
            scale: 0.5,
          },
        })
      }
      onMouseLeave={() => resetCursor()}
    >
      <div className={styles.sectionInnerWrapper}>
        <div className={styles.sectionInnerWrapper__contactUsCell}>
          <div className={styles.headingContainer}>
            <div
              className={`${styles.gradientSpot} ${styles["gradientSpot--1"]}`}
            />
            <div className={styles.sparkleDiv}>
              <Sparkle color={"#FFF6C3"} />
            </div>

            <h2 className={styles.headingContainer__primaryHeading}>
              {heading}
            </h2>
            <h3 className={styles.headingContainer__secondaryHeading}>
              {subheading}
            </h3>
          </div>
          <div className={styles.emailContainer}>
            <div className={styles.emailRow}>
              <Icon
                icon="eva:email-fill"
                style={{ width: "20px", height: "20px", color: "#fff6c3" }}
              />
              <p
                className={styles.email}
                onMouseEnter={() =>
                  transformCursor({
                    dot: {
                      backgroundColor: "white",
                      scale: 5,
                      opacity: 0.5,
                    },
                    ring: {
                      opacity: 0,
                      scale: 0.5,
                    },
                  })
                }
                onMouseLeave={() =>
                  transformCursor({
                    dot: {
                      backgroundColor: "white",
                      scale: 2,
                      opacity: 1,
                    },
                    ring: {
                      opacity: 0,
                      scale: 0.5,
                    },
                  })
                }
              >
                {email}
              </p>
            </div>
            <button
              className={styles.sendMsgButton}
              onClick={openForm}
              onMouseEnter={() =>
                transformCursor({
                  dot: {
                    backgroundColor: "#ff6432",
                    scale: 2,
                    opacity: 0.5,
                  },
                  ring: {
                    opacity: 0,
                    scale: 0.5,
                  },
                })
              }
              onMouseLeave={() =>
                transformCursor({
                  dot: {
                    backgroundColor: "white",
                    scale: 2,
                    opacity: 1,
                  },
                  ring: {
                    opacity: 0,
                    scale: 0.5,
                  },
                })
              }
            >
              <p>Send Message</p>
            </button>
          </div>
        </div>

        <div className={styles.sectionInnerWrapper__addressSocialCell}>
          <label className={styles.addressLabel}>ADDRESS</label>
          <p className={styles.address}>{address}</p>
          <div className={styles.socialLinksContainer}>
            {socialLinks.map((social, sIndex) => (
              <Link
                key={sIndex}
                href={social.href}
                className={styles.socialLinks}
                onMouseEnter={() =>
                  transformCursor({
                    dot: {
                      backgroundColor: "white",
                      scale: 3,
                      opacity: 0.5,
                    },
                    ring: {
                      opacity: 0,
                      scale: 0.5,
                    },
                  })
                }
                onMouseLeave={() =>
                  transformCursor({
                    dot: {
                      backgroundColor: "white",
                      scale: 2,
                      opacity: 1,
                    },
                    ring: {
                      opacity: 0,
                      scale: 0.5,
                    },
                  })
                }
              >
                <Icon icon={social.icon} className={styles.socialIcons} />
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.sectionInnerWrapper__linksCell}>
          {footerLinks.map((group, gIndex) => (
            <React.Fragment key={gIndex}>
              <div
                className={`${styles.itemContainer} ${styles["itemContainer--label"]}`}
              >
                {group.listLabel}
              </div>
              {group.links.map((link, lIndex) => (
                <Link
                  key={lIndex}
                  href={link.href}
                  onClick={scrollToTop}
                  className={`${styles.itemContainer} ${styles["itemContainer--link"]}`}
                >
                  <div className={styles.animatedUnderline}></div>
                  {link.label}
                </Link>
              ))}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.sectionInnerWrapper__legalCell}>
          <div className={styles.companyEmblem}>
            <InnoknowvexFooterEmblem />
          </div>
          <div className={styles.copywrite}>
            <p>All rights reserved 2025 © 2025 Lift Media Online S.L.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
