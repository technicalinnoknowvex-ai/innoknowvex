// components/Packs/Sidebar.js
"use client";
import React from "react";
import style from "./style/packs.module.scss";

const categories = [
  { id: "all", name: "All Programs" },
  { id: "Technology & Programming", name: "Technology & Programming" },
  { id: "AI & Data Science", name: "AI & Data Science" },
  { id: "Cloud & Security", name: "Cloud & Security" },
  { id: "Hardware & Engineering", name: "Hardware & Engineering" },
  { id: "Business & Management", name: "Business & Management" },
  { id: "Design & Creative", name: "Design & Creative" },
  { id: "Healthcare & Science", name: "Healthcare & Science" },
  { id: "Advance Programs", name: "Advanced Programs" },
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
