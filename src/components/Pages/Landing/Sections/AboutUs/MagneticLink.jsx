"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useCursor } from "@/hooks/useCursor";

const MagneticLink = ({ children, href, className }) => {
  const linkRef = useRef(null);
  const { registerMagneticElement } = useCursor();

  useEffect(() => {
    if (!linkRef.current) return;
    const unregister = registerMagneticElement(linkRef.current);
    return unregister;
  }, []);

  return (
    <Link
      href={href}
      ref={linkRef}
      className={className}
      onMouseEnter={() => {
        // Additional hover effects can go here
      }}
      onMouseLeave={() => {
        // Reset effects can go here
      }}
    >
      {children}
    </Link>
  );
};

export default MagneticLink;
