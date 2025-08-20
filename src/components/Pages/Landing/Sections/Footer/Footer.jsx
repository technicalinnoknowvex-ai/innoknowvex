"use client";
import React from "react";
import styles from "./styles/footer.module.scss";
import { useCursor } from "@/context/useCursor";
import InnoknowvexFooterEmblem from "./InnoknowvexFooterEmblem";
import { landingPageData } from "@/data/landing";
import Sparkle from "@/components/Common/Icons/Sparkle";
import Link from "next/link";
import { Icon } from "@iconify/react";

const Footer = () => {
  const { resetCursor, transformCursor } = useCursor();
  const { heading, subheading, email, address, socialLinks, footerLinks } =
    landingPageData.footerSection;

  return (
    <footer
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
