"use client";
import React, { useState } from "react";
import style from "./style/adminDashboards.module.scss";
import Image from "next/image";
import PersonalInfoPage from "./pages/PersonalInfo/PersonalInfoPage";

// Sidebar configuration
const sidebarArray = [
  { key: "personal", label: "Personal Info" },
  { key: "courses", label: "Courses Info" },
  { key: "blogs", label: "Blogs" },
  { key: "testimonials", label: "Testimonials" },
  { key: "coupons", label: "Coupons" },
];

// Tab content mapping (JSX per tab)
const TabContent = {
  personal: (
    <>
      <div className={style.imgdiv}>
        <Image
          className={style.profilepic}
          src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/anime-3083036_1280.jpg"
          height={100}
          width={100}
          alt="user profile"
        />
        <button>edit</button>
      </div>

      <div className={style.personalInfoContent}>Anshuman Rana</div>
    </>
  ),
  courses: (
    <div className={style.coursesInfoContent}>
      <div className={style.courseHeader}>
        <div>Total enrolled Students: 100</div>
        <div>Total Courses: 100</div>
      </div>
      <div className={style.coursestags}>
        <span className={style.tag}>technology-programming</span>
        <span className={style.tag}>business-management</span>
        <span className={style.tag}>blogs</span>
        <span className={style.tag}>hardware-engineering</span>
        <span className={style.tag}>advanced</span>
      </div>
      <div className={style.courseCard}>
        <div className={style.courseInfo}>
          <h4>
            <svg
              width="20"
              height="20"
              viewBox="0 0 136 148"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M66.0962 1.74792C66.3511 -0.582641 69.4658 -0.582641 69.7207 1.74792L71.8573 21.2992C74.6162 46.5452 92.9484 66.4498 116.2 69.4453L134.207 71.7651C136.354 72.0419 136.354 75.4237 134.207 75.7005L116.2 78.0203C92.9484 81.0159 74.6162 100.92 71.8573 126.166L69.7207 145.717C69.4658 148.048 66.3511 148.048 66.0962 145.717L63.9596 126.166C61.2007 100.92 42.8685 81.0159 19.6167 78.0203L1.60985 75.7005C-0.536616 75.4237 -0.536616 72.0419 1.60985 71.7651L19.6167 69.4453C42.8685 66.4498 61.2007 46.5452 63.9596 21.2992L66.0962 1.74792Z"
                fill="#FF6432"
              />
            </svg>
            Web Development
          </h4>
          <p>Course ID : CSE100</p>
          <p>Teacher : John Doe</p>
        </div>
      </div>
    </div>
  ),
  blogs: <div className={style.blogsContent}>Blogs Section</div>,
  testimonials: (
    <div className={style.testimonialsContent}>Testimonials Section</div>
  ),
  coupons: <div className={style.couponsContent}>Coupons Section</div>,
};

// Refactored component
const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <>
     <PersonalInfoPage/>
    </>
  );
};

export default AdminDashboardPage;
