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
  const { cursorRingRef, handleMouseEnter, handleMouseLeave } = useCursor();
  const { heading, subheading, email, address, socialLinks, footerLinks } =
    landingPageData.footerSection;

  return (
    <footer
      className={styles.sectionWrapper}
      onMouseEnter={() =>
        handleMouseEnter(null, {
          dot: {
            backgroundColor: "white",
            opacity: 0.2,
            scale: 10,
          },
          ring: {
            opacity: 0,
          },
        })
      }
      onMouseLeave={() => handleMouseLeave()}
    >
      <section className={styles.topSection}>
        <div className={styles.topSection__contactUsWrapper}>
          <div className={styles.sectionHeadingWrapper}>
            <div
              className={`${styles.gradientSpot} ${styles["gradientSpot--1"]}`}
            />
            <div className={styles.sparkleDiv}>
              <Sparkle color={"#FFF6C3"} />
            </div>

            <h2 className={styles.sectionHeadingWrapper__primaryHeading}>
              {heading}
            </h2>
            <h3 className={styles.sectionHeadingWrapper__secondaryHeading}>
              {subheading}
            </h3>
          </div>
          <button className={styles.sendMsgButton}>
            <p>Send Message</p>
          </button>

          <div className={styles.emailRow}>
            <Icon
              icon="eva:email-fill"
              style={{ width: "20px", height: "20px", color: "#fff6c3" }}
            />
            <p className={styles.email}>{email}</p>
          </div>
          <div className={styles.addressContainer}>
            <label className={styles.label}>ADDRESS</label>
            <p className={styles.address}>{address}</p>
          </div>
          <div className={styles.socialLinksContainer}>
            {socialLinks.map((social, sIndex) => (
              <Link
                key={sIndex}
                href={social.href}
                className={styles.socialLinks}
              >
                <Icon icon={social.icon} className={styles.socialIcons} />
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.topSection__footerLinksGrid}>
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
      </section>
      <section className={styles.bottomSection}>
        <div className={styles.bottomSection__emblemDiv}>
          <InnoknowvexFooterEmblem />
        </div>
        <div className={styles.bottomSection__bottomLinksDiv}>
          <p>All rights reserved 2025 © 2025 Lift Media Online S.L.</p>
          <div className={styles.rightContainer}>
            <Link href={"#"} className={styles.rightContainer__rightLinks}>
              Privacy Policy
            </Link>
            <Link href={"#"} className={styles.rightContainer__rightLinks}>
              Payments & Refunds
            </Link>
            <Link href={"#"} className={styles.rightContainer__rightLinks}>
              Terms of Service
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
