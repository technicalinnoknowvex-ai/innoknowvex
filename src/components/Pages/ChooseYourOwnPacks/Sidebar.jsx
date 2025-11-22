// components/Packs/Sidebar.js
"use client";
import React from "react";
import style from "./style/packs.module.scss";

const categories = [
  { id: "all", name: "All Programs" },
  { id: "technology-programming", name: "Technology & Programming" },
  { id: "ai-data", name: "AI & Data Science" },
  { id: "cloud-security", name: "Cloud & Security" },
  { id: "hardware-engineering", name: "Hardware & Engineering" },
  { id: "business-management", name: "Business & Management" },
  { id: "design-creative", name: "Design & Creative" },
  { id: "healthcare-sciences", name: "Healthcare & Sciences" },
  { id: "advanced", name: "Advanced Programs" },
];

const Sidebar = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className={style.sidebar}>
      <div className={style.sidebarContent}>
        <h2>Categories</h2>
        <div className={style.categoryList}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${style.categoryBtn} ${
                selectedCategory === cat.id ? style.active : ""
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
