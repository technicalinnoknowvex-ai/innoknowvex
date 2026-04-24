"use client";
import React, { useState } from "react";
import { usePopupForm } from "@/context/PopupFormContext";
import styles from "./styles/floatingButton.module.scss";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

const FloatingButton = () => {
  const { openScheduleForm } = usePopupForm();
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = React.useRef(null);
  const pathname = usePathname();

  const isAdminPath = pathname?.startsWith("/admin/");

  useGSAP(() => {
    if (isAdminPath) return;
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        {
          y: 100,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.5,
        }
      );
    }
  }, [isAdminPath]);

  const handleClick = () => {
    openScheduleForm();
  };

  if (isAdminPath) return null;

  return (
    <button
      ref={buttonRef}
      className={styles.floatingBtn}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Talk with expert"
    >
      <div className={styles.iconContainer}>
        <Icon icon="mdi:headset" width={28} height={28} />
        {isHovered && <span className={styles.pulse} />}
      </div>
      <span className={styles.text}>Talk with Expert</span>
    </button>
  );
};

export default FloatingButton;
