"use client";
import React, { useState, useEffect } from "react";
import style from "./style/sidenavigation.module.scss";
import { useRouter, usePathname, useParams } from "next/navigation";
import useUserSession from "@/hooks/useUserSession";

const SideNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { session } = useUserSession();

  // Prefer session user_id; fallback to route params (if available)
  const adminId = session?.user_id || params?.adminId;

  const base = adminId ? `/admin/${adminId}/dashboard` : "/admin";

  const navItems = [
    { key: "personal", label: "Personal Info", href: `${base}` },
    { key: "courses", label: "Courses Info", href: `${base}/courses` },
    { key: "blogs", label: "Blogs", href: `${base}/blogs` },
    { key: "testimonials", label: "Testimonials", href: `${base}/testimonials` },
    { key: "coupons", label: "Coupons", href: `${base}/coupons` },
  ];

  const [activeHref, setActiveHref] = useState(pathname);

  useEffect(() => {
    setActiveHref(pathname);
  }, [pathname]);

  return (
    <div className={style.main}>
      <div className={style.sidebar}>
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`${style.sidebtn} ${
              activeHref === item.href ? style.active : ""
            }`}
            onClick={() => router.push(item.href)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideNavigation;