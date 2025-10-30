"use client"
import React,{useState} from "react";
import style from "./style/sidenavigation.module.scss";
import { useRouter } from "next/navigation";

const sidebarArray = [
  { key: "/admin", label: "Personal Info" },
  { key: "/admin/courses", label: "Courses Info" },
  { key: "/admin/blogs", label: "Blogs" },
  { key: "/admin/testimonials", label: "Testimonials" },
  { key: "/admin/coupons", label: "Coupons" },
];

const SideNavigation = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const router = useRouter()

  return (
    <div className={style.main}>
      <div className={style.sidebar}>
        {sidebarArray.map((tab) => (
          <button
            key={tab.key}
            className={`${style.sidebtn} ${
              activeTab === tab.key ? style.active : ""
            }`}
            onClick={() => router.push(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideNavigation;
